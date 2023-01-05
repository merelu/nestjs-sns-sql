import { MessageModel } from '@domain/model/database/message';
import { AuthenticatedSocket } from '@infrastructure/common/adapter/redis-io.adapter';
import { WsExceptionFilter } from '@infrastructure/common/filter/ws-exception.filter';
import {
  CreateMessageDto,
  MessagePaginationDto,
} from '@infrastructure/controllers/chat/chat.dto';
import { BaseChatPresenter } from '@infrastructure/controllers/chat/chat.presenter';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { LoggerService } from '@infrastructure/services/logger/logger.service';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usercases-proxy';
import { Inject, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateMessageUseCases } from 'src/usecases/chat/create-message.usecases';
import { GetMessageUseCases } from 'src/usecases/chat/get-message.usecases';

@UseFilters(new WsExceptionFilter(new LoggerService()))
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(UseCasesProxyModule.GET_MESSAGE_USECASES_PROXY)
    private readonly getMessagesUseCaseProxy: UseCaseProxy<GetMessageUseCases>,
    @Inject(UseCasesProxyModule.CREATE_MESSAGE_USECASES_PROXY)
    private readonly createMessageUseCaseProxy: UseCaseProxy<CreateMessageUseCases>,
    private readonly exceptionService: ExceptionsService,
    private readonly logger: LoggerService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.logger.log('Socket Init', 'connected');
  }

  async handleConnection(socket: AuthenticatedSocket) {
    const coupleChannelId = socket.data.couple_channel_id?.toString();
    if (coupleChannelId) {
      socket.join(coupleChannelId.toString());
      socket.join(socket.data.id.toString());
      const onlineSockets = await socket.in(coupleChannelId).fetchSockets();
      console.log(
        'debug',
        onlineSockets.map((socket) => console.log(socket.data)),
      );
      const users = new Set(
        onlineSockets.map((socket) => socket.data.id.toString()),
      );

      socket.nsp.emit('onOnlineUsers', [...users]);
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: AuthenticatedSocket) {
    const coupleChannelId = socket.data.couple_channel_id?.toString();
    if (coupleChannelId) {
      const onlineSockets = await socket.in(coupleChannelId).fetchSockets();
      const users = new Set(
        onlineSockets.map((socket) => socket.data['user']._id.toString()),
      );
      socket.nsp.emit('onOnlineUsers', [...users]);
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() data: CreateMessageDto,
  ) {
    if (!socket.data.couple_channel_id) {
      return;
    }
    const useCase = this.createMessageUseCaseProxy.getInstance();

    const newMessage = await useCase.execute(
      socket.data.id,
      socket.data.couple_channel_id,
      data,
    );
    const result = await useCase.getMessage(newMessage.id);

    socket
      .to(socket.data.couple_channel_id.toString())
      .emit('onMessageUpdate', new BaseChatPresenter(result));
  }

  @SubscribeMessage('messages')
  async getChannelsMessages(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() data: MessagePaginationDto,
  ) {
    if (!socket.data.couple_channel_id) {
      return;
    }
    const useCase = this.getMessagesUseCaseProxy.getInstance();
    const messages = await useCase.getMessagesByPagination(
      socket.data.couple_channel_id,
      data,
    );

    return {
      event: 'onMessagesUpdate',
      data: messages.map((i) => new BaseChatPresenter(i)),
    };
  }
}
