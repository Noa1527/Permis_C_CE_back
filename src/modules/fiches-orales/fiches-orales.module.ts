import { Module } from '@nestjs/common';
import { FichesOralesService } from './fiches-orales.service';
import { FichesOralesController } from './fiches-orales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FicheOrale, FicheOraleSchema } from 'src/modules/fiches-orales/schemas/fiche-orale.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
            { name: FicheOrale.name, schema: FicheOraleSchema },
        ]),
  ],
  providers: [FichesOralesService],
  controllers: [FichesOralesController],
  exports: [FichesOralesService],
})
export class FichesOralesModule {}
