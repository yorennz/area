import { Injectable } from '@nestjs/common'
import { SpotifyService } from 'apps/area-api/src/auth/oauth2/service/spotify/spotify.service'
import { triggerData } from '../trigger/area-trigger.service'

@Injectable()
export class SpotifyAction {
  private newSong = []
  public actionMap: { [key: number | string]: () => void } = {}

  constructor(public readonly spotifyService: SpotifyService) {
    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.playlistTrigger.bind(this),
      1: this.checkArtist.bind(this),
      2: this.checkUserFollower.bind(this),
    }
  }

  async callRefreshToken(refresh_token: string) {
    return await this.spotifyService.refreshAccessToken(refresh_token)
  }

  async playlistTrigger(access_token, datas, actionData) {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${datas.playlist_id}/tracks`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Content-Type": "application/json"
        },
      })
      if (response.ok) {
        const trigger: triggerData = { trigger: false, data:null}
        const data = await response.json()
        if (actionData === undefined) {
          return {data: data.total, trigger: false}
        }
        if (data.total != actionData.data) {
          trigger.data = data.total
          trigger.trigger = true
        }
        return trigger
      } else {
        console.log('Request failed with status:', response.status)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  private async checkArtist(access_token: string, datas, actionData) {
    const apiUrl: string = 'https://api.spotify.com/v1/me/player/currently-playing'
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      const trigger: triggerData = { trigger: false, data:null}
      if (response.status == 200) {
        const data = await response.json()
        if (data.item.artists.map((artist) => {
            if (artist.id == datas.artist_id)
              return true
            return false
          }).indexOf(true) != -1) {
          trigger.trigger = true
          return trigger
        }
        return trigger
      } else {
        return trigger
      }
    } catch (e) {
    }
  }

  private async checkUserFollower(access_token: string, datas, actionData) {
    const apiUrl = 'https://api.spotify.com/v1/me'
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {Authorization: `Bearer ${access_token}`},
      })
      if (response.ok) {
        const data = await response.json()
        if (actionData === undefined)
          return {data: data.followers.total, trigger: false}
        if (data.followers.total != actionData.data)
          return {data: data.followers.total, trigger: true}
        return {data: data.followers.total, trigger: false}
      }
    } catch (e) {
    }
  }
}
