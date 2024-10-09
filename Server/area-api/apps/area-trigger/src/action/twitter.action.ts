import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {TwitterService} from "../../../area-api/src/auth/oauth2/service/twitter/twitter.service";

@Injectable()
export class TwitterAction {

  public actionMap: { [key: number | string]: () => void } = {}
  constructor(
    private readonly config: ConfigService,
    private readonly twitterService: TwitterService,
  ) {
    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    return await this.twitterService.refreshAccessToken(refresh_token)
  }
}