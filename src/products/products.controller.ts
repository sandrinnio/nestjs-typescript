import { Body, Controller, Get, UseGuards, Post } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }
}
