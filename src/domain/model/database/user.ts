import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { UserStatusEnum } from '@domain/common/enums/user/user-status.enum';
import { DeviceModel } from './device';
import { ProfileModel } from './profile';
import { PickType } from '@nestjs/mapped-types';
import { CoupleChannelModel } from './couple-channel';
import { ProfileImageModel } from './profile-image';
import { FeedLikerModel } from './feed-liker';

export class UserModel {
  id: number;

  status: UserStatusEnum;

  name: string;

  auth_type: AuthTypeEnum;

  oauth_user_id: string;

  last_login_at: Date | null;

  push_agree: boolean;

  deleted_at: Date | null;

  created_at: Date;
  updated_at: Date;

  profile_image_id: number | null;

  profile_image: ProfileImageModel;

  profile_id: number | null;
  profile: ProfileModel;

  device_id: number | null;
  device: DeviceModel;

  couple_channel_id: number | null;
  couple_channel: CoupleChannelModel;

  feed_likers: FeedLikerModel[];
}

export class CreateUserModel extends PickType(UserModel, [
  'name',
  'auth_type',
  'oauth_user_id',
  'profile',
  'device',
  'profile_image_id',
] as const) {}

export class UpdateUserModel extends PickType(UserModel, [
  'name',
  'push_agree',
  'status',
] as const) {}
