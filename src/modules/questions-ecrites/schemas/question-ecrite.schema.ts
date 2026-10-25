
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Permis } from 'src/enums/permis.enum';

export type QuestionEcriteDocument = HydratedDocument<QuestionEcrite>;
export type QuestionEcriteDocuments = QuestionEcriteDocument[];

@Schema({
  collection: 'questions_ecrites',
  timestamps: true,
})
export class QuestionEcrite {
  _id?: string;

  @Prop({
    type: String,
    enum: Permis,
    required: true
  })
  permis: Permis;

  @Prop({ required: true, min: 1, max: 20 })
  fiche: number;

  @Prop({ required: true, min: 1, max: 10 })
  numero: number;

  @Prop({ required: true, trim: true })
  question: string;

  @Prop({ required: true, trim: true })
  reponse: string;

  @Prop({ default: '' })
  explication: string;
}

export const QuestionEcriteSchema = SchemaFactory.createForClass(QuestionEcrite);

QuestionEcriteSchema.index(
  { permis: 1, fiche: 1, numero: 1 },
  { unique: true },
);
