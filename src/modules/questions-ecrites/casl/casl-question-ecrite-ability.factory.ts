import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action } from 'src/enums/action.enum';
import { Role } from 'src/enums/role.enum';
import { QuestionEcrite, type QuestionEcriteDocument } from 'src/modules/questions-ecrites/schemas/question-ecrite.schema';
import { UserDocument } from 'src/modules/users/schemas/users.schema';

@Injectable()
export class CaslQuestionEcriteAbilityFactory {
  constructor(
    @InjectModel(QuestionEcrite.name)
    private readonly _questionEcriteModel: Model<QuestionEcriteDocument>,
  ) { }

  createForUser(user: UserDocument | null) {
    const { can, build } = new AbilityBuilder(createMongoAbility);
    switch (user?.role) {
      case Role.Admin: {
        can(Action.Manage, this._questionEcriteModel, {})
        break;
      }
      case Role.User: {
        can(Action.Read, this._questionEcriteModel, {})
        break;
      }
      default: {
        break;
      }
    }
    return build({
      detectSubjectType: (object) => {
        return object.constructor as ExtractSubjectType<
          InferSubjects<Model<UserDocument>>
        >;
      },
    });
  }
}
