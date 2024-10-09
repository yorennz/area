import { Module } from '@nestjs/common';
import { LinkedInController } from './linkedin.controller';
import { LinkedInService } from './linkedin.service';
import { DatabaseModule } from 'apps/area-api/src/database/database.module';
import { HashToolService } from 'apps/area-api/src/utils/hashtool.service';

@Module({
    imports:[DatabaseModule],
    controllers: [LinkedInController],
    providers: [LinkedInService, HashToolService],
    exports:[LinkedInService]
  })
export class LinkedInModule {}
