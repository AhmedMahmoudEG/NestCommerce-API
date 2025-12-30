import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from '../utlis/constants';
import { IsEmail } from 'class-validator';
import { Product } from '../products/product.entity';
import { Review } from '../reviews/reviews.entity';
import { UserType } from '../utlis/enums';
import { Exclude } from 'class-transformer';
@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: '150', nullable: true })
  username: string;
  @Column({ type: 'varchar', length: '250', unique: true })
  @IsEmail()
  email: string;
  @Column()
  @Exclude()
  password: string;
  @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
  userType: UserType;
  @Column({ default: false })
  isVerified: boolean;
  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
  //function that return product, product object that return
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
