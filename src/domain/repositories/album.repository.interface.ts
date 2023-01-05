import { AlbumModel } from '@domain/model/database/album';
import { EntityManager } from 'typeorm';

export interface IAlbumRepository {
  create(conn?: EntityManager): Promise<AlbumModel>;
}
