import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { triggerData } from '../trigger/area-trigger.service'

@Injectable()
export class RiotAction {
  public actionMap: { [key: number | string]: () => void } = {}
  private readonly url = "https://euw1.api.riotgames.com"
  private readonly api_key;
  constructor(
    private readonly config: ConfigService,
  ) {
    this.api_key = this.config.get("riot.api_key")
    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.triggerLevelUp.bind(this),
      1: this.triggerTargetLevel.bind(this),
      2: this.triggerPlayerInNormalGame.bind(this),
      3: this.triggerPlayerInCustomGame.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    return [refresh_token, refresh_token]
  }

  private genHeaders() {
    return {
        "X-Riot-Token":`${this.api_key}`,
        "Content-Type": "application/json"
    }
  }

  async triggerLevelUp(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders()
      const apiUrl = `${this.url}/lol/summoner/v4/summoners/by-name/${data.name}`
      const response = await fetch(`${apiUrl}`, {
        headers:headers,
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.summonerLevel
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            await console.log(`Trigger: ${data.name} level up to ${compare}`)
            trigger.trigger = true
          }
        return trigger
      }
      else
        console.log(`Failed to user data with status: ${response.status}, ${response_data.status.message || "Not found"}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerTargetLevel(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders()
      const apiUrl = `${this.url}/lol/summoner/v4/summoners/by-name/${data.name}`
      const response = await fetch(`${apiUrl}`, {
        headers:headers,
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.summonerLevel
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (actionData.data === compare) {
              await console.log(`Trigger: ${data.name} level target to ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to user data with status: ${response.status}, ${response_data.status.message || "Not found"}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  private async getSummonerId(name) {
    try {
      const headers = this.genHeaders()
      const apiUrl = `${this.url}/lol/summoner/v4/summoners/by-name/${name}`
      const response = await fetch(`${apiUrl}`, {
        headers:headers,
        method: "GET",
      })
        const response_data = await response.json()
        if (response.ok) {
        return response_data.id
      }
      else
        console.log(`Failed to get user id with status: ${response.status}, ${response_data.status.message || "Not found"}`)
      throw new Error(`${response_data.status.message || "Not found"}`)
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerPlayerInNormalGame(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders()
      const id = await this.getSummonerId(data.name)
      // https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/Fal31OUUZuwJVjst-1p98V_UqEHuBfix4X2JEbJsDq-WKRPn
      const apiUrl = `${this.url}/lol/spectator/v4/active-games/by-summoner/${id}`
      const response = await fetch(`${apiUrl}`, {
        headers:headers,
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok || response.status === 404) {
        const trigger : triggerData = { trigger: false, data:null}
        var compare = response.status === 200  ? true : false
        if (compare === true)
            compare = response_data.gameType === "MATCHED_GAME" ? true : false
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: false}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare === true) {
              await console.log(`Trigger: ${data.name} is in normal game , ${response_data.gameMode}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to user data with status: ${response.status}, ${response_data.status.message || "Not found"}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerPlayerInCustomGame(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders()
      const id = await this.getSummonerId(data.name)
      const apiUrl = `${this.url}/lol/spectator/v4/active-games/by-summoner/${id}`
      const response = await fetch(`${apiUrl}`, {
        headers:headers,
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok || response.status === 404) {
        const trigger : triggerData = { trigger: false, data:null}
        var compare = response.status === 200  ? true : false
        if (compare === true)
            compare = response_data.gameType === "CUSTOM_GAME" ? true : false
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: false}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare === true) {
              await console.log(`Trigger: ${data.name} is in custom game , ${response_data.gameMode}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to user data with status: ${response.status}, ${response_data.status.message || "Not found"}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  
}