import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {GoogleService} from "../../../area-api/src/auth/oauth2/service/google/google.service";

@Injectable()
export class GoogleReaction {
  public reactionMap: { [key: number | string]: () => void } = {}
  constructor(
    private readonly config: ConfigService,
    private readonly googleService: GoogleService,
  ) {
    this.reactionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.addQuickEventCalendar.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    return await this.googleService.refreshAccessToken(refresh_token);
  }

  private async addQuickEventCalendar(access_token: string, datas) {
    const apiUrl: string = `https://www.googleapis.com/calendar/v3/calendars/${datas.calendar_id}/events/quickAdd`
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          text: datas.event_name,
          sendUpdates: 'all',
        }),
      })
      if (response.ok) {
        console.log("Event created on calendar")
        return 'Unique'
      } else {
        throw new Error('Error while trying to create event')
      }
    } catch (e) {
      throw new Error(`Error occured while trying to create event on calendar ${datas.calendar_id}`)
    }
  }
}