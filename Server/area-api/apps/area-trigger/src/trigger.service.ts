import { Injectable } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { AreaTriggerService } from './trigger/area-trigger.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TriggerService {
  constructor(private readonly areaTriggerService: AreaTriggerService, config: ConfigService) {}

  @Interval(Number(process.env.INTERVAL) || 5000)
  async handleTriger() {
    await this.areaTriggerService.updateAllArea()
    await this.areaTriggerService.handleArea()
  }
}
