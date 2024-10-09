import { MicrosoftService } from './../../../area-api/src/auth/oauth2/service/microsoft/microsoft.service';
import { Injectable } from '@nestjs/common'
import { triggerData } from '../trigger/area-trigger.service'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicrosoftAction {
  public actionMap: { [key: number | string]: () => void } = {}
  private readonly url = 'https://graph.microsoft.com/v1.0'

  constructor(public readonly microsoftService: MicrosoftService, private readonly config: ConfigService) {

    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.triggerNewMailReceived.bind(this),
      1: this.triggerNewMailReceivedFromSpecifiPersons.bind(this),
      2: this.triggerNewMailReceivedFromSpecifiDomains.bind(this),
      3: this.triggerNewMailReceivedIncludeSpecificObjets.bind(this),
      4: this.triggerNUnReadEmail.bind(this),
      5: this.trigerNewFolder.bind(this),
      6: this.trigerDeleteFolder.bind(this),
      7: this.trigerSpecificNewFolder.bind(this),
      8: this.trigerSpecificNewFolderDeleted.bind(this)
    }
  }

  private genHeaders(token) {
    return {
        "Authorization":`Bearer ${token}`,
        "Content-Type": "application/json"
    }
  }

  async callRefreshToken(refresh_token: string) {
    const data = await this.microsoftService.refresh_token(refresh_token)
    return [data.access_token, data.refresh_token]
  }

  async triggerNewMailReceived(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/me/mailfolders/inbox/messages?$top=1&$select=receivedDateTime`
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.value[0].receivedDateTime
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          const date1 = new Date(compare);
          const date2 = new Date(actionData.data);
          if (date1 > date2) {
            trigger.trigger = true
          await console.log(`Trigger: Outlook new mail received at [${compare}] `)
          }
          }
        return trigger
      }
      else
      await console.log(`Failed to fetch Outlook mail [${response_data}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async triggerNewMailReceivedFromSpecifiPersons(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/me/mailfolders/inbox/messages?$top=1&$select=from,receivedDateTime`
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.value[0].receivedDateTime
        const sender = response_data.value[0].from.emailAddress.address
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          const date1 = new Date(compare);
          const date2 = new Date(actionData.data);
          if (date1 > date2 && data.input.toLowerCase().includes(sender.toLowerCase())) {
            trigger.trigger = true
          await console.log(`Trigger: Outlook new mail received at [${compare}] from ${sender}`)
          }
          }
        return trigger
      }
      else
      await console.log(`Failed to fetch Outlook mail [${response_data}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async triggerNewMailReceivedFromSpecifiDomains(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/me/mailfolders/inbox/messages?$top=1&$select=from,receivedDateTime`
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.value[0].receivedDateTime
        const sender = response_data.value[0].from.emailAddress.address.toLowerCase().match(/@(.+)/);
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          const date1 = new Date(compare);
          const date2 = new Date(actionData.data);
          if (date1 > date2 && data.input.toLowerCase().includes(sender[1])) {
            trigger.trigger = true
          await console.log(`Trigger: Outlook new mail received at [${compare}] from ${sender} domains`)
          }
          }
        return trigger
      }
      else
      await console.log(`Failed to fetch Outlook mail [${response_data}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async triggerNewMailReceivedIncludeSpecificObjets(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/me/mailfolders/inbox/messages?$top=1&$select=subject,receivedDateTime`
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.value[0].receivedDateTime
        const sender = response_data.value[0].subject.toLowerCase()
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          const date1 = new Date(compare);
          const date2 = new Date(actionData.data);
          if (date1 > date2 && data.input.toLowerCase().includes(sender)) {
            trigger.trigger = true
          await console.log(`Trigger: Outlook new mail received that include [${sender}]`)
          }
          }
        return trigger
      }
      else
      await console.log(`Failed to fetch Outlook mail [${response_data}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  private checkNumberUnreadEmail(jsonData: any): boolean {
    for (const email of jsonData) {
      if (email.isRead) {
        return false
      }
    }
    return true;
  }

  async triggerNUnReadEmail(access_token, data, actionData) : Promise<triggerData> {
    try {
      var number = data.input;
      if (Number(data.input) < 0)
        number = 1
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/me/mailfolders/inbox/messages?$top=${number}&$select=receivedDateTime,isRead`
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.value[0].receivedDateTime
        const mail = response_data.value
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          if (this.checkNumberUnreadEmail(mail)) {
            trigger.trigger = true
          await console.log(`Trigger: Outlook got [${data.input}] unread email`)
          }
          }
        return trigger
      }
      else
        await console.log(`Failed to fetch Outlook mail [${response_data}] ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async trigerNewFolder(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/me/mailFolders?$count=true&top=1&$select=id`
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data["@odata.count"]
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          if (compare > actionData.data) {
            trigger.trigger = true
            await console.log(`Trigger: Outlook folder created`)
          }
        }
        return trigger
      }
      else
        await console.log(`Failed to fetch Outlook folder ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async trigerDeleteFolder(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/me/mailFolders?$count=true&top=1&$select=id`
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data["@odata.count"]
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          if (compare < actionData.data) {
            trigger.trigger = true
            await console.log(`Trigger: Outlook folder deleted`)
          }
        }
        return trigger
      }
      else
        await console.log(`Failed to fetch Outlook folder ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async trigerSpecificNewFolder(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      // https://graph.microsoft.com/v1.0/me/mailFolders?$count=true&top=1&$select=displayName&$&search=testNew&includeHiddenFolders=true
      // https://graph.microsoft.com/v1.0/me/mailFolders?top=1&$select=displayName&$filter=displayName eq 'testNew'
      const apiUrl = `${this.url}/me/mailFolders?top=1&$select=displayName&$filter=displayName eq '${data.input}'&includeHiddenFolders=true`
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.value.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          if (compare != 0) {
            trigger.trigger = true
            await console.log(`Trigger: Outlook folder created with specific name ${data.input}`)
          }
        }
        return trigger
      }
      else
        await console.log(`Failed to fetch Outlook folders ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }

  async trigerSpecificNewFolderDeleted(access_token, data, actionData) : Promise<triggerData> {
    try {
      const headers = this.genHeaders(access_token);
      const apiUrl = `${this.url}/me/mailFolders?top=1&$select=displayName&$filter=displayName eq '${data.input}'&includeHiddenFolders=true`
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.value.length
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
        if (actionData.data !== compare) {
          trigger.data = compare
          if (compare === 0) {
            trigger.trigger = true
            await console.log(`Trigger: Outlook folder deleted with specific name ${data.input}`)
          }
        }
        return trigger
      }
      else
        await console.log(`Failed to fetch Outlook folders ${response_data.message} with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(error)
    }
  }
}
