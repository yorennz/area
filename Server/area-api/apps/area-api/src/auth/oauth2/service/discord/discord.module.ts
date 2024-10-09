import { Module } from '@nestjs/common';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { DatabaseModule } from 'apps/area-api/src/database/database.module';
import { HashToolService } from 'apps/area-api/src/utils/hashtool.service';

@Module({
    imports:[DatabaseModule],
    controllers: [DiscordController],
    providers: [DiscordService, HashToolService],
    exports:[DiscordService]
  })
export class DiscordModule {}
