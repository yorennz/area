import { Injectable, UseFilters } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Area, AreaDocument, SingleArea, SingleAreaDocument } from './schemas/area.schema'
import { MongoExceptionFilter } from './mongo-exception.filter'
import { TriggerDatabase } from 'apps/area-trigger/src/database/trigger_database.service'

@UseFilters(MongoExceptionFilter)
export class SingleAreaDatabaseService {
  constructor(
    @InjectModel(SingleArea.name)
    private singleAreaModel: mongoose.Model<SingleArea>,
    private triggerData: TriggerDatabase
  ) {}

  async findAll() {
    return await this.singleAreaModel.find().populate('hostArea').exec()
  }
  async createSingleArea(hostArea, data): Promise<SingleAreaDocument> {
    const createdSingleArea: SingleAreaDocument = new this.singleAreaModel({
      ...data,
      hostArea: hostArea,
    })
    const savedSingleArea: SingleAreaDocument = await createdSingleArea.save()
    return savedSingleArea
  }

  async findAllById(hostId: mongoose.Types.ObjectId): Promise<SingleAreaDocument[]> {
    return await this.singleAreaModel.find({ hostArea: hostId }).select('-_id').select('-Action._id').select('-Reaction._id').select('-hostArea').select('-__v').select('-updatedAt').exec()
  }

  async findAllByHostId(hostId: mongoose.Types.ObjectId): Promise<SingleAreaDocument[]> {
    return await this.singleAreaModel.find({hostArea: hostId, isDone: false, isActive: true}).exec()
  }

  async findAndDeleteByName(hostArea: mongoose.Types.ObjectId, name: string): Promise<SingleAreaDocument> {
    return await this.singleAreaModel.findOneAndDelete({ hostArea: hostArea, name: name })
  }

  async findAndDeleteByHostArea(hostArea: mongoose.Types.ObjectId) {
    const data = await this.singleAreaModel.find({hostArea: hostArea}).select('_id')
    console.log(data)
    for (const element of data) {
      await this.triggerData.findAndDeleteBySingleAreaId(element._id)
      }
    return await this.singleAreaModel.deleteMany({ hostArea: hostArea })
  }

  async findAndUpdateByName(hostArea: mongoose.Types.ObjectId, name: string, data): Promise<SingleAreaDocument> {
    return await this.singleAreaModel.findOneAndUpdate({ hostArea: hostArea, name: name }, { ...data })
  }

  async findByName(hostArea: mongoose.Types.ObjectId, name: string): Promise<SingleAreaDocument> {
    return await this.singleAreaModel.findOne({ hostArea: hostArea, name: name })
  }
}

@Injectable()
@UseFilters(MongoExceptionFilter)
export class AreaDatabaseService {
  constructor(
    @InjectModel(Area.name) private areaModel: mongoose.Model<Area>,
    @InjectModel(SingleArea.name)
    private singleAreaModel: mongoose.Model<SingleArea>,
    private singleAreaDatabase: SingleAreaDatabaseService,
  ) {}
  async getAll() {
    return await this.areaModel.find()
  }

  async getUserAreas(hostId: mongoose.Types.ObjectId): Promise<AreaDocument[]> {
    return await this.areaModel.find({ hostId: hostId })
  }

  async createArea(hostId: mongoose.Types.ObjectId): Promise<AreaDocument> {
    const createdArea: AreaDocument = new this.areaModel({
      hostId: hostId,
      serviceAuthorization: new Map<string, string>(),
    })
    createdArea.serviceAuthorization.set("coingecko", "no OAuth service");
    createdArea.serviceAuthorization.set("riot", "no OAuth service");
    // createdArea.serviceAuthorization.set("key2", "value2");
    return createdArea.save()
  }

  async insertServiceAuthorization(areaId: mongoose.Types.ObjectId, service: string, token: string) {
    const findedArea = await this.areaModel.findOne({ _id: areaId })
    findedArea.serviceAuthorization.set(service, token)
    await findedArea.save()
  }

  async findAndDeleteServiceAuthorization(areaId: mongoose.Types.ObjectId, service: string): Promise<boolean> {
    const findedArea = await this.areaModel.findOne({ _id: areaId })
    if (!findedArea.serviceAuthorization.has(service)) return false
    if (findedArea.serviceAuthorization.delete(service)) {
      await findedArea.save()
      return true
    }
    return false
  }

  async findArea(areaId: mongoose.Types.ObjectId): Promise<AreaDocument> {
    return await this.areaModel.findOne({ _id: areaId })
  }

  // async insertSingleAreaToArea(areaId, singleArea) {
  //   const area = await this.findArea(areaId);
  //   area.areas.push(singleArea._id);
  //   await area.save();
  // }

  async findAndDeleteAreaById(areaid) {
    await this.areaModel.findByIdAndDelete(areaid)
  }

  async findAndDeleteAreaByHostId(hostId) {
    await this.areaModel.findOneAndDelete({ hostId: hostId })
  }

  async findAndUpdateByIDRefreshToken(areaid, refresh_token) {
    const test = await this.areaModel.findByIdAndUpdate(areaid, {serviceAuthorization: refresh_token})
  }
}
