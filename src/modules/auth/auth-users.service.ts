import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, FilterQuery, Model, Types } from 'mongoose';
import { EntityFactory } from 'src/commons/lib/entity-factory.lib';

import { User, UserLeanDocument } from '../users/entities/user.entity';
import { ERole } from '../users/users.enum';
import { CreateOneUserDto } from './dto/create-one-user.dto';
import { FindOneAuthUserDto } from './dto/find-one-auth-user.dto';
import { PasswordsService } from './passwords.service';

@Injectable()
export class AuthUsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User & Document>,
    private readonly passwordsService: PasswordsService,
  ) {}

  logger = new Logger(AuthUsersService.name);

  async onApplicationBootstrap() {
    const adminEmail = process.env.ADMIN_EMAIL;

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail) {
      this.logger.error('Not found process.env.ADMIN_EMAIL');

      return;
    }

    if (!adminPassword) {
      this.logger.error('Not found process.env.ADMIN_PASSWORD');

      return;
    }

    const existAdminUser = await this.userModel.findOne({
      isActive: true,
      email: adminEmail,
      role: ERole.admin,
    });

    if (!existAdminUser) {
      const _id = new Types.ObjectId();

      const hashedPassword = this.passwordsService.hashPassword(adminPassword);

      await this.userModel.create({
        _id,
        email: adminEmail,
        role: ERole.admin,
        password: hashedPassword,
        createdBy: _id,
        updatedBy: _id,
      });

      this.logger.log(`Created admin user with email: ${adminEmail}`);

      return;
    }

    this.logger.log(`Found admin user with email ${adminEmail}`);
  }

  async createOne(createOneUserDto: CreateOneUserDto) {
    const { googleEmail, facebookId, phoneNumber } = createOneUserDto;

    if (!googleEmail && !facebookId && !phoneNumber) {
      throw new BadRequestException();
    }

    const _id = new Types.ObjectId();

    const createOptions: Partial<User> & { _id: Types.ObjectId } = {
      _id,
      createdBy: _id,
      updatedBy: _id,
    };

    if (googleEmail) {
      createOptions.email = googleEmail;
    }

    if (facebookId) {
      createOptions.facebookId = facebookId;
    }

    if (phoneNumber) {
      createOptions.phoneNumber = phoneNumber;
    }

    const createUser = await this.userModel.create(createOptions);

    const newUser = createUser.toJSON();

    this.logger.debug(`Created new user ${JSON.stringify(newUser)}`);

    return newUser;
  }

  async findOne(findOneAuthUserDto: FindOneAuthUserDto, select?: string | any) {
    if (_.isEmpty(findOneAuthUserDto)) {
      return null;
    }

    const { email, facebookId, phoneNumber } = findOneAuthUserDto;

    const findOptions = EntityFactory.setFindOptions<UserLeanDocument>();

    if (email) {
      findOptions.email = email;
    }

    if (facebookId) {
      findOptions.facebookId = facebookId;
    }

    if (phoneNumber) {
      findOptions.phoneNumber = phoneNumber;
    }

    let query = this.userModel.findOne(findOptions);

    if (select) {
      query = query.select(select);
    }

    const findResult = await query.lean().exec();

    return findResult;
  }

  async findOneOrFail(findOneAuthUserDto: FindOneAuthUserDto) {
    const found = await this.findOne(findOneAuthUserDto);

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async findOneById(id: string) {
    const _id = new Types.ObjectId(id);

    const user = await this.userModel
      .findOne({ _id, isActive: true })
      .populate({
        path: 'interests',
        select: ['_id', 'title', 'tag'],
      })
      .populate({
        path: 'avatar',
        select: ['url'],
      })
      .lean()
      .exec();

    return user;
  }

  public async findOneOrFailById(id: string) {
    const findResult = await this.findOneById(id);

    if (!findResult) {
      throw new NotFoundException({ type: 'user' });
    }

    return findResult;
  }

  omitPassword(user: UserLeanDocument) {
    return _.omit(user, ['password']);
  }
}
