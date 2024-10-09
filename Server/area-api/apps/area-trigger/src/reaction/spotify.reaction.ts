import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SpotifyService } from '../../../area-api/src/auth/oauth2/service/spotify/spotify.service'

@Injectable()
export class SpotifyReaction {
  public reactionMap: { [key: number | string]: () => void } = {}
  constructor(
    private readonly config: ConfigService,
    private readonly spotifyService: SpotifyService,
  ) {
    this.reactionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.pauseUserPlayback.bind(this),
      1: this.startUserPlayback.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    return await this.spotifyService.refreshAccessToken(refresh_token)
  }

  private async pauseUserPlayback(access_token: string, datas) {
    const apiUrl = 'https://api.spotify.com/v1/me/player/pause'
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: headers,
      })
      if (response.ok) {
        console.log(`User playback state set to pause`)
        return ''
      } else {
        if (response.status == 403)
          return ''
        const response_data = await response.json()
        const message = `Unable to stop user's playback: ${response_data.message}`
        throw new Error(message)
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  private async startUserPlayback(access_token: string, datas) {
    const apiUrl = 'https://api.spotify.com/v1/me/player/play'
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: headers,
      })
      if (response.ok) {
        console.log(`User's playback state set to playing`)
        return ''
      } else {
        if (response.status == 403)
          return ''
        const response_data = await response.json()
        const message = `Unable to start user's playback: ${response_data.message}`
        throw new Error(message)
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }
}
