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
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User, UserDocument } from 'src/modules/users/schemas/users.schema';

@Injectable()
export class CaslUserAbilityFactory {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) { }

  createForUser(user: UserDocument | null) {
    const { can, build } = new AbilityBuilder(createMongoAbility);
    switch (user?.role) {
      case Role.Admin: {
        can(Action.Manage, this.userModel, {})
        can(Action.Create, this.userModel, {})
        can(Action.Read, this.userModel, {})
        break;
      }
      case Role.User: {
        can(Action.Read, this.userModel, {
          _id: user._id
        })
        break;
      }
      default: {
        break;
      }
    }

    return build({
      detectSubjectType: (object) => {
        return object.constructor as ExtractSubjectType<
          InferSubjects<Model<UserDocument>> | CreateUserDto
        >;
      },
    });
  }
}