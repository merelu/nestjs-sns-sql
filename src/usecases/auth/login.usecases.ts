import { IBcryptService } from '@domain/adapters/bcrypt.interface';
import {
  IJwtService,
  IJwtServicePayload,
} from '@domain/adapters/jwt.interface';
import { IRedisCacheService } from '@domain/adapters/redis-cache.interface';
import { JwtConfig } from '@domain/config/jwt.interface';
import { UpdateDeviceModel } from '@domain/model/database/device';
import { UserModel } from '@domain/model/database/user';
import { IDeviceRepository } from '@domain/repositories/device.repository.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { DeviceInfoDto } from '@infrastructure/controllers/auth/auth.dto';
import dayjs from 'dayjs';
import { EntityManager } from 'typeorm';

export class LoginUseCases {
  constructor(
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JwtConfig,
    private readonly userRepository: IUserRepository,
    private readonly deviceRepository: IDeviceRepository,
    private readonly redisCashService: IRedisCacheService,
    private readonly bcryptService: IBcryptService,
  ) {}

  getJwtTokenAndCookie(userId: number) {
    const payload: IJwtServicePayload = { sub: userId };
    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);

    return {
      token,
      cookie: `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtExpirationTime()}; SameSite=None; Secure`,
    };
  }

  async getJwtRefreshTokenAndCookie(userId: number) {
    const payload: IJwtServicePayload = { sub: userId };
    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    const tokenSigniture = token.split('.')[2];
    await this.setCurrentRefreshTokenHash(tokenSigniture, userId);

    return {
      token,
      cookie: `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}; SameSite=None; Secure`,
    };
  }

  async validateJwtToken(
    token: string,
    secret?: string,
  ): Promise<IJwtServicePayload> {
    const decode = await this.jwtTokenService.checkToken(token, secret);
    return decode;
  }

  async validateUserForJWTStrategy(userId: number): Promise<UserModel | null> {
    return await this.userRepository.findUserById(userId);
  }

  async updateLoginTime(userId: number) {
    await this.userRepository.updateLastLogin(userId);
  }

  async updateDeviceInfo(
    deviceId: number,
    data: DeviceInfoDto,
    conn?: EntityManager,
  ) {
    const updated = new UpdateDeviceModel();
    updated.device_token = data.device_token;
    updated.device_token_timestamp = dayjs().toDate();
    updated.platform = data.platform;

    await this.deviceRepository.update(deviceId, updated, conn);
  }

  async compareRefreshTokenHash(
    userId: number,
    signiture: string,
  ): Promise<boolean> {
    const matchedHash = await this.redisCashService.get('refresh' + userId);

    console.log(matchedHash);
    if (!matchedHash) return false;

    const isValid = await this.bcryptService.compare(signiture, matchedHash);

    console.log(isValid);
    if (!isValid) {
      return false;
    }
    return true;
  }

  async setCurrentRefreshTokenHash(signiture: string, userId: number) {
    const hashedKey = await this.bcryptService.hash(signiture);
    await this.redisCashService.set(
      'refresh' + userId,
      hashedKey,
      Number(this.jwtConfig.getJwtRefreshExpirationTime()),
    );
  }
}
