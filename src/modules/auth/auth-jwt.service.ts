import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthJwtPayload, AuthJwtSignPayload } from './auth.type';

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  sign(authJwtPayload: AuthJwtSignPayload) {
    const jwt = this.jwtService.sign(authJwtPayload);

    return jwt;
  }

  verify(jwt: string) {
    return this.jwtService.verify<AuthJwtPayload>(jwt);
  }
}
