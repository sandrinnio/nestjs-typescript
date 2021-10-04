import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Product from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  getAllProducts() {
    return this.productsRepository.find();
  }

  create(product: CreateProductDto) {
    const newProduct = this.productsRepository.create(product);
    return this.productsRepository.save(newProduct);
  }
}
