import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CarProperties } from '../interfaces/car-properties.interface';
import { BookProperties } from '../interfaces/book-properties.interface';
import ProductCategory from '../../product-categories/entities/product-category.entity';

@Entity()
class Product {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @ManyToOne(
    () => ProductCategory,
    (category: ProductCategory) => category.products,
  )
  category: ProductCategory;

  @Column({
    type: 'jsonb',
  })
  properties: CarProperties | BookProperties;
}

export default Product;
