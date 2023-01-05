import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { UserModel } from '@domain/model/database/user';
import {
  AuthJwt,
  CondAuthJwt,
} from '@infrastructure/common/decorators/auth.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { PresignedPresenter } from '@infrastructure/common/presenter/presinged.presenter';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usercases-proxy';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFeedUseCases } from 'src/usecases/feed/create-feed.usecases';
import { DeleteFeedUseCases } from 'src/usecases/feed/delete-feed.usecases';
import { GetFeedUseCases } from 'src/usecases/feed/get-feed.usecases';
import { LikeFeedUseCases } from 'src/usecases/feed/like-feed.usecases';
import { PresignedFeedImagesUseCases } from 'src/usecases/feed/presigned-feed-images.usecases';
import { UpdateFeedUseCases } from 'src/usecases/feed/update-feed.usecases';
import { DataSource } from 'typeorm';
import { CreateFeedDto, FeedPaginationDto, UpdateFeedDto } from './feed.dto';
import { BaseFeedPresenter, FeedDetailPresenter } from './feed.presenter';

@Controller('feeds')
@ApiTags('Feed')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiExtraModels(PresignedPresenter, BaseFeedPresenter, FeedDetailPresenter)
export class FeedController {
  constructor(
    @Inject(UseCasesProxyModule.PRESIGNED_FEED_IMAGES_USECASES_PROXY)
    private readonly presignedFeedImagesUseCasesProxy: UseCaseProxy<PresignedFeedImagesUseCases>,
    @Inject(UseCasesProxyModule.CREATE_FEED_USECASES_PROXY)
    private readonly createFeedUseCasesProxy: UseCaseProxy<CreateFeedUseCases>,
    @Inject(UseCasesProxyModule.LIKE_FEED_USECASES_PROXY)
    private readonly likeFeedUseCasesProxy: UseCaseProxy<LikeFeedUseCases>,
    @Inject(UseCasesProxyModule.GET_FEED_USECASES_PROXY)
    private readonly getFeedUseCasesProxy: UseCaseProxy<GetFeedUseCases>,
    @Inject(UseCasesProxyModule.UPDATE_FEED_USECASES_PROXY)
    private readonly updateFeedUseCasesProxy: UseCaseProxy<UpdateFeedUseCases>,
    @Inject(UseCasesProxyModule.DELETE_FEED_USECASES_PROXY)
    private readonly deleteFeedUseCasesProxy: UseCaseProxy<DeleteFeedUseCases>,
    private readonly exceptionService: ExceptionsService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  @AuthJwt()
  @ApiOperation({ summary: '피드 작성' })
  @ApiResponseType(BaseFeedPresenter)
  async createFeed(@User() user: UserModel, @Body() data: CreateFeedDto) {
    if (!user.couple_channel_id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '해당 서비스를 이용할 수 없는 유저입니다.',
        error_description: 'couple채널이 없습니다.',
      });
    }
    const useCase = this.createFeedUseCasesProxy.getInstance();

    const coupleChannel = await useCase.getCoupleChannel(
      user.couple_channel_id,
    );

    if (!coupleChannel.album_id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '해당 서비스를 이용할 수 없는 유저입니다.',
        error_description: 'album이 없습니다.',
      });
    }

    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      const result = await useCase.execute(
        user.id,
        coupleChannel.album_id,
        data,
        connection.manager,
      );

      await connection.commitTransaction();
      return new BaseFeedPresenter(result);
    } catch (err) {
      await connection.rollbackTransaction();
      throw err;
    } finally {
      await connection.release();
    }
  }

  @Get('image/presigned')
  @AuthJwt()
  @ApiOperation({ summary: 'feed 이미지 업로드 presigned url 받아오기' })
  @ApiResponseType(PresignedPresenter, true)
  async getPresignedUrlOfFeedImages(
    @User() user: UserModel,
    @Query('size', new ParseIntPipe()) size: number,
  ) {
    if (!user.couple_channel_id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '해당 서비스를 이용할 수 없는 유저입니다.',
      });
    }
    const useCase = this.presignedFeedImagesUseCasesProxy.getInstance();
    const result = await useCase.execute(user.couple_channel_id, size);

    return result.map((i) => new PresignedPresenter(i));
  }

  @Post('like')
  @AuthJwt()
  @ApiOperation({ summary: '좋아요' })
  @ApiResponseType()
  async likeFeed(
    @User() user: UserModel,
    @Query('id', new ParseIntPipe()) id: number,
  ) {
    const useCase = this.likeFeedUseCasesProxy.getInstance();
    await useCase.likeFeed(id, user.id);
    return 'Success';
  }

  @Post('unlike')
  @AuthJwt()
  @ApiOperation({ summary: '좋아요 해제' })
  @ApiResponseType()
  async unlikeFeed(
    @User() user: UserModel,
    @Query('id', new ParseIntPipe()) id: number,
  ) {
    const useCase = this.likeFeedUseCasesProxy.getInstance();
    await useCase.unlike(id, user.id);
    return 'Success';
  }

  @Get(':id')
  @CondAuthJwt()
  @ApiOperation({ summary: 'feed 가져오기 by id' })
  @ApiResponseType(FeedDetailPresenter)
  async getFeedById(
    @User() user: UserModel,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    const result = await this.getFeedUseCasesProxy
      .getInstance()
      .getFeedDetailById(id, user && user.id);
    return new FeedDetailPresenter(result);
  }

  @Get('list')
  @CondAuthJwt()
  @ApiOperation({ summary: 'feeds 가져오기 by pagination' })
  @ApiResponseType()
  async getFeedsByPagination(
    @User() user: UserModel,
    @Query() query: FeedPaginationDto,
  ) {
    const result = await this.getFeedUseCasesProxy
      .getInstance()
      .getFeedsByPagination(query, user.id);

    return result.map((i) => new FeedDetailPresenter(i));
  }

  @Put(':id')
  @AuthJwt()
  @ApiOperation({ summary: '피드 수정' })
  async updateFeed(
    @User() user: UserModel,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateFeedDto,
  ) {
    const useCase = this.updateFeedUseCasesProxy.getInstance();
    const check = await useCase.checkFeed(id);
    if (!check) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: 'id에 해당하는 데이터가 없습니다.',
        error_description: '존재하지 않는 피드입니다.',
      });
    }
    if (check.writer_id !== user.id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '수정할 권한이 없는 유저입니다.',
        error_description: '수정 권한이 없습니다.',
      });
    }
    await useCase.updateFeed(id, data);
    return 'Success';
  }

  @Delete(':id')
  @AuthJwt()
  @ApiOperation({ summary: '피드 삭제' })
  async deleteFeed(
    @User() user: UserModel,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    const useCase = this.deleteFeedUseCasesProxy.getInstance();
    const check = await useCase.checkFeed(id);
    if (!check) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: 'id에 해당하는 데이터가 없습니다.',
        error_description: '존재하지 않는 피드입니다.',
      });
    }
    if (check.writer_id !== user.id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '수정할 권한이 없는 유저입니다.',
        error_description: '수정 권한이 없습니다.',
      });
    }
    await useCase.execute(id);

    return 'Success';
  }
}
