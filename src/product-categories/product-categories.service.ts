import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategoriesRepository } from './product-categories.repository';

@Injectable()
export class ProductCategoriesService {
  constructor(
    private readonly productCategoriesRepository: ProductCategoriesRepository,
  ) {}

  getAllProductCategories() {
    return this.productCategoriesRepository.getAllProductCategories();
  }

  createProductCategory(productCategory: CreateProductCategoryDto) {
    return this.productCategoriesRepository.create(productCategory);
  }
}
