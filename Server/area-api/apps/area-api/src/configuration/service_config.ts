import * as dotenv from 'dotenv';

dotenv.config();

const redirect = process.env.REDIRECT_URI || "http://localhost:8080"
export default () => ({
  service_name: {
    discord: 'discord',
    google: 'google',
    spotify: 'spotify',
    github: 'github',
    facebook: 'facebook',
    twitter: 'twitter',
    linkedin: 'linkedin',
    twitch: 'twitch',
    microsoft: 'microsoft',
    notion: 'notion',
  },
  service_array: ["discord", "google", "spotify", "github", "facebook", "twitter", "linkedin", "twitch", "microsoft", "notion"],
  redirect_uri: `${redirect}/oauth2/save`,
  redirect_uri_auth: `${redirect}/oauth2/save-authorization`,
});
