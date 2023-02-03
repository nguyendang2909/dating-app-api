import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { AuthUsersService } from '../auth-users.service';
import { PasswordsService } from '../passwords.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly authUsersService: AuthUsersService,
    private readonly passwordsService: PasswordsService,
  ) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  logger = new Logger();

  async validate(email: string, password: string): Promise<any> {
    this.logger.debug(
      `User login with email: ${email} and password: ${password}`,
    );

    const user = await this.authUsersService.findOneOrFail({ email });

    this.logger.debug(`Found user with email: ${email}`);

    const { password: hashedPassword } = user;

    if (!hashedPassword) {
      throw new BadRequestException();
    }

    this.passwordsService.isMatchPasswordOrFail(password, hashedPassword);

    return user;
  }
}
