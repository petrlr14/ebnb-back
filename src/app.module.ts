import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/config/configuration.module';
import { DatabaseModule } from 'src/config/database.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { ReservationModule } from './reservation/reservation.module';
import { GraphQLModule } from '@nestjs/graphql';
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
