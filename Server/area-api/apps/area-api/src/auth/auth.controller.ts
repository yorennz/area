import { Controller, Body, ValidationPipe, HttpCode, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { LoginDto, UserDto } from './users/dto/user.dto';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Access_TokenDto } from './dto/auth.dto';
import { LoginInvalidRequestDto, LoginInvalidCreditendialRequestDto, RegisterErrorRequestDto } from './dto/auth_error.dto';
import { MongoExceptionFilter } from '../database/mongo-exception.filter';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOkResponse({
    description: 'User succesfully logged in',
    type: Access_TokenDto,
  })
  @ApiBadRequestResponse({
    description: 'Error bad request',
    type: LoginInvalidRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Error invalid credidential',
    type: LoginInvalidCreditendialRequestDto,
  })
  @ApiOperation({ summary: 'Login user' })
  // * Swagger Api *
    @HttpCode(HttpStatus.OK)
  @UseFilters(MongoExceptionFilter)
  @Post('login')
  async userLogin(
    @Body() User: LoginDto,
  ): Promise<Access_TokenDto> {
    return await this.authService.loginUser(User);
  }

  @ApiCreatedResponse({
    description: 'User succesfully registered',
    type: Access_TokenDto,
  })
  @ApiBadRequestResponse({
    description: 'An field is incorrect or missing, try Again',
    type: RegisterErrorRequestDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiConflictResponse({
    description: 'Email already registered',
  })
  @ApiOperation({ summary: 'Create new user' })
  // * Swagger Api *
  @HttpCode(HttpStatus.CREATED)
  @UseFilters(MongoExceptionFilter)
  @Post('register')
  async userRegister(@Body(new ValidationPipe()) User: UserDto) {
    const payload = await this.authService.registerUser(User);
    return payload;
  }
}
