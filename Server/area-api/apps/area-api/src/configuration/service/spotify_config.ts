import * as dotenv from 'dotenv';
dotenv.config()

export default () => ({
  spotify: {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    loginScope: ['user-read-email', 'user-read-private'].join(' '),
    authorizationScope: [
      // User Informations scope
      'user-read-email',
      'user-follow-read',
      // Playlist scope
      'user-read-playback-state',
      'playlist-read-private',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'user-library-read',
      'playlist-read-collaborative',
      // History scope
      'user-read-recently-played',
      'user-top-read',
      'user-read-playback-position',
    ].join(' '),
    oauth2: {
      token_url: process.env.SPOTIFY_TOKEN_URL,
      authorization_url: process.env.SPOTIFY_AUTH_URL,
    },
    service: {
      name: 'spotify',
      actions: [
        {
          name: 'Spotify Playlist Update',
          description: 'Get notified when playlist get updated',
          data: {
            playlist_id: 'Id of the playlist the user want news onto',
          }
        },
        {
          name: 'Spotify check playlist',
          description: 'Get notified when an user is listening to an artist',
          data: {
            artist_id: 'Id of the artist the user to be notified when listening to',
          },
        },
        {
          name: "Spotify check user's follower",
          description: "Triggers when user's follower count change",
          data: {},
        },
      ],
      reactions: [
        {
          name: 'Spotify pause track',
          description: "Pause the user's track",
          data: {},
        },
        {
          name: 'Spotify play track',
          description: "Play the user's track",
          data: {},
        },
      ],
    },
  },
})
