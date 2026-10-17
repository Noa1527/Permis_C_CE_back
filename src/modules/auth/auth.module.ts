import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/modules/users/users.module';
import { User, UserSchema } from 'src/modules/users/schemas/users.schema';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtStrategy } from 'src/modules/auth/guards/jwt.strategy';
import { LocalStrategy } from 'src/modules/auth/guards/local.strategy';
import { EmailToken, EmailTokenSchema } from 'src/modules/auth/schema/email-token.schema';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: EmailToken.name, schema: EmailTokenSchema
      }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule { }