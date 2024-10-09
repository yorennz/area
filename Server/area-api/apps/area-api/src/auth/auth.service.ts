import { Injectable } from '@nestjs/common';
import { LoginDto, UserDto } from './users/dto/user.dto';
import { UsersService } from './users/users.service';
import { Access_TokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async loginUser(user: LoginDto): Promise<Access_TokenDto> {
    return this.usersService.verifyCredentials(user);
  }
  async registerUser(user: UserDto) {
    return await this.usersService.createUser(user);
  }
}
