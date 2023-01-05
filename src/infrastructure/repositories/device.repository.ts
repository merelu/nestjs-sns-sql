import {
  CreateDeviceModel,
  DeviceModel,
  UpdateDeviceModel,
} from '@domain/model/database/device';
import { IDeviceRepository } from '@domain/repositories/device.repository.interface';
import { Device } from '@infrastructure/entities/device.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseDeviceRepository implements IDeviceRepository {
  constructor(
    @InjectRepository(Device)
    private readonly deviceEntityRepository: Repository<Device>,
  ) {}
  async create(
    data: CreateDeviceModel,
    conn?: EntityManager | undefined,
  ): Promise<DeviceModel> {
    const deviceEntity = this.toDeviceEntity(data);
    if (conn) {
      const result = await conn.getRepository(Device).save(deviceEntity);
      return this.toDevice(result);
    }
    const result = await this.deviceEntityRepository.save(deviceEntity);
    return this.toDevice(result);
  }

  async update(
    deviceId: number,
    data: UpdateDeviceModel,
    conn?: EntityManager,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(Device).update({ id: deviceId }, data);
      return;
    }
    await this.deviceEntityRepository.update({ id: deviceId }, data);
  }

  private toDevice(data: Device): DeviceModel {
    const result = new DeviceModel();
    result.id = data.id;
    result.device_token = data.device_token;
    result.device_token_timestamp = data.device_token_timestamp;
    result.platform = data.platform;

    result.deleted_at = data.deleted_at;
    result.created_at = data.created_at;
    result.updated_at = data.updated_at;

    return result;
  }

  private toDeviceEntity(data: CreateDeviceModel): Device {
    const result = new Device();

    result.device_token = data.device_token;
    result.platform = data.platform;

    return result;
  }
}
