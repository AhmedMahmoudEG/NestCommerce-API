import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Review } from './reviews/reviews.entity';
import { User } from './users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    ProductsModule,
    UsersModule,
    ReviewsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [Product, Review, User],
          synchronize: process.env.NODE_ENV != 'production', //if not prod make it true
        };
      },
    }),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
