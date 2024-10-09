import { UserDto } from './user.dto';
import { MinLength, Matches } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class UpdateUserDto extends PickType(UserDto, ['firstname', "lastname", "phone"] as const) { }


export class UpdatePasswordDto extends PickType(UserDto, ['password'] as const) {
  @ApiProperty({ description: 'User password', example: 'Password123!' })
  @MinLength(8)
  @Matches(/^(?=.*[!@#$%^&*])/, { message: 'Password must contain at least one special character' })
  @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  new_password: string;
}
