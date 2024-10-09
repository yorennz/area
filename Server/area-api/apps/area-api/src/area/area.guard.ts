import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { UserDatabaseService } from '../database/users_database.service';
import { HashToolService } from '../utils/hashtool.service';
import { AreaDatabaseService, SingleAreaDatabaseService } from '../database/areas_database.service';

@Injectable()
export class AreaGuard implements CanActivate {
  constructor(
    private dataService: UserDatabaseService,
    private hashService: HashToolService,
    private areaService: AreaDatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const service = this.extractServiceFromBody(request);
    if (service === undefined)
      throw new BadRequestException('Service is undefined');
    try {
      const hashedToken = await this.hashService.hashMd5(token);
      const user = await this.dataService.findUserByToken(hashedToken);
      if (!user) throw new UnauthorizedException();
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractServiceFromBody(
    request: Request,
  ): [string, string] | undefined {
    const serviceAction = request.body.Action.service;
    const serviceReaction = request.body.Reaction.service;
    if (!serviceAction || !serviceReaction) return undefined;
    return [serviceAction, serviceReaction];
  }
}

@Injectable()
export class AreaExistGuard implements CanActivate {
  constructor(
    private dataService: UserDatabaseService,
    private hashService: HashToolService,
    private singleAreaService: SingleAreaDatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const name = request.params.name;
    const exist = await this.singleAreaService.findByName(request["user"].area._id, name)
    if (!exist)
      throw new NotFoundException(`${name} area does not exist`)
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractServiceFromBody(
    request: Request,
  ): [string, string] | undefined {
    const serviceAction = request.body.Action.service;
    const serviceReaction = request.body.Reaction.service;
    if (!serviceAction || !serviceReaction) return undefined;
    return [serviceAction, serviceReaction];
  }
}
