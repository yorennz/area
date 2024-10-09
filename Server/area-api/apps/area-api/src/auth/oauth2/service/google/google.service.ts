import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as queryString from 'querystring'
import { OAuth2Interface } from '../../dto/OAuth2.dto';

@Injectable()
export class GoogleService {
  tokenURL: string = this.config.get<string>('google.oauth2.tokenURL');
  callURL: string = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='

  public OAuth2: OAuth2Interface;

  constructor(private readonly config: ConfigService) {
    this.OAuth2 = {
      getUserInfo: this.getUserInfo.bind(this),
      getAccessToken: this.getAccessToken.bind(this),
      getLoginUrl: this.getLoginUrl.bind(this),
      getAuthUrl: this.getAuthUrl.bind(this)
    }
  }

  async getUserInfo(authData) {
    const response = await fetch( `${this.callURL}${authData.access_token}`, {
      method: 'GET',
      headers: { "Authorization": `Bearer ${authData.id_token}` }
    })
    const data = await response.json();
    const parsedData = {
      firstname: data.given_name,
      type: "google",
      email: data.email
    }
    return parsedData;
  }

  async getLoginUrl() {
    const rootUrl = this.config.get("google.oauth2.authorization_url");
    let options: {client_id: string; response_type: string; redirect_uri: string; scope: string; state: string;access_type?: string;} = {
      client_id: this.config.get(`google.client_id`),
      response_type: 'code',
      redirect_uri: this.config.get(`redirect_uri`),
      scope: this.config.get(`google.loginScope`),
      access_type: this.config.get<string>('google.access_type'),
      state: "google"
    };
    return `${rootUrl}?${queryString.stringify(options)}`
  }

  async getAuthUrl(state) {
    const rootUrl = this.config.get("google.oauth2.authorization_url");
    let options: { client_id: string; response_type: string; redirect_uri: string; scope: string; access_type?: string; state: string} = {
      client_id: this.config.get(`google.client_id`),
      response_type: 'code',
      redirect_uri: this.config.get(`redirect_uri_auth`),
      scope: this.config.get(`google.authorizationScope`),
      state: state,
      access_type: this.config.get<string>('google.access_type'),
    };
    return `${rootUrl}?${queryString.stringify(options)}`
  }

  async getAccessToken(code: string, redirect_uri: string) {
    const body = {
      "client_id": this.config.get<string>(`google.client_id`),
      "client_secret": this.config.get<string>(`google.client_secret`),
      "grant_type": 'authorization_code',
      "code": code,
      "redirect_uri":redirect_uri,
    };
    const tokenUrl = this.config.get<string>(`google.oauth2.token_url`)
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body)
    });
    const data = await response.json();
    if (response.ok) {
      if (!data.refresh_token)
        data.refresh_token = data.access_token
      return data
    }
    else
      throw new UnauthorizedException(`Failed to get google accessToken`);
  }

  public async refreshAccessToken(refresh_token: string) {
    const apiUrl: string = this.config.get('google.oauth2.token_url')
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.config.get<string>(`google.client_id`),
          client_secret: this.config.get<string>(`google.client_secret`),
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        return [data.access_token, refresh_token]
      }
      throw new Error('')
    } catch (e) {
      throw new Error('Error while refreshing google access_token:' + e)
    }
  }
}