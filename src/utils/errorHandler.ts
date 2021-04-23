import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

export default function (e: any, model: string) {
  switch (e.code) {
    case '23505':
      throw new ConflictException(`${model} already exists`);
    default:
      throw new InternalServerErrorException();
  }
}

export function JWTErrorHanlder(name: string) {
  switch (name) {
    case 'No auth token': {
      break;
    }
    default: {
      throw new UnauthorizedException();
    }
  }
}
