import { MicrosoftService } from './../../../area-api/src/auth/oauth2/service/microsoft/microsoft.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'


@Injectable()
export class MicrosoftReaction {
  private readonly url = 'https://graph.microsoft.com/v1.0'
  public reactionMap: { [key: number | string]: () => void } = {}
  constructor(
    public readonly microsoftService: MicrosoftService, private readonly config: ConfigService
  ) {
    this.reactionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.createDraftEmail.bind(this),
      1: this.createHiddenFolder.bind(this),
      2: this.createVisibleFolder.bind(this),
      3: this.deleteFolder.bind(this),
      4: this.renameFolder.bind(this),
      5: this.createHiddenChildFolder.bind(this),
      6: this.createVisibleChildFolder.bind(this)
    }
  }

  // we dont have refresh token for linkedin, need to verify our app 
  async callRefreshToken(refresh_token: string) {
    const data = await this.microsoftService.refresh_token(refresh_token)
    return [data.access_token, data.refresh_token]
  }


  private genHeaders(token) {
    return {
        "Authorization":`Bearer ${token}`,
        "Content-Type": "application/json"
    }
  }

  private genDraftBody(data) {
    const subject = data.subject
    const body = { "contentType": "HTML", "content": data.content}
    const toRecipients = [{"emailAddress": {"address": data.recipient}}]
    return {subject, body, toRecipients, importance:"Low"}
  }

  async createDraftEmail(access_token: string, datas) {
    const apiUrl = `${this.url}/me/messages`
    const headers = this.genHeaders(access_token)
    const body = this.genDraftBody(datas)
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        })
        const response_data = (await response.json())
        if (response.ok){
            console.log(`[${datas.subject}] draft email created`)
            return
          }
        else {
            const message = `Unable to create draft email ${response_data.error.message}`
            throw new Error(message)
        }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }

  async createHiddenFolder(access_token: string, datas) {
    const apiUrl = `${this.url}/me/mailFolders`
    const headers = this.genHeaders(access_token)
    const body = {displayName: datas.name, isHidden: true}
    try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body)
      })
      const response_data = (await response.json())
      if (response.ok){
          console.log(`[${datas.name}] hidden folder created`)
          return "Unique"
        }
      else {
          const message = `Unable to create mail folder ${response_data.error.message}`
          throw new Error(message)
      }
  }
  catch (err) {
      throw new InternalServerErrorException(err.message)
  }
  }

  async createVisibleFolder(access_token: string, datas) {
    const apiUrl = `${this.url}/me/mailFolders`
    const headers = this.genHeaders(access_token)
    const body = {displayName: datas.name, isHidden: false}
    try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body)
      })
      const response_data = (await response.json())
      if (response.ok){
          console.log(`[${datas.name}] visible folder created`)
          return "Unique"
        }
      else {
          const message = `Unable to create mail folder ${response_data.error.message}`
          throw new Error(message)
      }
  }
  catch (err) {
      throw new InternalServerErrorException(err.message)
  }
  }

  async getFolderId(access_token: string, name: string) {
    const apiUrl = `${this.url}/me/mailFolders?$filter=displayName eq '${name}'&includeHiddenFolders=true&$select=id`
    const headers = this.genHeaders(access_token)

    try {
      const response = await fetch(apiUrl, {
          method: "GET",
          headers: headers,
      })
      const response_data = (await response.json())
      if (response_data.value.length === 0)
        throw new Error("Folder not found: " + name)
      if (response.ok){
          return response_data.value[0].id
        }
      else {
          const message = `Unable to get ${name} folder id : ${response_data.error.message}`
          throw new Error(message)
      }
  }
  catch (err) {
      throw new InternalServerErrorException(err.message)
  }
  }

  async deleteFolder(access_token: string, datas) {
    const id = await this.getFolderId(access_token, datas.name)

    const apiUrl = `${this.url}/me/mailFolders/${id}`
    const headers = this.genHeaders(access_token)
    try {
      const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: headers,
      })
      if (response.ok){
          console.log(`[${datas.name}] folder deleted`)
          return "Unique"
        }
      else {
        const response_data = (await response.json())
        const message = `Unable to delete  ${datas.name} mail folder ${response_data.error.message}`
          throw new Error(message)
      }
  }
  catch (err) {
      throw new InternalServerErrorException(err.message)
  }
  }

  async renameFolder(access_token: string, datas) {
    const id = await this.getFolderId(access_token, datas.name)

    const apiUrl = `${this.url}/me/mailFolders/${id}`
    const headers = this.genHeaders(access_token)
    const body = {"displayName": datas.new_name}
    try {
      const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(body)
      })
      if (response.ok){
          console.log(`[${datas.name}] folder renamed to [${datas.new_name}]`)
          return "Unique"
        }
      else {
        const response_data = (await response.json())
        const message = `Unable to rename  ${datas.name} mail folder ${response_data.error.message}`
          throw new Error(message)
      }
  }
  catch (err) {
      throw new InternalServerErrorException(err.message)
  }
  }


  // https://graph.microsoft.com/v1.0/me/mailFolders/{id}/childFolders


  async createHiddenChildFolder(access_token: string, datas) {
    const id = await this.getFolderId(access_token, datas.parent)

    const apiUrl = `${this.url}/me/mailFolders/${id}/childFolders`
    const headers = this.genHeaders(access_token)
    const body = {"displayName": datas.name, "isHidden": true}
    try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body)
      })
      if (response.ok){
          console.log(`[${datas.name}] child hidden folder created in [${datas.parent}] folder`)
          return "Unique"
        }
      else {
        const response_data = (await response.json())
        const message = `Unable to create ${datas.name} child folder ${response_data.error.message}`
          throw new Error(message)
      }
  }
  catch (err) {
      throw new InternalServerErrorException(err.message)
  }
  }

  async createVisibleChildFolder(access_token: string, datas) {
    const id = await this.getFolderId(access_token, datas.parent)

    const apiUrl = `${this.url}/me/mailFolders/${id}/childFolders`
    const headers = this.genHeaders(access_token)
    const body = {"displayName": datas.name, "isHidden": false}
    try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body)
      })
      if (response.ok){
          console.log(`[${datas.name}] child folder visible created in [${datas.parent}] folder`)
          return "Unique"
        }
      else {
        const response_data = (await response.json())
        const message = `Unable to create ${datas.name} child folder ${response_data.error.message}`
          throw new Error(message)
      }
  }
  catch (err) {
      throw new InternalServerErrorException(err.message)
  }
  }
}
