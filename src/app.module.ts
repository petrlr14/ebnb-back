import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { ReservationModule } from './reservation/reservation.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigurationModule } from './config/configuration.module';
import { DatabaseModule } from './config/database.module';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { ResourcesModule } from './resources/resources.module';
import { ServicesModule } from './service/service.module';
@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UserModule,
    RoomModule,
    ReservationModule,
    SendgridModule,
    ResourcesModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
