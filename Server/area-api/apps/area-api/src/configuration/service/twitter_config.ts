
import * as dotenv from 'dotenv';
dotenv.config()

export default () => ({
    twitter: {
      client_id: process.env.TWITTER_CLIENT_ID,
      client_secret: process.env.TWITTER_CLIENT_SECRET,
      loginScope: [
        'users.read',
        'offline.access',
        'tweet.read',
        'follows.read',
        'follows.write',
      ].join(" "),
      authorizationScope: [
        'users.read',
        'offline.access',
        'tweet.read',
        'follows.read',
        'follows.write',
        'tweet.write',
        'follows.write',
      ].join(" "),
      oauth2: {
          token_url: process.env.TWITTER_TOKEN_URL,
          authorization_url: process.env.TWITTER_AUTH_URL,
      },
      service: {
        name: 'twitter',
        actions: [
        ],
        reactions: [
          {
            name: 'Tweet a normal tweet',
            description: 'Tweet a normal tweet',
            data: {
              tweet: 'Message you want to tweet',
            },
          },
          {
            name: 'Delete a tweet',
            description: 'Delete a tweet by providing its id',
            data: {
              tweet_id: 'Tweet id',
            },
          },
        ],
      }
    }
  })
