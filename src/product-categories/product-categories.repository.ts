import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import ProductCategory from './entities/product-category.entity';

@Injectable()
export class ProductCategoriesRepository {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  getAllProductCategories() {
    return this.productCategoriesRepository.find();
  }

  create(category: CreateProductCategoryDto) {
    const newProductCategory =
      this.productCategoriesRepository.create(category);
    return this.productCategoriesRepository.save(newProductCategory);
  }
}
