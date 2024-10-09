import * as dotenv from 'dotenv';
dotenv.config()

export default () => ({
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    access_type: "offline",
    loginScope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(" "),
    authorizationScope: [
      'https://www.googleapis.com/auth/calendar',
      'https://mail.google.com/',
    ].join(" "),
    oauth2: {
      token_url: process.env.GOOGLE_TOKEN_URL,
      authorization_url: process.env.GOOGLE_AUTH_URL,
    },
    service: {
      name: 'google',
      actions: [
        {
          name: "Calendar's Event Checker",
          description: 'Check change in event list',
          data: {
            calendar_id: "Enter the calendar's id you want",
          },
        },
        {
          name: 'Check new mail',
          description: 'Check last 3 mails to see if you got a new one',
          data: { },
        },
        {
          name: 'Check draft list update',
          description: 'Check if a draft has been deleted or added',
          data: { },
        },
      ],
      reactions: [
        {
          name: 'Create a quickEvent',
          description: "Create a quick event in the user's calendar",
          data: {
            calendar_id: "Enter the calendar's id you want",
            event_name: 'Event name',
          }
        },
      ],
    }
  },
});