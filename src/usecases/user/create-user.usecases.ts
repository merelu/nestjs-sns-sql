import { DevicePlatformEnum } from '@domain/common/enums/device-platform';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { OAuthPayload, OAuthProfile } from '@domain/model/common/oauth-payload';
import { CreateDeviceModel, DeviceModel } from '@domain/model/database/device';
import { CreateProfileModel } from '@domain/model/database/profile';
import { CreateProfileImageModel } from '@domain/model/database/profile-image';
import { CreateUserModel, UserModel } from '@domain/model/database/user';
import { IDeviceRepository } from '@domain/repositories/device.repository.interface';
import { IProfileImageRepository } from '@domain/repositories/profile-image.repository.interface';
import { IProfileRepository } from '@domain/repositories/profile.repository.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { EntityManager } from 'typeorm';

export class CreateUserUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly deviceRepository: IDeviceRepository,
    private readonly profileRepository: IProfileRepository,
    private readonly profileImageRepository: IProfileImageRepository,
  ) {}

  async execute(
    data: OAuthPayload,
    deviceToken: string,
    platform: DevicePlatformEnum,
    conn?: EntityManager,
  ): Promise<UserModel> {
    const newDevice = await this.createDevice(deviceToken, platform, conn);

    const newProfile = await this.createProfile(data.profile, conn);

    const newProfileImage = await this.createProfileImage(
      data.profile.profile_image_url,
      conn,
    );

    const newUser = new CreateUserModel();

    console.log(data.profile.name);
    newUser.name = data.profile.name;
    newUser.auth_type = data.auth_type;
    newUser.oauth_user_id = data.id;
    newUser.profile = newProfile;
    newUser.device = newDevice;
    newUser.profile_image_id = newProfileImage.id;

    const result = await this.userRepository.create(newUser, conn);

    return result;
  }

  async checkMachedOAuthUser(
    providerId: string,
    provider: AuthTypeEnum,
    conn?: EntityManager,
  ) {
    return await this.userRepository.findUserByOAuthPayload(
      provider,
      providerId,
      conn,
    );
  }

  private async createDevice(
    deviceToken: string,
    platform: DevicePlatformEnum,
    conn?: EntityManager,
  ): Promise<DeviceModel> {
    const newDevice = new CreateDeviceModel();
    newDevice.device_token = deviceToken;
    newDevice.platform = platform;

    return await this.deviceRepository.create(newDevice, conn);
  }

  private async createProfile(data: OAuthProfile, conn?: EntityManager) {
    const newProfile = new CreateProfileModel();
    newProfile.email = data.email;
    newProfile.gender = data.gender_type;
    newProfile.birthday = data.birthday;

    return await this.profileRepository.create(newProfile, conn);
  }

  private async createProfileImage(url: string, conn?: EntityManager) {
    const newProfileImage = new CreateProfileImageModel();
    newProfileImage.key = null;
    newProfileImage.url = url;
    const result = await this.profileImageRepository.create(
      newProfileImage,
      conn,
    );

    return result;
  }
}
