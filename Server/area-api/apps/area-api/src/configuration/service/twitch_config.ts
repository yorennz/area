import * as dotenv from 'dotenv';
dotenv.config()

export default () => ({
  twitch: {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    loginScope: [
      'user:read:email',
    ].join(" "),
    authorizationScope: [
      'analytics:read:extensions',
      'analytics:read:games',
      'bits:read',
      'channel:manage:ads',
      'channel:manage:broadcast',
      'channel:read:charity',
      'channel:edit:commercial',
      'channel:read:editors',
      'channel:manage:extensions',
      'channel:read:goals',
      'channel:read:guest_star',
      'channel:manage:guest_star',
      'channel:read:hype_train',
      'channel:manage:moderators',
      'channel:read:polls',
      'channel:manage:polls',
      'channel:read:predictions',
      'channel:manage:predictions',
      'channel:manage:raids',
      'channel:read:redemptions',
      'channel:manage:redemptions',
      'channel:manage:schedule',
      'channel:read:stream_key',
      'channel:read:subscriptions',
      'channel:manage:videos',
      'channel:read:vips',
      'clips:edit',
      'moderation:read',
      'moderator:manage:announcements',
      'moderator:manage:automod',
      'moderator:read:automod_settings',
      'moderator:manage:automod_settings',
      'moderator:manage:banned_users',
      'moderator:read:blocked_terms',
      'moderator:manage:blocked_terms',
      'moderator:manage:chat_messages',
      'moderator:read:chat_settings',
      'moderator:manage:chat_settings',
      'moderator:read:chatters',
      'moderator:read:followers',
      'moderator:read:guest_star',
      'moderator:manage:guest_star',
      'moderator:read:shield_mode',
      'moderator:manage:shield_mode',
      'moderator:read:shoutouts',
      'moderator:manage:shoutouts',
      'user:edit',
      'user:edit:follows',
      'user:read:blocked_users',
      'user:manage:blocked_users',
      'user:read:broadcast',
      'user:manage:chat_color',
      'user:read:email',
      'user:read:follows',
      'user:read:subscriptions',
      'user:manage:whispers',
      'channel:moderate',
      'channel:read:ads',
      'chat:edit',
      'chat:read',
      'whispers:read',
      'whispers:edit',]
.join(" "),
    oauth2: {
      token_url: process.env.TWITCH_TOKEN_URL,
      authorization_url: process.env.TWITCH_AUTH_URL,
    },
    service: {
      name: 'twitch',
      actions: [
        {
          name: 'Own streamer sub goal',
          description: 'The user is able to set his own sub goal for a streamer',
          data: {
            broadcaster_id: "The id of the streamer you want to set the goal for",
            subGoal: "The goal you want to set",
          }
        },
        {
          name: 'Get updated on schedule update',
          description: "A trigger will be activated when the streamer's schedule get updated",
          data: {
            broadcaster_id: 'The id of the streamer you want to set the goal for',
          },
        },
      ],
      reactions: [
      ],
    }
  },
});