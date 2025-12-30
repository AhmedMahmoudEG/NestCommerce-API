import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controllers';
import { ReviewsService } from './reviews.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reviews.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
  imports: [
    TypeOrmModule.forFeature([Review]),
    UsersModule,
    ProductsModule,
    JwtModule,
  ],
})
export class ReviewsModule {}
