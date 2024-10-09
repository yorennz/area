import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { triggerData } from '../trigger/area-trigger.service'

@Injectable()
export class CoingeckoAction {
  public actionMap: { [key: number | string]: () => void } = {}
  private readonly url = "https://api.coingecko.com/api/v3"
  private readonly api_key;
  constructor(
    private readonly config: ConfigService,
  ) {
    this.api_key = this.config.get("coingecko.api_key")
    this.actionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.triggerCurrencyPriceHigher.bind(this),
      1: this.triggerCurrencyMarketCapLower.bind(this),
      2: this.triggerCurrencyMarketCapHigher.bind(this),
      3: this.triggerCurrencyMarketCapLower.bind(this),
      4: this.triggerBTCDominanceHigh.bind(this),
      5: this.triggerBTCDominanceLow.bind(this),
      6: this.triggerETHDominanceHigh.bind(this),
      7: this.triggerETHDominanceLow.bind(this),
      8: this.triggerBNBDominanceHigh.bind(this),
      9: this.triggerBNBDominanceLow.bind(this),
      10: this.triggerUSDTDominanceHigh.bind(this),
      11: this.triggerUSDTDominanceLow.bind(this),
      12: this.triggerXRPDominanceHigh.bind(this),
      13: this.triggerXRPDominanceLow.bind(this),
      14: this.triggerUSDCDominanceHigh.bind(this),
      15: this.triggerUSDCDominanceLow.bind(this),
      16: this.triggerSOLDominanceHigh.bind(this),
      17: this.triggerSOLDominanceLow.bind(this),
    }
  }

  private async callRefreshToken(refresh_token: string) {
    return [refresh_token, refresh_token]
  }

  private genHeaders(token) {
    return {
        "Authorization":`Bearer ${token}`,
        "Content-Type": "application/json"
    }
  }

  async triggerCurrencyPriceHigher(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/simple/price?ids=${data.currency}&vs_currencies=eur&x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data[`${data.currency}`].eur
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare => Number(data.price)) {
              await console.log(`Trigger: ${data.currency} breaks above ${data.price}, actual price ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger currency price  with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerCurrencyPriceLower(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/simple/price?ids=${data.currency}&vs_currencies=eur&x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data[`${data.currency}`].eur
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: compare}
          if (actionData.data != compare)  {
            trigger.data = compare
            if (compare <= Number(data.price)) {
              await console.log(`Trigger: ${data.currency} fall below ${data.price}, actual price ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger currency price  with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerCurrencyMarketCapHigher(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/simple/price?ids=${data.currency}&vs_currencies=eur&x_cg_api_key=${this.api_key}&include_market_cap=true`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data[`${data.currency}`].eur_market_cap
        const condition = compare >= Number(data.marketcap)
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: condition}
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: ${data.currency} marketCap breaks above ${data.marketcap}, actual marketcap ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger currency price  with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerCurrencyMarketCapLower(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/simple/price?ids=${data.currency}&vs_currencies=eur&x_cg_api_key=${this.api_key}&include_market_cap=true`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data[`${data.currency}`].eur_market_cap
        const condition = compare >= Number(data.marketcap)
        if (actionData === undefined) // undefined means first request
          return {trigger: false, data: condition}
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: ${data.currency} fall below ${data.marketcap}, actual marketcap ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger currency price  with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerBTCDominanceHigh(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.btc
        const condition = compare >= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: btc dominance break above ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger btc dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerBTCDominanceLow(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.btc
        const condition = compare <= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: btc dominance fall below ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger btc dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }


  async triggerSOLDominanceHigh(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.sol
        const condition = compare >= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: sol dominance break above ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger sol dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerETHDominanceLow(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.sol
        const condition = compare <= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: sol dominance fall below ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger sol dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerBNBDominanceHigh(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.bnb
        const condition = compare >= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: bnb dominance break above ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger bnb dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerBNBDominanceLow(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.bnb
        const condition = compare <= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: bnb dominance fall below ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger bnb dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerUSDTDominanceHigh(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.usdt
        const condition = compare >= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: usdt dominance break above ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger usdt dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerUSDTDominanceLow(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.usdt
        const condition = compare <= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: usdt dominance fall below ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger usdt dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }
  async triggerXRPDominanceHigh(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.xrp
        const condition = compare >= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: xrp dominance break above ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger xrp dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerXRPDominanceLow(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.xrp
        const condition = compare <= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: xrp dominance fall below ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger xrp dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerUSDCDominanceHigh(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.usdc
        const condition = compare >= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: usdc dominance break above ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger usdc dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerUSDCDominanceLow(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.usdc
        const condition = compare <= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: usdc dominance fall below ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger usdc dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }


  async triggerETHDominanceHigh(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.eth
        const condition = compare >= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: eth dominance break above ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger eth dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }

  async triggerSOLDominanceLow(access_token, data, actionData) : Promise<triggerData> {
    try {
      const apiUrl = `${this.url}/global??x_cg_api_key=${this.api_key}`
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      })
      const response_data = await response.json()
      if (response.ok) {
        const trigger : triggerData = { trigger: false, data:null}
        const compare = response_data.data.market_cap_percentage.eth
        const condition = compare <= Number(data.percentage)
        if (actionData === undefined) { // undefined means first request
          return {trigger: false, data: condition}
        }
          if (actionData.data != condition)  {
            trigger.data = condition
            if (condition) {
              await console.log(`Trigger: eth dominance fall below ${data.percentage}, actual dominance ${compare}`)
              trigger.trigger = true
            }
          }
        return trigger
      }
      else
        console.log(`Failed to trigger eth dominance with status: ${response.status}`)
      return {trigger: false, data: null}
      }
    catch (error) {
        throw new Error(`${error}`)
    }
  }
}