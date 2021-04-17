import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from 'src/room/resource.entity';
import { Review } from 'src/room/review.entity';
import { Room } from 'src/room/room.entity';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Review, Resource])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
