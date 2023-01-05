import {
  CreateDeviceModel,
  DeviceModel,
  UpdateDeviceModel,
} from '@domain/model/database/device';
import { EntityManager } from 'typeorm';

export interface IDeviceRepository {
  create(data: CreateDeviceModel, conn?: EntityManager): Promise<DeviceModel>;

  update(
    deviceId: number,
    data: UpdateDeviceModel,
    conn?: EntityManager,
  ): Promise<void>;
}
