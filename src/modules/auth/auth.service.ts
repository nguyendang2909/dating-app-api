import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import firebaseAdmin from 'firebase-admin';
import { OAuth2Client } from 'google-auth-library';
import _ from 'lodash';
import mongoose, { LeanDocument } from 'mongoose';

import { UserLeanDocument } from '../users/entities/user.entity';
import { AuthJwtService } from './auth-jwt.service';
import { AuthUsersService } from './auth-users.service';
import { LoginByFacebookDto } from './dto/login-by-facebook.dto';
import { LoginByGoogleDto } from './dto/login-by-google.dto';
import { LoginByPhoneNumberDto } from './dto/login-by-phone-number.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authUsersService: AuthUsersService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  private readonly googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
  );

  private readonly firebase = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  });

  async loginByGoogle(loginByGoogleDto: LoginByGoogleDto) {
    const { token: idToken } = loginByGoogleDto;

    const ticket = await this.googleClient.verifyIdToken({
      idToken,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new BadRequestException();
    }

    const { email } = payload;

    const findUser = await this.authUsersService.findOne({ email });

    const user = findUser
      ? findUser
      : await this.authUsersService.createOne({
          googleEmail: email,
        });

    const userOmitPassword = _.omit(user, ['password']);

    if (!user._id) {
      throw new InternalServerErrorException();
    }

    const accessToken = this.authJwtService.sign({
      id: user._id.toString(),
    });

    return {
      user: userOmitPassword,
      accessToken,
    };
  }

  async loginByFacebook(loginByFacebookDto: LoginByFacebookDto) {
    let facebookId: string;

    try {
      const { data: facebookResponse } = await axios.get<{ id?: string }>(
        `https://graph.facebook.com/v8.0/me?access_token=${loginByFacebookDto.token}`,
      );

      this.logger.debug(`Received response from facebook: ${facebookResponse}`);

      const { id } = facebookResponse;

      if (!id) {
        throw new BadRequestException();
      }

      facebookId = id;
    } catch (err) {
      throw new BadRequestException();
    }

    const findUser = await this.authUsersService.findOne({ facebookId });

    const user = findUser
      ? findUser
      : await this.authUsersService.createOne({
          facebookId,
        });

    const userOmitPassword = _.omit(user, ['password']);

    if (!user._id) {
      throw new InternalServerErrorException();
    }

    const accessToken = this.authJwtService.sign({
      id: user._id.toString(),
    });

    return {
      user: userOmitPassword,
      accessToken,
    };
  }

  async loginByPhoneNumber(loginByPhoneNumberDto: LoginByPhoneNumberDto) {
    const { token } = loginByPhoneNumberDto;

    const decoded = await this.firebase.auth().verifyIdToken(token);

    this.logger.debug(`Decoded firebase token: ${JSON.stringify(decoded)}`);

    const phoneNumber = decoded.phone_number;

    if (!phoneNumber) {
      this.logger.debug('There are no phone number in access token');

      throw new BadRequestException();
    }

    const findUser = await this.authUsersService.findOne({ phoneNumber });

    const user = findUser
      ? findUser
      : await this.authUsersService.createOne({
          phoneNumber,
        });

    const userOmitPassword = _.omit(user, ['password']);

    if (!user._id) {
      throw new InternalServerErrorException();
    }

    const accessToken = this.authJwtService.sign({
      id: user._id.toString(),
    });

    return {
      user: userOmitPassword,
      accessToken,
    };
  }
}
