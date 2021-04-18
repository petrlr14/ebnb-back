import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field()
  email: string;
}

@InputType()
export class FindUser {
  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  email?: string;
  @IsOptional()
  @Field({ nullable: true })
  code?: string;
}
