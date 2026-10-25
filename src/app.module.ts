import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppLoggerMiddleware } from 'src/middlewares/logger';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ProgressionModule } from 'src/modules/progression/progression.module';
import { AdministrationModule } from 'src/modules/administration/administration.module';
import { DashboardModule } from 'src/modules/dashboard/dashboard.module';
import { QuestionsEcritesModule } from 'src/modules/questions-ecrites/questions-ecrites.module';
import { FichesOralesModule } from 'src/modules/fiches-orales/fiches-orales.module';
import { ThemesModule } from 'src/modules/themes/themes.module';
import { VerificationsModule } from 'src/modules/verifications/verifications.module';
import { ManiabiliteModule } from 'src/modules/maniabilite/maniabilite.module';
import { AttelageDetelageModule } from 'src/modules/attelage-detelage/attelage-detelage.module';
import { CodeRouteModule } from 'src/modules/code-route/code-route.module';
import { ExamensBlancsModule } from 'src/modules/examens-blancs/examens-blancs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_ADDON_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    QuestionsEcritesModule,
    FichesOralesModule,
    ThemesModule,
    VerificationsModule,
    ManiabiliteModule,
    ExamensBlancsModule,
    ProgressionModule,
    DashboardModule,
    AttelageDetelageModule,
    CodeRouteModule,
    AdministrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
