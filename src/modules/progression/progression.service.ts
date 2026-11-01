import { Injectable } from '@nestjs/common';
import { Progression, ProgressionDocument } from './schemas/progression-question.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permis } from 'src/enums/permis.enum';
import { ProgressionType } from 'src/enums/progression-type.enum';
import { ProgressionStatut } from 'src/enums/progression-satus.enum';

interface EnregistrerTentative {
  userId: string;
  permis: Permis;
  typeOfProgression: ProgressionType;
  elementId: string;
  reussie: boolean;
  score?: number;
}

@Injectable()
export class ProgressionService { 
    
    constructor(
        @InjectModel(Progression.name)
        private readonly _progressionModel: Model<ProgressionDocument>,
    ) {}

    // -----------------------------------------------------
    // Enregistrer une tentative
    // -----------------------------------------------------

    async enregistrerTentative(data: EnregistrerTentative) {

        const {
        userId,
        permis,
        typeOfProgression,
        elementId,
        reussie,
        score,
        } = data;

        return this._progressionModel.findOneAndUpdate(
        {
            _user: userId,
            permis,
            typeOfProgression,
            elementId,
        },
        {
            $set: {
            reussie,
            statut: reussie
                ? ProgressionStatut.REUSSI
                : ProgressionStatut.A_REVOIR,
            ...(score !== undefined ? { score } : {}),
            },
            $inc: {
            tentatives: 1,
            },
        },
        {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        },
        );
    }

    // -----------------------------------------------------
    // Statistiques globales par permis et activité
    // -----------------------------------------------------

    async getStatistiques(userId: string) {

        return this._progressionModel.aggregate([
        {
            $match: {
            _user: new Types.ObjectId(userId),
            },
        },
        {
            $group: {
            _id: {
                permis: '$permis',
                type: '$typeOfProgression',
            },
            travaillees: { $sum: 1 },
            reussies: {
                $sum: {
                $cond: [
                    { $eq: ['$reussie', true] },
                    1,
                    0,
                ],
                },
            },
            tentatives: {
                $sum: '$tentatives',
            },
            },
        },
        {
            $sort: {
            '_id.permis': 1,
            '_id.type': 1,
            },
        },
        ]);
    }
}
