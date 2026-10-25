import { Controller, ForbiddenException, Get, Param, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { QuestionsEcritesService } from './questions-ecrites.service';
import { GetQuestionsEcritesDto } from './dto/get-questions-ecrites.dto';
import type { UserDocument } from 'src/modules/users/schemas/users.schema';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CaslQuestionEcriteAbilityFactory } from './casl/casl-question-ecrite-ability.factory';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Action } from 'src/enums/action.enum';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionEcrite, QuestionEcriteDocument } from './schemas/question-ecrite.schema';
import { Model, QueryFilter } from 'mongoose';
import { ForbiddenReason } from 'src/enums/forbidden_reason.enum';
import { accessibleBy } from "@casl/mongoose";
import { Permis } from 'src/enums/permis.enum';


@Controller('questions-ecrites')
export class QuestionsEcritesController {
    constructor(
        @InjectModel(QuestionEcrite.name)
        private _questionsEcritesModel: Model<QuestionEcrite>,

        private _questionsEcritesService: QuestionsEcritesService,
        private _caslQuestionEcriteAbilityFactory: CaslQuestionEcriteAbilityFactory,
    ) {}
 /**
   * Récupérer les questions écrites
   * Permis C ou CE, avec filtre par fiche.
   */
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  findAll(
    @Query() dto: GetQuestionsEcritesDto,
    @CurrentUser() user: UserDocument,
  ) {
    const ability = this._caslQuestionEcriteAbilityFactory.createForUser(user);
    const canReadQuestions = ability.can( Action.Read, this._questionsEcritesModel);

    if (!canReadQuestions) {
      throw new ForbiddenException(ForbiddenReason.ROLE);
    }

    const caslQuery: QueryFilter<QuestionEcriteDocument> = accessibleBy(
      ability,
      Action.Read,
    ).ofType(this._questionsEcritesModel);

    const filters: QueryFilter<QuestionEcriteDocument>[] = [
      caslQuery,
      { permis: dto.permis },
    ];

    if (dto.fiche !== undefined) {
      filters.push({ fiche: dto.fiche });
    }

    const query: QueryFilter<QuestionEcriteDocument> = {
      $and: filters,
    };

    return this._questionsEcritesService.findAll(query);
  }
 
  /**
   * Récupérer des questions random écrites
   * Permis C ou CE, avec filtre par fiche.
   */
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('random/:permis')
  findRandomQuestion(
    @CurrentUser() user: UserDocument,
    @Param('permis') permis: Permis
  ) {
    const ability = this._caslQuestionEcriteAbilityFactory.createForUser(user);
    const canReadQuestions = ability.can( Action.Read, this._questionsEcritesModel);

    if (!canReadQuestions) {
      throw new ForbiddenException(ForbiddenReason.ROLE);
    }

    return this._questionsEcritesService.findRandom(permis);
  }

  /**
   * Récupérer des questions random écrites
   * Permis C ou CE, avec filtre par fiche.
   */
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':ficheId')
  findFicheById(
    @CurrentUser() user: UserDocument,
    @Param('ficheId') ficheId: number
  ) {
    const ability = this._caslQuestionEcriteAbilityFactory.createForUser(user);
    const canReadQuestions = ability.can( Action.Read, this._questionsEcritesModel);

    if (!canReadQuestions) {
      throw new ForbiddenException(ForbiddenReason.ROLE);
    }

    return this._questionsEcritesService.findOneFicheById(ficheId);
  }
}
