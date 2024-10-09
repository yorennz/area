import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuardParams } from "../../oauth2.guard"
import { GithubReaction } from '../../../../../../area-trigger/src/reaction/github.reaction';

@Controller('github')
export class GithubController {
  constructor(private readonly config: ConfigService) { }
}
