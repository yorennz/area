import { Module } from '@nestjs/common';
import { MicrosoftController } from './microsoft.controller';
import { MicrosoftService } from './microsoft.service';
import { DatabaseModule } from 'apps/area-api/src/database/database.module';
import { HashToolService } from 'apps/area-api/src/utils/hashtool.service';

@Module({
    imports:[DatabaseModule],
    controllers: [MicrosoftController],
    providers: [MicrosoftService, HashToolService],
    exports:[MicrosoftService]
  })
export class MicrosoftModule {}
