import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Interface } from '../../dto/OAuth2.dto';
import * as queryString from 'querystring'

@Injectable()
export class GithubService {
  private getMeUrl: string = 'https://api.github.com/user'
  public OAuth2: OAuth2Interface;
  private serviceName: string = "github"
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
      headers: { "Authorization": `Bearer ${authData.access_token}`, "X-GitHub-Api-Version": "2022-11-28" }
    })
    const data = await response.json();
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      method: 'GET',
      headers: { "Authorization": `Bearer ${authData.access_token}`, "X-GitHub-Api-Version": "2022-11-28", "Accept": "application/vnd.github+json" }
    })
    const email = await emailResponse.json()
    const parsedData = {
      firstname: data.name,
      type: this.serviceName,
      email: email[0].email
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
      client_id: this.config.get(`${this.serviceName}.client_id_auth`),
      response_type: 'code',
      redirect_uri: this.config.get(`redirect_uri_auth`),
      scope: this.config.get(`${this.serviceName}.authorizationScope`),
      state: state
    };
    return `${rootUrl}?${queryString.stringify(options)}`
  }

  async getAccessToken(code: string, redirect_uri: string) {
    var client_id;
    var client_secret;
    if (redirect_uri == this.config.get("redirect_uri_auth")) {
      client_id = this.config.get<string>(`${this.serviceName}.client_id_auth`)
      client_secret = this.config.get<string>(`${this.serviceName}.client_secret_auth`)
    }
    else {
      client_id = this.config.get<string>(`${this.serviceName}.client_id`)
      client_secret = this.config.get<string>(`${this.serviceName}.client_secret`)
    }
      const body = {
      "client_id": client_id,
      "client_secret": client_secret,
      "code": code,
      "redirect_uri":redirect_uri,
    };
    const tokenUrl = this.config.get<string>(`${this.serviceName}.oauth2.token_url`)
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', "Accept": "application/json"},
      body: new URLSearchParams(body)
    });
    const data = await response.json();
    if (response.ok) 
    {
      data.refresh_token = data.access_token;
      return data
    }
    else
      throw new UnauthorizedException(`Failed to get ${this.serviceName} accessToken`);
  }

}
