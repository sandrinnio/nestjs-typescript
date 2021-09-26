import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @Put(':id')
  updateCategory(@Param('id') id: string, @Body() category: { name: string }) {
    return this.categoriesService.updateCategory(id, category);
  }
}
