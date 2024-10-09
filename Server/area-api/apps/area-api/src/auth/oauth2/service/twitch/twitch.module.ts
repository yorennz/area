import { Module } from '@nestjs/common';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';
import { DatabaseModule } from 'apps/area-api/src/database/database.module';
import { HashToolService } from 'apps/area-api/src/utils/hashtool.service';

@Module({
    imports:[DatabaseModule],
    controllers: [TwitchController],
    providers: [TwitchService, HashToolService],
    exports:[TwitchService]
  })
export class TwitchModule {}
