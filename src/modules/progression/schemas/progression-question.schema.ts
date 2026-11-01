
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema, Types } from 'mongoose';

import { Permis } from 'src/enums/permis.enum';
import { ProgressionStatut } from 'src/enums/progression-satus.enum';
import { ProgressionType } from 'src/enums/progression-type.enum';
import { User } from 'src/modules/users/schemas/users.schema';

export type ProgressionDocument = HydratedDocument<Progression>;
export type ProgressionDocuments = ProgressionDocument[];

@Schema({
  timestamps: true,
  collection: 'progressions',
})
export class Progression {

  // Utilisateur propriétaire de la progression
  @Prop({
    type: MongoSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  _user!: Types.ObjectId;

  // Type d'activité
  @Prop({
    type: String,
    enum: ProgressionType,
    required: true,
  })
  typeOfProgression!: ProgressionType;

  // Permis C ou CE
  @Prop({
    type: String,
    enum: Permis,
    required: true,
  })
  permis!: Permis;

  // Identifiant de l'élément travaillé
  @Prop({
    type: String,
    required: true,
  })
  elementId!: string;

  // État de l'activité
  @Prop({
    type: String,
    enum: ProgressionStatut,
    default: ProgressionStatut.EN_COURS,
  })
  statut!: ProgressionStatut;

  // Résultat du dernier essai
  @Prop({
    type: Boolean,
    default: null,
  })
  reussie!: boolean | null;

  // Nombre de tentatives
  @Prop({
    type: Number,
    default: 0,
  })
  tentatives!: number;

  // Note éventuelle
  @Prop({
    type: Number,
    default: null,
  })
  score!: number | null;
}

export const ProgressionSchema = SchemaFactory.createForClass(Progression);

// Une progression par utilisateur, permis,
// type et élément.
ProgressionSchema.index(
  {
    _user: 1,
    permis: 1,
    typeOfProgression: 1,
    elementId: 1,
  },
  {
    unique: true,
  },
);
