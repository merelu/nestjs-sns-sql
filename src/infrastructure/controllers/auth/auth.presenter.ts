import { UserModel } from '@domain/model/database/user';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUserPresenter } from '../user/user.presenter';

export class TokenPresenter {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  constructor(accessToken: string, refreshToken: string) {
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
  }
}

export class AuthUserPresenter {
  @ApiProperty({ type: BaseUserPresenter })
  user: BaseUserPresenter;

  @ApiProperty()
  authorization: TokenPresenter;

  constructor(accessToken: string, refreshToken: string, user: UserModel) {
    this.authorization = new TokenPresenter(accessToken, refreshToken);
    this.user = new BaseUserPresenter(user);
  }
}
