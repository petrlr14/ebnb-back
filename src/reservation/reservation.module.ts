import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from '../room/room.module';
import { RoomService } from '../room/room.service';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationRepository]), RoomModule],
  controllers: [ReservationController],
  providers: [ReservationService, RoomService, ReservationResolver],
  exports: [TypeOrmModule],
})
export class ReservationModule {}
