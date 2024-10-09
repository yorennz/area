import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuardParams } from "../../oauth2.guard"

@Controller('twitch')
export class TwitchController {
  constructor(private readonly config: ConfigService) { }

}
