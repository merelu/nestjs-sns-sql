import { DevicePlatformEnum } from '@domain/common/enums/device-platform';
import { PickType } from '@nestjs/mapped-types';

export class DeviceModel {
  id: number;
  device_token: string | null;
  device_token_timestamp: Date | null;
  platform: DevicePlatformEnum;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class CreateDeviceModel extends PickType(DeviceModel, [
  'device_token',
  'platform',
] as const) {}

export class UpdateDeviceModel extends PickType(DeviceModel, [
  'device_token',
  'device_token_timestamp',
  'platform',
] as const) {}
