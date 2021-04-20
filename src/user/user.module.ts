import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendgridModule } from '../sendgrid/sendgrid.module';
import { FavoritesRoom } from './favoritesRooms.entity';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    SendgridModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE') },
      }),
    }),
    TypeOrmModule.forFeature([UserRepository, FavoritesRoom]),
  ],
  providers: [UserService, UserResolver, JwtStrategy],
  exports: [JwtStrategy, PassportModule, TypeOrmModule, JwtModule],
})
export class UserModule {}
