import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import {
  CreateUserModel,
  UpdateUserModel,
  UserModel,
} from '@domain/model/database/user';
import { EntityManager } from 'typeorm';

export interface IUserRepository {
  create(data: CreateUserModel, conn?: EntityManager): Promise<UserModel>;
  findUserById(id: number, conn?: EntityManager): Promise<UserModel | null>;
  findByIdUserWithProfile(
    id: number,
    conn?: EntityManager,
  ): Promise<UserModel | null>;
  findUserByOAuthPayload(
    provider: AuthTypeEnum,
    providerUserId: string,
    conn?: EntityManager,
  ): Promise<UserModel | null>;
  updateLastLogin(id: number, conn?: EntityManager): Promise<void>;

  updateCoupleChannelId(
    userId: number,
    coupleChannelId: number,
    conn?: EntityManager,
  ): Promise<void>;

  update(
    userId: number,
    data: UpdateUserModel,
    conn?: EntityManager,
  ): Promise<void>;

  delete(userId: number): Promise<void>;
}
