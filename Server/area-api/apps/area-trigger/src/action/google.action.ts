import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {GoogleService} from "../../../area-api/src/auth/oauth2/service/google/google.service";

@Injectable()
export class GoogleAction {
  public actionMap: { [key: number | string]: () => void } = {}
  constructor(
    private readonly config: ConfigService,
    private readonly googleService: GoogleService,
  ) {
    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.checkCalendarEvent.bind(this),
      1: this.checkIncomingMail.bind(this),
      2: this.checkDraftUpdate.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    return await this.googleService.refreshAccessToken(refresh_token);
  }

  private async checkCalendarEvent(access_token: string, datas, actionData) {
    const apiUrl: string = `https://www.googleapis.com/calendar/v3/calendars/${datas.calendar_id}/events`
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      })
      if (response.ok) {
        const trigger = {trigger: false, data: null};
        const data = await response.json()
        trigger.data = data.items.length
        if (actionData === undefined)
          return trigger
        if (actionData != data.items.length) {
          trigger.trigger = true
          return trigger
        }
        return trigger
      }
    } catch (e) {
      throw new Error(`Error occured while trying to get event of calendar ${datas.calendar_id}`)
    }
  }

  private async checkIncomingMail(access_token: string, datas, actionData) {
    const apiUrl: string = `https://gmail.googleapis.com/gmail/v1/users/me/messages`
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      })
      if (response.ok) {
        const trigger = {trigger: false, data: null};
        const data = await response.json()
        trigger.data = data.messages.slice(0, 3)
        if (actionData === undefined)
          return trigger
        if (JSON.stringify(actionData.data) !== JSON.stringify(data.messages.slice(0, 3))) {
          trigger.trigger = true
          return trigger
        }
        return trigger
      }
    } catch (e) {
      throw new Error(`Error occured while trying to get mail`)
    }
  }

  private async checkDraftUpdate(access_token: string, datas, actionData) {
    const apiUrl: string = `https://gmail.googleapis.com//gmail/v1/users/me/drafts`
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      })
      if (response.ok) {
        const trigger = {trigger: false, data: null};
        const data = await response.json()
        trigger.data = data.messages.slice(0, 3)
        if (actionData === undefined)
          return trigger
        if (JSON.stringify(actionData.data) !== JSON.stringify(data.messages.slice(0, 3))) {
          trigger.trigger = true
          return trigger
        }
        return trigger
      }
    } catch (e) {
      throw new Error(`Error occured while trying to get drafts`)
    }
  }
}