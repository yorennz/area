import { Module } from '@nestjs/common'
import { AreaTriggerService } from './area-trigger.service'
import { DatabaseModule } from 'apps/area-api/src/database/database.module'
import { MongooseModule } from '@nestjs/mongoose'
import { TriggerDatabaseModule } from '../database/trigger_database.module'
// Config Setting
import { ConfigModule, ConfigService } from '@nestjs/config'
import discord_config from '../../../area-api/src/configuration/service/discord_config'
import service_config from '../../../area-api/src/configuration/service_config'
import google_config from '../../../area-api/src/configuration/service/google_config'
import spotify_config from '../../../area-api/src/configuration/service/spotify_config'
import github_config from '../../../area-api/src/configuration/service/github_config'
import facebook_config from '../../../area-api/src/configuration/service/facebook_config'
import twitter_config from '../../../area-api/src/configuration/service/twitter_config'
import linkedin_config from '../../../area-api/src/configuration/service/linkedin_config'
import twitch_config from '../../../area-api/src/configuration/service/twitch_config'
import microsoft_config from '../../../area-api/src/configuration/service/microsoft_config'
import notion_config from '../../../area-api/src/configuration/service/notion_config'
// Module from the server
import { LinkedInModule } from 'apps/area-api/src/auth/oauth2/service/linkedin/linkedin.module'
import { SpotifyModule } from 'apps/area-api/src/auth/oauth2/service/spotify/spotify.module'
import { GithubModule } from 'apps/area-api/src/auth/oauth2/service/github/github.module'
import { DiscordModule } from "../../../area-api/src/auth/oauth2/service/discord/discord.module";
import { TwitterModule } from "../../../area-api/src/auth/oauth2/service/twitter/twitter.module";
import { GoogleModule } from "../../../area-api/src/auth/oauth2/service/google/google.module";
import { TwitchModule } from "../../../area-api/src/auth/oauth2/service/twitch/twitch.module";
import { MicrosoftModule } from 'apps/area-api/src/auth/oauth2/service/microsoft/microsoft.module'
// Action
import { LinkeInAction } from '../action/linkedin.action'
import { DiscordAction } from '../action/discord.action'
import { GithubAction } from '../action/github.action'
import { SpotifyAction } from '../action/spotify.action'
import { NotionAction } from '../action/notion.action'
import { TwitchAction } from "../action/twitch.action";
import { MicrosoftAction } from '../action/microsoft.action'
import { CoingeckoAction } from '../action/coingecko.action'
import { GoogleAction } from "../action/google.action";
import { FacebookAction } from '../action/facebook.action'
import { RiotAction } from '../action/riot.action'
// Reaction
import { GithubReaction } from "../reaction/github.reaction";
import { LinkeInReaction } from '../reaction/linkedin.reaction'
import { NotionReaction } from '../reaction/notion.reaction'
import { SpotifyReaction } from '../reaction/spotify.reaction'
import { TwitchReaction } from "../reaction/twitch.reaction";
import { MicrosoftReaction } from '../reaction/microsoft.reaction'
import { TwitterReaction } from "../reaction/twitter.reaction";
import { GoogleReaction } from "../reaction/google.reaction";
import coingecko_config from 'apps/area-api/src/configuration/service/coingecko_config'
import riot_config from 'apps/area-api/src/configuration/service/riot_config'

console.log(process.env.DB_URI)
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [discord_config, service_config, google_config, spotify_config, github_config, facebook_config, twitter_config, linkedin_config, twitch_config, microsoft_config, notion_config, coingecko_config, riot_config],
    }),
    MongooseModule.forRoot(process.env.DB_URI || "mongodb+srv://josephyu31:hfZkzLd7HRzXcNtx@cluster0.rcjrk3v.mongodb.net/?retryWrites=true&w=majority", {
      serverSelectionTimeoutMS: 1000,
    }),
    DatabaseModule,
    TriggerDatabaseModule,
    SpotifyModule,
    GithubModule,
    LinkedInModule,
    TwitchModule,
    DiscordModule,
    MicrosoftModule,
    TwitterModule,
    GoogleModule
  ],
  providers: [
    // Misc
    AreaTriggerService, ConfigService,
    // Action
    SpotifyAction,
    GithubAction,
    LinkeInAction,
    NotionAction,
    DiscordAction,
    MicrosoftAction,
    FacebookAction,
    CoingeckoAction,
    GoogleAction,
    TwitchAction,
    RiotAction,
    // Reaction
    SpotifyReaction,
    GithubReaction,
    LinkeInReaction,
    NotionReaction,
    TwitchReaction,
    NotionReaction,
    SpotifyReaction,
    MicrosoftReaction,
    TwitterReaction,
    GoogleReaction
  ],
  exports: [AreaTriggerService],
})
export class AreaTriggerModule {}
