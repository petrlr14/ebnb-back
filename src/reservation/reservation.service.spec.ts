import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Room } from '../room/room.entity';
import { User } from '../user/user.entity';
import { Reservation } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

const mockRepository = () => ({
  createReservation: jest.fn(),
  getReservationsByRoomId: jest.fn(),
  lookForOverlap: jest.fn(),
});

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: ReservationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: ReservationRepository, useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repository = module.get<ReservationRepository>(ReservationRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get Reservations by Room id', () => {
    it('Should get reservations', async () => {
      jest.spyOn(repository, 'getReservationsByRoomId').mockResolvedValue([]);
      const result = await service.getReservationsByRoomId(1);
      expect(result.length).toBe(0);
    });
  });
  describe('Create Reservation', () => {
    let reservation: Reservation;
    let room: Room;
    let user: User;
    beforeAll(() => {
      room = new Room();
      reservation = new Reservation();
      user = new User();
      reservation.startDate = new Date();
      reservation.endDate = new Date();
      reservation.startTime = '10:20';
      reservation.endTime = '20:20';
      reservation.user = new User();
      reservation.room = room;
      reservation.user = user;
    });
    it('should create reservation', async () => {
      jest.spyOn(repository, 'lookForOverlap').mockResolvedValue(null);
      jest
        .spyOn(repository, 'createReservation')
        .mockResolvedValue(reservation);
      const result = await service.createReservation(user, room, {
        roomId: 1,
        endDate: new Date(),
        startDate: new Date(),
        endTime: '10:10',
        startTime: '09:10',
      });
      expect(repository.lookForOverlap).toHaveBeenCalled();
      expect(repository.createReservation).toHaveBeenCalled();
      expect(result).not.toBeNull();
    });
    it('should fail create reservation', async () => {
      jest
        .spyOn(repository, 'lookForOverlap')
        .mockRejectedValue(new ConflictException());
      expect(repository.createReservation).not.toHaveBeenCalled();
    });
  });
});
