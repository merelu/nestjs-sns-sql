import { IPagination } from '@domain/model/common/pagination';
import {
  CreateFeedModel,
  FeedModel,
  UpdateFeedModel,
} from '@domain/model/database/feed';
import { EntityManager } from 'typeorm';

export interface IFeedRepository {
  create(data: CreateFeedModel, conn?: EntityManager): Promise<FeedModel>;

  update(
    feedId: number,
    data: UpdateFeedModel,
    conn?: EntityManager,
  ): Promise<void>;

  delete(feedId: number): Promise<void>;

  findFeedById(feedId: number, conn?: EntityManager): Promise<FeedModel | null>;

  findFeedByIdDetail(feedId: number, userId?: number): Promise<FeedModel>;

  findFeedsByPagination(
    pagination: IPagination,
    userId?: number,
  ): Promise<FeedModel[]>;

  increaseLikeCount(feedId: number, conn?: EntityManager): Promise<void>;

  decreaseLikeCount(feedId: number, conn?: EntityManager): Promise<void>;
}
