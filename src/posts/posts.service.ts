import { Injectable } from '@nestjs/common';
import User from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  getAllPosts() {
    return this.postsRepository.getAllPosts();
  }

  getPostById(id: number) {
    return this.postsRepository.getPostById(id);
  }

  createPost(post: CreatePostDto, user: User) {
    return this.postsRepository.create(post, user);
  }

  updatePost(id: number, post: UpdatePostDto) {
    return this.postsRepository.update(id, post);
  }

  deletePost(id: number) {
    return this.postsRepository.delete(id);
  }
}
