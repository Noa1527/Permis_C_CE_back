import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionEcrite, QuestionEcriteDocument } from 'src/modules/questions-ecrites/schemas/question-ecrite.schema';
import { Model, QueryFilter } from 'mongoose';
import { Permis } from 'src/enums/permis.enum';

@Injectable()
export class QuestionsEcritesService {
    constructor(
        @InjectModel(QuestionEcrite.name)
        private _questionsEcritesModel: Model<QuestionEcrite>,
    ) {}

  /**
   * Récupérer les questions par permis
   * et éventuellement par fiche.
   */
  findAll(
    query: QueryFilter<QuestionEcriteDocument>,
  ) {
    return this._questionsEcritesModel
      .find(query)
      .select('-__v')
      .sort({
        fiche: 1,
        numero: 1,
      })
      .lean()
      .exec();
  }

  /**
   * Récupérer 10 questions aléatoires
   * sans exposer les corrections.
   */
  findRandom(permis: Permis) {
    return this._questionsEcritesModel.aggregate([
      { $match: { permis } },
      { $sample: { size: 10 } },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
  }
  
  /**
   * Récupérer 1 Fiche avec 10 questions
   * sans exposer les corrections.
   */
  findOneFicheById(fiche: number) {
    return this._questionsEcritesModel
      .find({ fiche })
      .select('-__v ')
      .sort({
        fiche: 1,
        numero: 1,
      })
      .lean()
      .exec();
  }


}
