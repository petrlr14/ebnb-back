import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

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
  @Field(() => Int)
  roomId: number;
}
