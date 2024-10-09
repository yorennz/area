import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserDatabaseService } from '../database/users_database.service';
import { HashToolService } from '../utils/hashtool.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private dataService: UserDatabaseService,
    private hashService: HashToolService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const hashedToken = await this.hashService.hashMd5(token)
      const user = await this.dataService.findUserByToken(hashedToken)
      if (!user)
        throw new UnauthorizedException();
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
}
