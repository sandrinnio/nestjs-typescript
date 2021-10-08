import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { PaginationInput } from '../utils/types/pagination-input';
import { GraphqlJwtAuthGuard } from '../authentication/guards/graphql-jwt-auth.guard';
import { GraphqlUser } from '../authentication/customs/graphql-user.decorator';
import User from '../users/entities/user.entity';
import { CreatePostInput } from './input/post.input';
import { PostsDataLoader } from './loaders/posts.loader';
import { PUB_SUB } from '../pub-sub/pub-sub.module';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsLoader: PostsDataLoader,
    @Inject(PUB_SUB)
    private readonly pubSub: RedisPubSub,
  ) {}

  @Query(() => [Post])
  async posts(@Args('input') pagination: PaginationInput) {
    const posts = await this.postsService.getAllPosts(pagination);
    return posts.items;
  }

  @Subscription(() => Post)
  postAdded() {
    return this.pubSub.asyncIterator('POST_ADDED_EVENT');
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @GraphqlUser() user: User,
  ) {
    const newPost = await this.postsService.createPost(createPostInput, user);
    await this.pubSub.publish('POST_ADDED_EVENT', { postAdded: newPost });
    return newPost;
  }

  @ResolveField()
  async author(@Parent() post: Post) {
    const { authorId } = post;
    return this.postsLoader.batchAuthors.load(authorId);
  }
}
