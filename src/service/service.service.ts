import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { CreateServiceInput } from './service.input';
import { ServiceRepository } from './service.repository';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async createServices(services: CreateServiceInput[]): Promise<Service[]> {
    const result = await this.serviceRepository.createMultipleServices(
      services,
    );
    if (result[1].length > 0) {
      throw new ConflictException({
        message: `There were ${result[1].length} services with name already in use`,
        conflictiveServices: result[1],
        createdServices: result[0],
      });
    }
    return result[0];
  }
}
