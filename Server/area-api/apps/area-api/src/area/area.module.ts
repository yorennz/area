import { Module } from '@nestjs/common'
import { AreaService } from './area.service'
import { AreaController } from './area.controller'
import { DatabaseModule } from 'apps/area-api/src/database/database.module'
import { HashToolService } from 'apps/area-api/src/utils/hashtool.service'
import { TriggerDatabaseModule } from '../../../area-trigger/src/database/trigger_database.module'
import { AreaTriggerModule } from '../../../area-trigger/src/trigger/area-trigger.module'

@Module({
  imports: [DatabaseModule, TriggerDatabaseModule, AreaTriggerModule],
  providers: [AreaService, HashToolService],
  controllers: [AreaController],
})
export class AreaModule {}
