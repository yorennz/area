import {IsString, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';
import area_config from '../../configuration/area_config';
import { ApiProperty } from '@nestjs/swagger';

// Function that check if the action id exist in the provided service
function validateActionId(service: string, id: number): number {
  const array = area_config.services;
  const index = array.find((item) => item.name === service);
  const action = index.actions.at(id);
  if (!action)
    throw new BadRequestException(`Action ID does not exist: ${id}`);
  return id;
}

// Function that check if reactionId exist in the provided service
function validateReactionId(service: string, id: number): number {
  const array = area_config.services;
  const index = array.find((item) => item.name === service);
  const action = index.reactions.at(id);
  if (!action)
    throw new BadRequestException(`Reaction ID does not exist: ${id}`);
  return id;
}

// Function that check if provided service exist
function validateService(service: string): string {
  const validServiceNames = area_config.services.map((item) => item.name);
  const isService = validServiceNames.includes(service);
  if (!isService)
    throw new BadRequestException(`Service does not exist: ${service}`);
  return service;
}

// Function that check if the action data provided is not missing
function validateActionData(serviceName, ActionId, data) {
  const array = area_config.services;
  const index = array.find((item) => item.name === serviceName);
  const action = index.actions.at(ActionId);
  for (const key of Object.keys(action["data"])) {
    // check if the required body params is fill && check if it is optional
    if (data[key] === undefined && action["data"][key].includes('*optional*') == false) 
      throw new BadRequestException(`Service ActionData should contain '${key}' : '${action['data'][key]}'`)
      if (data[key] === 'undefined')
      data[key] = undefined
      if (action["data"][key].includes('*boolean*') === true && data[key] !== undefined) {
        data[key] = Boolean(data[key])
      }
  }
  return data;
}

// Function that check if the reaction data provided is not missing
function validateReactionData(serviceName, ActionId, data) {
  const array = area_config.services;
  const index = array.find((item) => item.name === serviceName);
  const action = index.reactions.at(ActionId);
  for (const key of Object.keys(action["data"])) {
    // check if the required body params is fill && check if it is optional
    if (data[key] === undefined && action["data"][key].includes('*optional*') === false)
      throw new BadRequestException(`Service ReactionData should contain '${key}' : '${action['data'][key]}'`)
    if (data[key] === 'undefined')
      data[key] = undefined
    if (action["data"][key].includes('*boolean*') === true && data[key] !== "undefined" && data[key] !== undefined) {
      data[key] = Boolean(data[key])
    }
  }
  return data;
}

class Action {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => validateService(value))
  @ApiProperty({example: "github"})
  service: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value, obj }) => validateActionId(obj.service, value))
  @ApiProperty({example: 3})
  id: number;

  @IsNotEmpty()
  @Type(() => Object)
  @Transform(({ value, obj }) => validateActionData(obj.service, obj.id,  obj.data))
  @ApiProperty()
  data: Record<string, any>;
}

class Reaction {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({example: "github"})
  service: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value, obj }) => validateReactionId(obj.service, value))
  @ApiProperty({example:0})
  id: number;

  @IsNotEmpty()
  @Type(() => Object)
  @Transform(({ value, obj }) => validateReactionData(obj.service, obj.id, obj.data))
  @ApiProperty({example: {"name":"LeRepoCreeParArea4", "description":"RepositoryCreatedByArea"}})
  data: Record<string, any>;
}

export class SingleArea {
  hostArea: mongoose.Types.ObjectId;

  state: boolean;
  @ApiProperty({example:"AreaNameExample"})
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:"this is an area description"})
  description: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Action)
  @ApiProperty()
  Action: Action;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Reaction)
  @ApiProperty()
  Reaction: Reaction;
}
