import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('facebook')
export class FacebookController {
  constructor(private readonly config: ConfigService) { }
}
