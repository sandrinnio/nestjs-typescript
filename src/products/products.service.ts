import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getAllProducts() {
    return this.productsRepository.getAllProducts();
  }

  createProduct(product: CreateProductDto) {
    return this.productsRepository.create(product);
  }
}
