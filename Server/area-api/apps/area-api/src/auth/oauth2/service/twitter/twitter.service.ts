import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Interface } from '../../dto/OAuth2.dto';
import * as queryString from 'querystring'

@Injectable()
export class TwitterService {
  private getMeUrl: string = "https://api.twitter.com/2/users/me";
  public OAuth2: OAuth2Interface;
  private serviceName: string = "twitter"
  constructor(private readonly config: ConfigService) {
    this.OAuth2 = {
      getUserInfo: this.getUserInfo.bind(this),
      getAccessToken: this.getAccessToken.bind(this),
      getLoginUrl: this.getLoginUrl.bind(this),
      getAuthUrl: this.getAuthUrl.bind(this)
    }
  }

  async getUserInfo(authData) {
    const response = await fetch(this.getMeUrl, {
      method: 'GET',
      headers: { "Authorization": `Bearer ${authData.access_token}` }
    })
    const data = (await response.json()).data;
    const parsedData = {
      firstname: data.username,
      type: this.serviceName,
      email: data.id
    }
    return parsedData;
  }

  async getLoginUrl() {
    const rootUrl = this.config.get(`${this.serviceName}.oauth2.authorization_url`);
    let options: {client_id: string; response_type: string; redirect_uri: string; scope: string; state: string;code_challenge;code_challenge_method} = {
      client_id: this.config.get(`${this.serviceName}.client_id`),
      response_type: 'code',
      redirect_uri: this.config.get(`redirect_uri`),
      scope: this.config.get(`${this.serviceName}.loginScope`),
      state: this.serviceName,
      code_challenge: "challenge",
      code_challenge_method:"plain",
    };
    return `${rootUrl}?${queryString.stringify(options)}`
  }

  async getAuthUrl(state) {
    const rootUrl = this.config.get(`${this.serviceName}.oauth2.authorization_url`);
    let options = {
      client_id: this.config.get(`${this.serviceName}.client_id`),
      response_type: 'code',
      redirect_uri: this.config.get(`redirect_uri_auth`),
      scope: this.config.get(`${this.serviceName}.authorizationScope`),
      state: state,
      code_challenge: "challenge",
      code_challenge_method:"plain",
    };
    return `${rootUrl}?${queryString.stringify(options)}`
  }

  async getAccessToken(code: string, redirect_uri: string) {
    const client_id = this.config.get<string>(`${this.serviceName}.client_id`)
    const client_secret = this.config.get<string>(`${this.serviceName}.client_secret`)
    const credentials = `${client_id}:${client_secret}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');
    const body = {
      "grant_type": 'authorization_code',
      "client_id": client_id,
      "code": code,
      "code_verifier": 'challenge',
      "redirect_uri": redirect_uri,
    };
    const test = new URLSearchParams(body)
    const tokenUrl = this.config.get<string>(`${this.serviceName}.oauth2.token_url`);
    const response = await fetch(`${tokenUrl}?${test}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base64Credentials}`
      },
   
    });
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
    else {
      throw new UnauthorizedException(`Failed to get ${this.serviceName} accessToken : ${response.status}`);
    }
  }

  public async refreshAccessToken(refresh_token: string) {
    const client_id = this.config.get<string>(`${this.serviceName}.client_id`)
    const client_secret = this.config.get<string>(`${this.serviceName}.client_secret`)
    const authoUrl = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
    try {
      const response = await fetch(this.config.get("twitter.oauth2.token_url"), {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authoUrl}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: client_id,
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        })
      })
      if (response.ok) {
        const data = await response.json()
        return [data.access_token, data.refresh_token]
      }
    } catch (e) {
      throw new Error("Error while trying to refresh twitter refresh token:" + e)
    }
  }
}