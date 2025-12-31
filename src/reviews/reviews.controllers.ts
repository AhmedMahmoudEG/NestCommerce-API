import {
  Body,
  Controller,
  Post,
  UseGuards,
  Param,
  ParseIntPipe,
  Get,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';
import { Roles } from '../users/decorators/user-role.decorator';
import { UserType } from '../utlis/enums';
import * as types from '../utlis/types';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':productId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.NORMAL_USER, UserType.ADMIN)
  public createNewReview(
    @Body() body: CreateReviewDto,
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.reviewsService.create(body, productId, payload.id);
  }

  //GET : ~/api/reviews
  @Get()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public getAllReviews(
    @Query('pageNumber', ParseIntPipe) pageNumber?: number,
    @Query('reviewPerPage', ParseIntPipe) reviewPerPage?: number,
  ) {
    return this.reviewsService.getAllReviews(pageNumber, reviewPerPage);
  }
  //GET : ~/api/reviews/:id
  @Get(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public getOneReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.reviewsService.getOneReview(id, payload);
  }
  //PUT :~/api/reviews/:id
  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReviewDto,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.reviewsService.updateReview(id, payload.id, body);
  }
  //DELETE : ~/api/reviews/:id
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @Delete(':id')
  public deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.reviewsService.deleteReview(id, payload);
  }
}
