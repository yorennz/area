import * as dotenv from 'dotenv';
dotenv.config()

export default () => ({
  facebook: {
    client_id: process.env.FACEBOOK_CLIENT_ID,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
    loginScope: [
      'email',
    ].join(" "),
    authorizationScope: [
      "email", 
      "public_profile", 
      "user_friends", 
      "user_hometown", 
      "user_birthday",
      "user_age_range",
      "user_gender",
      "user_likes",
      "user_link",
      "user_location",
      "user_videos",
      "user_posts",
      "user_photos",
    ].join(" "),
    oauth2: {
      token_url: process.env.FACEBOOK_TOKEN_URL,
      authorization_url: process.env.FACEBOOK_AUTH_URL,
      refresh_token_url: process.env.FACEBOOK_TOKEN_URL,
    },

    // Discord Service Action Reaction
    service: {
      name: 'facebook',
      actions: [
        {
          name: 'new_friend',
          description: 'User got a new friend',
          data: { }
        },
        {
          name: 'delete_friend',
          description: 'User delete friend',
          data: { }
        },
      ],
      reactions: [
      ],
    }
  },
});