import { GenderTypeEnum } from '@domain/common/enums/user/gender-type.enum';
import { ProfileModel } from '@domain/model/database/profile';
import { ApiProperty } from '@nestjs/swagger';

export class ProfilePresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mobile: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  gender: GenderTypeEnum;

  @ApiProperty({ type: 'string', nullable: true })
  birthday: string | null;

  constructor(data: ProfileModel) {
    this.id = data.id;
    this.mobile = data.mobile;
    this.email = data.email;
    this.gender = data.gender;
    this.birthday = data.birthday;
  }
}
