import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { triggerData } from '../trigger/area-trigger.service';

@Injectable()
export class GithubAction {
  private readonly url = "https://api.github.com"
  private readonly apiVersion;
  public actionMap: { [key: number | string]: () => void } = {}


  constructor(private readonly config: ConfigService) { 
    this.apiVersion = this.config.get("github.api_version")
    this.actionMap = {
      0: this.createPrivateRepositoryTrigger.bind(this),
      1: this.deletePrivateRepositoryTrigger.bind(this),
      2: this.createPublicRepositoryTrigger.bind(this),
      3: this.deletePublicRepositoryTrigger.bind(this),
      getToken: this.callRefreshToken.bind(this),
    }
  }

    //Github No need to refresh
  // Maybe create function for refresh github 
  // https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens#refreshing-a-user-access-token-with-a-refresh-token
  async callRefreshToken(refresh_token: string) {
    return [refresh_token, refresh_token]
  }

  async createPrivateRepositoryTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/user`
      const headers = {
        "Authorization": `Bearer ${access_token}`,
        "X-GitHub-Api-Version": this.apiVersion,
        "Accept": "application/vnd.github+json",
      }

      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {

        const trigger : triggerData = { trigger: false, data:null}
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: response_data.total_private_repos}
        if (actionData.data != response_data.total_private_repos)  {}
          trigger.data = response_data.total_private_repos
        if (actionData.data < response_data.total_private_repos) {
          console.log(`Trigger: newPrivateRepositoryCreated, now has ${response_data.total_private_repos} private repository`)
          trigger.trigger = true
        }
        return trigger
      }
      else
        console.log(`Failed to trigger createPrivateRepository ${response_data.message} with status: ${response.status}`)
        return {trigger: false, data: null}

      }
    catch (error) {
        throw new Error(error)
    }
  }

  async deletePrivateRepositoryTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/user`
      const headers = {
        "Authorization": `Bearer ${access_token}`,
        "X-GitHub-Api-Version": this.apiVersion,
        "Accept": "application/vnd.github+json",
      }

      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: response_data.total_private_repos}
        if (actionData.data > response_data.total_private_repos) {
          console.log(`Trigger: newPrivateRepositoryDeleted, now has ${response_data.total_private_repos} private repository`)
          trigger.trigger = true
        }
        if (actionData.data != response_data.total_private_repos) 
          trigger.data = response_data.total_private_repos
        return trigger
      }
      else
        console.log(`Failed to trigger PrivateRepository ${response_data.erros.message} with status: ${response.status}`)
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async createPublicRepositoryTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/user`
      const headers = {
        "Authorization": `Bearer ${access_token}`,
        "X-GitHub-Api-Version": this.apiVersion,
        "Accept": "application/vnd.github+json",
      }
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: response_data.public_repos}
        if (actionData.data != response_data.public_repos) 
          trigger.data = response_data.public_repos
        if (actionData.data < response_data.public_repos) {
          console.log(`Trigger: newPublicRepositoryCreated, now has ${response_data.public_repos} private repository`)
          trigger.trigger = true
        }
        return trigger
      }
      else
        console.log(`Failed to trigger createPrivateRepository ${response_data.message} with status: ${response.status}`)
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async deletePublicRepositoryTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/user`
      const headers = {
        "Authorization": `Bearer ${access_token}`,
        "X-GitHub-Api-Version": this.apiVersion,
        "Accept": "application/vnd.github+json",
      }

      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: response_data.public_repos}
        if (actionData.data != response_data.public_repos) 
          trigger.data = response_data.public_repos
        if (actionData.data > response_data.public_repos) {
          console.log(`Trigger: newPublicRepositoryDeleted, now has ${response_data.public_repos} public repository`)
          trigger.trigger = true
        }
        return trigger
      }
      else
        console.log(`Failed to trigger createPrivateRepository ${response_data.message} with status: ${response.status}`)
      }
    catch (error) {
        throw new Error(error)
    }
  }
}
