import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from '../utlis/constants';
import { Review } from '../reviews/reviews.entity';
import { User } from '../users/user.entity';
@Entity({ name: 'Products' }) //set table name
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ type: 'varchar', length: '150' })
  description: string;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;
  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE',
  })
  user: User;
}
