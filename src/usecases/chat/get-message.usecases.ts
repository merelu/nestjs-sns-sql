import { DEFAULT_PAGINATION_SIZE } from '@domain/common/constants/pagination.constants';
import { IPagination } from '@domain/model/common/pagination';
import { IMessageRepository } from '@domain/repositories/message.repository.interface';
import dayjs from 'dayjs';

export class GetMessageUseCases {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async getMessagesByPagination(
    coupleChannelId: number,
    pagination: IPagination,
  ) {
    const result = await this.messageRepository.findMessagesByPagination(
      coupleChannelId,
      {
        page: pagination.page ? pagination.page : 0,
        size: pagination.size ? pagination.size : DEFAULT_PAGINATION_SIZE,
        requested_at: pagination.requested_at
          ? pagination.requested_at
          : dayjs().toDate(),
      },
    );
    console.log(result);
    return result;
  }
}
