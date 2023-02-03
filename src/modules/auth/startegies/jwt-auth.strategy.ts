import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { LeanDocument } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserLeanDocument } from 'src/modules/users/entities/user.entity';

import { AuthService } from '../auth.service';
import { AuthJwtPayload } from '../auth.type';
import { AuthUsersService } from '../auth-users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private authUsersService: AuthUsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH_JWT_SECRET_KEY,
    });
  }

  async validate(
    jwtPayload: AuthJwtPayload,
  ): Promise<LeanDocument<UserLeanDocument>> {
    const user = await this.authUsersService.findOneById(jwtPayload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
