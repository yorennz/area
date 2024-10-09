import { LinkedInService } from './../../../area-api/src/auth/oauth2/service/linkedin/linkedin.service';
import { Injectable } from '@nestjs/common'
import { triggerData } from '../trigger/area-trigger.service'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkeInAction {
  public actionMap: { [key: number | string]: () => void } = {}
  private readonly url = 'https://api.linkedin.com'
  private readonly apiVersion
  private readonly protocolVersion

  constructor(public readonly linkedInService: LinkedInService, private readonly config: ConfigService) {
    this.apiVersion = this.config.get('linkedin.api_version')
    this.protocolVersion = this.config.get('linkedin.protocol_version')

    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.changedLinkedinNameTrigger.bind(this),
      1: this.changedLinkedinFamilyNameTrigger.bind(this),
      2: this.specificLinkedinNameTrigger.bind(this),
      3: this.specificLinkedinFamilyNameTrigger.bind(this),
    }
  }

  async callRefreshToken(refresh_token: string) {
    return [refresh_token, refresh_token]
  }

  private genLinkedinHeaders(token) {
    return {
        "Authorization":`Bearer ${token}`,
        "X-Restli-Protocol-Version": this.protocolVersion,
        "Content-Type": "application/json"
    }
  }

  async changedLinkedinNameTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      // https://api.linkedin.com/v2/userinfo
      const headers = this.genLinkedinHeaders(access_token);
      const apiUrl = `${this.url}/${this.apiVersion}/userinfo`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {

        const trigger : triggerData = { trigger: false, data:null}
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: response_data.given_name}
          if (actionData.data != response_data.given_name)  {
            trigger.data = response_data.given_name
            console.log(`Trigger: linkedin given_name changed, now ${response_data.given_name}`)
            trigger.trigger = true
          }
        return trigger
      }
      else
        console.log(`Failed to trigger linkedin given_name ${response_data.message} with status: ${response.status}`)
        return {trigger: false, data: null}

      }
    catch (error) {
        throw new Error(error)
    }
  }  
  async changedLinkedinFamilyNameTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      // https://api.linkedin.com/v2/userinfo
      const headers = this.genLinkedinHeaders(access_token);
      const apiUrl = `${this.url}/${this.apiVersion}/userinfo`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {

        const trigger : triggerData = { trigger: false, data:null}
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: response_data.family_name}
        if (actionData.data != response_data.family_name)  {
          trigger.data = response_data.family_name
          console.log(`Trigger: linkedin family_name changed, now ${response_data.family_name}`)
          trigger.trigger = true
        }
        return trigger
      }
      else
        console.log(`Failed to trigger linkedin family_name ${response_data.message} with status: ${response.status}`)
        return {trigger: false, data: null}

      }
    catch (error) {
        throw new Error(error)
    }
  }  

  async specificLinkedinFamilyNameTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      // https://api.linkedin.com/v2/userinfo
      const headers = this.genLinkedinHeaders(access_token);
      const apiUrl = `${this.url}/${this.apiVersion}/userinfo`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        if (data.trigger_name == response_data.family_name) {
          console.log(`Trigger: linkedin family_name changed, now ${response_data.family_name}`)
          trigger.trigger = true
        }
        return trigger
      }
      else
        console.log(`Failed to trigger linkedin family_name ${response_data.message} with status: ${response.status}`)
        return {trigger: false, data: null}

      }
    catch (error) {
        throw new Error(error)
    }
  }  

  async specificLinkedinNameTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      // https://api.linkedin.com/v2/userinfo
      const headers = this.genLinkedinHeaders(access_token);
      const apiUrl = `${this.url}/${this.apiVersion}/userinfo`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {

        const trigger : triggerData = { trigger: false, data:null}
        if (data.trigger_name == response_data.given_name) {
          console.log(`Trigger: linkedin name is equal to , now ${data.trigger_name}`)
          trigger.trigger = true
        }
        return trigger
      }
      else
        console.log(`Failed to trigger linkedin given_name ${response_data.message} with status: ${response.status}`)
        return {trigger: false, data: null}

      }
    catch (error) {
        throw new Error(error)
    }
  }  
}
