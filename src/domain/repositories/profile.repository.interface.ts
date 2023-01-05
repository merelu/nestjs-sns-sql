import {
  CreateProfileModel,
  ProfileModel,
  UpdateProfileModel,
} from '@domain/model/database/profile';
import { EntityManager } from 'typeorm';

export interface IProfileRepository {
  create(data: CreateProfileModel, conn?: EntityManager): Promise<ProfileModel>;

  updateProfile(
    profileId: number,
    updatedModel: UpdateProfileModel,
    conn?: EntityManager | undefined,
  ): Promise<void>;
}
