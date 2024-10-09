import * as dotenv from 'dotenv';
dotenv.config()

export default () => ({
  discord: {
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    loginScope: [
      'identify',
      'email',
    ].join(" "),
    permission:"3072",
    authorizationScope: [
      "applications.builds.read",
      "applications.commands.permissions.update",
      "applications.entitlements",
      "applications.store.update",
      "connections",
      "email",
      "gdm.join",
      "guilds",
      "guilds.join",
      "guilds.members.read",
      "identify",
      "messages.read",
      "role_connections.write",
    ].join(" "),
    oauth2: {
      token_url: process.env.DISCORD_TOKEN_URL,
      authorization_url: process.env.DISCORD_AUTH_URL,
    },
    // Discord Service Action Reaction
    service: {
      name: 'discord',
      actions: [
        {
          name: 'user_joined_a_guild',
          description: 'Trigger when user join a guild',
          data: { }
        },
        {
          name: 'user_leaved_a_guild',
          description: 'Trigger when user leave a guild',
          data: { }
        },
        {
          name: 'user_added_a_connection',
          description: 'Trigger when user connect to a new service',
          data: { }
        },
        {
          name: 'user_deleted_a_connection',
          description: 'Trigger when user delete a service',
          data: { }
        },
        {
          name: 'user_added_a_specific_connection',
          description: 'Trigger when user connect to a new service that is equal to your input',
          data: { 
            input: "The service connection you want to trigger"
          }
        },
        {
          name: 'user_number_of_connection',
          description: 'Trigger when user has a N number of connection',
          data: { 
            input: "The number of connection you want to trigger"
          }
        },
        {
          name: 'user_new_role_added_in_guild',
          description: 'Trigger when user added one role in a guild',
          data: { 
            guild_id:"The guild id where you want to trigger roles"
          }
        },
        {
          name: 'user_specific_number_of_role_in_guild',
          description: 'Trigger when user has N role in a guild',
          data: {
            guild_id:"The guild id where you want to trigger roles",
            input: "The number of role in the guild you want to trigger"
           }
        },
        {
          name: 'user_specific_number_of_guild',
          description: 'Trigger when user has N number of guild',
          data: {
            input:"The number of guild that you want to trigger"
           }
        },
        {
          name: 'user_username',
          description: 'Trigger when username is changed',
          data: {}
        },
        {
          name: 'user_specific_username',
          description: 'Trigger when username is changed and equal to your input',
          data: {
            input:"The username that you want to trigger"
          }
        },
      ],
      reactions: [
      ],
    }
  },
});