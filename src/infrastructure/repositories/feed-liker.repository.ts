import {
  CreateFeedLikerModel,
  FeedLikerModel,
} from '@domain/model/database/feed-liker';
import { IFeedLikerRepository } from '@domain/repositories/feed-liker.repository.interface';
import { FeedLiker } from '@infrastructure/entities/feed-likers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class DatabaseFeedLikerRepository implements IFeedLikerRepository {
  constructor(
    @InjectRepository(FeedLiker)
    private readonly feedLikerEntityRepository: Repository<FeedLiker>,
  ) {}

  async create(data: CreateFeedLikerModel): Promise<boolean> {
    const newFeedLikerEntity = this.toFeedLikerEntity(data);

    const result = await this.feedLikerEntityRepository.upsert(
      newFeedLikerEntity,
      {
        skipUpdateIfNoValuesChanged: true,
        conflictPaths: ['user_id', 'feed_id'],
      },
    );
    if (result.raw.length === 0) {
      return false;
    }
    return true;
  }

  async delete(feedId: number, userId: number): Promise<boolean> {
    const result = await this.feedLikerEntityRepository.delete({
      feed_id: feedId,
      user_id: userId,
    });
    if (result.affected === 0) {
      return false;
    }
    return true;
  }

  private toFeedLiker(data: FeedLiker): FeedLikerModel {
    const result = new FeedLikerModel();
    result.feed_id = data.feed_id;
    result.feed = data.feed;
    result.user_id = data.user_id;
    result.user = data.user;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    return result;
  }

  private toFeedLikerEntity(data: CreateFeedLikerModel) {
    const result = new FeedLiker();
    result.feed_id = data.feed_id;
    result.user_id = data.user_id;

    return result;
  }
}
