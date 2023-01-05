import { CreatePhotoModel, PhotoModel } from '@domain/model/database/photo';
import { EntityManager } from 'typeorm';

export interface IPhotoRepository {
  createMany(
    data: CreatePhotoModel[],
    conn?: EntityManager,
  ): Promise<PhotoModel[]>;

  delete(feedId: number): Promise<void>;
}
