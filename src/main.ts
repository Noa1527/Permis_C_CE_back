import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { setServers } from 'dns';
import cookieParser from 'cookie-parser';
import type { Request, Response, NextFunction } from 'express';


async function bootstrap() {
  setServers(['1.1.1.1', '8.8.8.8']);
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const clientUrl = new URL(
    configService.getOrThrow<string>('FRONTEND_URL'),
  ).origin;

  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
  app.use(cookieParser());

  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

   // Protection des requêtes d'écriture de cette API destinée au navigateur.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

    if (
      !safeMethods.includes(req.method) &&
      req.get('origin') !== clientUrl
    ) {
      res.status(403).json({
        message: 'Origine de la requête non autorisée.',
      });
      return;
    }

    next();
  });

  // app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }
  ));
  
  await app.listen(configService.get<number>('PORT') || 8081);
}
bootstrap();
