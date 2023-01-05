import { UserModel } from '@domain/model/database/user';
import {
  AuthJwt,
  AuthRefreshJwt,
} from '@infrastructure/common/decorators/auth.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usercases-proxy';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { LogoutUseCases } from 'src/usecases/auth/logout.usecases';
import { OAuthLoginDto, RefreshTokenDto } from './auth.dto';
import { AuthUserPresenter, TokenPresenter } from './auth.presenter';
import { IException } from '@domain/adapters/exceptions.interface';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { GoogleOAuthUseCases } from 'src/usecases/auth/google-oauth.usecases';
import { CreateUserUseCases } from 'src/usecases/user/create-user.usecases';
import { DataSource } from 'typeorm';

@Controller('auth')
@ApiTags('Auth')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiExtraModels(TokenPresenter, AuthUserPresenter)
export class AuthController {
  constructor(
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCasesProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UseCasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUseCasesProxy: UseCaseProxy<LogoutUseCases>,
    @Inject(UseCasesProxyModule.GOOGLE_OAUTH_USECASES_PROXY)
    private readonly googleOAuthUseCasesProxy: UseCaseProxy<GoogleOAuthUseCases>,
    @Inject(UseCasesProxyModule.CREATE_USER_USECASES_PROXY)
    private readonly createUserUseCasesProxy: UseCaseProxy<CreateUserUseCases>,
    @Inject(ExceptionsService)
    private readonly exceptionService: IException,
    private readonly dataSource: DataSource,
  ) {}

  @Get('swagger')
  @ApiOperation({ summary: '스웨거용 로그인' })
  @ApiResponseType(TokenPresenter)
  async swaggerLogin(
    @Query('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const usecase = this.loginUseCasesProxy.getInstance();
    const user = await usecase.validateUserForJWTStrategy(+userId);

    if (!user) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_description: '해당하는 아이디의 유저 정보가 없습니다.',
      });
    }
    const retAccess = usecase.getJwtTokenAndCookie(user.id);
    const retRefresh = await usecase.getJwtRefreshTokenAndCookie(user.id);

    res.setHeader('Set-Cookie', [retAccess.cookie, retRefresh.cookie]);
    return new TokenPresenter(retAccess.token, retRefresh.token);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인 (OAuth)' })
  @ApiResponseType(AuthUserPresenter)
  async googleLogin(
    @Body() body: OAuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const googleOAuthUseCase = this.googleOAuthUseCasesProxy.getInstance();
    const tokenInfo = await googleOAuthUseCase.authToken(body.credential);
    if (!tokenInfo.sub || !tokenInfo.email) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_description: '유효한 토큰이 아닙니다.',
      });
    }
    const createUserUseCase = this.createUserUseCasesProxy.getInstance();
    let user = await createUserUseCase.checkMachedOAuthUser(
      tokenInfo.sub,
      body.auth_type,
    );

    if (!user) {
      const connection = this.dataSource.createQueryRunner();
      await connection.connect();
      await connection.startTransaction();
      try {
        const payload = await googleOAuthUseCase.getUserInfo(
          body.credential,
          tokenInfo.sub,
          tokenInfo.email,
        );
        user = await createUserUseCase.execute(
          payload,
          body.device_info.device_token,
          body.device_info.platform,
          connection.manager,
        );

        await connection.commitTransaction();
      } catch (err) {
        await connection.rollbackTransaction();
        throw err;
      } finally {
        await connection.release();
      }
    }
    const loginUseCase = this.loginUseCasesProxy.getInstance();
    const retAccess = loginUseCase.getJwtTokenAndCookie(user.id);
    const retRefresh = await loginUseCase.getJwtRefreshTokenAndCookie(user.id);

    res.setHeader('Set-Cookie', [retAccess.cookie, retRefresh.cookie]);

    return new AuthUserPresenter(retAccess.token, retRefresh.token, user);
  }

  @Post('refresh')
  @AuthRefreshJwt()
  @ApiResponseType(TokenPresenter)
  @ApiOperation({ description: '토큰 재발급' })
  async refresh(
    @User() user: UserModel,
    @Res({ passthrough: true }) res: Response,
    @Body() body: RefreshTokenDto,
  ) {
    if (!user.device_id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '해당 서비스를 이용할 수 없는 유저입니다.',
        error_description: 'device id가 없는 유저입니다.',
      });
    }
    const useCase = this.loginUseCasesProxy.getInstance();
    await useCase.updateDeviceInfo(user.device_id, body.device_info);
    const retAccess = useCase.getJwtTokenAndCookie(user.id);
    const retRefresh = await useCase.getJwtRefreshTokenAndCookie(user.id);

    res.setHeader('Set-Cookie', [retAccess.cookie, retRefresh.cookie]);
    return new TokenPresenter(retAccess.token, retRefresh.token);
  }

  @Post('logout')
  @AuthJwt()
  @ApiOperation({ description: 'logout' })
  async logout(
    @User() user: UserModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookie = await this.logoutUseCasesProxy
      .getInstance()
      .execute(user.id);
    res.setHeader('Set-Cookie', cookie);

    return { data: 'Logout 성공' };
  }
}
