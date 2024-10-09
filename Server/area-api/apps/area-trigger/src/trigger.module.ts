import { Module } from '@nestjs/common'
import { TriggerService } from './trigger.service'
import { ScheduleModule } from '@nestjs/schedule'
import { AreaTriggerModule } from './trigger/area-trigger.module'

@Module({
  imports: [ScheduleModule.forRoot(), AreaTriggerModule],
  providers: [TriggerService],
})
export class TriggerModule {}
