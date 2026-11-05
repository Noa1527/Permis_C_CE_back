import { BadRequestException, Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Query } from '@nestjs/common';
import { FichesOralesService } from './fiches-orales.service';
import { Permis } from 'src/enums/permis.enum';

@Controller('fiches-orales')
export class FichesOralesController {
     constructor(
        private _fichesOralesService: FichesOralesService,
    ) {}

    
  // -----------------------------------------------------
  // Liste des fiches orales
  // GET /api/fiches-orales?permis=C
  // -----------------------------------------------------

  @Get(':permis')
  findAll(
    @Param('permis') permis?: Permis,
  ) {

    console.log('permis controller',permis);
    
    return this._fichesOralesService.findAll(permis);
  }

  // -----------------------------------------------------
  // Récupérer une fiche par numéro
  // GET /api/fiches-orales/1
  // -----------------------------------------------------

  @Get('numero/:numero')
  findOne(
    @Param('numero', ParseIntPipe)
    numero: number,
  ) {
    console.log('numero', numero);
    
    return this._fichesOralesService.findOne(numero);
  }

  // -----------------------------------------------------
  // Entraînement d'un point
  // GET /api/fiches-orales/1/points/pluie/entrainement
  // -----------------------------------------------------

  @Get(':numero/points/:pointId/entrainement')
  getEntrainement(
    @Param('numero', ParseIntPipe)
    numero: number,

    @Param('pointId')
    pointId: string,
  ) {
    return this._fichesOralesService.getEntrainement(
      numero,
      pointId,
    );
  }

  // -----------------------------------------------------
  // Correction d'un point
  // GET /api/fiches-orales/1/points/pluie/correction
  // -----------------------------------------------------

  @Get(':numero/points/:pointId/correction')
  getCorrection(
    @Param('numero', ParseIntPipe)
    numero: number,

    @Param('pointId')
    pointId: string,
  ) {
    return this._fichesOralesService.getCorrection(
      numero,
      pointId,
    );
  }
}
