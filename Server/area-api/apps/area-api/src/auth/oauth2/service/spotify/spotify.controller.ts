import { Controller, Get, Request, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags('Authorization')
@Controller('spotify')
export class SpotifyController {
  constructor() { }
}