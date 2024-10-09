import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DiscordService } from './service/discord/discord.service';
import { ConfigService } from '@nestjs/config';
import { UserDatabaseService } from '../../database/users_database.service';
import { HashToolService } from '../../utils/hashtool.service';
import { GoogleService } from './service/google/google.service';
import { SpotifyService } from './service/spotify/spotify.service';
import mongoose from 'mongoose';
import { ResponseDto } from '../users/dto/response.dto';
import { OAuth2Interface } from "./dto/OAuth2.dto"
import { GithubService } from './service/github/github.service';
import { FacebookService } from './service/facebook/facebook.service';
import { TwitterService } from './service/twitter/twitter.service';
import { LinkedInService } from './service/linkedin/linkedin.service';
import { TwitchService } from './service/twitch/twitch.service';
import { MicrosoftService } from './service/microsoft/microsoft.service';
import { NotionService } from './service/notion/notion.service';
import { AreaDatabaseService } from '../../database/areas_database.service';
import { Interval } from '@nestjs/schedule';
@Injectable()
export class Oauth2Service {
  private userServiceMap: { [key: string]: OAuth2Interface };

  constructor(
    private readonly discord: DiscordService,
    private readonly google: GoogleService,
    private readonly spotify: SpotifyService,
    private readonly github: GithubService,
    private readonly facebook: FacebookService,
    private readonly twitter: TwitterService,
    private readonly linkedin: LinkedInService,
    private readonly twitch: TwitchService,
    private readonly microsoft: MicrosoftService,
    private readonly notion: NotionService,
    private readonly config: ConfigService,
    private readonly hashService: HashToolService,
    private readonly userDatabase: UserDatabaseService,
    private readonly areaDatabase: AreaDatabaseService,
  ) {
    this.userServiceMap = {
      discord: this.discord.OAuth2,
      google: this.google.OAuth2,
      spotify: this.spotify.OAuth2,
      github: this.github.OAuth2,
      facebook: this.facebook.OAuth2,
      twitter: this.twitter.OAuth2,
      linkedin: this.linkedin.OAuth2,
      twitch: this.twitch.OAuth2,
      microsoft: this.microsoft.OAuth2,
      notion: this.notion.OAuth2,
    };
  }

  async getUrl(serviceName: string, type: string, state) {
    if (!this.userServiceMap.hasOwnProperty(serviceName.toLocaleLowerCase())) {
      throw new NotFoundException(`${serviceName} is not handled by our app`)
    }
    if (type == "Login")
      return await this.userServiceMap[serviceName].getLoginUrl();
    else 
      return await this.userServiceMap[serviceName].getAuthUrl(state);
  }

  async getOAuth2Data(code : string, serviceName: string) {
    const data = await this.userServiceMap[serviceName].getAccessToken(code, this.config.get(`redirect_uri`));
    const userInfo : any = await this.userServiceMap[serviceName].getUserInfo(data);
    return userInfo;
  }

  async handleServiceData(query): Promise<string> {
    try {
      const data = await this.getOAuth2Data(query.code, query.state);
      const token = await this.saveServiceData(data);
      return token;
    } catch (err) {
      console.log('error OAuth2:', err.message);
      const status = err.status ? err.status : 500;
      throw new ResponseDto(err.message, status)
    }
  }

  async saveServiceData(data): Promise<string> {
    const [token, tokenHash] = await this.hashService.genToken(data.email);
    data.token = tokenHash;
    try {
      await this.userDatabase.create(data);
    } catch (err) {
      if (err.code === 11000) {// This will crush the actual service Token {}
        await this.changeServiceToken(data.email, data.type, data.token);
      }
      else console.log('MongoDB error:', err.message);
    }
    return token;
  }

  async changeServiceToken(email: string, type: string, token: string) {
    const user = await this.userDatabase.findAndUpdateUserServiceToken(email, type, token);
  }

  async saveAuthorizationToken(code, stateData) {
    const token = await this.userServiceMap[stateData.service].getAccessToken(code, this.config.get(`redirect_uri_auth`))
    await this.areaDatabase.insertServiceAuthorization(stateData.areaId, stateData.service, token.refresh_token);
  }

  async deleteAuthorizationToken(areaId: mongoose.Types.ObjectId, service: string): Promise<boolean> {  
    return await this.areaDatabase.findAndDeleteServiceAuthorization(areaId, service);
  }

  async getServiceAuthorization(areaId: mongoose.Types.ObjectId) {
    const area = await this.areaDatabase.findArea(areaId);
    const auth = []
    for (const [key, value] of area.serviceAuthorization.entries())
      auth.push(key)
    return {"Authorizations": auth};
  }
}