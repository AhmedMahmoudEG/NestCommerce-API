import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProductDto } from './dtos/update-products.dto';
import { Between, Like, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../users/user.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
  ) {}

  /**
   * create new product
   * @param dto data for create a new product
   * @param userId id of the logged in user (admin)
   * @returns the created product from database
   */
  public async createProduct(dto: CreateProductsDto, userId: number) {
    const user = await this.userService.getCurrentUser(userId);
    const newProduct = this.productRepository.create({
      ...dto,
      title: dto.title.toLowerCase(),
      user,
    });
    return this.productRepository.save(newProduct);
  }

  /**
   *
   * get all products
   * @returns array of product with product owners and reviews
   */
  public getAll(title?: string, minPrice?: number, maxPrice?: number) {
    const where: any = {};

    if (title) {
      where.title = Like(`%${title.toLowerCase()}%`);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = minPrice;
    } else if (maxPrice !== undefined) {
      where.price = maxPrice;
    }
    return this.productRepository.find({
      where,
      relations: { user: true, reviews: true },
    });
  }
  /**
   *
   * Get single product
   * @param id of the product
   * @returns return product from the database
   */
  public async getOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { user: true, reviews: true },
    });
    if (!product) throw new NotFoundException('product not found');
    return product;
  }
  /**
   *
   * updateProduct
   * @param id of the product
   * @returns updated product
   */
  public async updateOne(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.getOne(id);
    product.title = updateProductDto.title ?? product.title;
    product.description = updateProductDto.description ?? product.description;
    product.price = updateProductDto.price ?? product.price;
    await this.productRepository.save(product);
    return product;
  }
  /**
   *
   * delete product
   * @returns deleted product
   */
  public async deleteOne(id: number) {
    const product = await this.getOne(id);
    await this.productRepository.remove(product);
    return { message: 'product deleted Successfully with id ' + id };
  }
}
