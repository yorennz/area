import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as ip from 'ip';
import { AboutDto } from './dto/about.dto';
import area_config from './configuration/area_config';


@Injectable()
export class AppService {

  async getTime(): Promise<number> {
    const date = Date.now();
    return date;
  }

  async getHostIp() {
    return await ip.address();
  }

  private countArea(services) {
    var count = 0
    for (const element of services) {
      const actions = element.actions
      const reactions = element.reactions
      count = count + actions.length + reactions.length
    }
    return count
  }
  async getAbout() {
    try {
      const currentTime: number = await this.getTime();
      const ipAddress: string = await this.getHostIp();
      const area_count = this.countArea(area_config.services)
      return new AboutDto(ipAddress, currentTime, area_config.services, area_count);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
