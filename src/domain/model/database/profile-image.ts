import { PickType } from '@nestjs/mapped-types';

export class ProfileImageModel {
  id: number;
  key: string | null;
  url: string | null;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class CreateProfileImageModel extends PickType(ProfileImageModel, [
  'key',
  'url',
] as const) {}

export class UpdateProfileImageModel extends PickType(ProfileImageModel, [
  'key',
  'url',
] as const) {}
