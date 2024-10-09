import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'apps/area-api/src/database/schemas/user.schema';
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength, Matches } from 'class-validator';

export class UserDto {
  @IsEmail()
  @ApiProperty({ description: 'The email address of the User', example: 'Email.email@epitech.eu', type: String })
  email: string;

  @ApiProperty({ description: 'The password of the User', example: 'Password123!' })
  @MinLength(8)
  @Matches(/^(?=.*[!@#$%^&*])/, { message: 'Password must contain at least one special character' })
  @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  @Matches(/^(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/^(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  password: string;

  @ApiProperty({ description: 'The firstname of the User', example: 'firstname' })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'The lastname of the User', example: 'lastname' })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ description: 'The phone number of the User', example: '0745142166' })
  @IsPhoneNumber('FR')
  @IsNotEmpty()
  phone: string;

}

export class LoginDto extends PickType(UserDto, ['email', 'password',] as const) { }

export class UserInfo extends PickType(UserDto, ['email', 'firstname', 'lastname', 'phone',] as const) {
  constructor(user: User) {
    super();
    this.email = user.email;
    this.firstname = user.firstname || "";
    this.lastname = user.lastname || "";
    this.phone = user.phone || "";
  }
}
