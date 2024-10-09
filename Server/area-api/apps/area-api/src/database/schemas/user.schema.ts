import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { UserDto } from "../../auth/users/dto/user.dto";

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true,
    collection: 'users',
})

export class User {
    @Prop({ required: true })
    email: string;

    @Prop()
    password: string;

    @Prop()
    firstname: string;

    @Prop()
    lastname: string;

    @Prop()
    phone: string;


    @Prop({ required: true })
    token: string;

    @Prop({ default: "basic" })
    type: string;


    @Prop({type: mongoose.Types.ObjectId, ref:"Area" })
    area: mongoose.Types.ObjectId;

    constructor(userDto: UserDto) {
        this.email = userDto.email;
        this.password = userDto.password;
        this.firstname = userDto.firstname;
        this.lastname = userDto.lastname;
        this.phone = userDto.phone;
    }
}


export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.index({ email: 1, type: 1 }, { unique: true });
