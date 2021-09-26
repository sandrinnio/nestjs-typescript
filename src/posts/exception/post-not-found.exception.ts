import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(`Post not found with id: ${id}`);
  }
}
