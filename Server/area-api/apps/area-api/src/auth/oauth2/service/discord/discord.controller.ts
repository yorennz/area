import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('discord')
export class DiscordController {
  constructor(private readonly config: ConfigService) { }
}
