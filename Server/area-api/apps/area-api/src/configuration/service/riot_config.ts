import * as dotenv from 'dotenv';
dotenv.config()

export default () => ({
  riot: {
    api_key: process.env.RIOT_API_KEY,
    service: {
      name: 'riot',
      actions: [
        {
          name: 'level_up',
          description: 'Trigger when the user level up - available only for EUW',
          data: {
            name:"The username of the summoner",
           }
        },
        {
          name: 'level_up_target',
          description: 'Trigger when the user level up to a target level - available only for EUW',
          data: {
            name:"The username of the summoner",
            input:"The target level",
           }
        },
        {
          name: 'player_in_normal_game',
          description: 'Trigger when the player is in normal game - available only for EUW',
          data: {
            name:"The username of the summoner",
           }
        },
        {
          name: 'player_in_game_custom_game',
          description: 'Trigger when the player is in custom_game - available only for EUW',
          data: {
            name:"The username of the summoner",
           }
        },
      ],
      reactions: [
      ],
    }
  },
});
