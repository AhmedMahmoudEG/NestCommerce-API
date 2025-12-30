import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CURRENT_TIMESTAMP } from '../utlis/constants';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
@Entity({ name: 'Reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;
  @Column()
  comment: string;
  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;
  @ManyToOne(() => User, (user) => user.reviews, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
