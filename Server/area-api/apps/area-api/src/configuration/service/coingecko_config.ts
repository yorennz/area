import * as dotenv from 'dotenv';
dotenv.config()

export default () => ({
  coingecko: {
    api_key: process.env.COINGECKO_API_KEY,
    service: {
      name: 'coingecko',
      actions: [
        {
          name: 'crypto_price_alert_up',
          description: 'Trigger when the price is higher than your input',
          data: {
            currency:"The crypto currency that you want to trigger",
            price:"The reference price, "
           }
        },
        {
          name: 'crypto_price_alert_down',
          description: 'Trigger when the price is lower than your input',
          data: {
            currency:"The crypto currency that you want to trigger",
            price:"The reference price, "
           }
        },
        {
          name: 'crypto_market_alert_up',
          description: 'Trigger when the marketcap is higher than your input',
          data: {
            currency:"The crypto currency that you want to trigger",
            marketcap:"The marketcap reference, "
           }
        },
        {
          name: 'crypto_market_alert_down',
          description: 'Trigger when the marketcap is lower than your input',
          data: {
            currency:"The crypto currency that you want to trigger",
            marketcap:"The marketcap reference, "
           }
        },
        {
          name: 'btc_dominance_up',
          description: 'Trigger when the btc dominance is higher than your input',
          data: {
            percentage:"The crypto currency that you want to trigger",
           }
        },
        {
          name: 'btc_dominance_down',
          description: 'Trigger when the btc dominance is lower than your input',
          data: {
            percentage:"The percentage that you want to trigger",
           }
        },
        {
          name: 'eth_dominance_up',
          description: 'Trigger when the eth dominance is higher than your input',
          data: {
            percentage:"The crypto currency that you want to trigger",
           }
        },
        {
          name: 'eth_dominance_down',
          description: 'Trigger when the eth dominance is lower than your input',
          data: {
            percentage:"The percentage that you want to trigger",
           }
        },
        {
          name: 'bnb_dominance_up',
          description: 'Trigger when the bnb dominance is higher than your input',
          data: {
            percentage:"The crypto currency that you want to trigger",
           }
        },
        {
          name: 'bnb_dominance_down',
          description: 'Trigger when the bnb dominance is lower than your input',
          data: {
            percentage:"The percentage that you want to trigger",
           }
        },
        {
          name: 'usdt_dominance_up',
          description: 'Trigger when the usdt dominance is higher than your input',
          data: {
            percentage:"The crypto currency that you want to trigger",
           }
        },
        {
          name: 'usdt_dominance_down',
          description: 'Trigger when the usdt dominance is lower than your input',
          data: {
            percentage:"The percentage that you want to trigger",
           }
        },
        {
          name: 'xrp_dominance_up',
          description: 'Trigger when the xrp dominance is higher than your input',
          data: {
            percentage:"The crypto currency that you want to trigger",
           }
        },
        {
          name: 'xrp_dominance_down',
          description: 'Trigger when the xrp dominance is lower than your input',
          data: {
            percentage:"The percentage that you want to trigger",
           }
        },
        {
          name: 'usdc_dominance_up',
          description: 'Trigger when the usdc dominance is higher than your input',
          data: {
            percentage:"The crypto currency that you want to trigger",
           }
        },
        {
          name: 'usdc_dominance_down',
          description: 'Trigger when the usdc dominance is lower than your input',
          data: {
            percentage:"The percentage that you want to trigger",
           }
        },
        {
          name: 'sol_dominance_up',
          description: 'Trigger when the sol dominance is higher than your input',
          data: {
            percentage:"The crypto currency that you want to trigger",
           }
        },
        {
          name: 'sol_dominance_down',
          description: 'Trigger when the sol dominance is lower than your input',
          data: {
            percentage:"The percentage that you want to trigger",
           }
        },
      ],
      reactions: [
      ],
    }
  },
});