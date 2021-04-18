import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { ReservationModule } from './reservation/reservation.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigurationModule } from './config/configuration.module';
import { DatabaseModule } from './config/database.module';
@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UserModule,
    RoomModule,
    ReservationModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
