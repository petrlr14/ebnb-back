import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  code: string;
  @IsEmail()
  @Field()
  email: string;
}
