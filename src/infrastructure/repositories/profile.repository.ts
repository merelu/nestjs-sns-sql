import {
  CreateProfileModel,
  ProfileModel,
  UpdateProfileModel,
} from '@domain/model/database/profile';
import { IProfileRepository } from '@domain/repositories/profile.repository.interface';
import { Profile } from '@infrastructure/entities/profile.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseProfileRepository implements IProfileRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly profileEntityRepository: Repository<Profile>,
  ) {}

  async create(
    data: CreateProfileModel,
    conn?: EntityManager | undefined,
  ): Promise<ProfileModel> {
    const profileEntity = this.toProfileEntity(data);
    if (conn) {
      const result = await conn.getRepository(Profile).save(profileEntity);

      return this.toProfile(result);
    }

    const result = await this.profileEntityRepository.save(profileEntity);

    return this.toProfile(result);
  }

  async updateProfile(
    profileId: number,
    updatedModel: UpdateProfileModel,
    conn?: EntityManager | undefined,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(Profile).update({ id: profileId }, updatedModel);
      return;
    }

    await this.profileEntityRepository.update({ id: profileId }, updatedModel);
  }

  private toProfile(data: Profile): ProfileModel {
    const result = new ProfileModel();
    result.id = data.id;

    result.mobile = data.mobile;
    result.email = data.email;
    result.gender = data.gender;
    result.birthday = data.birthday;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    return result;
  }

  private toProfileEntity(data: CreateProfileModel): Profile {
    const result = new Profile();

    result.email = data.email;
    result.gender = data.gender;
    result.birthday = data.birthday;

    return result;
  }
}
