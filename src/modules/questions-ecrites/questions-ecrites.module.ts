
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  QuestionEcrite,
  QuestionEcriteSchema,
} from 'src/modules/questions-ecrites/schemas/question-ecrite.schema';

import { CaslQuestionEcriteAbilityFactory } from 'src/modules/questions-ecrites/casl/casl-question-ecrite-ability.factory';
import { QuestionsEcritesController } from 'src/modules/questions-ecrites/questions-ecrites.controller';
import { QuestionsEcritesService } from 'src/modules/questions-ecrites/questions-ecrites.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionEcrite.name, schema: QuestionEcriteSchema},
    ]),
  ],
  controllers: [
    QuestionsEcritesController,
  ],
  providers: [
    QuestionsEcritesService,
    CaslQuestionEcriteAbilityFactory,
  ],
  exports: [
    QuestionsEcritesService,
    CaslQuestionEcriteAbilityFactory,
  ],
})
export class QuestionsEcritesModule {}
