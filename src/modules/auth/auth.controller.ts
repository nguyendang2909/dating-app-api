import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { omit } from 'lodash';
import { IsPublic } from 'src/commons/decorators/public.enpoint';
import { RequestUser } from 'src/commons/decorators/request-user.decorator';

import { CurrentUser } from '../users/users.type';
import { AuthService } from './auth.service';
import { AuthJwtService } from './auth-jwt.service';
import { LoginByEmailDto } from './dto/login-by-email.dto';
import { LoginByFacebookDto } from './dto/login-by-facebook.dto';
import { LoginByGoogleDto } from './dto/login-by-google.dto';
import { LoginByPhoneNumberDto } from './dto/login-by-phone-number.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  private logger = new Logger(__filename);

  // @Post('/login/email')
  // @IsPublic()
  // @UseGuards(AuthGuard('local'))
  // loginByEmail(
  //   @RequestUser() currentUser: CurrentUser,
  //   @Body() loginByEmailDto: LoginByEmailDto,
  // ) {
  //   const { email, password } = loginByEmailDto;

  //   this.logger.debug(
  //     `User logged by email: ${email} and password: ${password}`,
  //   );

  //   const userPart = omit(currentUser, ['password']);

  //   const accessToken = this.authJwtService.sign({
  //     id: currentUser._id.toString(),
  //   });

  //   return {
  //     type: 'login',
  //     data: {
  //       user: userPart,
  //       accessToken,
  //     },
  //   };
  // }

  @Post('/login/google')
  @IsPublic()
  private async loginByGoogle(@Body() loginByGoogleDto: LoginByGoogleDto) {
    const data = await this.authService.loginByGoogle(loginByGoogleDto);

    return { type: 'loginByGoogle', data };
  }

  @Post('/login/facebook')
  @IsPublic()
  private async loginByFacebook(
    @Body() loginByFacebookDto: LoginByFacebookDto,
  ) {
    return {
      type: 'loginByFacebook',
      data: await this.authService.loginByFacebook(loginByFacebookDto),
    };
  }

  @Post('/login/phone-number')
  @IsPublic()
  private async loginByPhoneNumber(
    @Body() loginByPhoneNumberDto: LoginByPhoneNumberDto,
  ) {
    return {
      type: 'loginByPhoneNumber',
      data: await this.authService.loginByPhoneNumber(loginByPhoneNumberDto),
    };
  }

  @Post('/logout')
  private async logout() {
    return {
      type: 'logout',
      message: 'Logout successfully',
    };
  }
}
