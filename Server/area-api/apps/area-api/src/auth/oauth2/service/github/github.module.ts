import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GithubAction } from '../../../../../../area-trigger/src/action/github.action';
import { DatabaseModule } from 'apps/area-api/src/database/database.module';
import { HashToolService } from 'apps/area-api/src/utils/hashtool.service';

@Module({
    imports:[DatabaseModule],
    controllers: [GithubController],
    providers: [GithubService, HashToolService, GithubAction],
    exports:[GithubService]
  })
export class GithubModule {}
