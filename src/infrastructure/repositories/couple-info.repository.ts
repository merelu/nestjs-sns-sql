import {
  CoupleInfoModel,
  UpdateCoupleInfoModel,
} from '@domain/model/database/couple-info';
import { ICoupleInfoRepository } from '@domain/repositories/couple-info.repository.interface';
import { CoupleInfo } from '@infrastructure/entities/couple-info.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseCoupleInfoRepository implements ICoupleInfoRepository {
  constructor(
    @InjectRepository(CoupleInfo)
    private readonly coupleInfoEntityRepository: Repository<CoupleInfo>,
  ) {}

  async create(conn?: EntityManager): Promise<CoupleInfoModel> {
    const coupleInfoEntity = this.toCoupleInfoEntity();
    if (conn) {
      const result = await conn
        .getRepository(CoupleInfo)
        .save(coupleInfoEntity);
      return this.toCoupleInfo(result);
    }

    const result = await this.coupleInfoEntityRepository.save(coupleInfoEntity);
    return this.toCoupleInfo(result);
  }

  async update(
    coupleInfoId: number,
    data: UpdateCoupleInfoModel,
    conn?: EntityManager | undefined,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(CoupleInfo).update({ id: coupleInfoId }, data);
      return;
    }

    await this.coupleInfoEntityRepository.update({ id: coupleInfoId }, data);
  }

  private toCoupleInfo(data: CoupleInfo): CoupleInfoModel {
    const result = new CoupleInfoModel();
    result.id = data.id;

    result.loveday = data.loveday;
    result.anniversaries = data.anniversaries;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    return result;
  }

  private toCoupleInfoEntity(): CoupleInfo {
    return new CoupleInfo();
  }
}
