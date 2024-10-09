import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class LinkeInReaction {
  private readonly apiVersion
  private readonly url = 'https://api.linkedin.com'
  private readonly protocolVersion
  public reactionMap: { [key: number | string]: () => void } = {}
  constructor(
    private readonly config: ConfigService,
  ) {
    this.apiVersion = this.config.get('linkedin.api_version')
    this.protocolVersion = this.config.get('linkedin.protocol_version')
    this.reactionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.createPublicShareOnLinkedin.bind(this),
      1: this.createPrivateShareOnLinkedin.bind(this),
    }
  }

  // we dont have refresh token for linkedin, need to verify our app 
  async callRefreshToken(refresh_token: string) {
    return [refresh_token, refresh_token]
  }

  private async getPersonURN(token) {
    const apiUrl = `${this.url}/${this.apiVersion}/userinfo`
    try {
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${token}` }
    })
    const data = await response.json();
    if (response.ok) {
        return `urn:li:person:${data.sub}`
    }
    else {
        throw new Error(data.message)
    }
}   catch (err) {
    throw new InternalServerErrorException(`Unable to fetch linkedIn user URN:`, err.message)
}
  }

  private genLinkedinHeaders(token) {
    return {
        "Authorization":`Bearer ${token}`,
        "X-Restli-Protocol-Version": this.protocolVersion,
        "Content-Type": "application/json"
    }
  }

  private genShareVisibility(isPublic: boolean) {
    if (isPublic == true) {
        return  {visibility : { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}}
    } 
    else
        return  {visibility : { "com.linkedin.ugc.MemberNetworkVisibility": "CONNECTIONS"}}
  }

  private genShareMedia(data) { // Description Optionnal
    const media = [{
        "status":"READY",
        "originalUrl": data.url,
        "description": { "text": data.url_description},
        "title": { "text": data.url_title}
    }]
    return media
  }

  private genShareSpecificContent(data) {
    const shareCommentary = {
        "text": data.commentary
    }
    if (data.url) {
        const media = this.genShareMedia(data);
        // specificContent.media = media;
        return {"specificContent": {"com.linkedin.ugc.ShareContent": { "shareCommentary": shareCommentary, "shareMediaCategory": "ARTICLE", "media": media}}}
    }
    return {"specificContent": {"com.linkedin.ugc.ShareContent": { "shareCommentary": shareCommentary, "shareMediaCategory": "NONE"}}}
  }

  private async genShareBody(access_token, data, isPublic) {
    const content = this.genShareSpecificContent(data)
    const visibility = this.genShareVisibility(isPublic)
    const urn = await this.getPersonURN(access_token)
    const body = {"author":urn, "lifecycleState": "PUBLISHED" ,...content, ...visibility}
    return body
  }

  // 0 https://learn.microsoft.com/fr-fr/linkedin/consumer/integrations/self-serve/share-on-linkedin
  async createPublicShareOnLinkedin(access_token: string, datas) {
    const apiUrl = `${this.url}/${this.apiVersion}/ugcPosts`
    const headers = this.genLinkedinHeaders(access_token)
    const body = await this.genShareBody(access_token, datas, true)
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        })
        const response_data = (await response.json())
        if (response.ok){
            console.log(`[${datas.commentary}] linkedIn Public share succesfully posted`)
            return "Unique"
          }
        else {
            const message = `Unable to post linkedIn Public share ${response_data.message}`
            throw new Error(message)
        }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }

  // 1 https://learn.microsoft.com/fr-fr/linkedin/consumer/integrations/self-serve/share-on-linkedin
  async createPrivateShareOnLinkedin(access_token: string, datas) {
    const apiUrl = `${this.url}/${this.apiVersion}/ugcPosts`
    const headers = this.genLinkedinHeaders(access_token)
    const body = await this.genShareBody(access_token, datas, false)
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        })
        const response_data = (await response.json())
        if (response.ok){
            console.log(`[${datas.commentary}] linkedIn Private share succesfully posted`)
            return "Unique"
          }
        else {
            const message = `Unable to post linkedIn Private share ${response_data.message}`
            throw new Error(message)
        }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }

  // Cannot delete because user cannot get URN
  // // 2 https://learn.microsoft.com/en-us/linkedin/compliance/integrations/shares/ugc-post-api?context=linkedin%2Fcompliance%2Fcontext&view=li-lms-unversioned&preserve-view=true&tabs=http#delete-ugc-posts
  // async deleteShareOnLinkedin(access_token: string , datas) {
  //   const apiUrl = `${this.url}/${this.apiVersion}/ugcPosts`
  //   const headers = this.genLinkedinHeaders(access_token)
  //   const urn = encodeURIComponent(`urn:li:share:${datas.id}`)
  //   console.log(`${apiUrl}/${urn}`)
  //   try {
  //     const response = await fetch(`${apiUrl}/${urn}`, {
  //         method: "DELETE",
  //         headers: headers,
  //     })
  //     if (response.ok){
  //         console.log(`[${datas.id}] linkedIn share succesfully deleted`)
  //         return "Unique"
  //       }
  //     else {
  //     const response_data = (await response.json())
  //     const message = `Unable to delete linkedIn share ${response_data.message}`
  //         throw new Error(message)
  //     }
  // }
  // catch (err) {
  //     throw new InternalServerErrorException(err.message)
  // }
  // }
}
