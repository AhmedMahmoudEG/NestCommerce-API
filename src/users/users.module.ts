import { Module } from '@nestjs/common';
import { UserController } from './user.controllers';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthProvider } from './auth.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthProvider],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<number>('JWT_EXPIRES_IN'),
          },
        };
      },
    }),
  ],
})
export class UsersModule {}
