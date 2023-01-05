import { IException } from '@domain/adapters/exceptions.interface';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import {
  AnniversaryModel,
  CreateAnniversaryModel,
} from '@domain/model/database/anniversary';
import { IAnniversaryRepository } from '@domain/repositories/anniversary.repository.interface';
import { ICoupleChannelRepository } from '@domain/repositories/couple-channel.repository.interface';
import { AddAnniversaryDto } from '@infrastructure/controllers/couple/couple.dto';
import { EntityManager } from 'typeorm';

export class AddAnniversaryUseCases {
  constructor(
    private readonly anniversaryRepository: IAnniversaryRepository,
    private readonly coupleChannelRepository: ICoupleChannelRepository,
    private readonly exceptionService: IException,
  ) {}

  async execute(
    coupleChannelId: number,
    data: AddAnniversaryDto,
    conn?: EntityManager,
  ): Promise<AnniversaryModel> {
    const coupleChannel = await this.getCoupleInfoById(coupleChannelId);
    if (!coupleChannel) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_description: '커플 채널 정보를 찾을 수 없습니다.',
      });
    }
    const newAnniversary = new CreateAnniversaryModel();
    newAnniversary.couple_info_id = coupleChannel.couple_info_id;
    newAnniversary.name = data.name;
    newAnniversary.datetime = data.datetime;

    const result = await this.anniversaryRepository.create(
      newAnniversary,
      conn,
    );

    return result;
  }

  private async getCoupleInfoById(coupleInfoId: number) {
    return await this.coupleChannelRepository.findById(coupleInfoId);
  }
}
