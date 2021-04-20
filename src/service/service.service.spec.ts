import { Test, TestingModule } from '@nestjs/testing';
import { Service } from './service.entity';
import { ServiceRepository } from './service.repository';
import { ServicesService } from './service.service';

const mockRepository = () => ({
  createMultipleServices: jest.fn(),
});

describe('UserService', () => {
  let service: ServicesService;
  let repository: ServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: ServiceRepository, useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    repository = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createServices', () => {
    const services = new Service();
    services.displayName = 'Name';
    services.name = 'NAME';
    it('should faild one insert', async () => {
      jest
        .spyOn(repository, 'createMultipleServices')
        .mockResolvedValue([[], [services]]);
      try {
        await service.createServices([{ ...services }]);
      } catch (e) {
        expect(e.status).toBe(409);
      }
      expect(repository.createMultipleServices).toHaveBeenCalledWith([
        services,
      ]);
    });
    it('should inser one', async () => {
      jest
        .spyOn(repository, 'createMultipleServices')
        .mockResolvedValue([[services], []]);
      const result = await service.createServices([{ ...services }]);
      console.log(result);
      expect(result[0].displayName).toBe(services.displayName);
    });
  });
});
