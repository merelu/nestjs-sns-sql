import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { UserModel } from '@domain/model/database/user';
import { AuthJwt } from '@infrastructure/common/decorators/auth.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usercases-proxy';
import { Body, Controller, Get, Inject, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AddAnniversaryUseCases } from 'src/usecases/couple/add-anniversary.usecases';
import { CreateCoupleChannelUseCases } from 'src/usecases/couple/create-couple-channel.usecases';
import { GenerateCoupleCodeUseCases } from 'src/usecases/couple/generate-couple-code.usecases';
import { GetCoupleUseCases } from 'src/usecases/couple/get-couple.usecases';
import { UpdateCoupleUseCases } from 'src/usecases/couple/update-couple.usecases';
import { DataSource } from 'typeorm';
import {
  AddAnniversaryDto,
  CreateCoupleChannelDto,
  UpdateCoupleDto,
} from './couple.dto';
import { CoupleChannelPresenter } from './couple.presenter';

@Controller('couple')
@ApiTags('Couple')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiExtraModels(CoupleChannelPresenter)
export class CoupleController {
  constructor(
    @Inject(UseCasesProxyModule.GENERATE_COUPLE_CODE_USECASES_PROXY)
    private readonly generateCoupleCodeUseCasesProxy: UseCaseProxy<GenerateCoupleCodeUseCases>,
    @Inject(UseCasesProxyModule.CREATE_COUPLE_CHANNEL_USECASES_PROXY)
    private readonly createCoupleChannelUseCasesProxy: UseCaseProxy<CreateCoupleChannelUseCases>,
    @Inject(UseCasesProxyModule.GET_COUPLE_USECASES_PROXY)
    private readonly getCoupleUseCasesProxy: UseCaseProxy<GetCoupleUseCases>,
    @Inject(UseCasesProxyModule.ADD_ANNIVERSARY_USECASES_PROXY)
    private readonly addAnniversaryUseCasesProxy: UseCaseProxy<AddAnniversaryUseCases>,
    @Inject(UseCasesProxyModule.UPDATE_COUPLE_USECASES_PROXY)
    private readonly updateCoupleUseCasesProxy: UseCaseProxy<UpdateCoupleUseCases>,
    private readonly exceptionService: ExceptionsService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('code')
  @AuthJwt()
  @ApiOperation({ summary: '커플 코드 생성' })
  @ApiResponseType()
  async generateCoupleCode(@User() user: UserModel) {
    const useCase = this.generateCoupleCodeUseCasesProxy.getInstance();
    const result = useCase.execute(user.id);

    return result;
  }

  @Get('me')
  @AuthJwt()
  @ApiOperation({ summary: '내 커플 조회' })
  @ApiResponseType(CoupleChannelPresenter)
  async getCoupleMine(@User() user: UserModel) {
    if (!user.couple_channel_id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '해당 서비스를 이용할 수 없는 유저입니다.',
      });
    }
    const result = await this.getCoupleUseCasesProxy
      .getInstance()
      .getCoupleByCoupleChannelId(user.couple_channel_id);

    return result ? new CoupleChannelPresenter(result) : null;
  }

  @Post()
  @AuthJwt()
  @ApiOperation({ summary: '커플 맺기' })
  @ApiBadRequestResponse({
    description:
      '이미 등록된 채널이 있는경우(error_code: -1), 자기 자신과 코드를 주고 받았을 경우 (error_code: -1)',
  })
  @ApiResponseType()
  async createCoupleChannel(
    @User() user: UserModel,
    @Body() data: CreateCoupleChannelDto,
  ) {
    if (user.couple_channel_id) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_description: '이미 커플 등록된 유저입니다.',
      });
    }
    const useCase = this.createCoupleChannelUseCasesProxy.getInstance();
    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      await useCase.execute(user.id, data.couple_code, connection.manager);

      await connection.commitTransaction();

      return 'Success';
    } catch (err) {
      await connection.rollbackTransaction();
      throw err;
    } finally {
      await connection.release();
    }
  }

  @Post('anniversary')
  @AuthJwt()
  @ApiOperation({ summary: '기념일 등록' })
  @ApiResponseType()
  async addAnniversary(
    @User() user: UserModel,
    @Body() body: AddAnniversaryDto,
  ) {
    if (!user.couple_channel_id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '해당 서비스를 이용할 수 없는 유저입니다.',
      });
    }

    await this.addAnniversaryUseCasesProxy
      .getInstance()
      .execute(user.couple_channel_id, body);

    return 'Success';
  }

  @Put('loveday')
  @AuthJwt()
  @ApiOperation({ summary: '연애 시작일 변경' })
  @ApiResponseType()
  async updateLoveday(@User() user: UserModel, @Body() body: UpdateCoupleDto) {
    const useCase = this.updateCoupleUseCasesProxy.getInstance();
    const result = user.couple_channel_id
      ? await useCase.updateLoveday(user.couple_channel_id, body.loveday)
      : false;

    if (!result) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '해당 서비스를 이용할 수 없는 유저입니다.',
      });
    }
    return 'Success';
  }
}
