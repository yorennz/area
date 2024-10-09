import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly config: ConfigService) { }

}
