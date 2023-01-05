import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { UserModel } from '@domain/model/database/user';
import { AuthJwt } from '@infrastructure/common/decorators/auth.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usercases-proxy';
import {
  Body,
  Controller,
  Get,
  Inject,
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
import { CreateMessageUseCases } from 'src/usecases/chat/create-message.usecases';
import { GetMessageUseCases } from 'src/usecases/chat/get-message.usecases';
import { ReadMessageUseCases } from 'src/usecases/chat/read-message.usecases';
import { DataSource } from 'typeorm';
import { CreateMessageDto, MessagePaginationDto } from './chat.dto';
import { BaseChatPresenter } from './chat.presenter';

@Controller('chat')
@ApiTags('Chat')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiExtraModels(BaseChatPresenter)
export class ChatController {
  constructor(
    @Inject(UseCasesProxyModule.GET_MESSAGE_USECASES_PROXY)
    private readonly getMessageUseCasesProxy: UseCaseProxy<GetMessageUseCases>,
    @Inject(UseCasesProxyModule.CREATE_MESSAGE_USECASES_PROXY)
    private readonly createMessageUseCasesProxy: UseCaseProxy<CreateMessageUseCases>,
    @Inject(UseCasesProxyModule.READ_MESSAGE_USECASES_PROXY)
    private readonly readMessageUseCasesProxy: UseCaseProxy<ReadMessageUseCases>,
    private readonly exceptionService: ExceptionsService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  @AuthJwt()
  @ApiOperation({ summary: '채팅 작성' })
  @ApiResponseType(BaseChatPresenter)
  async createMessage(@User() user: UserModel, @Body() data: CreateMessageDto) {
    if (!user.couple_channel_id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '해당 서비스를 이용할 수 없는 유저입니다.',
        error_description: 'couple채널이 없습니다.',
      });
    }

    const useCase = this.createMessageUseCasesProxy.getInstance();

    const newMessage = await useCase.execute(
      user.id,
      user.couple_channel_id,
      data,
    );

    const result = await useCase.getMessage(newMessage.id);

    return new BaseChatPresenter(result);
  }

  @Get('list')
  @AuthJwt()
  @ApiOperation({ summary: 'messages 가져오기 by pagination' })
  async getMessagesByPagination(
    @User() user: UserModel,
    @Query() query: MessagePaginationDto,
  ) {
    if (!user.couple_channel_id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '해당 서비스를 이용할 수 없는 유저입니다.',
        error_description: 'couple채널이 없습니다.',
      });
    }

    const result = await this.getMessageUseCasesProxy
      .getInstance()
      .getMessagesByPagination(user.couple_channel_id, query);

    return result.map((i) => new BaseChatPresenter(i));
  }

  @Put('read')
  @AuthJwt()
  @ApiOperation({ summary: 'message 읽음 처리' })
  async readMessage(@User() user: UserModel) {
    if (!user.couple_channel_id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '해당 서비스를 이용할 수 없는 유저입니다.',
        error_description: 'couple채널이 없습니다.',
      });
    }

    await this.readMessageUseCasesProxy
      .getInstance()
      .execute(user.id, user.couple_channel_id);

    return 'Success';
  }
}
