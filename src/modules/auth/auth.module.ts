import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthJwtService } from './auth-jwt.service';
import { AuthUsersService } from './auth-users.service';
import { PasswordsService } from './passwords.service';
import { JwtStrategy } from './startegies/jwt-auth.strategy';
import { LocalStrategy } from './startegies/local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('AUTH_JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: '60d',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [AuthJwtService, AuthUsersService],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    AuthService,
    AuthUsersService,
    PasswordsService,
    AuthJwtService,
    JwtStrategy,
  ],
})
export class AuthModule {}
