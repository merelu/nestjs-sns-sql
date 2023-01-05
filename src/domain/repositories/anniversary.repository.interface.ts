import {
  AnniversaryModel,
  CreateAnniversaryModel,
  UpdateAnniversaryModel,
} from '@domain/model/database/anniversary';
import { EntityManager } from 'typeorm';

export interface IAnniversaryRepository {
  create(
    data: CreateAnniversaryModel,
    conn?: EntityManager,
  ): Promise<AnniversaryModel>;

  delete(anniversaryId: number, conn?: EntityManager): Promise<void>;

  update(
    anniversaryId: number,
    data: UpdateAnniversaryModel,
    conn?: EntityManager,
  ): Promise<void>;
}
