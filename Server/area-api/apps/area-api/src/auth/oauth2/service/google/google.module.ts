import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { DatabaseModule } from 'apps/area-api/src/database/database.module';
import { HashToolService } from 'apps/area-api/src/utils/hashtool.service';
@Module({
    imports:[DatabaseModule],
    controllers: [GoogleController],
    providers: [GoogleService, HashToolService],
    exports:[GoogleService]
})
export class GoogleModule {}
