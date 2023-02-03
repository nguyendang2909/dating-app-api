import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import _ from 'lodash';
import { decode } from 'punycode';
import { Socket } from 'socket.io';
import { ActivitiesService } from 'src/activities/activities.service';
import { APP_CONFIG } from 'src/app.config';
import { AuthJwtService } from 'src/modules/auth/auth-jwt.service';
import { AuthUsersService } from 'src/modules/auth/auth-users.service';
import { UserLeanDocument } from 'src/modules/users/entities/user.entity';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authJwtService: AuthJwtService,
    private readonly authUsersService: AuthUsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();

    const authHeaders =
      client.handshake.headers.authorization ||
      client.handshake.headers.Authorization;

    if (!authHeaders || !_.isString(authHeaders)) {
      throw new WsException({ status: 401, message: 'Unauthorized' });
    }

    const token = authHeaders.split(' ')[1];

    if (!token) {
      throw new WsException({ status: 401, message: 'Unauthorized' });
    }

    const decoded = this.authJwtService.verify(token);

    const user = await this.authUsersService.findOneById(decoded.id);

    if (!user) {
      throw new WsException({
        status: 404,
        type: 'user',
        message: 'User not found',
      });
    }

    client.handshake.user = user;

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return true;
  }
}
