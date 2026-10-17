import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Role } from "src/enums/role.enum";

export type UserDocument = HydratedDocument<User>;
export type UserDocuments = UserDocument[];

@Schema({ timestamps: true, collection: "users" })
export class User {
  _id?: string;

  @Prop({
    type: String,
    enum: Role,
    required: true,
    default: Role.User
  })
  role: Role;

  @Prop({
    required: true,
  })
  firstName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({})
  email: string;

  @Prop({
    required: false,
    select: false,
  })
  password: string;

  @Prop({
    default: false,
  })
  forcePasswordReset: boolean;
  
  @Prop({ 
    required: true, 
    type: String, 
    enum: ["emailPassword", "emailOnly"] 
  })
  authenticationMethod: string;

}

export const UserSchema = SchemaFactory.createForClass(User);