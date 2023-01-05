import {
  CoupleInfoModel,
  UpdateCoupleInfoModel,
} from '@domain/model/database/couple-info';
import { EntityManager } from 'typeorm';

export interface ICoupleInfoRepository {
  create(conn?: EntityManager): Promise<CoupleInfoModel>;

  update(
    coupleInfoId: number,
    data: UpdateCoupleInfoModel,
    conn?: EntityManager,
  ): Promise<void>;
}
