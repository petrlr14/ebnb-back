import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field()
  email: string;
}

@InputType()
class FindUser {
  @IsEmail()
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  code: string;
}

@InputType()
export class FindUserInput extends PartialType(FindUser) {}

@InputType()
export class LikeRoomInput {
  @Field()
  roomId: number;
}
