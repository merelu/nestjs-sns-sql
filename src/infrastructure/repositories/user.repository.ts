import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import {
  CreateUserModel,
  UpdateUserModel,
  UserModel,
} from '@domain/model/database/user';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@infrastructure/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class DatabaseUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  async create(
    data: CreateUserModel,
    conn?: EntityManager,
  ): Promise<UserModel> {
    const userEntity = this.toUserEntity(data);
    if (conn) {
      const result = await conn.getRepository(User).save(userEntity);
      return this.toUser(result);
    }
    const result = await this.userEntityRepository.save(userEntity);
    return this.toUser(result);
  }

  async findUserById(
    userid: number,
    conn?: EntityManager,
  ): Promise<UserModel | null> {
    if (conn) {
      const result = await conn
        .getRepository(User)
        .findOneOrFail({ where: { id: userid } });

      return this.toUser(result);
    }
    const result = await this.userEntityRepository.findOne({
      where: { id: userid },
      withDeleted: true,
    });
    if (!result) {
      return null;
    }
    return this.toUser(result);
  }

  async findByIdUserWithProfile(
    id: number,
    conn?: EntityManager,
  ): Promise<UserModel | null> {
    let result: User | null = null;
    if (conn) {
      result = await conn
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .innerJoinAndSelect('user.profile', 'profile')
        .innerJoinAndSelect('user.profile_image', 'profile_image')
        .select(['user', 'profile', 'profile_image.url'])
        .getOneOrFail();
    }
    result = await this.userEntityRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoinAndSelect('user.profile', 'profile')
      .innerJoinAndSelect('user.profile_image', 'profile_image')
      .select(['user', 'profile', 'profile_image.url'])
      .getOne();

    if (!result) {
      return null;
    }

    return this.toUser(result);
  }

  async findUserByOAuthPayload(
    provider: AuthTypeEnum,
    providerUserId: string,
    conn?: EntityManager,
  ): Promise<UserModel | null> {
    let result: User | null = null;
    if (conn) {
      result = await conn
        .getRepository(User)
        .createQueryBuilder('user')
        .where(
          'user.auth_type = :auth_type AND user.oauth_user_id = :oauth_id',
          { auth_type: provider, oauth_id: providerUserId },
        )
        .getOneOrFail();
    }

    result = await this.userEntityRepository
      .createQueryBuilder('user')
      .where('user.auth_type = :auth_type AND user.oauth_user_id = :oauth_id', {
        auth_type: provider,
        oauth_id: providerUserId,
      })
      .getOne();

    if (!result) return null;

    return this.toUser(result);
  }

  async updateLastLogin(id: number, conn?: EntityManager): Promise<void> {
    if (conn) {
      await conn
        .getRepository(User)
        .update({ id }, { last_login_at: () => 'CURRENT_TIMESTAMP' });
    }
    await this.userEntityRepository.update(
      {
        id,
      },
      { last_login_at: () => 'CURRENT_TIMESTAMP' },
    );
  }

  async updateCoupleChannelId(
    userId: number,
    coupleChannelId: number,
    conn?: EntityManager,
  ): Promise<void> {
    if (conn) {
      await conn
        .getRepository(User)
        .update({ id: userId }, { couple_channel_id: coupleChannelId });
      return;
    }
    await this.userEntityRepository.update(
      { id: userId },
      { couple_channel_id: coupleChannelId },
    );
  }

  async update(
    userId: number,
    data: UpdateUserModel,
    conn?: EntityManager,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(User).update({ id: userId }, data);
      return;
    }
    await this.userEntityRepository.update({ id: userId }, data);
  }

  async delete(userId: number): Promise<void> {
    await this.userEntityRepository.softDelete({ id: userId });
  }

  private toUser(data: User): UserModel {
    const result = new UserModel();
    result.id = data.id;
    result.status = data.status;

    result.auth_type = data.auth_type;
    result.oauth_user_id = data.oauth_user_id;

    result.last_login_at = data.last_login_at;

    result.push_agree = data.push_agree;

    result.deleted_at = data.deleted_at;

    result.couple_channel_id = data.couple_channel_id;
    result.couple_channel = data.couple_channel;

    result.profile_id = data.profile_id;
    result.profile = data.profile;

    result.profile_image_id = data.profile_image_id;
    result.profile_image = data.profile_image;

    result.device_id = data.device_id;
    result.device = data.device;

    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    return result;
  }

  private toUserEntity(data: CreateUserModel): User {
    const result: User = new User();

    result.name = data.name;
    result.auth_type = data.auth_type;
    result.oauth_user_id = data.oauth_user_id;
    result.profile = data.profile;
    result.device = data.device;
    result.profile_image_id = data.profile_image_id;

    return result;
  }
}
