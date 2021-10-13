import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import User from '../../users/entities/user.entity';
import { UserModel } from './user.model';

@ObjectType()
export class Post {
  @Field(() => ID)
  id?: string;

  @Field()
  title: string;

  @Field(() => [String], { nullable: true })
  keywords: string[];

  @Field(() => Int)
  authorId: string;

  @Field(() => UserModel)
  author: User;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
