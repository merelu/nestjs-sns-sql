import { IMAGE_BASE_URL } from '@domain/common/constants/image.baseurl';
import { CreateFeedModel, FeedModel } from '@domain/model/database/feed';
import { CreatePhotoModel } from '@domain/model/database/photo';
import { ICoupleChannelRepository } from '@domain/repositories/couple-channel.repository.interface';
import { IFeedRepository } from '@domain/repositories/feed.repository.interface';
import { IPhotoRepository } from '@domain/repositories/photo.repository.interface';
import { CreateFeedDto } from '@infrastructure/controllers/feed/feed.dto';
import { EntityManager } from 'typeorm';

export class CreateFeedUseCases {
  constructor(
    private readonly feedRepository: IFeedRepository,
    private readonly coupleChannelRepository: ICoupleChannelRepository,
    private readonly photoRepository: IPhotoRepository,
  ) {}

  async execute(
    userId: number,
    albumId: number,
    data: CreateFeedDto,
    conn?: EntityManager,
  ): Promise<FeedModel> {
    const newFeed = new CreateFeedModel();
    newFeed.access_type = data.access_type;
    newFeed.content = data.content;
    newFeed.dating_date = data.dating_date;
    newFeed.album_id = albumId;
    newFeed.writer_id = userId;

    const result = await this.feedRepository.create(newFeed, conn);
    await this.createFeedImage(result.id, data.feed_photo_keys, conn);

    return result;
  }

  async getCoupleChannel(coupleChannelId: number) {
    return await this.coupleChannelRepository.findById(coupleChannelId);
  }

  private async createFeedImage(
    feedId: number,
    keys: string[],
    conn?: EntityManager,
  ) {
    const newPhotos = keys.map((key) => {
      const newPhoto = new CreatePhotoModel();
      newPhoto.key = key;
      newPhoto.url = IMAGE_BASE_URL + `/${key}`;
      newPhoto.feed_id = feedId;
      return newPhoto;
    });

    await this.photoRepository.createMany(newPhotos, conn);
  }
}
