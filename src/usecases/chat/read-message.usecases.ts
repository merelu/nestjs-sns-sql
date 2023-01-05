import { IMessageRepository } from '@domain/repositories/message.repository.interface';

export class ReadMessageUseCases {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(userId: number, coupleChannelId: number) {
    await this.messageRepository.updateMessagesRead(userId, coupleChannelId);
  }
}
