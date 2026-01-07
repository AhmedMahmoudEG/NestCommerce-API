import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';

import { CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProductDto } from './dtos/update-products.dto';
import { ProductService } from './products.service';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';
import { UserType } from '../utlis/enums';
import { Roles } from '../users/decorators/user-role.decorator';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import * as types from '../utlis/types';
import { ApiQuery } from '@nestjs/swagger';

@Controller('/api/products')
export class ProductController {
  //dependecy injection
  constructor(private readonly productService: ProductService) {}

  //POST : http://localhost:3000/api/products
  @Post()
  @Roles(UserType.ADMIN) //check user role
  @UseGuards(AuthRolesGuard) //check token and return it
  public createProduct(
    @Body()
    body: CreateProductsDto,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.productService.createProduct(body, payload.id);
  }

  // GET : http://localhost:3000/api/products
  @Get()
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'minimum price',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'maximum price',
  })
  public getAllProducts(
    @Query('title') title: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ) {
    return this.productService.getAll(title, minPrice, maxPrice);
  }
  //get single product
  // GET : http://localhost:3000/api/products/:id
  @Get('/:id')
  public getProudct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getOne(id);
  }
  //update product
  // PUT : http://localhost:3000/api/products/:id
  @Put('/:id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.updateOne(id, body);
  }
  //delete product
  // DELETE : http://localhost:3000/api/products/:id
  @Delete('/:id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public deleteProduct(@Param('id') id: number) {
    return this.productService.deleteOne(id);
  }
}
