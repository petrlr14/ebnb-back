import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Service {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column()
  @Index({ unique: true })
  name: string;
  @Field()
  @Column()
  displayName: string;
}
