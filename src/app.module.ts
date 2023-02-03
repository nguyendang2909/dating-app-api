import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import mg from 'nodemailer-mailgun-transport';
import path from 'path';
import winston from 'winston';

import { ActivitiesModule } from './activities/activities.module';
import { APP_NAME } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ChatsModule } from './modules/chats/chats.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { DataInterestsModule } from './modules/data-interests/data-interests.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { InterestsModule } from './modules/interests/interests.module';
import { MessagesModule } from './modules/messages/messages.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(APP_NAME, {
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(APP_NAME, {
              prettyPrint: true,
            }),
          ),
          dirname: path.join(__dirname, './../log/'),
          filename: 'info.log',
          level: 'info',
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(APP_NAME, {
              prettyPrint: true,
            }),
          ),
          dirname: path.join(__dirname, './../log/'),
          filename: 'warning.log',
          level: 'warning',
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(APP_NAME, {
              prettyPrint: true,
            }),
          ),
          dirname: path.join(__dirname, './../log/'),
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(APP_NAME, {
              prettyPrint: true,
            }),
          ),
          dirname: path.join(__dirname, './../log/'),
          filename: 'debug.log',
          level: 'debug',
        }),
        // other transports...
      ],
      // other options
    }),
    ThrottlerModule.forRoot({ ttl: 10, limit: 100 }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      dbName: process.env.MONGO_DB_NAME,
    }),
    MailerModule.forRoot({
      transport: mg({
        auth: {
          api_key: process.env.MAILGUN_PRIVATE_API_KEY,
          domain: process.env.MAILGUN_DOMAIN,
        },
      }),
      defaults: {
        from: '"vDating" <admin@vdating.com>',
      },
    }),
    AuthModule,
    UsersModule,
    DataInterestsModule,
    InterestsModule,
    GalleryModule,
    ActivitiesModule,
    ConversationsModule,
    MessagesModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
