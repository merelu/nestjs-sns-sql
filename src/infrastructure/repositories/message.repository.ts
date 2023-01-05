import { IPagination } from '@domain/model/common/pagination';
import {
  CreateMessageModel,
  MessageModel,
} from '@domain/model/database/message';
import { IMessageRepository } from '@domain/repositories/message.repository.interface';
import { Message } from '@infrastructure/entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Not, Repository } from 'typeorm';

export class DatabaseMessageRepository implements IMessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageEntityRepository: Repository<Message>,
  ) {}

  async create(
    data: CreateMessageModel,
    conn?: EntityManager | undefined,
  ): Promise<MessageModel> {
    const messageEntity = this.toMessageEntity(data);
    if (conn) {
      const result = await conn.getRepository(Message).save(messageEntity);
      return this.toMessage(result);
    }
    const result = await this.messageEntityRepository.save(messageEntity);

    return this.toMessage(result);
  }
  async findByIdWithSernder(messageId: number): Promise<MessageModel> {
    const qb = this.messageEntityRepository
      .createQueryBuilder('message')
      .where('message.id = :message_id', { message_id: messageId })
      .innerJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('sender.profile_image', 'profile_image');

    const result = await qb.getOneOrFail();

    return result;
  }
  async findMessagesByPagination(
    coupleChannelId: number,
    pagination: IPagination,
  ): Promise<MessageModel[]> {
    const qb = this.messageEntityRepository
      .createQueryBuilder('message')
      .where(
        'message.couple_channel_id = :couple_channel_id AND message.created_at < :requested_at',
        {
          couple_channel_id: coupleChannelId,
          requested_at: pagination.requested_at,
        },
      )
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('sender.profile_image', 'profile_image')
      .orderBy('message.id', 'DESC')
      .limit(pagination.size)
      .offset(pagination.page * pagination.size);

    const result = await qb.getMany();

    return result.map((i) => this.toMessage(i));
  }
  async updateMessagesRead(
    userId: number,
    coupleChannelId: number,
    conn?: EntityManager | undefined,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(Message).update(
        {
          couple_channel_id: coupleChannelId,
          sender_id: Not(userId),
          read: false,
        },
        { read: true },
      );
      return;
    }
    await this.messageEntityRepository.update(
      {
        couple_channel_id: coupleChannelId,
        sender_id: Not(userId),
        read: false,
      },
      { read: true },
    );
  }

  private toMessage(data: Message): MessageModel {
    const result = new MessageModel();
    result.id = data.id;
    result.type = data.type;
    result.content = data.content;
    result.read = data.read;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    result.couple_channel_id = data.couple_channel_id;
    result.couple_channel = data.couple_channel;

    result.sender_id = data.sender_id;
    result.sender = data.sender;

    return result;
  }

  private toMessageEntity(data: CreateMessageModel): Message {
    const result = new Message();
    result.type = data.type;
    result.content = data.content;
    result.couple_channel_id = data.couple_channel_id;
    result.sender_id = data.sender_id;

    return result;
  }
}
