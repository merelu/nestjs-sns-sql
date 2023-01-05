import { IPagination } from '@domain/model/common/pagination';
import {
  CreateFeedModel,
  FeedModel,
  UpdateFeedModel,
} from '@domain/model/database/feed';
import { IFeedRepository } from '@domain/repositories/feed.repository.interface';
import { Feed } from '@infrastructure/entities/feed.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export class DatabaseFeedRepository implements IFeedRepository {
  constructor(
    @InjectRepository(Feed)
    private readonly feedEntityRepository: Repository<Feed>,
  ) {}

  async create(
    data: CreateFeedModel,
    conn?: EntityManager | undefined,
  ): Promise<FeedModel> {
    const feedEntity = this.toFeedEntity(data);
    if (conn) {
      const result = await conn.getRepository(Feed).save(feedEntity);
      return this.toFeed(result);
    }

    const result = await this.feedEntityRepository.save(feedEntity);
    return this.toFeed(result);
  }

  async update(
    feedId: number,
    data: UpdateFeedModel,
    conn?: EntityManager | undefined,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(Feed).update({ id: feedId }, data);
      return;
    }
    await this.feedEntityRepository.update({ id: feedId }, data);
  }

  async delete(feedId: number): Promise<void> {
    await this.feedEntityRepository.softDelete({ id: feedId });
  }

  async increaseLikeCount(feedId: number, conn?: EntityManager): Promise<void> {
    if (conn) {
      await conn
        .getRepository(Feed)
        .update({ id: feedId }, { like_count: () => 'like_count + 1' });
    }
    this.feedEntityRepository.update(
      { id: feedId },
      { like_count: () => 'like_count + 1' },
    );
  }

  async decreaseLikeCount(feedId: number, conn?: EntityManager): Promise<void> {
    if (conn) {
      await conn
        .getRepository(Feed)
        .update({ id: feedId }, { like_count: () => 'like_count - 1' });
    }
    this.feedEntityRepository.update(
      { id: feedId },
      { like_count: () => 'like_count - 1' },
    );
  }

  async findFeedById(
    feedId: number,
    conn?: EntityManager | undefined,
  ): Promise<FeedModel | null> {
    if (conn) {
      const result = await conn
        .getRepository(Feed)
        .findOneOrFail({ where: { id: feedId } });
      return this.toFeed(result);
    }
    const result = await this.feedEntityRepository.findOne({
      where: { id: feedId },
    });

    if (!result) {
      return null;
    }
    return this.toFeed(result);
  }

  async findFeedByIdDetail(
    feedId: number,
    userId?: number,
  ): Promise<FeedModel> {
    const qb = this.feedEntityRepository
      .createQueryBuilder('feed')
      .where('feed.id = :feedId', { feedId })
      .leftJoinAndSelect('feed.photos', 'photos')
      .innerJoinAndSelect('feed.writer', 'writer')
      .innerJoinAndSelect('writer.profile_image', 'profile_image')
      .leftJoin(
        'feed_liker',
        'likers',
        'likers.feed_id = feed.id AND likers.user_id = :userId',
        { userId },
      )
      .addSelect(
        'CASE WHEN likers.feed_id IS NOT NULL THEN true ELSE false END',
        'feed_is_liked',
      );

    const records = await qb.getRawAndEntities();
    const [result] = records.entities.map((entity, i) => {
      entity.is_liked = records.raw[i].feed_is_liked;
      return entity;
    });

    return this.toFeed(result);
  }

  async findFeedsByPagination(
    pagination: IPagination,
    userId: number,
  ): Promise<FeedModel[]> {
    const qb = this.feedEntityRepository
      .createQueryBuilder('feed')
      .where('feed.created_at < :requested_at', {
        requested_at: pagination.requested_at,
      })
      .orderBy('feed.id', 'DESC')
      .leftJoinAndSelect('feed.photos', 'photos')
      .innerJoinAndSelect('feed.writer', 'writer')
      .innerJoinAndSelect('writer.profile_image', 'profile_image')
      .leftJoin(
        'feed_liker',
        'likers',
        'likers.feed_id = feed.id AND likers.user_id = :userId',
        { userId },
      )
      .addSelect(
        'CASE WHEN likers.feed_id IS NOT NULL THEN true ELSE false END',
        'feed_is_liked',
      )
      .limit(pagination.size)
      .offset(pagination.page * pagination.size);
    // console.log(await qb.getMany());

    const records = await qb.getRawAndEntities();
    console.log(records);
    const result = records.entities.map((entity, i) => {
      entity.is_liked = records.raw[i].feed_is_liked;
      return entity;
    });

    return result.map((i) => this.toFeed(i));
  }

  private toFeed(data: Feed): FeedModel {
    const result = new FeedModel();
    result.id = data.id;
    result.access_type = data.access_type;
    result.content = data.content;
    result.photos = data.photos;

    result.dating_date = data.dating_date;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    result.album_id = data.album_id;
    result.album = data.album;

    result.likers = data.likers;

    result.writer_id = data.writer_id;
    result.writer = data.writer;

    result.like_count = data.like_count;
    result.is_liked = data.is_liked;

    return result;
  }

  private toFeedEntity(data: CreateFeedModel): Feed {
    const result = new Feed();
    result.access_type = data.access_type;
    result.content = data.content;
    result.dating_date = data.dating_date;
    result.album_id = data.album_id;
    result.writer_id = data.writer_id;

    return result;
  }
}
