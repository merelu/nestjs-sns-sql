import { GenderTypeEnum } from '@domain/common/enums/user/gender-type.enum';
import { PickType } from '@nestjs/mapped-types';

export class ProfileModel {
  id: number;

  mobile: string;

  email: string;

  gender: GenderTypeEnum;

  birthday: string | null;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class CreateProfileModel extends PickType(ProfileModel, [
  'email',
  'gender',
  'birthday',
] as const) {}

export class UpdateProfileModel extends PickType(ProfileModel, [
  'mobile',
  'email',
  'gender',
  'birthday',
]) {}
