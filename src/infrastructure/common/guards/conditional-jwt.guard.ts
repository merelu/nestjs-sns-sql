import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { IException } from '@domain/adapters/exceptions.interface';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpStrategy } from '../strategies/http.strategy';
import { Request } from 'express';

@Injectable()
export class ConditionalJwtAuthGuard implements CanActivate {
  constructor(
    private exceptionService: ExceptionsService,
    private httpStrategy: HttpStrategy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token =
      request.headers.authorization ||
      request.headers.cookie?.split(';')[0].split('=')[1];

    console.log(token);
    if (!token) {
      return true;
    }

    const user = await this.httpStrategy.validate(token);
    if (!user) {
      throw this.exceptionService.unauthorizedException({
        error_code: CommonErrorCodeEnum.UNAUTHORIZED,
        error_description: '유효 하지 않은 토큰입니다.',
      });
    }
    if (user.deleted_at) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '탈퇴 회원',
        error_description: '탈퇴한 회원입니다.',
      });
    }
    request.user = user;
    return true;
  }
}
