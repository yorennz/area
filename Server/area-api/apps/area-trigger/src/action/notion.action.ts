import { LinkedInService } from '../../../area-api/src/auth/oauth2/service/linkedin/linkedin.service';
import { Injectable } from '@nestjs/common'
import { triggerData } from '../trigger/area-trigger.service'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotionAction {
  public actionMap: { [key: number | string]: () => void } = {}
  private readonly url = 'https://api.notion.com/v1'

  constructor(public readonly linkedInService: LinkedInService, private readonly config: ConfigService) {

    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.notionPageTitleTrigger.bind(this),
      1: this.notionPageIconTrigger.bind(this),
      2: this.specificNotionPageTitleTrigger.bind(this),
      3: this.specificNotionPageIconTrigger.bind(this),
      4: this.notionPageContentTrigger.bind(this),
      5: this.specificNotionPageContentTrigger.bind(this),
      6: this.NotionPageCoverTrigger.bind(this),
      7: this.specificNotionPageCoverTrigger.bind(this),
      8: this.notionPageCommentTrigger.bind(this),
      9: this.specificNotionPageCommentTrigger.bind(this)
    }
  }

  private genHeaders(token) {
    return {
        "Authorization":`Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
  }

  async callRefreshToken(refresh_token: string) {
    return [refresh_token, refresh_token]
  }


  async notionPageTitleTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/pages/${data.page_id}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.properties.title.title[0]?.text.content ?? undefined 
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            await console.log(`Trigger: Notion page [${data.page_id}] title changed, now ${compare}`)
            trigger.trigger = true
          }
        return trigger
      }
      else
        console.log(`Failed to trigger Notion page [${data.page_id}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async notionPageIconTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/pages/${data.page_id}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.icon?.emoji ?? "NONE"

        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data != compare) {
          trigger.data = compare
          await console.log(`Trigger: Notion page [${data.page_id}] icon changed, now ${compare}`)
          trigger.trigger = true
          }
        return trigger
      }
      else
      await console.log(`Failed to trigger Notion page [${data.page_id}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async specificNotionPageTitleTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/pages/${data.page_id}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const compare = response_data.properties.title.title[0]?.text.content ?? undefined 
        const trigger : triggerData = { trigger: false, data:null}
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: null}
        if (compare === undefined)
          return {trigger: false, data: null}
          if (actionData.data != compare) {
            trigger.data = compare
        if (data.title === compare)  {
            await console.log(`Trigger: Notion page [${data.page_id}] is equal ${data.title}, now ${compare}`)
            trigger.trigger = true
          }
        }
        return trigger
      }
      else
        console.log(`Failed to trigger Notion page [${data.page_id}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async specificNotionPageIconTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/pages/${data.page_id}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.icon?.emoji ?? "NONE"

        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data != compare) {
          trigger.data = compare
          if (data.icon === compare) {
            await console.log(`Trigger: Notion page [${data.page_id}] icon is equal to ${data.icon}`)
            trigger.trigger = true
          }
          }
        return trigger
      }
      else
      await console.log(`Failed to trigger Notion page [${data.page_id}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async notionPageContentTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/blocks/${data.page_id}/children`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = JSON.stringify(response_data.results)
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          trigger.trigger = true
          await console.log(`Trigger: Notion page [${data.page_id}] content changed `)
          }
        return trigger
      }
      else
      await console.log(`Failed to trigger Notion page [${data.page_id}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async specificNotionPageContentTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/blocks/${data.page_id}/children`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = JSON.stringify(response_data.results)
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          if (compare.includes(data.content)) {
            trigger.trigger = true
            await console.log(`Trigger: Notion page [${data.page_id}] content include ${data.content} `)
        }
        }
        return trigger
      }
      else
        await console.log(`Failed to trigger Notion content [${data.page_id}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }


  async NotionPageCoverTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/pages/${data.page_id}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.cover?.external.url ?? "NONE"
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data != compare) {
          trigger.data = compare
          trigger.trigger = true
          await console.log(`Trigger: Notion page [${data.page_id}] icon changed, now ${compare}`)
          }
        return trigger
      }
      else
      await console.log(`Failed to trigger Notion page [${data.page_id}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }


  async specificNotionPageCoverTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/pages/${data.page_id}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.cover?.external.url ?? "NONE"
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data != compare) {
          trigger.data = compare
        if (compare === data.url) {
            await console.log(`Trigger: Notion page [${data.page_id}] cover changed, now ${compare}`)
            trigger.trigger = true
          }
        }
        return trigger
      }
      else
      await console.log(`Failed to trigger Notion page [${data.page_id}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async notionPageCommentTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/comments?block_id=${data.page_id}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.results.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data != compare) {
          trigger.data = compare
          if (compare > actionData.data) {
            trigger.trigger = true
            await console.log(`Trigger: Notion page [${data.page_id}] comment added, now ${compare}`)
          }
          }
        return trigger
      }
      else
      await console.log(`Failed to trigger Notion page [${data.page_id}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async specificNotionPageCommentTrigger(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/comments?block_id=${data.page_id}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.results.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data != compare) {
          const compare1 = JSON.stringify(response_data.results)
          trigger.data = compare
          if (compare1.includes(data.input)) {
            trigger.trigger = true
            await console.log(`Trigger: Notion page [${data.page_id}] a comment is equal to ${data.input}, now ${compare}`)
          }
          }
        return trigger
      }
      else
      await console.log(`Failed to trigger Notion page [${data.page_id}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }
}
