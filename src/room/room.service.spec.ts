import { Test, TestingModule } from '@nestjs/testing';
import { Resource } from '../resources/resource.entity';
import { Service } from '../service/service.entity';
import { Room } from './room.entity';
import { RoomRepository } from './room.repository';
import { RoomService } from './room.service';

const mockRepository = () => ({
  createRoom: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  addResources: jest.fn(),
  getRooms: jest.fn(),
  addServices: jest.fn(),
});

describe('RoomService', () => {
  let service: RoomService;
  let repository: RoomRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        { provide: RoomRepository, useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
    repository = module.get<RoomRepository>(RoomRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockRoom = new Room();
  mockRoom.id = 1;
  mockRoom.capacity = 10;
  mockRoom.building = 'Tech Hub';
  mockRoom.location = '2da Planta';
  mockRoom.name = 'BoosterSide';
  mockRoom.resources = [];
  mockRoom.services = [];

  describe('Create Room', () => {
    const input = {
      building: 'Tech Hub',
      capacity: 10,
      location: '2da Planta',
      name: 'BoosterSide',
    };
    it('should create a room', async () => {
      jest.spyOn(repository, 'createRoom').mockResolvedValue(mockRoom);
      expect(repository.createRoom).not.toBeCalled();
      const room = await service.createRoom(input);
      expect(repository.createRoom).toBeCalledWith(input);
      expect(room.capacity).toBe(mockRoom.capacity);
    });
  });
  describe('getRoomById', () => {
    it('should get room with id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRoom);
      const room = await service.getRoomById(1);
      expect(repository.findOne).toHaveBeenCalledWith(1, {});
      expect(room.id).toBe(1);
    });
    it('should faild to get room with id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      try {
        await service.getRoomById(2);
      } catch (e) {
        expect(e.status).toBe(404);
      }
    });
  });
  describe('getRooms', () => {
    it('should get all Rooms', async () => {
      jest.spyOn(repository, 'getRooms').mockResolvedValue([mockRoom]);
      expect((await service.getRooms({})).length).toBe(1);
    });
  });
  describe('add Resource', () => {
    const mockResource = new Resource();
    mockResource.room = mockRoom;
    mockResource.url = 'superurl';
    it('should add Resouces', async () => {
      jest
        .spyOn(repository, 'addResources')
        .mockResolvedValue({ ...mockRoom, resources: [mockResource] });
      const result = await service.addResources([mockResource], mockRoom);
      expect(repository.addResources).toHaveBeenCalledWith(
        [mockResource],
        mockRoom,
      );
      expect(result.resources.length).toBe(1);
    });
  });
  describe(' add service', () => {
    const mockService = new Service();
    mockService.displayName = 'NAME';
    mockService.name = 'Name';
    it('should fail to add service to room', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue({ ...mockRoom, services: [] });
      jest.spyOn(repository, 'addServices').mockResolvedValue([[], [1]]);
      try {
        await service.addServices([1], 1);
      } catch (e) {
        expect(e.status).toBe(409);
      }
    });
    it('should add service to room', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue({ ...mockRoom, services: [] });
      jest
        .spyOn(repository, 'addServices')
        .mockResolvedValue([[{ ...mockRoom, services: [mockService] }], []]);
      expect(mockRoom.services.length === 0);
      const result = await service.addServices([1], 1);
      expect(result.services.length === 1);
    });
  });
});
