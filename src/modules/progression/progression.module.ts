import { Module } from '@nestjs/common';
import { ProgressionService } from './progression.service';
import { ProgressionController } from './progression.controller';
import { User, UserSchema } from '../users/schemas/users.schema';
import { Progression, ProgressionSchema } from './schemas/progression-question.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progression.name, schema: ProgressionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ProgressionService],
  controllers: [ProgressionController]
})
export class ProgressionModule {}
