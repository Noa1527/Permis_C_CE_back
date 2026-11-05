import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Permis } from 'src/enums/permis.enum';
import { TypeExercice } from 'src/enums/type-exercice.enum';

@Schema({ _id: false })
export class SourceFicheOrale {
  @Prop({ required: true })
  ouvrage!: string;

  @Prop({ required: true })
  pages!: string;

  @Prop({ required: true })
  nature!: string;
}
export const SourceFicheOraleSchema = SchemaFactory.createForClass(SourceFicheOrale);

@Schema({ _id: false })
export class CritereOral {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  titre!: string;

  @Prop({ required: true })
  explication!: string;

  @Prop({ 
    type: [String], 
    default: [] 
  })
  motsCles!: string[];
}
export const CritereOralSchema = SchemaFactory.createForClass(CritereOral);

@Schema({ _id: false })
export class CoursOral {
  @Prop({ required: true })
  resume!: string;

  @Prop({ 
    type: [String], 
    default: [] 
  })
  risques!: string[];

  @Prop({ 
    type: [String], 
    default: [] 
  })
  conseils!: string[];
}
export const CoursOralSchema = SchemaFactory.createForClass(CoursOral);

@Schema({ _id: false })
export class EntrainementOral {

  @Prop({
    required: true,
    enum: Object.values(TypeExercice),
    default: TypeExercice.REPONSE_LIBRE_AUTO_CORRECTION,
  })
  type!: TypeExercice;

  @Prop({ required: true })
  question!: string;

  @Prop({ required: true })
  consigne!: string;

  @Prop({ 
    required: true, 
    min: 1, 
    default: 420 
  })
  dureeSecondes!: number;

  @Prop({ default: true })
  correctionVisibleApresChrono!: boolean;

  @Prop({ 
    type: [CritereOralSchema], 
    default: [] 
  })
  criteres!: CritereOral[];
}
export const EntrainementOralSchema = SchemaFactory.createForClass(EntrainementOral);

@Schema({ _id: false })
export class PointFicheOrale {
  @Prop({ required: true })
  id!: string;

  @Prop({ 
    required: true, 
    min: 1 
  })
  ordre!: number;

  @Prop({ required: true })
  titre!: string;

  @Prop({ 
    type: CoursOralSchema, 
    required: true 
  })
  cours!: CoursOral;

  @Prop({ 
    type: EntrainementOralSchema, 
    required: true 
  })
  entrainement!: EntrainementOral;
}
export const PointFicheOraleSchema = SchemaFactory.createForClass(PointFicheOrale);

@Schema({ _id: false })
export class SectionFicheOrale {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  titre!: string;

  @Prop({ 
    type: [PointFicheOraleSchema], 
    default: [] 
  })
  points!: PointFicheOrale[];
}
export const SectionFicheOraleSchema = SchemaFactory.createForClass(SectionFicheOrale);

export type FicheOraleDocument = HydratedDocument<FicheOrale>;
export type FicheOraleDocuments = FicheOraleDocument[];


@Schema({ 
  collection: 'fiches_orales', 
  timestamps: true 
})
export class FicheOrale {

  @Prop({
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 12,
  })
  numero!: number;

  @Prop({ 
    required: true, 
    unique: true 
  })
  slug!: string;

  @Prop({ required: true })
  titre!: string;

  // @Prop({
  //   required: true,
  //   enum: Permis,
  // })
  // permis!: Permis;

  @Prop({
    type: [String],
    enum: Object.values(Permis),
    required: true,
    default: undefined,
  })
  permis!: Permis[];

  @Prop({ required: true })
  introduction!: string;

  @Prop({ 
    type: SourceFicheOraleSchema, 
    required: true 
  })
  source!: SourceFicheOrale;

  @Prop({ required: true })
  versionContenu!: string;

  @Prop({ 
    type: [SectionFicheOraleSchema], 
    default: [] 
  })
  sections!: SectionFicheOrale[];
}

export const FicheOraleSchema = SchemaFactory.createForClass(FicheOrale);
