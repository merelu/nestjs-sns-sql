import { PickType } from '@nestjs/mapped-types';
import { AnniversaryModel } from './anniversary';

export class CoupleInfoModel {
  id: number;
  loveday: Date;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;

  anniversaries: AnniversaryModel[];
}

export class UpdateCoupleInfoModel extends PickType(CoupleInfoModel, [
  'loveday',
] as const) {}
