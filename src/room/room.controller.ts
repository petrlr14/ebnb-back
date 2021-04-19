import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResourcesService } from '../resources/resources.service';
import { CreateResourceDTO } from './room.dto';
import { RoomService } from './room.service';

@Controller('room/resources')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly resourcesService: ResourcesService,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateResourceDTO,
  ) {
    const resources = await this.resourcesService.getNewResourcesFromFiles(
      files,
    );
    const room = await this.roomService.getRoomById(body.room_id);
    const roomWithUrls = await this.roomService.addResources(resources, room);
    return roomWithUrls;
  }
}
