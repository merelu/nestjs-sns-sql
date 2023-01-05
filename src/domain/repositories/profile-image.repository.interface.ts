import {
  CreateProfileImageModel,
  ProfileImageModel,
  UpdateProfileImageModel,
} from '@domain/model/database/profile-image';
import { EntityManager } from 'typeorm';

export interface IProfileImageRepository {
  create(
    data: CreateProfileImageModel,
    conn?: EntityManager,
  ): Promise<ProfileImageModel>;

  updateProfileIamge(
    profileImageId: number,
    data: UpdateProfileImageModel,
    conn?: EntityManager,
  ): Promise<void>;
}
