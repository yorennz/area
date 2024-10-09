import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TwitchService } from '../../../area-api/src/auth/oauth2/service/twitch/twitch.service'

@Injectable()
export class TwitchAction {
  public actionMap: { [key: number | string]: () => void } = {}
  constructor(
    private readonly config: ConfigService,
    private readonly twitchService: TwitchService,
  ) {
    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.checkCreatorGoal.bind(this),
      1: this.scheduleUpdate.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    return await this.twitchService.refreshAccessToken(refresh_token);
  }

  private async checkCreatorGoal(access_token: string, datas, actionData) {
    const apiUrl: string = `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${datas.broadcaster_id}`
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Client-Id': this.config.get('twitch.client_id'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      })
      if (response.ok) {
        const trigger = {trigger: false, data: null}
        const data = await response.json()
        if (actionData === undefined)
          return trigger
        if (datas.subGoal - 5 < data.total && data.total < datas.subGoal + 5) {
          trigger.trigger = true
          return trigger
        }
        return trigger
      } else {
        throw new Error('Error while getting broadcaster data');
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  private async scheduleUpdate(access_token: string, datas, actionData) {
    const apiUrl = `https://api.twitch.tv/helix/schedule?broadcaster_id=${datas.broadcaster_id}`
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Client-Id': this.config.get('twitch.client_id'),
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
      if (response.ok) {
        const trigger = {trigger: false, data: null}
        const data = await response.json()
        trigger.data = data.data.segments
        if (actionData.data === undefined)
          return trigger
        if (JSON.stringify(actionData.data) !== JSON.stringify(data.data.segments))
          trigger.trigger = true;
        return trigger
      } else if (response.status == 404) {
        throw new Error("The streamer didn't set any schedule for his channel")
      } else {
        throw new Error('Error occured while getting data from clip [Twitch]')
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}
