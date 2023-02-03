import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ActivitiesService } from 'src/activities/activities.service';
import { APP_CONFIG } from 'src/app.config';
import { UserLeanDocument } from 'src/modules/users/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt']) {
  constructor(
    private readonly reflector: Reflector,
    private readonly activitiesService: ActivitiesService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      APP_CONFIG.PUBLIC_ENDPOINT_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest<T extends UserLeanDocument>(
    err: any,
    user: T,
    info: any,
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest<Request>();

    // const isAllowPublic = this.reflector.getAllAndOverride<boolean>(
    //   APP_CONFIG.ALLOW_PUBLIC_ENDPOINT_METADATA,
    //   [context.getHandler(), context.getClass()],
    // );

    const _userId = user?._id;

    if (_userId) {
      const userId = _userId.toString();

      if (req.method === 'POST') {
        req.body.createdBy = userId;

        req.body.updatedBy = userId;
      } else if (['PATCH', 'PUT'].includes(req.method)) {
        req.body.updatedBy = userId;
      }

      this.activitiesService.create({
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        path: req.path,
        createdBy: _userId,
        updatedBy: _userId,
        ip: req.ip,
      });

      // console.log(req.body);

      return user;
    }

    // if (isAllowPublic) {
    //   return true;
    // }

    throw err || new UnauthorizedException();
  }
}
