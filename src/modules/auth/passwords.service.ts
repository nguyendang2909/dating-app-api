import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordsService {
  hashPassword(password: string): string {
    return bcrypt.hashSync(password + process.env.PASSWORD_SECRET_KEY, 10);
  }

  isMatch(password: string, hashedPassword: string) {
    const isMatchPassword = bcrypt.compareSync(
      `${password}${process.env.PASSWORD_SECRET_KEY}`,
      hashedPassword,
    );

    return isMatchPassword;
  }

  isMatchPasswordOrFail(password: string, hashedPassword: string) {
    const isMatchPassword = this.isMatch(password, hashedPassword);

    if (!isMatchPassword) {
      throw new UnauthorizedException();
    }
  }
}
