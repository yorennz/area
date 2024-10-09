import { ApiProperty } from '@nestjs/swagger';

export class Access_TokenDto {
  @ApiProperty({
    description: 'User access_token',
    example:
      'eyJhbGeyJhbGUzIXVCXVCJ9XVCJ9.eyJzdWIieyJzdWIiJteWVtYWlsQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiam9zZXBoIiwiaWF0IjoxNjk1NTg5NDM5LCJleHAiOjE2OTU4MDU0Mzl9._KeFTbyA2aMc1dzUdr7i33fAWgH0xnCqCO2rZHSHowo',
  })
  access_token: string;
  constructor(token: string) {
    this.access_token = token;
  }
}
