import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const mockRepository = () => ({
  createUser: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create User', () => {
    const user = new User();
    user.email = '123@gmail.com';
    it('should fail', async () => {
      jest
        .spyOn(repository, 'createUser')
        .mockRejectedValue(new ConflictException());
      expect(repository.createUser).not.toHaveBeenCalled();
      try {
        await service.createUser({ email: '123@gmail.com' });
      } catch (e) {
        expect(e.status).toBe(409);
      }
    });
    it('should create user', async () => {
      jest.spyOn(repository, 'createUser').mockResolvedValue(user);
      const result = await service.createUser({ email: user.email });
      expect(result.email).toBe(user.email);
    });
  });
});
