import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type AreaDocument = HydratedDocument<Area>;

@Schema({
    timestamps: true,
    collection: 'areas',
})
export class Area {
    @Prop({ required: true, type: mongoose.Types.ObjectId, ref:"User" })
    hostId: mongoose.Types.ObjectId;

    @Prop({ type: Map, of: String })
    serviceAuthorization: Map<string, string>;

    // @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'SingleArea' }] })
    // areas: mongoose.Types.ObjectId[];
}
export const AreaSchema = SchemaFactory.createForClass(Area)
// ---------------------- AreaSchema

export type SingleAreaDocument = HydratedDocument<SingleArea>;
@Schema({
    timestamps: true,
    collection: 'singleArea',
})
export class SingleArea {
    @Prop({ required: true, type: mongoose.Types.ObjectId, ref:"Area" })
    hostArea: mongoose.Types.ObjectId;

    @Prop({ type: Boolean, default:false })
    isDone: boolean;

    @Prop({ type: Boolean, default:true })
    isActive: boolean;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required:true})
    description: string;
    @Prop({ type: {
          service: String,
          id: Number,
          data: {
            type: mongoose.Schema.Types.Mixed,
          },
        },
      })
    Action: {
        service: string;
        id: number;
        data: Record<string, any>;
    };

    @Prop({ type: {
        service: String,
        id: Number,
        data: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    })
    Reaction: {
        service: string;
        id: number;
        data: Record<string, any>;
    };
}
export const SingleAreaSchema = SchemaFactory.createForClass(SingleArea)
// ---------------------- SingleAreaSchema
