import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { UserStatusEnum } from '@domain/common/enums/user/user-status.enum';
import { UserModel } from '@domain/model/database/user';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProfilePresenter } from './profile.presenter';

export class BaseUserPresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: UserStatusEnum;

  @ApiProperty()
  auth_type: AuthTypeEnum;

  @ApiProperty({ type: Date })
  last_login_at: Date | null;

  @ApiProperty()
  push_agree: boolean;

  constructor(data: UserModel) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
    this.auth_type = data.auth_type;
    this.last_login_at = data.last_login_at;
    this.push_agree = data.push_agree;
  }
}

export class DetailUserPresenter extends BaseUserPresenter {
  @ApiProperty({ type: ProfilePresenter, nullable: true })
  profile: ProfilePresenter | null;

  @ApiProperty({ type: 'string', nullable: true })
  profile_image_url: string | null;

  constructor(data: UserModel) {
    super(data);
    this.profile = data.profile ? new ProfilePresenter(data.profile) : null;
    this.profile_image_url = data.profile_image.url;
  }
}

export class SimpleUserPresenter extends PickType(DetailUserPresenter, [
  'id',
  'name',
  'profile_image_url',
] as const) {
  constructor(data: UserModel) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.profile_image_url = data.profile_image.url;
  }
}
