import {
  Body,
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { CurrentUser } from '../authentication/current-user.decorator';
import User from '../users/entities/user.entity';
import { PaginationParams } from '../utils';
import { HttpCacheInterceptor } from '../utils/interceptors/http-cache.interceptor';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey('GET_POSTS_CACHE')
  @CacheTTL(120)
  @Get()
  getAllPosts(
    @Query('search') search: string,
    @Query() pagination: PaginationParams,
  ) {
    if (search) {
      return this.postsService.searchForPosts(search, pagination);
    }
    return this.postsService.getAllPosts(pagination);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey('GET_POSTS_CACHE')
  @CacheTTL(120)
  @Get('search')
  getPostsByKeywords(@Query('keyword') keywords: string) {
    return this.postsService.getPostsByKeywords(keywords);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createPost(@Body() post: CreatePostDto, @CurrentUser() user: User) {
    return this.postsService.createPost(post, user);
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(id, post);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    this.postsService.deletePost(id);
  }
}
