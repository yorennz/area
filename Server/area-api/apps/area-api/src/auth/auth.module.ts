import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { Oauth2Module } from './oauth2/oauth2.module';

@Module({
  imports: [UsersModule, Oauth2Module],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
