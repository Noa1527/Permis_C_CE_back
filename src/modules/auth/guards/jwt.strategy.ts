import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { type UserDocument } from 'src/modules/users/schemas/users.schema';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          const token = request?.cookies?.accessToken;
          
          return typeof token === 'string' ? token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('SECRET_KEY'),
    });
  }

  async validate(payload: any): Promise<UserDocument> {
    if (typeof payload?._id !== 'string' || !payload._id) {
      throw new UnauthorizedException('Token invalide.');
    }

    const user = await this.userService.findOne(payload._id);

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable.');
    }

    return user;
  }
}