import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql';
import { printSchema } from 'graphql';
import { AppModule } from './app.module';
import { ReservationResolver } from './reservation/reservation.resolver';
import { RoomResolver } from './room/room.resolver';
import { ServiceResolver } from './service/service.resolver';
import { UserResolver } from './user/user.resolver';
import * as morgan from 'morgan';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.enableCors();
  app.use(morgan('dev'));
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
