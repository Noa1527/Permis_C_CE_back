import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Permis } from 'src/enums/permis.enum';
import { FicheOrale, FicheOraleDocument } from 'src/modules/fiches-orales/schemas/fiche-orale.schema';

@Injectable()
export class FichesOralesService {
    constructor(
        @InjectModel(FicheOrale.name)
        private readonly _ficheOraleModel: Model<FicheOraleDocument>,
    ) {}

    // -----------------------------------------------------
  // Liste des fiches
  // -----------------------------------------------------

  findAll(permis?: Permis) {
    console.log('Permis -->',permis);
    
    return this._ficheOraleModel
        .find({
          permis
        })
        .select('numero slug titre permis introduction')
        .sort({ numero: 1 })
        .lean()
        .exec();
  }

  // -----------------------------------------------------
  // Une fiche avec ses cours
  // -----------------------------------------------------

  async findOne(numero: number) {
    console.log('numero la', numero);
    
    const fiche = await this._ficheOraleModel
      .findOne({ numero })
      .lean()
      .exec();

    if (!fiche) {
      throw new NotFoundException(
        `Fiche orale n°${numero} introuvable`,
      );
    }

    // Ne pas retourner les corrections ici.
    return {
      numero: fiche.numero,
      slug: fiche.slug,
      titre: fiche.titre,
      permis: fiche.permis,
      introduction: fiche.introduction,
      sections: fiche.sections.map((section) => ({
        id: section.id,
        titre: section.titre,
        points: section.points.map((point) => ({
          id: point.id,
          ordre: point.ordre,
          titre: point.titre,
          cours: point.cours,
        })),
      })),
    };
  }

  // -----------------------------------------------------
  // Rechercher un point dans une fiche
  // -----------------------------------------------------

  private async findPoint(
    numero: number,
    pointId: string,
  ) {
    const fiche = await this._ficheOraleModel
      .findOne({ numero })
      .lean()
      .exec();

    const point = fiche?.sections
      .flatMap((section) => section.points)
      .find((point) => point.id === pointId);

    if (!point) {
      throw new NotFoundException(
        `Point ${pointId} introuvable dans la fiche ${numero}`,
      );
    }

    return point;
  }

  // -----------------------------------------------------
  // Entraînement sans correction
  // -----------------------------------------------------

  async getEntrainement(
    numero: number,
    pointId: string,
  ) {
    const point = await this.findPoint(
      numero,
      pointId,
    );

    const { entrainement } = point;

    return {
      type: entrainement.type,
      question: entrainement.question,
      consigne: entrainement.consigne,
      dureeSecondes: entrainement.dureeSecondes,
    };
  }

  // -----------------------------------------------------
  // Correction du point
  // -----------------------------------------------------

  async getCorrection(
    numero: number,
    pointId: string,
  ) {
    const point = await this.findPoint(
      numero,
      pointId,
    );

    return {
      criteres: point.entrainement.criteres,
    };
  }
}
