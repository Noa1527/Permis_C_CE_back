import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProgressionService } from 'src/modules/progression/progression.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { UserDocument } from 'src/modules/users/schemas/users.schema';
import { EnregistrerTentativeDto } from 'src/modules/progression/dto/enregistrer-tentative.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('progression')
export class ProgressionController {
    constructor(
    private readonly _progressionService: ProgressionService,
  ) {}

  // -----------------------------------------------------
  // Récupérer toutes les statistiques
  // de l'utilisateur connecté
  // -----------------------------------------------------

  @Get()
  @UseGuards(JwtAuthGuard)
  getStatistiques(
    @CurrentUser() user: UserDocument
  ) {
    if (!user) {
      return [];
    }
    return this._progressionService.getStatistiques(user._id);
  }

  // -----------------------------------------------------
  // Enregistrer une tentative
  // Toutes catégories confondues
  // -----------------------------------------------------

  @Post('tentatives')
  @UseGuards(JwtAuthGuard)
  enregistrerTentative(
    @CurrentUser() user: UserDocument,
    @Body() dto: EnregistrerTentativeDto,
  ) {
    console.log('dto',dto);
    
    return this._progressionService.enregistrerTentative({
      userId: user._id,
      permis: dto.permis,
      typeOfProgression: dto.typeOfProgression,
      elementId: dto.elementId,
      reussie: dto.reussie,
      score: dto.score,
    });
  }

}
