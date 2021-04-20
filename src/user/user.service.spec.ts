import { v4 as uuid } from 'uuid';
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigMock, JwtMock } from '../mocks/mock';
import { SENDGRID_MAIL } from '../sendgrid/sendgrid.constants';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

const mockRepository = () => ({
  createUser: jest.fn(),
  getUser: jest.fn(),
  removeVerificationId: jest.fn(),
  addVerificationId: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;
  let jwtService: JwtService;
  let sendGridService: SendgridService;

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.code = uuid();
  mockUser.email = '123@gmail.com';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigMock, JwtMock],
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
        ConfigService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    sendGridService = module.get<SendgridService>(SendgridService);
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

  describe('Get user by filter', () => {
    describe('Get user by email', () => {
      it('should fail', async () => {
        jest.spyOn(repository, 'getUser').mockResolvedValue(null);
        try {
          await service.getUser({ email: '1234@gmail.com' });
        } catch (e) {
          expect(e.status).toBe(404);
        }
      });
      it('should getUser', async () => {
        jest.spyOn(repository, 'getUser').mockResolvedValue(mockUser);
        const result = await service.getUser({ email: mockUser.email });
        expect(result.email).toBe(mockUser.email);
      });
    });
    describe('Get user by code', () => {
      it('should fail', async () => {
        jest.spyOn(repository, 'getUser').mockResolvedValue(null);
        try {
          await service.getUser({ code: uuid() });
        } catch (e) {
          expect(e.status).toBe(404);
        }
      });
      it('should get User by code', async () => {
        jest.spyOn(repository, 'getUser').mockResolvedValue(mockUser);
        const result = await service.getUser({ code: mockUser.code });
        expect(result.code).toBe(mockUser.code);
      });
    });
  });

  describe('verifyUser', () => {
    it('should fail verify user', async () => {
      try {
        await service.verifyUser(
          { ...mockUser, lastVerificationId: null },
          'an id',
        );
      } catch (e) {
        expect(e.status).toBe(401);
      }
    });
    it('should verify user', async () => {
      jest
        .spyOn(repository, 'removeVerificationId')
        .mockResolvedValue({ ...mockUser, lastVerificationId: null });
      const result = await service.verifyUser(
        mockUser,
        mockUser.lastVerificationId,
      );
      const token = jwtService.decode(result.token) as { [key: string]: any };
      expect(token.email).toBe(mockUser.email);
    });
  });
  describe('sendVerification', () => {
    it('should fail send verification email', async () => {
      jest.spyOn(repository, 'getUser').mockResolvedValue(null);
      try {
        await service.sendVerification({ email: 'undefined email' });
      } catch (e) {
        expect(e.status).toBe(404);
      }
    });
    it('should send email verification', async () => {
      const token = jwtService.sign({ email: mockUser.email });
      jest.spyOn(repository, 'getUser').mockResolvedValue(mockUser);
      jest
        .spyOn(repository, 'addVerificationId')
        .mockResolvedValue({ ...mockUser, lastVerificationId: token });
      jest.spyOn(sendGridService, 'send').mockResolvedValue([{} as any, {}]);
      await service.sendVerification({ email: mockUser.email });
      expect(sendGridService.send).toHaveBeenCalled();
    });
  });
});
