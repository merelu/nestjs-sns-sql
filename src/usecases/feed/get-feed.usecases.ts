import { DEFAULT_PAGINATION_SIZE } from '@domain/common/constants/pagination.constants';
import { IPagination } from '@domain/model/common/pagination';
import { IFeedRepository } from '@domain/repositories/feed.repository.interface';
import dayjs from 'dayjs';

export class GetFeedUseCases {
  constructor(private readonly feedRepository: IFeedRepository) {}

  async getFeedDetailById(feedId: number, userId?: number) {
    return await this.feedRepository.findFeedByIdDetail(feedId, userId);
  }

  async getFeedsByPagination(pagination: IPagination, userId?: number) {
    return await this.feedRepository.findFeedsByPagination(
      {
        page: pagination.page ? pagination.page : 0,
        size: pagination.size ? pagination.size : DEFAULT_PAGINATION_SIZE,
        requested_at: pagination.requested_at
          ? pagination.requested_at
          : dayjs().toDate(),
      },
      userId,
    );
  }
}
