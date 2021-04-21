import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { JwtPayload } from './jwtPayload.interface';
import { User } from './user.entity';
import { CreateUserInput, FindUserInput, LikeRoomInput } from './user.input';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly sendGridClient: SendgridService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(userDTO: CreateUserInput): Promise<User> {
    return await this.userRepository.createUser(userDTO);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['favRooms', 'reservations'],
    });
  }

  async getUser(filter: FindUserInput): Promise<User> {
    const result = await this.userRepository.getUser(filter);
    if (!result) throw new NotFoundException();
    return result;
  }

  async toggleFavoritesRoom(
    likeInput: LikeRoomInput,
    user: User,
  ): Promise<User> {
    return await this.userRepository.toggleFavoritesRoom(likeInput, user);
  }

  async sendVerification(filter: FindUserInput) {
    try {
      const user = await this.getUser(filter);
      const payload: JwtPayload = {
        email: user.email,
      };
      const userWithVerificationId = await this.userRepository.addVerificationId(
        user,
        this.jwtService.sign(payload, {
          expiresIn: 60 * 10,
        }),
      );
      return await this.sendGridClient.send({
        mailSettings: {
          sandboxMode: {
            enable: this.configService.get<string>('NODE_ENV') === 'test',
          },
        },
        from: this.configService.get<string>('SENDGRID_SENDER'),
        templateId: this.configService.get<string>('SENDGRID_TEMPLATE'),
        personalizations: [
          {
            to: userWithVerificationId.email,
            dynamicTemplateData: {
              verification_link: `${this.configService.get<string>(
                'FRONT_LINK',
              )}/${userWithVerificationId.lastVerificationId}`,
            },
          },
        ],
      });
    } catch (e) {
      throw e;
    }
  }

  async verifyUser(user: User, verificationId: string) {
    if (user.lastVerificationId === verificationId) {
      const userWithouVerificationId = await this.userRepository.removeVerificationId(
        user,
      );
      const payload: JwtPayload = {
        email: userWithouVerificationId.email,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
