import { UpdateProfileModel } from '@domain/model/database/profile';
import { UpdateProfileImageModel } from '@domain/model/database/profile-image';
import { IProfileImageRepository } from '@domain/repositories/profile-image.repository.interface';
import { IProfileRepository } from '@domain/repositories/profile.repository.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { UpdateUserDto } from '@infrastructure/controllers/user/user.dto';
import { EntityManager } from 'typeorm';
import { IMAGE_BASE_URL } from '@domain/common/constants/image.baseurl';
import { UpdateUserModel } from '@domain/model/database/user';

export class UpdateUserUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly profileRepository: IProfileRepository,
    private readonly profileImageRepository: IProfileImageRepository,
  ) {}

  async updateProfile(
    userId: number,
    data: UpdateUserDto,
    conn?: EntityManager,
  ): Promise<boolean> {
    const user = await this.userRepository.findByIdUserWithProfile(
      userId,
      conn,
    );
    if (!user || !user.profile_id) {
      return false;
    }

    const updatedModel = new UpdateProfileModel();

    updatedModel.gender = data.gender;
    updatedModel.birthday = data.birthday;

    await this.profileRepository.updateProfile(
      user.profile_id,
      updatedModel,
      conn,
    );

    if (data.push_agree || data.name) {
      const updatedUser = new UpdateUserModel();
      updatedUser.name = data.name;
      updatedUser.push_agree = data.push_agree;
      await this.userRepository.update(userId, updatedUser, conn);
    }

    if (data.profile_image_key && user.profile_image_id) {
      await this.updateProfileImage(
        user.profile_image_id,
        data.profile_image_key,
        IMAGE_BASE_URL + `/${data.profile_image_key}`,
        conn,
      );
    }

    return true;
  }

  private async updateProfileImage(
    profileImageId: number,
    key: string,
    url: string,
    conn?: EntityManager,
  ) {
    const updatedProfileImage = new UpdateProfileImageModel();
    updatedProfileImage.key = key;
    updatedProfileImage.url = url;

    await this.profileImageRepository.updateProfileIamge(
      profileImageId,
      updatedProfileImage,
      conn,
    );
  }
}
