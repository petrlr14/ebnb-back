import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesModule } from '../resources/resources.module';
import { ResourcesService } from '../resources/resources.service';
import { Resource } from './resource.entity';
import { Review } from './review.entity';
import { RoomController } from './room.controller';
import { Room } from './room.entity';
import { RoomService } from './room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Review, Resource]),
    ResourcesModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, ResourcesService],
})
export class RoomModule {}
