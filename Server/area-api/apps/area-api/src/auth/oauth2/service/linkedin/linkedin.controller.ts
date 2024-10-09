import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('linkedin')
export class LinkedInController {
  constructor(private readonly config: ConfigService) { }
}
