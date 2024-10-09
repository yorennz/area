import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type TriggerDataDocument = HydratedDocument<TriggerData>

@Schema({
  timestamps: true,
  collection: 'TriggerData',
})
export class TriggerData {
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'SingleArea' })
  singleAreaId: mongoose.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  data: any
}
export const TriggerDataSchema = SchemaFactory.createForClass(TriggerData)
// ---------------------- AreaSchema
