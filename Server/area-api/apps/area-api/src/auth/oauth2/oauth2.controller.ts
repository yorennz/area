import { BadRequestException, Controller, Delete, Get, NotFoundException, Param, Query, Request, Res, UseGuards} from '@nestjs/common';
import { ApiBadRequestResponse, ApiHeader, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Oauth2Service } from './oauth2.service';
import { AuthGuard } from '../auth.guard';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from '../users/dto/response.dto';
import { AuthGuardParams } from './oauth2.guard';

@Controller('oauth2')
export class Oauth2Controller {
  constructor(
    private readonly OAuth2: Oauth2Service,
    private readonly config: ConfigService,
  ) {}


  @ApiTags('Authentication')
  @ApiOperation({summary: "Login user with external service [google, discord, spotify]"})
  @ApiParam({ description: "serviceName that you want to log in", name: "service", example: "/oauth2/login/google"})
  @ApiOkResponse({description:`Redirect to your route with access_token in the "code params" params, example: localhost:8081/login?code=ee8d363aa8c88fd96fb9b374a6f9b89f`})
  @ApiInternalServerErrorResponse({description:"Redirect to localhost:8081/authorization?code=failed"})
  // * Swagger Api *
  @Get('/login/:service')
  async LoginOAuth2(@Param('service') serviceName: string, @Res() res: Response) {
    res.redirect(await this.OAuth2.getUrl(serviceName, "Login", false));
  }

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Save OAuth2 Login information' })
  // * Swagger Api *
  @Get('/save')
  async save(@Query() query, @Res() res: Response) {
    const token = await this.OAuth2.handleServiceData(query);
    const url = `http://localhost:8081/login?token=${token}&type=${query.state}`;
    res.redirect(url);
  }

  @ApiTags('Authorization')
  @ApiOperation({summary: "Authorize external service for our app [google, discord, ...]"})
  @ApiOkResponse({description:"Redirect to localhost:8081/authorization?status=200"})
  @ApiInternalServerErrorResponse({description:"Redirect to localhost:8081/authorization?status=500"})
  @ApiParam({  name: 'service',  description: 'pass the service authorization that you want to authorize',})
  @ApiQuery({  name: 'authorization',  description: 'your bearer token', example:"http://localhost/oauth2/authorize/discord?authorization=<access_token>"})
  // * Swagger Api *
  @UseGuards(AuthGuardParams)
  @Get('/authorize/:service')
  async AuthorizationOAuth2(@Param('service') serviceName: string, @Res() res: Response, @Request() req) {
    const areaId = req.user.area._id;
    const stateData = { "service": this.config.get<string>(`service_name.${serviceName}`), "areaId": areaId };
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64');
    const url = await this.OAuth2.getUrl(serviceName, "Authorize", state)
    res.redirect(url);
  }

  @ApiTags('Authorization')
  @ApiSecurity('authorization')
  @ApiOperation({ summary: 'Revoke OAuth2 Authorization' })
  @ApiHeader({  name: 'Bearer <access_token>',  description: 'Access_Token for authentication',})
  @ApiQuery({  name: 'service',  description: 'pass the service authorization that you want to revoke',})
  @ApiBadRequestResponse({ description: 'Error bad request' })
  @ApiNotFoundResponse({ description: 'Error service not found in your authorization' })
  @ApiNoContentResponse({  status: 204,  description: 'Service authorization successfully revoked',  type: ResponseDto})
  // * Swagger Api *
  @Delete('authorize/:service')
  @UseGuards(AuthGuard)
  async deleteAuthorization(@Request() req, @Param('service') service: string) {
    const services = this.config.get('service_array'); // Get all the service
    if (!services.includes(service))
      throw new BadRequestException('The service you provided in service params does not exist');
    if (!(await this.OAuth2.deleteAuthorizationToken(req.user.area, service)))
      throw new NotFoundException('The service you provided in service params is not found in your authorization');
    const response = new ResponseDto('Authorization successfully revoked', 204);
    return response;
  }

  @ApiTags('Authorization')
  @ApiSecurity('authorization')
  @ApiOperation({summary: "Get autorized external service for our app"})
  @ApiOkResponse({description:"Autorized external service successfully sent"})
  @ApiUnauthorizedResponse({description:"Unauthorized error"})
  @ApiInternalServerErrorResponse({description:"Internal server error"})
  // * Swagger Api *
  @Get('/authorization')
  @UseGuards(AuthGuard)
  async getAuthorization(@Request() req) {
    return await this.OAuth2.getServiceAuthorization(req.user.area._id)
  }


  @ApiTags('Authorization')
  @ApiOperation({ summary: 'Save OAuth2 Authorization' })
  // * Swagger Api *
  @Get('/save-authorization')
  async saveAuthorization(@Query() query, @Res() res: Response) {
    if (!query.code) {
      const url = `http://localhost:8081/authorization?status=401`;
      res.redirect(url);
    }
    const stateData = JSON.parse(Buffer.from(query.state, 'base64').toString('utf-8')); // Retrieve Data from the encoded format
    await this.OAuth2.saveAuthorizationToken(query.code, stateData);
    const url = `http://localhost:8081/authorization?status=200`;
    res.redirect(url);
  }
}
