import { Injectable, UseFilters } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { Area, AreaDocument } from './schemas/area.schema'
import { AreaDatabaseService } from './areas_database.service'
import { MongoExceptionFilter } from './mongo-exception.filter'

@Injectable()
@UseFilters(MongoExceptionFilter)
export class UserDatabaseService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    @InjectModel(Area.name) private areaModel: mongoose.Model<Area>,
    private readonly areaDatabase: AreaDatabaseService,
  ) {}

  async getAll(): Promise<UserDocument[]> {
    return await this.userModel.find()
  }

  async create(user: User): Promise<UserDocument> {
    const createdUser = new this.userModel(user)
    const savedUser = await createdUser.save()

    const savedArea: AreaDocument = await this.areaDatabase.createArea(savedUser._id)
    savedUser.area = savedArea._id
    return savedUser.save()
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email: email, type: 'basic' }).populate('area').exec()
  }

  async findUserByToken(token: string): Promise<UserDocument> {
    return await this.userModel.findOne({ token: token }).populate("area").exec()
  }

  async findAndUpdateUserToken(email: string, token: string): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate({ email: email }, { token: token })
  }

  async findAndUpdateUserServiceToken(email: string, type: string, token: string): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate({ email: email, type: type }, { token: token })
  }

  async findAndUpdateUserByEmail(email: string, updateUser): Promise<UserDocument> {
    return await this.userModel.findOneAndUpdate({ email: email }, { ...updateUser }, { new: true })
  }

  async findAndUpdateUserByToken(token: string, updateUser): Promise<UserDocument> {
    return await this.userModel.findOneAndUpdate({ token: token }, { ...updateUser }, { new: true })
  }

  async findAndDeleteUser(token: string): Promise<UserDocument> {
    return await this.userModel.findOneAndDelete({ token: token })
  }
}
