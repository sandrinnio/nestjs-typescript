import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  getAllCategories() {
    return this.categoriesRepository.getAllCategories();
  }

  getCategoryById(id: number) {
    return this.categoriesRepository.getCategoryById(id);
  }

  updateCategory(id: number, category: { name: string }) {
    return this.categoriesRepository.updateCategory(id, category);
  }
}
