import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Category from './entities/category.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  getAllCategories() {
    return this.categoriesRepository.find({ relations: ['posts'] });
  }

  async getCategoryById(id: string) {
    const category = await this.categoriesRepository.findOne(id, {
      relations: ['posts'],
    });
    if (!category) {
      throw new NotFoundException(id);
    }
    return category;
  }

  async updateCategory(id: string, category: { name: string }) {
    await this.categoriesRepository.update(id, category);
    const updatedCategory = await this.categoriesRepository.findOne(id, {
      relations: ['posts'],
    });
    if (!updatedCategory) {
      throw new NotFoundException(id);
    }
    return updatedCategory;
  }
}
