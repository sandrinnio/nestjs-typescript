import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { PaginationInput } from '../utils/types/pagination-input';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../authentication/guards/graphql-jwt-auth.guard';
import { GraphqlUser } from '../authentication/customs/graphql-user.decorator';
import User from '../users/entities/user.entity';
import { CreatePostInput } from './input/post.input';
import { PostsDataLoader } from './loaders/posts.loader';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsLoader: PostsDataLoader,
  ) {}

  @Query(() => [Post])
  async posts(@Args('input') pagination: PaginationInput) {
    const posts = await this.postsService.getAllPosts(pagination);
    return posts.items;
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @GraphqlUser() user: User,
  ) {
    const newPost = await this.postsService.createPost(createPostInput, user);
    // await this.pubSub.publish(POST_ADDED_EVENT, { postAdded: newPost });
    return newPost;
  }

  @ResolveField()
  async author(@Parent() post: Post) {
    const { authorId } = post;
    return this.postsLoader.batchAuthors.load(authorId);
  }
}
