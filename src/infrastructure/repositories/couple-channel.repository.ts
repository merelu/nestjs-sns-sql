import {
  CreateCoupleChannelModel,
  CoupleChannelModel,
} from '@domain/model/database/couple-channel';
import { ICoupleChannelRepository } from '@domain/repositories/couple-channel.repository.interface';
import { CoupleChannel } from '@infrastructure/entities/couple-channel.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseCoupleChannelRepository
  implements ICoupleChannelRepository
{
  constructor(
    @InjectRepository(CoupleChannel)
    private readonly channelEntityRepository: Repository<CoupleChannel>,
  ) {}

  async create(
    data: CreateCoupleChannelModel,
    conn?: EntityManager | undefined,
  ): Promise<CoupleChannelModel> {
    const channelEntity = this.toCoupleChannelEntity(data);
    if (conn) {
      const result = await conn
        .getRepository(CoupleChannel)
        .save(channelEntity);
      return this.toCoupleChannel(result);
    }
    const result = await this.channelEntityRepository.save(channelEntity);
    return this.toCoupleChannel(result);
  }

  async findById(coupleChannelId: number): Promise<CoupleChannelModel> {
    const result = await this.channelEntityRepository.findOneOrFail({
      where: { id: coupleChannelId },
    });

    return this.toCoupleChannel(result);
  }

  async findByIdWithCoupleInfo(
    coupleChannelId: number,
  ): Promise<CoupleChannelModel | null> {
    const result = await this.channelEntityRepository
      .createQueryBuilder('coupleChannel')
      .where('coupleChannel.id = :coupleChannelId', {
        coupleChannelId,
      })
      .innerJoinAndSelect('coupleChannel.couple_info', 'coupleInfo')
      .leftJoinAndSelect('coupleInfo.anniversaries', 'anniversaries')
      .innerJoinAndSelect('coupleChannel.users', 'users')
      .innerJoinAndSelect('users.profile_image', 'profile_image')
      .select([
        'coupleChannel',
        'coupleInfo',
        'anniversaries',
        'users',
        'profile_image.url',
      ])
      .getOne();

    if (!result) {
      return null;
    }

    return this.toCoupleChannel(result);
  }

  private toCoupleChannel(data: CoupleChannel): CoupleChannelModel {
    const result = new CoupleChannelModel();
    result.id = data.id;

    result.code = data.code;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    result.users = data.users;

    result.couple_info_id = data.couple_info_id;
    result.couple_info = data.couple_info;

    result.album_id = data.album_id;
    result.album = data.album;

    result.messages = data.messages;

    return result;
  }

  private toCoupleChannelEntity(data: CreateCoupleChannelModel): CoupleChannel {
    const result = new CoupleChannel();
    result.album_id = data.album_id;
    result.couple_info_id = data.couple_info_id;
    result.code = data.code;

    return result;
  }
}
