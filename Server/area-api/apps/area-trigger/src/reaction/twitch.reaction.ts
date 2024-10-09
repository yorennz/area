import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TwitchService } from '../../../area-api/src/auth/oauth2/service/twitch/twitch.service'

@Injectable()
export class TwitchReaction {
  public reactionMap: { [key: number | string]: () => void } = {}

  constructor(
    private readonly config: ConfigService,
    private readonly twitchService: TwitchService,
  ) {
    this.reactionMap = {
      getToken: this.callRefreshToken.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    return await this.twitchService.refreshAccessToken(refresh_token);
  }

}