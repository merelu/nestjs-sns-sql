import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { BaseResponseFormat } from '@domain/model/common/base.response';
import { UserModel } from '@domain/model/database/user';
import { AuthJwt } from '@infrastructure/common/decorators/auth.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { PresignedPresenter } from '@infrastructure/common/presenter/presinged.presenter';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usercases-proxy';
import { Body, Controller, Delete, Get, Inject, Put } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteUserUseCases } from 'src/usecases/user/delete-user.usercases';
import { GetUserUseCases } from 'src/usecases/user/get-user.usecases';
import { PresignedProfileImageUseCases } from 'src/usecases/user/presigned-profile-image.usecases';
import { UpdateUserUseCases } from 'src/usecases/user/update-user.usecases';
import { DataSource } from 'typeorm';
import { ProfilePresenter } from './profile.presenter';
import { UpdateUserDto } from './user.dto';
import { BaseUserPresenter, DetailUserPresenter } from './user.presenter';

@Controller('user')
@ApiTags('User')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(
  BaseUserPresenter,
  DetailUserPresenter,
  PresignedPresenter,
  ProfilePresenter,
)
export class UserController {
  constructor(
    @Inject(UseCasesProxyModule.GET_USER_USECASES_PROXY)
    private readonly getUserUseCasesProxy: UseCaseProxy<GetUserUseCases>,
    @Inject(UseCasesProxyModule.UPDATE_USER_USECASES_PROXY)
    private readonly updateUserUseCasesProxy: UseCaseProxy<UpdateUserUseCases>,
    @Inject(UseCasesProxyModule.PRESIGNED_PROFILE_IMAGE_USECASES_PROXY)
    private readonly presignedProfileImageUseCasesProxy: UseCaseProxy<PresignedProfileImageUseCases>,
    @Inject(UseCasesProxyModule.DELETE_USER_USECASES_PROXY)
    private readonly deleteUserUseCasesProxy: UseCaseProxy<DeleteUserUseCases>,
    private readonly exceptionService: ExceptionsService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('me')
  @AuthJwt()
  @ApiOperation({ summary: '내 정보(+ 프로필)' })
  @ApiResponseType(DetailUserPresenter)
  async getuser(@User() user: UserModel): Promise<BaseResponseFormat> {
    const result = await this.getUserUseCasesProxy
      .getInstance()
      .getUserByIdWithProfile(user.id);

    return new DetailUserPresenter(result as UserModel);
  }

  @Put()
  @AuthJwt()
  @ApiOperation({ summary: '유저 정보 수정' })
  async updateUser(
    @User() user: UserModel,
    @Body() body: UpdateUserDto,
  ): Promise<BaseResponseFormat> {
    const useCase = this.updateUserUseCasesProxy.getInstance();
    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      const result = await useCase.updateProfile(
        user.id,
        body,
        connection.manager,
      );
      if (!result) {
        throw this.exceptionService.internalServerErrorException({
          error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
          error_text: '유저 정보를 수정 할 수없는 유저입니다.',
          error_description: 'DB error or 유저의 프로필 정보가 없는경우',
        });
      }
      await connection.commitTransaction();
      return 'Success';
    } catch (err) {
      await connection.rollbackTransaction();
      throw err;
    } finally {
      await connection.release();
    }
  }

  @Get('profile/image/presigned')
  @AuthJwt()
  @ApiOperation({ summary: '유저 프로필 이미지 presigned url' })
  @ApiResponseType(PresignedPresenter)
  async getUserProfileImagePresigned(
    @User() user: UserModel,
  ): Promise<BaseResponseFormat> {
    const useCase = this.presignedProfileImageUseCasesProxy.getInstance();
    const result = await useCase.execute(user.id);

    return new PresignedPresenter(result);
  }

  @Delete()
  @AuthJwt()
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiResponseType()
  async withdrawUser(@User() user: UserModel) {
    const useCase = this.deleteUserUseCasesProxy.getInstance();
    await useCase.execute(user.id);

    return 'Success';
  }
}
