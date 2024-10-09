import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { HashToolService } from 'apps/area-api/src/utils/hashtool.service';
import { UserDatabaseService } from '../../database/users_database.service';

@Injectable()
export class AuthGuardParams implements CanActivate {
  constructor(
    private dataService: UserDatabaseService,
    private hashService: HashToolService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authQueryParam = request.query.authorization;
    if (!authQueryParam) {
      throw new UnauthorizedException('Authorization token is missing');
    }
    try {
      const hashedToken = await this.hashService.hashMd5(authQueryParam);
      const user = await this.dataService.findUserByToken(hashedToken);
      if (!user) {
        throw new UnauthorizedException('Invalid authorization token');
      }
      request['user'] = user;
    } catch {
      throw new UnauthorizedException('Invalid authorization token');
    }
    return true;
  }
}
