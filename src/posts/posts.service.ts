import { Injectable } from '@nestjs/common';
import User from '../users/entities/user.entity';
import { PaginationParams } from '../utils';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import PostsSearchService from './posts-search.service';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly searchService: PostsSearchService,
  ) {}

  getAllPosts(pagination: PaginationParams) {
    return this.postsRepository.getAllPosts(pagination);
  }

  getPostById(id: string) {
    return this.postsRepository.getPostById(id);
  }

  getPostsByKeywords(keywords: string) {
    return this.postsRepository.getPostsByKeywords(keywords);
  }

  async searchForPosts(text: string, pagination: PaginationParams) {
    const { results } = await this.searchService.search(text, pagination);
    const ids = results.map(({ id }) => id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepository.getPostsByIds(ids);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create(post, user);
    await this.searchService.indexPost(newPost);
    return newPost;
  }

  async updatePost(id: string, post: UpdatePostDto) {
    const updatedPost = await this.postsRepository.update(id, post);
    await this.searchService.update(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: string) {
    await Promise.all([
      this.postsRepository.delete(id),
      this.searchService.delete(id),
    ]);
  }
}
