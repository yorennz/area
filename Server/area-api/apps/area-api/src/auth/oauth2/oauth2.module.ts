import { Module } from '@nestjs/common';
import { DiscordModule } from './service/discord/discord.module';
import { Oauth2Controller } from './oauth2.controller';
import { Oauth2Service } from './oauth2.service';
import { HashToolService } from '../../utils/hashtool.service';
import { RouterModule } from '@nestjs/core';
import { GoogleModule } from './service/google/google.module';
import { DatabaseModule } from 'apps/area-api/src/database/database.module';
import { SpotifyModule } from './service/spotify/spotify.module';
import { GithubModule } from "./service/github/github.module"
import { FacebookModule } from "./service/facebook/facebook.module"
import { TwitterModule } from "./service/twitter/twitter.module"
import { LinkedInModule } from "./service/linkedin/linkedin.module"
import { TwitchModule } from "./service/twitch/twitch.module"
import { MicrosoftModule } from "./service/microsoft/microsoft.module"
import { NotionModule } from "./service/notion/notion.module"

@Module({
  providers: [Oauth2Service, HashToolService],
  controllers: [Oauth2Controller],
  imports: [DiscordModule, GoogleModule, SpotifyModule, GithubModule, FacebookModule, TwitterModule, LinkedInModule, TwitchModule, MicrosoftModule, NotionModule, DatabaseModule],
})
export class Oauth2Module { }
