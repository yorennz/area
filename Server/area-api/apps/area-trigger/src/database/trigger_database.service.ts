import { Injectable, UseFilters } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { MongoExceptionFilter } from './mongo-exception.filter'
import { TriggerData, TriggerDataDocument } from './schemas/trigger-data.schema'

@Injectable()
@UseFilters(MongoExceptionFilter)
export class TriggerDatabase {
  constructor(
    @InjectModel(TriggerData.name) private triggerDataModel: mongoose.Model<TriggerData>, // private readonly triggerDatabase: AreaTriggerService,
  ) {}

  async create(singleAreaId, data): Promise<TriggerDataDocument> {
    const createdTriggerData = new this.triggerDataModel({ singleAreaId: singleAreaId, data: data })
    const savedUser = await createdTriggerData.save()
    return savedUser
  }

  async findBySingleAreaId(singleAreaId): Promise<TriggerDataDocument> {
    return await this.triggerDataModel.findOne({ singleAreaId: singleAreaId })
  }

  async findAndDeleteBySingleAreaId(singleAreaId): Promise<TriggerDataDocument> {
    return await this.triggerDataModel.findOneAndDelete({ singleAreaId: singleAreaId })
  }

  async findAndUpdateBySingleAreaId(singleAreaId, data): Promise<TriggerDataDocument> {
    if (data === undefined)
      return await this.triggerDataModel.findOneAndUpdate({ singleAreaId: singleAreaId }, { $set: { data: null } })
    return await this.triggerDataModel.findOneAndUpdate({ singleAreaId: singleAreaId }, { $set: { data: data } })
  }

}
