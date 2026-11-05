// // // À exécuter depuis la racine du projet NestJS : npm run import:fiches-orales
// // import 'dotenv/config';
// // import { readFileSync } from 'node:fs';
// // import { resolve } from 'node:path';
// // import { connect, disconnect, model } from 'mongoose';
// // import { FicheOrale, FicheOraleSchema } from 'src/modules/fiches-orales/schemas/fiche-oraler.schema';

// // function chargerFiches(): Record<string, unknown>[] {
// //   const fichier = resolve(process.cwd(), 'src/data/fiches-orales-import.json');
// //   const donnees: unknown = JSON.parse(readFileSync(fichier, 'utf8'));

// //   if (!Array.isArray(donnees) || donnees.length === 0) {
// //     throw new Error('Le JSON doit contenir un tableau de fiches non vide.');
// //   }

// //   const numeros = new Set<number>();
// //   for (const item of donnees) {
// //     if (item === null || typeof item !== 'object' || Array.isArray(item)) {
// //       throw new Error('Chaque fiche doit être un objet JSON.');
// //     }
// //     const fiche = item as Record<string, unknown>;
// //     if (!Number.isInteger(fiche.numero) || (fiche.numero as number) < 1 || (fiche.numero as number) > 12) {
// //       throw new Error(`Numéro de fiche invalide : ${String(fiche.numero)}`);
// //     }
// //     if (numeros.has(fiche.numero as number)) {
// //       throw new Error(`Numéro de fiche en double : ${fiche.numero}`);
// //     }
// //     if (typeof fiche.slug !== 'string' || !fiche.slug.trim()) {
// //       throw new Error(`Slug manquant pour la fiche ${fiche.numero}`);
// //     }
// //     if (!Array.isArray(fiche.sections) || fiche.sections.length === 0) {
// //       throw new Error(`Sections manquantes pour la fiche ${fiche.numero}`);
// //     }
// //     numeros.add(fiche.numero as number);
// //   }
// //   return donnees as Record<string, unknown>[];
// // }

// // async function importer(): Promise<void> {
// //   const uri = process.env.MONGODB_ADDON_URI;
// //   if (!uri) {
// //     throw new Error('Ajoute MONGODB_URI (ou MONGO_URI) dans le fichier .env du backend.');
// //   }

// //   const fiches = chargerFiches();

// //   try {
// //     await connect(uri, { serverSelectionTimeoutMS: 10000 });
// //     console.log('✅ Connecté à MongoDB');

// //     const fichesModel = model(FicheOrale.name, FicheOraleSchema);
// //     await fichesModel.init();

// //     for (const fiche of fiches) {
// //       const numero = fiche.numero as number;
// //       // $set met à jour le cours et la correction, sans remplacer _id ou createdAt.
// //       const resultat = await fichesModel.updateOne(
// //         { numero },
// //         { $set: fiche },
// //         { upsert: true, runValidators: true, setDefaultsOnInsert: true },
// //       );
// //       const action = resultat.upsertedCount ? 'créée' : 'mise à jour';
// //       console.log(`✅ Fiche n°${numero} ${action}`);
// //     }

// //     console.log(`✅ Import terminé : ${fiches.length} fiche(s).`);
// //   } finally {
// //     await disconnect();
// //   }
// // }

// // importer().catch((erreur: unknown) => {
// //   console.error('❌ Import impossible :', erreur);
// //   process.exitCode = 1;
// // });


// import { NestFactory } from '@nestjs/core';
// import { getModelToken } from '@nestjs/mongoose';
// import { readFileSync } from 'node:fs';
// import { join } from 'node:path';
// import { Model } from 'mongoose';

// import { AppModule } from '../app.module';
// import {
//   FicheOrale,
//   FicheOraleDocument,
// } from 'src/modules/fiches-orales/schemas/fiche-orale.schema';

// // -----------------------------------------------------
// // Charger et valider les fiches orales
// // -----------------------------------------------------

// function loadFichesOrales(
//   filename: string,
// ): FicheOrale[] {
//   const path = join(
//     process.cwd(),
//     'src',
//     'data',
//     filename,
//   );

//   const fiches: unknown = JSON.parse(
//     readFileSync(path, 'utf-8'),
//   );

//   if (!Array.isArray(fiches) || fiches.length === 0) {
//     throw new Error(
//       `${filename} doit contenir au moins une fiche orale`,
//     );
//   }

//   const numeros = new Set<number>();
//   const slugs = new Set<string>();

//   for (const value of fiches) {
//     const fiche = value as Partial<FicheOrale>;

//     if (
//       !Number.isInteger(fiche.numero) ||
//       fiche.numero! < 1 ||
//       fiche.numero! > 12 ||
//       typeof fiche.slug !== 'string' ||
//       !fiche.slug.trim() ||
//       typeof fiche.titre !== 'string' ||
//       !fiche.titre.trim() ||
//       typeof fiche.introduction !== 'string' ||
//       !Array.isArray(fiche.permis) ||
//       fiche.permis.length === 0 ||
//       fiche.permis.some(
//         (permis) => !['C', 'CE'].includes(permis),
//       ) ||
//       !fiche.source ||
//       typeof fiche.versionContenu !== 'string' ||
//       !Array.isArray(fiche.sections) ||
//       fiche.sections.length === 0
//     ) {
//       throw new Error(
//         `Fiche orale invalide dans ${filename}`,
//       );
//     }

//     if (numeros.has(fiche.numero!)) {
//       throw new Error(
//         `Fiche n°${fiche.numero} en double`,
//       );
//     }

//     if (slugs.has(fiche.slug)) {
//       throw new Error(
//         `Slug en double : ${fiche.slug}`,
//       );
//     }

//     const points = fiche.sections.flatMap(
//       (section) => section.points ?? [],
//     );

//     if (
//       points.length === 0 ||
//       points.some(
//         (point) =>
//           !point.id ||
//           !point.titre ||
//           !point.cours ||
//           !point.entrainement ||
//           !point.entrainement.question ||
//           !Array.isArray(point.entrainement.criteres) ||
//           point.entrainement.criteres.length === 0,
//       )
//     ) {
//       throw new Error(
//         `Points d'apprentissage invalides dans la fiche ${fiche.numero}`,
//       );
//     }

//     numeros.add(fiche.numero!);
//     slugs.add(fiche.slug);
//   }

//   return fiches as FicheOrale[];
// }

// // -----------------------------------------------------
// // Importer dans MongoDB via NestJS
// // -----------------------------------------------------

// async function bootstrap() {
//   // Valider les données AVANT de lancer NestJS.
//   const fiches = loadFichesOrales(
//     'fiches-orales-import.json',
//   );

//   // La connexion MongoDB est gérée par AppModule.
//   const app = await NestFactory.createApplicationContext(
//     AppModule,
//   );

//   try {
//     const model = app.get<Model<FicheOraleDocument>>(
//       getModelToken(FicheOrale.name),
//     );

//     const result = await model.bulkWrite(
//       fiches.map((fiche) => ({
//         updateOne: {
//           filter: {
//             numero: fiche.numero,
//           },
//           update: {
//             $set: {
//               slug: fiche.slug,
//               titre: fiche.titre,
//               permis: fiche.permis,
//               introduction: fiche.introduction,
//               source: fiche.source,
//               versionContenu: fiche.versionContenu,
//               sections: fiche.sections,
//             },
//           },
//           upsert: true,
//         },
//       })),
//       { ordered: true },
//     );

//     console.log('✅ Import terminé !');
//     console.log('Fiches traitées :', fiches.length);
//     console.log('Fiches ajoutées :', result.upsertedCount);
//     console.log('Fiches modifiées :', result.modifiedCount);

//   } finally {
//     // await app.close();
//     console.log("DONE");
    
//   }
// }

// bootstrap().catch((error) => {
//   console.error('❌ Erreur pendant l’import :', error);
//   process.exitCode = 1;
// });

