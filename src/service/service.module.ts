import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRepository } from './service.repository';
import { ServiceResolver } from './service.resolver';
import { ServicesService } from './service.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRepository])],
  providers: [ServicesService, ServiceResolver],
  exports: [TypeOrmModule],
})
export class ServicesModule {}
