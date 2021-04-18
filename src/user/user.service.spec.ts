import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SENDGRID_MAIL } from '../sendgrid/sendgrid.constants';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const mockRepository = () => ({
  createUser: jest.fn(),
  getUser: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useFactory: mockRepository },
        SendgridService,
        {
          provide: SENDGRID_MAIL,
          useValue: {
            send: jest.fn(),
          },
        },
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
  describe('Get user by email', () => {
    const user = new User();
    user.id = 1;
    it('should fail', async () => {
      jest.spyOn(repository, 'getUser').mockRejectedValue(null);
      try {
        await service.getUser({ email: '123@gmail.com' });
      } catch (e) {
        expect(e).toBeNull();
      }
    });
    it('should getUser', async () => {
      jest.spyOn(repository, 'getUser').mockResolvedValue(user);
      const result = await service.getUser({ email: user.email });
      expect(result.email).toBe(user.email);
    });
  });
});
