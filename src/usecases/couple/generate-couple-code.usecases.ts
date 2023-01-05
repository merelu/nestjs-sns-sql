import {
  IJwtService,
  IJwtServicePayload,
} from '@domain/adapters/jwt.interface';
import { JwtConfig } from '@domain/config/jwt.interface';

export class GenerateCoupleCodeUseCases {
  constructor(
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JwtConfig,
  ) {}

  execute(userId: number): string {
    const payload: IJwtServicePayload = { sub: userId };

    const secret = this.jwtConfig.getJwtCoupleCodeSecret();
    const expiresIn = this.jwtConfig.getJwtCoupleCodeExpirationTime();
    const result = this.jwtTokenService.createToken(payload, secret, expiresIn);

    return result;
  }
}
