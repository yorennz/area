import { SingleAreaDocument, SingleAreaSchema } from 'apps/area-api/src/database/schemas/area.schema';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common'
import { AreaService } from './area.service'
import { SingleArea } from './dto/area.dto'
import { AreaExistGuard, AreaGuard } from './area.guard'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'
import { MongoExceptionFilter } from '../database/mongo-exception.filter'
import { ResponseDto } from '../auth/users/dto/response.dto'

@ApiSecurity('authorization')
@ApiTags('Areas')
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @ApiOkResponse({description: 'User areas successfully sent', type:[SingleArea]})
  @ApiInternalServerErrorResponse({ description: 'Internal server rrror' , type:ResponseDto})
  @ApiUnauthorizedResponse({ description: 'Unauthorized' , type:ResponseDto})
  @ApiOperation({ summary: 'Get user areas' })
  @UseGuards(AuthGuard)
  @UseFilters(MongoExceptionFilter)
  @Get('/')
  async getAreas(@Request() req) {
    try {
      return await this.areaService.getAllSingleArea(req.user.area._id)
    } catch (e) {
      throw new ResponseDto(e.message, 500)
    }
  }

  @HttpCode(201)
  @ApiCreatedResponse({description: 'User areas successfully created', type:ResponseDto})
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type:ResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type:ResponseDto })
  @ApiBadRequestResponse({description: "Bad request", type:ResponseDto})
  @ApiOperation({ summary: 'create area for user' })
  @UseGuards(AreaGuard)
  @UseFilters(MongoExceptionFilter)
  @Post('/')
  async createArea(@Request() req, @Body(new ValidationPipe()) singleArea: SingleArea) {
    // try {
      singleArea.name = singleArea.name.trimEnd().trimStart()
      await this.areaService.handleAreaCreation(req.user, singleArea)
      return new ResponseDto('Area successfully created', 201)
    // } catch (e) {
    //   const status = e.status ? e.status : 500
    //   throw new ResponseDto(e.message, status)
    // }
  }

  @ApiCreatedResponse({description: 'User areas successfully deleted', type:ResponseDto})
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type:ResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type:ResponseDto })
  @ApiOperation({ summary: 'delete area with the name' })
  @UseGuards(AreaExistGuard)
  @UseGuards(AuthGuard)
  @UseFilters(MongoExceptionFilter)
  @Delete('/:name')
  async deleteArea(@Request() req, @Param('name') name: string) {
    await this.areaService.deleteSingleArea(req.user.area._id, name)
    return new ResponseDto(`Area successfully deleted: ${name}`, 204)
  }

  @ApiOkResponse({description: 'User single area successfully sent', type:SingleArea})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' , type:ResponseDto})
  @ApiUnauthorizedResponse({ description: 'Unauthorized' , type:ResponseDto})
  @ApiOperation({ summary: 'Get user single area by name' })
  @UseGuards(AreaExistGuard)
  @UseGuards(AuthGuard)
  @UseFilters(MongoExceptionFilter)
  @Get('/:name')
  async getSingleArea(@Request() req, @Param('name') name: string) {
    return await this.areaService.getSingleArea(req.user.area._id, name)
  }

  @ApiNoContentResponse({description: 'User single area state successfully changed', })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' ,})
  @ApiUnauthorizedResponse({ description: 'Unauthorized' ,})
  @ApiOperation({ summary: 'Change the state of a singleArea' })
  @HttpCode(204)
  @UseGuards(AreaExistGuard)
  @UseGuards(AuthGuard)
  @UseFilters(MongoExceptionFilter)
  @Get('/:name/disable_enable')
  async disableEnableArea(@Request() req, @Param('name') name: string) {
    const state = await this.areaService.changeIsActiveState(req.user.area._id, name)
    return new ResponseDto(state ? `${name} area has been disabled` : `${name} area has been enabled`, 204)
  }
}
