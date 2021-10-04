import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Product from '../../products/entities/product.entity';

@Entity()
class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @OneToMany(() => Product, (product: Product) => product.category)
  products: Product[];
}

export default ProductCategory;
