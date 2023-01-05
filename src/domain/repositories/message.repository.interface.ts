import { IPagination } from '@domain/model/common/pagination';
import {
  CreateMessageModel,
  MessageModel,
} from '@domain/model/database/message';
import { EntityManager } from 'typeorm';

export interface IMessageRepository {
  create(data: CreateMessageModel, conn?: EntityManager): Promise<MessageModel>;

  findByIdWithSernder(messageId: number): Promise<MessageModel>;

  findMessagesByPagination(
    coupleChannelId: number,
    pagination: IPagination,
  ): Promise<MessageModel[]>;

  updateMessagesRead(
    userId: number,
    coupleChannelId: number,
    conn?: EntityManager,
  ): Promise<void>;
}
