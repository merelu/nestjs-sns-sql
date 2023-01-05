import { CreateMessageModel } from '@domain/model/database/message';
import { IMessageRepository } from '@domain/repositories/message.repository.interface';
import { CreateMessageDto } from '@infrastructure/controllers/chat/chat.dto';

export class CreateMessageUseCases {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(
    userId: number,
    coupleChannelId: number,
    data: CreateMessageDto,
  ) {
    const newMessage = new CreateMessageModel();
    newMessage.type = data.type;
    newMessage.content = data.content;
    newMessage.couple_channel_id = coupleChannelId;
    newMessage.sender_id = userId;

    const result = await this.messageRepository.create(newMessage);

    return result;
  }

  async getMessage(messageId: number) {
    return await this.messageRepository.findByIdWithSernder(messageId);
  }
}
