import * as dotenv from 'dotenv';
dotenv.config()

export default () => ({
  linkedin: {
    api_version: process.env.LINKEDIN_API_VERSION,
    protocol_version: process.env.LINKEDIN_PROTOCOL_VERSION,
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    loginScope: [
      'profile',
      'email',
      'w_member_social',
      "openid"
    ].join(" "),
    authorizationScope: [
      'profile',
      'email',
      'w_member_social',
      "openid"
    ].join(" "),
    oauth2: {
      token_url: process.env.LINKEDIN_TOKEN_URL,
      authorization_url: process.env.LINKEDIN_AUTH_URL,
    },

    // Discord Service Action Reaction
    service: {
      name: 'linkedin',
      actions: [
        {
          name: 'name_changed_trigger',
          description: 'trigger when the user change his name',
          data: {}
        },
        {
          name: 'family_name_changed_trigger',
          description: 'trigger when the user change his family name',
          data: {}
        },
        {
          name: 'specific_name_trigger',
          description: 'trigger when the user name is equal to the trigger name',
          data: { trigger_name: "The trigger family name"}
        },
        {
          name: 'specific_family_name_trigger',
          description: 'trigger when the user family_name is equal to the trigger name',
          data: {
            trigger_name: "The trigger family name"
          }
        },
      ],
      reactions: [
        { // 0: this.createPublicShareOnLinkedin.bind(this),
          name: 'post_public_share_linkedin',
          description: 'The user post a share on linkedin, visibily: public',
          data: {
            commentary:"The shared commentary",
            url: "A shared url *optional*",
            url_title: "A title for your URL *optional*",
            url_description: "A description for your URL *optional*",
          }
        },
        { // 1: this.createPrivateShareOnLinkedin.bind(this),
          name: 'post_private_share_linkedin',
          description: 'The user post a share on linkedin | visibily: connections',
          data: {
            commentary:"The shared commentary",
            url: "A shared url *optional*",
            url_title: "A title for your URL *optional*",
            url_description: "A description for your URL *optional*",
          }
        },
      ],
    }
  },
});