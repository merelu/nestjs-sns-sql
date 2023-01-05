import {
  CreateAnniversaryModel,
  AnniversaryModel,
  UpdateAnniversaryModel,
} from '@domain/model/database/anniversary';
import { IAnniversaryRepository } from '@domain/repositories/anniversary.repository.interface';
import { Anniversary } from '@infrastructure/entities/anniversary.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseAnniversaryRepository implements IAnniversaryRepository {
  constructor(
    @InjectRepository(Anniversary)
    private readonly anniversaryEntityRepository: Repository<Anniversary>,
  ) {}

  async create(
    data: CreateAnniversaryModel,
    conn?: EntityManager | undefined,
  ): Promise<AnniversaryModel> {
    const anniversaryEntity = this.toAnniversaryEntity(data);
    if (conn) {
      const result = await conn
        .getRepository(Anniversary)
        .save(anniversaryEntity);
      return this.toAnniversary(result);
    }

    const result = await this.anniversaryEntityRepository.save(
      anniversaryEntity,
    );
    return this.toAnniversary(result);
  }

  async delete(
    anniversaryId: number,
    conn?: EntityManager | undefined,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(Anniversary).delete({ id: anniversaryId });
      return;
    }

    await this.anniversaryEntityRepository.delete({ id: anniversaryId });
  }

  async update(
    anniversaryId: number,
    data: UpdateAnniversaryModel,
    conn?: EntityManager,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(Anniversary).update({ id: anniversaryId }, data);
      return;
    }

    await this.anniversaryEntityRepository.update({ id: anniversaryId }, data);
  }

  toAnniversary(data: Anniversary): AnniversaryModel {
    const result = new AnniversaryModel();
    result.id = data.id;
    result.name = data.name;
    result.datetime = data.datetime;
    result.couple_info_id = data.couple_info_id;
    result.couple_info = data.couple_info;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    return result;
  }

  toAnniversaryEntity(data: CreateAnniversaryModel) {
    const result = new Anniversary();

    result.name = data.name;
    result.datetime = data.datetime;
    result.couple_info_id = data.couple_info_id;

    return result;
  }
}
