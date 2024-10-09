import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as queryString from 'querystring'
import { OAuth2Interface } from '../../dto/OAuth2.dto'

@Injectable()
export class SpotifyService {
  public OAuth2: OAuth2Interface
  private serviceName: string = 'spotify'
  constructor(private readonly config: ConfigService) {
    this.OAuth2 = {
      getUserInfo: this.getUserInfo.bind(this),
      getAccessToken: this.getAccessToken.bind(this),
      getLoginUrl: this.getLoginUrl.bind(this),
      getAuthUrl: this.getAuthUrl.bind(this),
    }
  }
  async getUserInfo(token) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token.access_token}` },
    })
    const data = await response.json()
    const parsedData = {
      firstname: data.display_name,
      type: 'spotify',
      email: data.email,
    }
    return parsedData
  }
  async getLoginUrl() {
    const rootUrl = this.config.get(`${this.serviceName}.oauth2.authorization_url`)
    const options: { client_id: string; response_type: string; redirect_uri: string; scope: string; state: string } = {
      client_id: this.config.get(`${this.serviceName}.client_id`),
      response_type: 'code',
      redirect_uri: this.config.get(`redirect_uri`),
      scope: this.config.get(`${this.serviceName}.loginScope`),
      state: this.serviceName,
    }
    return `${rootUrl}?${queryString.stringify(options)}`
  }

  async getAuthUrl(state) {
    const rootUrl = this.config.get(`${this.serviceName}.oauth2.authorization_url`)
    const options: { client_id: string; response_type: string; redirect_uri: string; scope: string; access_type?: string; state: string } = {
      client_id: this.config.get(`${this.serviceName}.client_id`),
      response_type: 'code',
      redirect_uri: this.config.get(`redirect_uri_auth`),
      scope: this.config.get(`${this.serviceName}.authorizationScope`),
      state: state,
    }
    return `${rootUrl}?${queryString.stringify(options)}`
  }

  async getAccessToken(code: string, redirect_uri: string) {
    const body = {
      client_id: this.config.get<string>(`${this.serviceName}.client_id`),
      client_secret: this.config.get<string>(`${this.serviceName}.client_secret`),
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri,
    }
    const tokenUrl = this.config.get<string>(`${this.serviceName}.oauth2.token_url`)
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body),
    })
    const data = await response.json()
    if (response.ok) return data
    else throw new UnauthorizedException(`Failed to get ${this.serviceName} accessToken`)
  }

  public async refreshAccessToken(refreshToken: string) {
    try {
      const response = await fetch(this.config.get('spotify.oauth2.token_url'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.get('spotify.client_id'),
          client_secret: this.config.get('spotify.client_secret'),
        }),
      })
      const data = await response.json()
      if (response.ok) {
        return [data.access_token, refreshToken] as const
      } else
        throw new Error(`Failed to refresh access token. Error: ${data.error}`)
    } catch (error) {
      throw new Error(`Error refreshing access token: ${error.message}`)
    }
  }
}
