import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaModule } from './area/area.module';
import { ScheduleModule } from '@nestjs/schedule';
import discord_config from './configuration/service/discord_config';
import service_config from './configuration/service_config';
import google_config from './configuration/service/google_config';
import spotify_config from './configuration/service/spotify_config';
import github_config from './configuration/service/github_config';
import facebook_config from './configuration/service/facebook_config';
import twitter_config from './configuration/service/twitter_config';
import linkedin_config from './configuration/service/linkedin_config';
import twitch_config from './configuration/service/twitch_config';
import microsoft_config from './configuration/service/microsoft_config';
import notion_config from './configuration/service/notion_config';
import coingecko_config from './configuration/service/coingecko_config';
import riot_config from './configuration/service/riot_config';

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    AuthModule, AreaModule, 
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [discord_config, service_config, google_config, spotify_config, github_config, facebook_config, twitter_config, linkedin_config, twitch_config, microsoft_config, notion_config, coingecko_config, riot_config],
    }),
    MongooseModule.forRoot(process.env.DB_URI || "mongodb+srv://josephyu31:hfZkzLd7HRzXcNtx@cluster0.rcjrk3v.mongodb.net/?retryWrites=true&w=majority", {
      serverSelectionTimeoutMS: 1000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
