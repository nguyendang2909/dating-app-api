import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FilterQuery, UpdateWriteOpResult } from 'mongoose';

export class EntityFactory {
  public static getPagination({
    page,
    pageSize,
  }: {
    page?: string;
    pageSize?: string;
  }): {
    limit: number;
    skip: number;
  } {
    const pageAsNumber = +(page || 1);

    const pageSizeAsNumber = +(pageSize || 25);

    const limit = pageSizeAsNumber > 25 ? 25 : pageSizeAsNumber;

    const skip = limit * (pageAsNumber - 1);

    return { limit, skip };
  }

  public static setFindOptions<T>(condition?: FilterQuery<T>): FilterQuery<T> {
    if (condition) {
      return {
        ...condition,
        isActive: true,
      };
    }

    return { isActive: true };
  }

  public static handleUpdateOne(updateWriteOpResult: UpdateWriteOpResult): {
    message: string;
  } {
    const { matchedCount, modifiedCount } = updateWriteOpResult;

    if (modifiedCount) {
      return { message: 'Update successfully' };
    }

    if (!matchedCount) {
      throw new NotFoundException();
    }

    throw new BadRequestException();
  }

  public static handleDeleteOne(updateWriteOpResult: UpdateWriteOpResult): {
    message: string;
  } {
    const { matchedCount, modifiedCount } = updateWriteOpResult;

    if (modifiedCount) {
      return { message: 'Update successfully' };
    }

    if (!matchedCount) {
      throw new NotFoundException();
    }

    throw new BadRequestException();
  }
}
