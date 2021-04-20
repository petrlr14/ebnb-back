import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Service } from './service.entity';
import { CreateServiceInput } from './service.input';
import { ServicesService } from './service.service';

@Resolver(() => Service)
export class ServiceResolver {
  constructor(private readonly servicesService: ServicesService) {}
  @Mutation(() => [Service])
  async createServices(
    @Args({ name: 'services', type: () => [CreateServiceInput] })
    services: [CreateServiceInput],
  ) {
    return await this.servicesService.createServices(services);
  }
}
