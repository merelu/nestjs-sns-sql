import {
  CreateProfileImageModel,
  ProfileImageModel,
  UpdateProfileImageModel,
} from '@domain/model/database/profile-image';
import { IProfileImageRepository } from '@domain/repositories/profile-image.repository.interface';
import { ProfileImage } from '@infrastructure/entities/profile-image.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseProfileImageRepository implements IProfileImageRepository {
  constructor(
    @InjectRepository(ProfileImage)
    private readonly profileImageEntityRepository: Repository<ProfileImage>,
  ) {}

  async create(
    data: CreateProfileImageModel,
    conn?: EntityManager,
  ): Promise<ProfileImageModel> {
    const profileImageEntity = this.toProfileImageEntity(data);
    if (conn) {
      const result = await conn
        .getRepository(ProfileImage)
        .save(profileImageEntity);
      return this.toProfileImage(result);
    }

    const result = await this.profileImageEntityRepository.save(
      profileImageEntity,
    );
    return this.toProfileImage(result);
  }

  async updateProfileIamge(
    profileImageId: number,
    data: UpdateProfileImageModel,
    conn?: EntityManager,
  ): Promise<void> {
    if (conn) {
      await conn
        .getRepository(ProfileImage)
        .update({ id: profileImageId }, data);
      return;
    }
    await this.profileImageEntityRepository.update(
      { id: profileImageId },
      data,
    );
  }

  private toProfileImage(data: ProfileImage): ProfileImageModel {
    const result = new ProfileImageModel();
    result.id = data.id;
    result.key = data.key;
    result.url = data.url;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    return result;
  }

  private toProfileImageEntity(data: CreateProfileImageModel): ProfileImage {
    const result = new ProfileImage();
    result.key = data.key;
    result.url = data.url;

    return result;
  }
}
