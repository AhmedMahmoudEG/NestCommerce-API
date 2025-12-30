import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dtos/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './reviews.entity';
import { Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { ProductService } from '../products/products.service';
import { UpdateReviewDto } from './dtos/update-review.dto';
import * as types from '../utlis/types';
import { UserType } from '../utlis/enums';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}
  /**
   * create new review
   * @param dto create review dto
   * @param productId product id
   * @param userId user id
   * @returns review created on product by user
   */
  public async create(dto: CreateReviewDto, productId: number, userId: number) {
    const product = await this.productService.getOne(productId);
    const user = await this.userService.getCurrentUser(userId);
    const review = this.reviewsRepository.create({ ...dto, product, user });
    const result = await this.reviewsRepository.save(review);
    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      userId: result.user.id,
      productId: result.product.id,
    };
  }

  /**
   *
   * @returns all reviews ordered by last one created
   */
  public async getAllReviews() {
    return await this.reviewsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: { product: true, user: true },
    });
  }
  //get one review by id
  public async getOneReview(id: number, payload: types.JWTPayloadType) {
    const review = await this.reviewsRepository.findOne({
      where: { id },
    });
    if (!review) throw new NotFoundException('review not found');

    if (review.user.id == payload.id || payload.userType == UserType.ADMIN) {
      return review;
    } else {
      throw new ForbiddenException(
        'Acces denied!,You are not allowed to view this review',
      );
    }
  }

  //update review
  /**
   *
   * @param reviewId id of review
   * @param userId user id of review owner
   * @param dto data for update reivew
   * @returns updated review
   */
  public async updateReview(
    reviewId: number,
    userId: number,
    dto: UpdateReviewDto,
  ) {
    const review = await this.getReviewBy(reviewId);
    if (review.user.id !== userId)
      throw new ForbiddenException(
        'Acces denied!,You are not allowed to update this review',
      );
    if (review) {
      review.comment = dto.comment ?? review.comment;
      review.rating = dto.rating ?? review.rating;
    }
    const result = await this.reviewsRepository.save(review);
    return {
      ...result,
    };
  }
  //delete review
  /**
   * delete review
   * @param reviewId id of review
   * @param payload user id of owener of review or admin
   * @returns successfull message
   */
  public async deleteReview(reviewId: number, payload: types.JWTPayloadType) {
    const review = await this.getReviewBy(reviewId);
    if (review.user.id == payload.id || payload.userType == UserType.ADMIN) {
      await this.reviewsRepository.remove(review);
      return { message: 'review deleted Successfully with id ' + reviewId };
    }

    throw new ForbiddenException(
      'Acces denied!,You are not allowed to delete this review',
    );
  }
  private async getReviewBy(id: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id },
    });
    if (!review) throw new NotFoundException('review not found');
    return review;
  }
}
