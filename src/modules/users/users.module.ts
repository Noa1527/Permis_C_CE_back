import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslUserAbilityFactory } from 'src/modules/users/casl/casl-user-ability.factory';
import { User, UserSchema } from 'src/modules/users/schemas/users.schema';
import { UsersController } from 'src/modules/users/users.controller';
import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },

    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, CaslUserAbilityFactory],
  exports: [UsersService],
})
export class UsersModule { }