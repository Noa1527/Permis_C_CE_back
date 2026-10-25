
// import { NestFactory } from '@nestjs/core';
// import { getModelToken } from '@nestjs/mongoose';
// import { readFileSync } from 'node:fs';
// import { join } from 'node:path';
// import { Model } from 'mongoose';

// import { AppModule } from '../app.module';
// import {
//   QuestionEcrite,
//   QuestionEcriteDocument,
// } from 'src/modules/questions-ecrites/schemas/question-ecrite.schema';
// import { Permis } from 'src/enums/permis.enum';

// type QuestionImport = {
//   permis: Permis;
//   fiche: number;
//   numero: number;
//   question: string;
//   reponse: string;
//   explication: string;
// };

// function loadQuestions(
//   filename: string,
//   permis: Permis,
// ): QuestionImport[] {
//   const path = join(process.cwd(), 'src', 'data', filename);

//   const questions: unknown = JSON.parse(
//     readFileSync(path, 'utf-8'),
//   );

//   if (!Array.isArray(questions) || questions.length !== 200) {
//     throw new Error(
//       `${filename} doit contenir exactement 200 questions`,
//     );
//   }

//   const positions = new Set<string>();

//   for (const value of questions) {
//     const q = value as QuestionImport;

//     if (
//       q.permis !== permis ||
//       !Number.isInteger(q.fiche) ||
//       q.fiche < 1 ||
//       q.fiche > 20 ||
//       !Number.isInteger(q.numero) ||
//       q.numero < 1 ||
//       q.numero > 10 ||
//       typeof q.question !== 'string' ||
//       !q.question.trim() ||
//       typeof q.reponse !== 'string' ||
//       !q.reponse.trim() ||
//       typeof q.explication !== 'string'
//     ) {
//       throw new Error(`Question invalide dans ${filename}`);
//     }

//     const position = `${q.fiche}-${q.numero}`;

//     if (positions.has(position)) {
//       throw new Error(
//         `Position en double : ${position} dans ${filename}`,
//       );
//     }

//     positions.add(position);
//   }

//   return questions as QuestionImport[];
// }

// async function bootstrap() {
//   // Valider les fichiers AVANT de modifier MongoDB.
//   const questions = [
//     ...loadQuestions('questions-c.json', Permis.C),
//     // ...loadQuestions('questions-ce.json', Permis.CE),
//   ];

//   const app = await NestFactory.createApplicationContext(
//     AppModule,
//   );

//   try {
//     const model = app.get<Model<QuestionEcriteDocument>>(
//       getModelToken(QuestionEcrite.name),
//     );

//     const result = await model.bulkWrite(
//       questions.map((q) => ({
//         updateOne: {
//           filter: {
//             permis: q.permis,
//             fiche: q.fiche,
//             numero: q.numero,
//           },
//           update: {
//             $set: {
//               question: q.question,
//               reponse: q.reponse,
//               explication: q.explication,
//             },
//           },
//           upsert: true,
//         },
//       })),
//       { ordered: true },
//     );

//     console.log('Import terminé !');
//     console.log('Questions traitées :', questions.length);
//     console.log('Questions ajoutées :', result.upsertedCount);
//     console.log('Questions modifiées :', result.modifiedCount);
//   } finally {
//     await app.close();
//   }
// }

// bootstrap().catch((error) => {
//   console.error('Erreur pendant l’import :', error);
//   process.exitCode = 1;
// });
