import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import User from '../users/entities/user.entity';
import { PaginationParams } from '../utils';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import Post from './entities/post.entity';
import { PostNotFoundException } from './exception/post-not-found.exception';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  async getAllPosts(pagination: PaginationParams) {
    const { startId, offset, limit } = pagination;
    const { query, count: postsCount } = await this.buildKeysetPaginationQuery(
      startId,
    );
    const [items, count] = await this.postsRepository.findAndCount({
      where: query,
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });
    return { items, count: startId ? postsCount : count };
  }

  async getPostById(id: string) {
    const post = await this.postsRepository.findOne(id);
    if (!post) {
      throw new PostNotFoundException(id);
    }
    return post;
  }

  getPostsByIds(ids: string[]) {
    return this.postsRepository.find({
      where: { id: In(ids) },
    });
  }

  getPostsByKeywords(keyword: string) {
    return this.postsRepository.query(
      `SELECT * from post WHERE $1 = ANY(keywords)`,
      [keyword],
    );
  }

  create(post: CreatePostDto, user: User) {
    const newPost = this.postsRepository.create({ ...post, author: user });
    return this.postsRepository.save(newPost);
  }

  async update(id: string, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne(id);
    if (!updatedPost) {
      throw new PostNotFoundException(id);
    }
    return updatedPost;
  }

  async delete(id: string): Promise<void> {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }

  private async buildKeysetPaginationQuery(startId?: string) {
    if (!startId) {
      return {};
    }
    const query = { id: MoreThan(startId) };
    const count = await this.postsRepository.count();
    return { query, count };
  }
}
