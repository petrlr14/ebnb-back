import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesRoom } from './favoritesRooms.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, FavoritesRoom])],
  controllers: [UserController],
  providers: [UserService, UserResolver],
})
export class UserModule {}
