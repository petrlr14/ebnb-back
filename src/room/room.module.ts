import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesModule } from '../resources/resources.module';
import { ResourcesService } from '../resources/resources.service';
import { Resource } from '../resources/resource.entity';
import { Review } from './review.entity';
import { RoomController } from './room.controller';
import { RoomRepository } from './room.repository';
import { RoomResolver } from './room.resolver';
import { RoomService } from './room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomRepository, Review, Resource]),
    ResourcesModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, ResourcesService, RoomResolver],
})
export class RoomModule {}
