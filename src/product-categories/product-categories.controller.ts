import { Body, Controller, Get, UseGuards, Post } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategoriesService } from './product-categories.service';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly productsService: ProductCategoriesService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProductCategories();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createProduct(@Body() productCategory: CreateProductCategoryDto) {
    return this.productsService.createProductCategory(productCategory);
  }
}
