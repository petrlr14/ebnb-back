import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class GResponse {
  @Field()
  data: string;
  @Field(() => User)
  user: User;
}
