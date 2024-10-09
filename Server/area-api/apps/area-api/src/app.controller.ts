import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AboutDto } from './dto/about.dto';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({summary: 'Get Service Information'})
  @ApiOkResponse({ description: "About information successfully sent", type: AboutDto })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  // * Swagger Api *
  @Get('/about.json')
  async getAbout() {
    return await this.appService.getAbout();
  }
}
