import { Area, SingleAreaDocument } from './../database/schemas/area.schema'
import { BadRequestException, ConflictException, Injectable, NotFoundException, UseFilters } from '@nestjs/common'
import mongoose from 'mongoose'
import { AreaDatabaseService, SingleAreaDatabaseService } from '../database/areas_database.service'
import { TriggerDatabase } from '../../../area-trigger/src/database/trigger_database.service'
import { single } from 'rxjs'
import { AreaTriggerService, triggerData } from '../../../area-trigger/src/trigger/area-trigger.service'

@Injectable()
export class AreaService {
  constructor(
    private areaDatabase: AreaDatabaseService,
    private singleAreaDatabase: SingleAreaDatabaseService,
    private triggerDatabase: TriggerDatabase,
    private areaTriggerService: AreaTriggerService,
  ) {}

  // Check if the Action Reaction service provided is authorized by the user
  private async checkIfServiceExistInAuthorization(areaId: mongoose.Types.ObjectId, service: [string, string]) {
    const area = await this.areaDatabase.findArea(areaId)
    if (!area.serviceAuthorization.has(service[0]) || !area.serviceAuthorization.has(service[1]))
      throw new BadRequestException("Your didn't Authorized the service you provided")
  }

  async checkIfAreaNameIsAlreadyUsed(areaId: mongoose.Types.ObjectId, name) {
    const area = await this.singleAreaDatabase.findByName(areaId, name)
    if (area)
      throw new ConflictException(`Area name is already used:${name}`)
  }

  private async fillAreaTriggerData(singleArea, refresh_token) {
    const actionService = singleArea.Action.service
    const actionToken = refresh_token.get(actionService)

    await this.triggerDatabase.create(singleArea._id, [])
    const [access_token, refresh] = await this.areaTriggerService.actionService[actionService]['getToken'](actionToken)
    refresh_token.set(actionService, refresh)
    await this.areaDatabase.findAndUpdateByIDRefreshToken(singleArea.hostArea, refresh_token)
    const actionData: triggerData = await this.areaTriggerService.actionService[actionService][singleArea.Action.id](access_token, singleArea.Action.data, undefined)
    if (actionData.data !== null)
      await this.triggerDatabase.findAndUpdateBySingleAreaId(singleArea._id, actionData.data)
    }

  async handleAreaCreation(user, singleArea) {
    await this.checkIfServiceExistInAuthorization(user.area._id, [singleArea.Action.service, singleArea.Reaction.service])
    await this.checkIfAreaNameIsAlreadyUsed(user.area._id, singleArea.name)
    const singleAreaId: SingleAreaDocument = await this.singleAreaDatabase.createSingleArea(user.area._id, singleArea)
    await this.fillAreaTriggerData(singleAreaId, user.area.serviceAuthorization)
    await user.area.save()
  }

  async getAllSingleArea(areaId: mongoose.Types.ObjectId) {
    return await this.singleAreaDatabase.findAllById(areaId)
  }

  async deleteSingleArea(hostId: mongoose.Types.ObjectId, name: string) {
    const data = await this.singleAreaDatabase.findAndDeleteByName(hostId, name)
    if (!data) throw new NotFoundException(`Area not found: ${name}`)
  }

  async getSingleArea(hostId: mongoose.Types.ObjectId, name: string) {
    return await this.singleAreaDatabase.findByName(hostId, name)
  }

  async changeIsActiveState(hostId: mongoose.Types.ObjectId, name: string) {
    const findedArea = await this.getSingleArea(hostId, name)
    const data = await this.singleAreaDatabase.findAndUpdateByName(hostId, name, { isActive: !findedArea.isActive })
    return data.isActive
  }
}
