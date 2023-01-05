import { DevicePlatformEnum } from '@domain/common/enums/device-platform';
import { DeviceModel } from '@domain/model/database/device';
import { ApiProperty } from '@nestjs/swagger';

export class DevicePresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  device_token: string | null;

  @ApiProperty()
  device_token_timestamp: Date | null;

  @ApiProperty()
  platform: DevicePlatformEnum;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(data: DeviceModel) {
    this.id = data.id;
    this.device_token = data.device_token;
    this.device_token_timestamp = data.device_token_timestamp;
    this.platform = data.platform;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
