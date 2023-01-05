import {
  CoupleChannelModel,
  CreateCoupleChannelModel,
} from '@domain/model/database/couple-channel';
import { EntityManager } from 'typeorm';

export interface ICoupleChannelRepository {
  create(
    data: CreateCoupleChannelModel,
    conn?: EntityManager,
  ): Promise<CoupleChannelModel>;

  findByIdWithCoupleInfo(
    coupleChannelId: number,
  ): Promise<CoupleChannelModel | null>;

  findById(coupleChannelId: number): Promise<CoupleChannelModel>;
}
