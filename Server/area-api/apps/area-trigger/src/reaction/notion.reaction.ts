import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

function containsOnlyEmojis(text: string): boolean {
    const emojiRegex = /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1F004}\u{1F0CF}\u{1F004}\u{1F0CF}\u{1F004}\u{1F0CF}\u{1F004}\u{1F0CF}\u{1F005}\u{1F0CE}\u{1F004}\u{1F0CF}\u{1F004}\u{1F0CF}\u{1F004}\u{1F0CF}]+$/u;
  
    return emojiRegex.test(text);
  }

@Injectable()
export class NotionReaction {
  private readonly url = 'https://api.notion.com/v1'
  public reactionMap: { [key: number | string]: () => void } = {}
  constructor(
    private readonly config: ConfigService,
  ) {
    this.reactionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.postCommentOnPage.bind(this),
      1: this.createNewPageOnParent.bind(this),
      2: this.createNewBlockOnPage.bind(this),
      3: this.updateBlockTitle.bind(this),
      4: this.deleteBlock.bind(this)
    }
  }

  // we dont have refresh token for linkedin, need to verify our app 
  async callRefreshToken(refresh_token: string) {
    return [refresh_token, refresh_token]
  }


  private genHeaders(token) {
    return {
        "Authorization":`Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
  }

  private genCommentBody(datas) {
    const colors = ["default", "gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red", "gray_background", "brown_background", "orange_background", "yellow_background", "green_background", "blue_background", "purple_background", "pink_background", "red_background"];
    if (!colors.includes(datas.color)) {
        console.log(datas.color, "is not supported by notion, changed to default color")
        datas.color = "default"
    }
    const parent = { page_id: datas.page_id}
    const rich_text = [
        {
            text: { content: datas.comment},
            annotations: { bold: datas.bold || false, color: datas.color || "default", underline: datas.underline || false, italic: datas.italic || false }
        }
    ]
    if (datas.url !== undefined) {
      rich_text[0].text["link"] = { url: datas.url };
    }
    return {parent, rich_text}
  }

  // 0
  async postCommentOnPage(access_token: string, datas) {
    const apiUrl = `${this.url}/comments`
    const headers = this.genHeaders(access_token)
    const body = await this.genCommentBody(datas)
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        })
        const response_data = (await response.json())
        if (response.ok){
            console.log(`[${body.rich_text[0]["text"]["content"]}] comment successfully posted in the page : ${body.parent.page_id}`)
          }
        else {
            const message = `Unable to post comment ${response_data.message}`
            throw new Error(message)
        }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }


  private genNewPageBody(datas) {
    const parent = { page_id: datas.page_id}
    const icon = {type: "emoji", emoji: datas.icon}
    const cover = {type: "external", external: {url: datas.image_url}}
    var properties = {
        title: {
            id: "title",
            type: "title",
            title: [
                {
                    type: "text",
                    text: {
                        content: datas.title,
                        link: {url:datas.title_url}
                    }
                }
            ]
        }
    }
    if (!datas.title_url)
      delete properties.title.title[0].text.link;
    var body = {parent, properties, icon, cover}
    if (containsOnlyEmojis(datas.icon) == false) {
        delete body.icon
    }
    if (!datas.image_url) {
      delete body.cover.type["external"]
    }
    if (!datas.cover)
        delete body['cover']
    return body

  }

  // 1
  async createNewPageOnParent(access_token: string, datas) {
    const apiUrl = `${this.url}/pages`
    const headers = this.genHeaders(access_token)
    const body = await this.genNewPageBody(datas)
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        })
        const response_data = (await response.json())
        if (response.ok){
            console.log(`[${response_data.id}] successfully posted in the page : ${datas.page_id}`)
            // return "Unique"
          }
        else {
            const message = `Unable to post comment ${response_data.message}`
            throw new Error(message)
        }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }

  private genRichText(content, url, annotations) {
    const rich_text: { text: { content: string, link?: { url: string } }, annotations: any } = {
      text: {
        content: content,
      },
      annotations: {
        ...annotations
      }
    };
    if (url !== undefined) {
      rich_text.text.link = { url };
    }
    return {rich_text : [rich_text]}
  }

  private genBlockBody(data) {
    const title_annotations = {
      color: data.title_color,
      bold:data.title_bold,
      underline:data.title_underline,
      italic: data.title_italic
    }
    const heading_2 = {
      heading_2: this.genRichText(data.title, data.title_url, title_annotations)
    }
    const content_annotations = {
      color: data.content_color,
      bold:data.content_bold,
      underline:data.content_underline,
      italic: data.content_italic
    }
    const content = {
      paragraph : this.genRichText(data.content, data.content_url, content_annotations)
    }
    const children = {children : [heading_2, content]}
    return children
  }
  // 2
  async createNewBlockOnPage(access_token: string, datas) {
    const apiUrl = `${this.url}/blocks/${datas.page_id}/children`
    const headers = this.genHeaders(access_token)
    const body = this.genBlockBody(datas)
    try {
      const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(body)
      })
      const response_data = (await response.json())
      if (response.ok){
          console.log(`[${datas.title}] block successfully posted in the page : ${datas.page_id}`)
          // return "Unique"
        }
      else {
          const message = `Unable to post comment ${response_data.message}`
          throw new Error(message)
      }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }

  // 3
  async updateBlockTitle(access_token, datas) {
    const apiUrl = `${this.url}/blocks/${datas.block_id}`
    const headers = this.genHeaders(access_token)
    const title_annotations = {
      color: datas.title_color,
      bold:datas.title_bold,
      underline:datas.title_underline,
      italic: datas.title_italic
    }
    const body = {heading_2:  this.genRichText(datas.title, datas.title_url, title_annotations)};
    try {
      const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(body)
      })
      const response_data = (await response.json())
      if (response.ok){
          console.log(`[${response_data.id}] block successfully deleted from the page : ${response_data.parent.page_id}`)
          // return "Unique"
        }
      else {
          const message = `Unable to update block title ${response_data.message}`
          throw new Error(message)
      }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }
 // 4
  async deleteBlock(access_token, datas) {
    const apiUrl = `${this.url}/blocks/${datas.id}`
    const headers = this.genHeaders(access_token)
    try {
      const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: headers,
      })
      const response_data = (await response.json())
      if (response.ok){
          console.log(`[${response_data.id}] block successfully deleted from the page : ${response_data.parent.page_id}`)
          return "Unique"
        }
      else {
          const message = `Unable to delete block ${response_data.message}`
          throw new Error(message)
      }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }
}
