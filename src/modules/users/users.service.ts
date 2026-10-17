import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import argon2 from 'argon2';
import { QueryFilter } from 'mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/enums/role.enum';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { User, type UserDocument, type UserDocuments } from 'src/modules/users/schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {
    this.userModel
      .exists({})
      .then(async (userExists) => {
        if (userExists) {
          return;
        }

        const password = this.configService.getOrThrow<string>(
          'DEFAULT_ADMIN_PASSWORD',
        );

        const hashedPassword = await argon2.hash(password, {
          type: argon2.argon2id,
        });

        await this.userModel.create({
          email: 'mickael.raveneau15@gmail.com',
          firstName: 'Mike',
          lastName: 'Raven',
          password: hashedPassword,
          role: Role.Admin,
          authenticationMethod: 'emailPassword',
        });
      });
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
    });

    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  findAll(
    query: QueryFilter<UserDocument> = {},
    skip?: number,
    limit?: number,
  ): Promise<UserDocuments> {
    return this.userModel
      .find({ deleted: { $ne: true }, ...query })
      
      // .skip(skip)
      // .limit(limit)
      .exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }


  findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        email,
      })
      .select('+password')
      .select('+authenticationMethod')
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updates = { ...updateUserDto };

    if (updates.password) {
      updates.password = await argon2.hash(updates.password, {
        type: argon2.argon2id,
      });

      updates.forcePasswordReset = false;
    } else {
      // Ne remplace pas le hash existant par un mot de passe vide.
      delete updates.password;
    }

    return this.userModel
      .findByIdAndUpdate(id, updates, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();
  }

  async remove(id: string) {
    await this.userModel.findByIdAndUpdate(id, { deleted: true }).exec();
  }

}