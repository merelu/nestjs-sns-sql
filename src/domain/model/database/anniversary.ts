import { PickType } from '@nestjs/mapped-types';
import { CoupleInfoModel } from './couple-info';

export class AnniversaryModel {
  id: number;
  name: string;
  datetime: Date;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;

  couple_info_id: number | null;
  couple_info: CoupleInfoModel;
}

export class CreateAnniversaryModel extends PickType(AnniversaryModel, [
  'name',
  'datetime',
  'couple_info_id',
] as const) {}

export class UpdateAnniversaryModel extends PickType(AnniversaryModel, [
  'name',
  'datetime',
] as const) {}
