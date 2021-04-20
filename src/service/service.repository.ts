import { EntityRepository, Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceInput } from './service.input';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async createMultipleServices(
    services: CreateServiceInput[],
  ): Promise<[x1: Service[], x2: any[]]> {
    const result: Service[] = [];
    const errors = [];
    await Promise.all(
      services.map(async (service) => {
        const newService = new Service();
        newService.displayName = service.displayName;
        newService.name = service.name;
        try {
          await this.save(newService);
          result.push(newService);
        } catch (e) {
          errors.push(service);
        }
      }),
    );
    return [result, errors];
  }
}
