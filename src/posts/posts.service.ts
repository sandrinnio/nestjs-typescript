import { Injectable } from '@nestjs/common';
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

  createPost(post: CreatePostDto) {
    return this.postsRepository.create(post);
  }

  updatePost(id: number, post: UpdatePostDto) {
    return this.postsRepository.update(id, post);
  }

  deletePost(id: number) {
    return this.postsRepository.delete(id);
  }
}
