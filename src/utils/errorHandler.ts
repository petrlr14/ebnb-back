import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export default function (e: any, model: string) {
  switch (e.code) {
    case '23505':
      throw new ConflictException(`${model} already exists`);
    default:
      throw new InternalServerErrorException();
  }
}
