import { IException } from '@domain/adapters/exceptions.interface';
import { IJwtService } from '@domain/adapters/jwt.interface';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { JwtConfig } from '@domain/config/jwt.interface';
import { IAlbumRepository } from '@domain/repositories/album.repository.interface';
import { ICoupleChannelRepository } from '@domain/repositories/couple-channel.repository.interface';
import { ICoupleInfoRepository } from '@domain/repositories/couple-info.repository.interface';
import { EntityManager } from 'typeorm';
import {
  CoupleChannelModel,
  CreateCoupleChannelModel,
} from '@domain/model/database/couple-channel';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { AlbumModel } from '@domain/model/database/album';
import { CoupleInfoModel } from '@domain/model/database/couple-info';

export class CreateCoupleChannelUseCases {
  constructor(
    private readonly coupleChannelRepository: ICoupleChannelRepository,
    private readonly coupleInfoRepository: ICoupleInfoRepository,
    private readonly albumRepository: IAlbumRepository,
    private readonly userRepository: IUserRepository,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JwtConfig,
    private readonly exceptionService: IException,
  ) {}

  async execute(
    userId: number,
    code: string,
    conn?: EntityManager,
  ): Promise<CoupleChannelModel> {
    const partnerId = await this.checkCoupleCode(code);
    const newAlbum = await this.createAlbum(conn);
    const newCoupleInfo = await this.createCoupleInfo(conn);

    const newCoupleChannel = await this.createCoupleChannel(
      newAlbum.id,
      newCoupleInfo.id,
      code,
      conn,
    );

    await this.updateUserCoupleChannelId(userId, newCoupleChannel.id, conn);
    await this.updateUserCoupleChannelId(partnerId, newCoupleChannel.id, conn);

    return newCoupleChannel;
  }

  private async updateUserCoupleChannelId(
    userId: number,
    coupleChannelId: number,
    conn?: EntityManager,
  ): Promise<void> {
    await this.userRepository.updateCoupleChannelId(
      userId,
      coupleChannelId,
      conn,
    );
  }

  private async createCoupleChannel(
    albumId: number,
    coupleInfoId: number,
    code: string,
    conn?: EntityManager,
  ): Promise<CoupleChannelModel> {
    const newCreatedModel = new CreateCoupleChannelModel();
    newCreatedModel.couple_info_id = coupleInfoId;
    newCreatedModel.album_id = albumId;
    newCreatedModel.code = code;

    return await this.coupleChannelRepository.create(newCreatedModel, conn);
  }

  private async createAlbum(conn?: EntityManager): Promise<AlbumModel> {
    return await this.albumRepository.create(conn);
  }

  private async createCoupleInfo(
    conn?: EntityManager,
  ): Promise<CoupleInfoModel> {
    return await this.coupleInfoRepository.create(conn);
  }

  private async checkCoupleCode(code: string): Promise<number> {
    try {
      const decode = await this.jwtTokenService.checkToken(
        code,
        this.jwtConfig.getJwtCoupleCodeSecret(),
        true,
      );
      return decode.sub;
    } catch (err) {
      console.log(err);
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_description: '유효하지 않은 코드 입니다.',
      });
    }
  }
}
