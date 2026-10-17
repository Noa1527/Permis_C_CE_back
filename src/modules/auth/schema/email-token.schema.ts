import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from "src/modules/users/schemas/users.schema";

export type EmailTokenDocument = HydratedDocument<EmailToken>;
export type EmailTokenDocuments = EmailTokenDocument[];

@Schema({ timestamps: true, collection: "email-token" })
export class EmailToken {
  _id?: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  _user: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  token: string

  @Prop({
    required: false,
    type: Boolean,
  })
  used: boolean;
}

export const EmailTokenSchema = SchemaFactory.createForClass(EmailToken);