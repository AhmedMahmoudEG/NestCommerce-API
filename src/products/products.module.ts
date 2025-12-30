import { Module } from '@nestjs/common';
import { ProductController } from './products.controllers';
import { ProductService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

// GET : api/products

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
  imports: [TypeOrmModule.forFeature([Product]), UsersModule, JwtModule],
})
export class ProductsModule {}
