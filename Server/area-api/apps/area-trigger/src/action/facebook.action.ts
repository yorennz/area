import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { triggerData } from '../trigger/area-trigger.service'

@Injectable()
export class FacebookAction {
  public actionMap: { [key: number | string]: () => void } = {}
  private readonly url = "https://graph.facebook.com/v18.0"
  constructor(
    private readonly config: ConfigService,
  ) {
    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.triggerNewFriend.bind(this),
      1:this.triggerRemoveFriend.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    return [refresh_token, refresh_token]
  }

  private genHeaders(token) {
    return {
        "Authorization":`Bearer ${token}`,
        "Content-Type": "application/json"
    }
  }

  async triggerNewFriend(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/me/friends`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.summary.total_count
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare > actionData.data) {
              await console.log(`Trigger: Facebook new friend`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger facebook friend ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerRemoveFriend(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/me/friends`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.summary.total_count
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare < actionData.data) {
              await console.log(`Trigger: Facebook remove friend`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger facebook friend ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }
}