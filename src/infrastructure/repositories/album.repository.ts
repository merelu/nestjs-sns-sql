import { AlbumModel } from '@domain/model/database/album';
import { IAlbumRepository } from '@domain/repositories/album.repository.interface';
import { Album } from '@infrastructure/entities/album.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseAlbumRepository implements IAlbumRepository {
  constructor(
    @InjectRepository(Album)
    private readonly albumEntityRepository: Repository<Album>,
  ) {}

  async create(conn?: EntityManager | undefined): Promise<AlbumModel> {
    const albumEntity = this.toAlbumEntity();
    if (conn) {
      const result = await conn.getRepository(Album).save(albumEntity);
      return this.toAlbum(result);
    }

    const result = await this.albumEntityRepository.save(albumEntity);
    return this.toAlbum(result);
  }

  private toAlbum(data: Album): AlbumModel {
    const result = new AlbumModel();
    result.id = data.id;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    result.couple_channel = data.couple_channel;
    result.feeds = data.feeds;

    return result;
  }

  private toAlbumEntity(): Album {
    return new Album();
  }
}
