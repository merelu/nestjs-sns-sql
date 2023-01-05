import { PickType } from '@nestjs/mapped-types';
import { AlbumModel } from './album';
import { CoupleInfoModel } from './couple-info';
import { MessageModel } from './message';
import { UserModel } from './user';

export class CoupleChannelModel {
  id: number;

  code: string;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;

  users: UserModel[];

  couple_info_id: number | null;
  couple_info: CoupleInfoModel;

  album_id: number | null;
  album: AlbumModel;

  messages: MessageModel[];
}

export class CreateCoupleChannelModel extends PickType(CoupleChannelModel, [
  'couple_info_id',
  'album_id',
  'code',
] as const) {}
