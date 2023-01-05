import { CreatePhotoModel, PhotoModel } from '@domain/model/database/photo';
import { Photo } from '@infrastructure/entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export class DatabasePhotoRepository {
  constructor(
    @InjectRepository(Photo)
    private readonly photoEntityRepository: Repository<Photo>,
  ) {}

  async createMany(
    data: CreatePhotoModel[],
    conn?: EntityManager,
  ): Promise<PhotoModel[]> {
    const newPhotos = data.map((i) => this.toPhotoEntity(i));
    if (conn) {
      const result = conn.getRepository(Photo).create(newPhotos);
      await conn.getRepository(Photo).insert(result);

      return result.map((i) => this.toPhoto(i));
    }
    const result = this.photoEntityRepository.create(newPhotos);
    await this.photoEntityRepository.insert(result);
    return result.map((i) => this.toPhoto(i));
  }

  async delete(feedId: number): Promise<void> {
    await this.photoEntityRepository.softDelete({ id: feedId });
  }

  private toPhoto(data: Photo): PhotoModel {
    const result = new PhotoModel();
    result.id = data.id;
    result.key = data.key;
    result.url = data.url;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;
    result.feed_id = data.feed_id;
    result.feed = data.feed;

    return result;
  }

  private toPhotoEntity(data: CreatePhotoModel): Photo {
    const result = new Photo();
    result.key = data.key;
    result.url = data.url;
    result.feed_id = data.feed_id;

    return result;
  }
}
