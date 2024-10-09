import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Cron, Interval } from '@nestjs/schedule'
import { AreaDatabaseService, SingleAreaDatabaseService } from 'apps/area-api/src/database/areas_database.service'
import { AreaDocument, SingleAreaDocument } from 'apps/area-api/src/database/schemas/area.schema'
import { TriggerDatabase } from '../database/trigger_database.service'
import service_config from 'apps/area-api/src/configuration/area_config'

import { LinkeInReaction } from '../reaction/linkedin.reaction'
import { LinkeInAction } from '../action/linkedin.action'

import { NotionReaction } from '../reaction/notion.reaction'
import { NotionAction } from '../action/notion.action'

import {SpotifyReaction} from "../reaction/spotify.reaction";
import {SpotifyAction} from '../action/spotify.action'

import { GithubAction } from '../action/github.action'
import {GithubReaction} from "../reaction/github.reaction";

import { MicrosoftAction } from '../action/microsoft.action'
import { MicrosoftReaction } from '../reaction/microsoft.reaction'

import { DiscordAction } from '../action/discord.action'

import { FacebookAction } from '../action/facebook.action'

import { CoingeckoAction } from '../action/coingecko.action'

import { RiotAction } from '../action/riot.action'

import {GoogleAction} from "../action/google.action";
import {GoogleReaction} from "../reaction/google.reaction";

import {TwitterReaction} from "../reaction/twitter.reaction";

import {TwitchAction} from "../action/twitch.action";
import {TwitchReaction} from "../reaction/twitch.reaction";

export type triggerData = {
  trigger: boolean,
  data: any | null,
}

function initializeMapServiceAction() {
  const map = new Map();
  for (const element of service_config.services) {
    map.set(element["name"], element['actions']);
  }
  return map;
}

function initializeMapServiceReaction() {
  const map = new Map();
  for (const element of service_config.services) {
    map.set(element["name"], element['reactions']);
  }
  return map;
}

@Injectable()
export class AreaTriggerService {
  private allAreas: AreaDocument[]
  private allSingleAreas: SingleAreaDocument[]
  public actionService: { [key: string]: any };
  public reactionService: { [key: string]: any };
  private serviceMapAction: { [key: string]: any };
  private serviceMapReaction: { [key: string]: any };
  constructor(
    private areaDatabase: AreaDatabaseService,
    private singleAreaDatabase: SingleAreaDatabaseService,
    private triggerDatabase: TriggerDatabase,
    //Action
    private readonly spotifyAction: SpotifyAction,
    private readonly githubAction: GithubAction,
    private readonly linkedInAction: LinkeInAction,
    private readonly notionAction: NotionAction,
    private readonly discordAction: DiscordAction,
    private readonly microsoftAction: MicrosoftAction,
    private readonly facebookAction: FacebookAction,
    private readonly coingeckoAction: CoingeckoAction,
    private readonly riotAction: RiotAction,
    private readonly googleAction: GoogleAction,
    private readonly twitchAction: TwitchAction,
    // Reaction
    private readonly spotifyReaction: SpotifyReaction,
    private readonly githubReaction: GithubReaction,
    private readonly linkedInReaction: LinkeInReaction,
    private readonly notionReaction: NotionReaction,
    private readonly twitchReaction: TwitchReaction,
    private readonly microsoftReaction: MicrosoftReaction,
    private readonly googleReaction: GoogleReaction,
    private readonly twitterReaction: TwitterReaction,
    ) {
    this.serviceMapAction = initializeMapServiceAction()
    this.serviceMapReaction = initializeMapServiceReaction()
    this.actionService = {
      spotify: this.spotifyAction.actionMap, // Actions && Refresh token
      github: this.githubAction.actionMap, // Actions && Refresh token
      linkedin: this.linkedInAction.actionMap, // Actions && Refresh token
      notion: this.notionAction.actionMap, // Actions && Refresh token
      discord: this.discordAction.actionMap, // Actions && Refresh token
      microsoft: this.microsoftAction.actionMap, // Actions && Refresh token
      facebook: this.facebookAction.actionMap, // Actions && Refresh token
      coingecko: this.coingeckoAction.actionMap, // Actions && Refresh token
      google: this.googleAction.actionMap,
      twitch: this.twitchAction.actionMap,
      riot: this.riotAction.actionMap,
    }
    this.reactionService = {
      spotify: this.spotifyReaction.reactionMap, // Reaction && Refresh token
      github: this.githubReaction.reactionMap, // Actions && Refresh token
      linkedin: this.linkedInReaction.reactionMap, // Actions && Refresh token
      notion: this.notionReaction.reactionMap, // Actions && Refresh token
      twitch: this.twitchReaction.reactionMap,
      microsoft: this.microsoftReaction.reactionMap, // Actions && Refresh token
      google: this.googleReaction.reactionMap,
      twitter: this.twitterReaction.reactionMap,
    }
  }

  async updateAllArea() {
    this.allAreas = await this.areaDatabase.getAll()
  }

  async handleArea() {
    await console.log('-------------------------===[ Trigger ]===-------------------------\n\n')

    for (const area of this.allAreas) {
      const hostId = area._id
      const SingleAreas = await this.getSingleAreasFromHost(hostId)
      for (const singleArea of SingleAreas) {
        try {
        await this.handleSingleArea(singleArea, area.serviceAuthorization, area)
        } catch (err) {
          await console.log(`Error with ${singleArea.name} single area :`, err.message, "\n")
        }
        await area.save()
      }
    }
    await console.log('\n\n-------------------------===[ End ]===-----------------------------')
  }

  async handleSingleArea(singleArea, refresh_token, area) {
    const actionService = singleArea.Action.service
    const reactionService = singleArea.Reaction.service
    const actionToken = refresh_token.get(actionService)
    const reactionToken = refresh_token.get(reactionService)

    await console.log("------------===[",singleArea.name,"]===------------")
    await console.log("-=[", this.serviceMapAction.get(actionService)[singleArea.Action.id].name, "]=- >>>> -=[", this.serviceMapReaction.get(reactionService)[singleArea.Reaction.id].name, "]=-\n")
    const triggerData = await this.triggerDatabase.findBySingleAreaId(singleArea._id)

    if (!triggerData)
      throw new InternalServerErrorException("TriggerData is empty")
    const [access_token, refresh] = await this.actionService[actionService]['getToken'](actionToken)

    refresh_token.set(actionService, refresh)
    await area.save()
    // await this.areaDatabase.findAndUpdateByIDRefreshToken(area._id, refresh_token)
    const actionData: triggerData = await this.actionService[actionService][singleArea.Action.id](access_token, singleArea.Action.data, triggerData)

    if (actionData.data !== null) {// Save data {}
      await this.triggerDatabase.findAndUpdateBySingleAreaId(singleArea._id, actionData.data)
    }
    // await this.triggerDatabase.findAndDeleteBySingleAreaId(singleArea._id)
    if (actionData.trigger === true) {
      const [access_token, refresh] = await this.reactionService[reactionService]['getToken'](reactionToken) // Token
      refresh_token.set(reactionService, refresh)
      const reactionData = await this.reactionService[reactionService][singleArea.Reaction.id](access_token, singleArea.Reaction.data, triggerData)
      if (reactionData === 'Unique') {
        //if reaction send Unique then delete triggerData and set singleArea to isDone
        await this.triggerDatabase.findAndDeleteBySingleAreaId(singleArea._id)
        singleArea.isDone = true
        await singleArea.save()
      }
    }
  }

  async getSingleAreasFromHost(hostId): Promise<SingleAreaDocument[]> {
    return await this.singleAreaDatabase.findAllByHostId(hostId)
  }
}
