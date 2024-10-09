import discord_config from "./service/discord_config"
import google_config from "./service/google_config"
import spotify_config from "./service/spotify_config"
import github_config from "./service/github_config"
import facebook_config from "./service/facebook_config"
import twitter_config from "./service/twitter_config"
import linkedin_config from "./service/linkedin_config"
import twitch_config from "./service/twitch_config"
import microsoft_config from "./service/microsoft_config"
import notion_config from "./service/notion_config"
import coingecko_config from "./service/coingecko_config"
import riot_config from "./service/riot_config"

const discordConfig = discord_config()
const googleConfig = google_config()
const spotifyConfig = spotify_config()
const githubConfig = github_config()
const facebookConfig = facebook_config()
const twitterConfig = twitter_config()
const linkedinConfig = linkedin_config()
const twitchConfig = twitch_config()
const microsoftConfig = microsoft_config()
const notionConfig = notion_config()
const coingeckoConfig = coingecko_config()
const riotConfig = riot_config()
export default {
  services: [
    discordConfig.discord.service,
    googleConfig.google.service,
    spotifyConfig.spotify.service,
    githubConfig.github.service,
    facebookConfig.facebook.service,
    twitterConfig.twitter.service,
    linkedinConfig.linkedin.service,
    twitchConfig.twitch.service,
    microsoftConfig.microsoft.service,
    notionConfig.notion.service,
    coingeckoConfig.coingecko.service,
    riotConfig.riot.service,
  ],
};
