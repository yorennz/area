import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TwitterService } from '../../../area-api/src/auth/oauth2/service/twitter/twitter.service'

@Injectable()
export class TwitterReaction {
  public reactionMap: { [key: number | string]: () => void } = {}
  constructor(
    private readonly config: ConfigService,
    private readonly twitterService: TwitterService,
  ) {
    this.reactionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.postNormalTweet.bind(this),
      1: this.deleteTweet.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    return await this.twitterService.refreshAccessToken(refresh_token);
  }

  private async postNormalTweet(access_token: string, datas) {
    const apiUrl: string = 'https://api.twitter.com/2/tweets'
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: datas.tweet,
        })
      })
      if (response.ok) {
        console.log(`Tweet tweeted`)
        return "Unique"
      } else {
        const message = `Unable to post tweet`
        throw new Error(message)
      }
    } catch (e) {
      throw new Error('Error while trying to tweet:' + e)
    }
  }

  private async deleteTweet(access_token: string, datas) {
    const apiUrl: string = `https://api.twitter.com/2/tweets/${datas.tweet_id}`
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        console.log(`Tweet deleted`)
        return "Unique"
      } else {
        const message = `Unable to delete tweet`
        throw new Error(message)
      }
    } catch (e) {
      throw new Error('Error while trying to delete tweet:' + e)
    }
  }
}
