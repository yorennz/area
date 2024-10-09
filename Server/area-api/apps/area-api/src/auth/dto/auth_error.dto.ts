import { ApiProperty } from '@nestjs/swagger';

export class RegisterErrorRequestDto {
  @ApiProperty({
    example: [
      'email must be an email',
      'Password must contain at least one special character',
      'password must be longer than or equal to 8 characters',
      'firstname should not be empty',
      'lastname should not be empty',
      'phone should not be empty',
      'phone must be a valid phone number',
    ],
    isArray: true,
  })
  message: string[];

  @ApiProperty({
    example: 'Bad request',
    description: 'HTTP status description',
  })
  error: string;
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number;
}

export class LoginInvalidRequestDto {
  @ApiProperty({
    example: ['email must be an email', 'password should not be empty'],
    isArray: true,
  })
  message: string[];

  @ApiProperty({
    example: 'Bad request',
    description: 'HTTP status description',
  })
  error: string;
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number;
}

export class LoginInvalidCreditendialRequestDto {
  @ApiProperty({
    example: 'Invalid login credentials',
  })
  message: string;

  @ApiProperty({
    example: 'Unauthorized',
    description: 'HTTP status description',
  })
  error: string;
  @ApiProperty({
    example: 401,
    description: 'HTTP status code',
  })
  statusCode: number;
}
