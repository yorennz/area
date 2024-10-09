import { ApiProperty } from '@nestjs/swagger';
import area_config from '../configuration/area_config';
export class AboutDto {
  @ApiProperty({
    description: 'Client Information',
    type: 'object',
    properties: { host: { type: 'string', example:"127.0.0.1"
    }}
  })
  // * Swagger Api *
  client: {
    host: string;
  };

  @ApiProperty({
    description: 'Server Information',
    type: 'object',
    properties: {
      current_time: { type: 'number', example:1696880067024 },
      number_of_area: { type: 'number', example:100 },
      services: { type: 'object' , example:area_config.services[0]}
    }
  })
  // * Swagger Api *
  server: {
    current_time: number;
    number_of_area: number;
    services: any;
  };

  constructor(client: string, current_time: number, services: any, nbr) {
    this.client = { host: client };
    this.server = { current_time: current_time, number_of_area:nbr , services: services || null};
  }
}
