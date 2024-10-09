import { Injectable } from '@nestjs/common'
import { DiscordService } from '../../../area-api/src/auth/oauth2/service/discord/discord.service'
import { ConfigService } from '@nestjs/config'
import { triggerData } from '../trigger/area-trigger.service'

@Injectable()
export class DiscordAction {
  public actionMap: { [key: number | string]: () => void } = {}
  private readonly url = "https://discord.com/api/v10"
  constructor(
    private readonly config: ConfigService,
    private readonly discordService: DiscordService,
  ) {
    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.triggerJoinGuild.bind(this),
      1: this.triggerLeaveGuild.bind(this),
      2: this.triggerAddConnection.bind(this),
      3: this.triggerDeleteConnection.bind(this),
      4: this.triggerSpecificAddConnection.bind(this),
      5: this.triggerSpecificNumberOfConnection.bind(this),
      6: this.triggerRoleAddedInAGuild.bind(this),
      7: this.triggerspecificNumberOfRoleInAGuild.bind(this),
      8: this.triggerNumberOfGuild.bind(this),
      9: this.triggerUsername.bind(this),
      10: this.triggerspecificUsername.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    const [access_token, refresh] = await this.discordService.refreshAccessToken(refresh_token)
    return [access_token, refresh]
  }

  private genHeaders(token) {
    return {
        "Authorization":`Bearer ${token}`,
        "Content-Type": "application/json"
    }
  }

  async triggerJoinGuild(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me/guilds`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare > actionData.data) {
              await console.log(`Trigger: Discord User joined a new guild`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user guilds ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerLeaveGuild(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me/guilds`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare < actionData.data) {
              await console.log(`Trigger: Discord User leave a guild`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user guilds ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerAddConnection(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me/connections`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare > actionData.data) {
              await console.log(`Trigger: Discord User connected to a new service`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user connections ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerDeleteConnection(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me/connections`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare < actionData.data) {
              await console.log(`Trigger: Discord User deleted a connection`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user connections ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerSpecificAddConnection(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me/connections`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            const element = response_data.map(item => item.type)
            if (element.includes(data.input)) {
              await console.log(`Trigger: Discord new service equal to ${data.input}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user connections ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerSpecificNumberOfConnection(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me/connections`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (String(compare) === data.input) {
              await console.log(`Trigger: Discord number of service equal to ${data.input}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user connections ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerRoleAddedInAGuild(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me/guilds/${data.guild_id}/member`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.roles.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare > actionData.data) {
              await console.log(`Trigger: Discord user added a new role in the guild ${data.guild_id}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user guild info ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerspecificNumberOfRoleInAGuild(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me/guilds/${data.guild_id}/member`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.roles.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (String(compare) === data.input) {
              await console.log(`Trigger: Discord user number of role is equal to ${data.input} in the guild ${data.guild_id}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user guild info ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerNumberOfGuild(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me/guilds`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (String(compare) === data.input) {
              await console.log(`Trigger: Discord number of guild is equal to ${data.input}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user guilds ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerUsername(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.global_name
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
              await console.log(`Trigger: Discord username has changed`)
              trigger.trigger = true
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user info ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerspecificUsername(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/users/@me`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.global_name
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare === data.input) {
              await console.log(`Trigger: Discord username is equal to ${data.input}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger user info ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }
}