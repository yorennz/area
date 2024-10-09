import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TriggerDataSchema } from './schemas/trigger-data.schema'
import { TriggerDatabase } from './trigger_database.service'
import { DatabaseModule } from 'apps/area-api/src/database/database.module'
import { NotionModule } from 'apps/area-api/src/auth/oauth2/service/notion/notion.module'
import { MicrosoftModule } from 'apps/area-api/src/auth/oauth2/service/microsoft/microsoft.module'
import { TwitchModule } from 'apps/area-api/src/auth/oauth2/service/twitch/twitch.module'
import { LinkedInModule } from 'apps/area-api/src/auth/oauth2/service/linkedin/linkedin.module'
import { TwitterModule } from 'apps/area-api/src/auth/oauth2/service/twitter/twitter.module'
import { FacebookModule } from 'apps/area-api/src/auth/oauth2/service/facebook/facebook.module'
import { GithubModule } from 'apps/area-api/src/auth/oauth2/service/github/github.module'
import { SpotifyModule } from 'apps/area-api/src/auth/oauth2/service/spotify/spotify.module'
import { GoogleModule } from 'apps/area-api/src/auth/oauth2/service/google/google.module'
import { DiscordModule } from 'apps/area-api/src/auth/oauth2/service/discord/discord.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'TriggerData', schema: TriggerDataSchema }]),
  //  DiscordModule, GoogleModule, SpotifyModule, GithubModule, FacebookModule, TwitterModule, LinkedInModule, TwitchModule, MicrosoftModule, NotionModule, DatabaseModule
  ],
  providers: [TriggerDatabase],
  exports: [TriggerDatabase],
})
export class TriggerDatabaseModule {}
