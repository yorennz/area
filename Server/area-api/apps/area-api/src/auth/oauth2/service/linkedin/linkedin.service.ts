import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Interface } from '../../dto/OAuth2.dto';
import * as queryString from 'querystring'

@Injectable()
export class LinkedInService {
  private getMeUrl: string = "https://api.linkedin.com/v2/userinfo";
  public OAuth2: OAuth2Interface;
  private serviceName: string = "linkedin"
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
    const data = await response.json();
    const parsedData = {
      firstname: data.username,
      type: this.serviceName,
      email: data.email,
    }
    return parsedData;
  }

  async getLoginUrl() {
    const rootUrl = this.config.get(`${this.serviceName}.oauth2.authorization_url`);
    let options: {client_id: string; response_type: string; redirect_uri: string; scope: string; state: string;} = {
      client_id: this.config.get(`${this.serviceName}.client_id`),
      response_type: 'code',
      redirect_uri: this.config.get(`redirect_uri`),
      scope: this.config.get(`${this.serviceName}.loginScope`),
      state: this.serviceName
    };
    return `${rootUrl}?${queryString.stringify(options)}`
  }

  async getAuthUrl(state) {
    const rootUrl = this.config.get(`${this.serviceName}.oauth2.authorization_url`);
    let options: { client_id: string; response_type: string; redirect_uri: string; scope: string; access_type?: string; state: string} = {
      client_id: this.config.get(`${this.serviceName}.client_id`),
      response_type: 'code',
      redirect_uri: this.config.get(`redirect_uri_auth`),
      scope: this.config.get(`${this.serviceName}.authorizationScope`),
      state: state
    };
    return `${rootUrl}?${queryString.stringify(options)}`
  }

  async getAccessToken(code: string, redirect_uri: string) {
    const body = {
      "client_id": this.config.get<string>(`${this.serviceName}.client_id`),
      "client_secret": this.config.get<string>(`${this.serviceName}.client_secret`),
      "grant_type": 'authorization_code',
      "code": code,
      "redirect_uri":redirect_uri,
    };
    const tokenUrl = this.config.get<string>(`${this.serviceName}.oauth2.token_url`)
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body)
    });
    const data = await response.json();
    data.refresh_token = data.access_token // pas sur pour le refresh
    if (response.ok)
      return data
    else
      throw new UnauthorizedException(`Failed to get ${this.serviceName} accessToken`);
  }
}
