import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth.guard';
import { UserInfo } from './dto/user.dto';
import { ResponseDto } from './dto/response.dto';

@ApiTags('User')
@ApiSecurity('authorization')
// * Swagger Api *
@Controller('user')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({
    description: 'User information successfully sent',
    type: UserInfo,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server rrror' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get user information' })
  // * Swagger Api *
  @Get('/me')
  async getUserInfo(@Request() req) {
    const user = new UserInfo(req.user);
    return user;
  }

  @ApiOkResponse({  description: 'User information successfully updated',  type: ResponseDto,})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Update user information' })
  // * Swagger Api *
  @Put('/me')
  async updateUserInfo(
    @Request() req,
    @Body(new ValidationPipe()) updateInfo: UpdateUserDto,
  ) {
    if (req.user.type !== 'basic') {
      // check if the user is using our authentication service
      throw new UnauthorizedException('Cannot update user information');
    }
    const data: UpdateUserDto = {
      firstname: updateInfo.firstname,
      lastname: updateInfo.lastname,
      phone: updateInfo.phone,
    };
    await this.usersService.updateUser(req.user.token, data);
    const response = new ResponseDto(
      'User information successfully updated',
      HttpStatus.OK,
    );
    return response;
  }

  @ApiOkResponse({ description: 'User password successfully changed' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Change user password' })
  // * Swagger Api *
  @Put('/reset_password')
  async updateUserPassword(
    @Request() req,
    @Body(new ValidationPipe()) updateInfo: UpdatePasswordDto,
  ) {
    if (req.body.type !== 'basic') {
      // check if the user is using our authentication service
      throw new UnauthorizedException('Cannot update user information');
    }
    await this.usersService.updateUserPassword(req.user, updateInfo);
    const response = new ResponseDto(
      'Password successfully changed',
      HttpStatus.OK,
    );
    return response;
  }

  @ApiOkResponse({ description: 'User account successfully deleted' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Delete user account' })
  // * Swagger Api *
  @Delete('/me')
  async deleteUser(@Request() req) {
    await this.usersService.deleteUser(req.user.token);
    const response = new ResponseDto(
      'User account successfully deleted',
      HttpStatus.OK,
    );
    return response;
  }
}
