import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import argon2 from 'argon2';
import moment from 'moment';
import { Model } from 'mongoose';
import { UserDocument } from 'src/modules/users/schemas/users.schema';
import { UsersService } from 'src/modules/users/users.service';
import { v4 as uuidV4 } from 'uuid';
import { EmailToken, EmailTokenDocument } from 'src/modules/auth/schema/email-token.schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(EmailToken.name)
    private emailTokenModel: Model<EmailTokenDocument>
  ) { }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await argon2.verify(
      user.password, 
      pass,         
    );

    if (!isPasswordValid) {
      return null;
    }

    const { password, ...safeUser } = user.toObject();
    void password;

    return safeUser;
  }

  async getAuthSystem(email: string) {
    return this.usersService.findOneByEmail(email).then((user) => {
      console.log('user',user);
      
      if (!user) throw new UnauthorizedException();
      return { system: user.authenticationMethod };
    });
  }

  
  async signIn(user: UserDocument) {
    const payload = {
      _id: String(user._id),
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  setNewToken(user: UserDocument): string {
    const payload = {
      _id: user._id,
    };
    return this.jwtService.sign(payload);
  }

  async createSignToken(userId: string) {
    const token: string = uuidV4();

    return this.emailTokenModel.create({
      _user: userId,
      token
    })
  }

  // async signInWithToken(token: string) {
  //   const tokenPayload = this.jwtService.decode(token);
  //   const user = await this.usersService.findOne(tokenPayload['_id']);

  //   if (!user)
  //     throw new UnauthorizedException();

  //   const payload = {
  //     _id: user._id,
  //   };

  //   return {
  //     user,
  //     accessToken: this.jwtService.sign(payload),
  //     exp: moment().add(7, 'days').unix(),
  //   };
  // }

  async signInWithToken(token: unknown) {
    console.log('< TOKEN >',token);
    
    if (typeof token !== 'string' || !token.trim()) {
        throw new UnauthorizedException('Token manquant.');
    }

    let payload: { _id?: string };

    try {
        payload = await this.jwtService.verifyAsync<{
            _id?: string;
        }>(token);
    } catch {
        throw new UnauthorizedException(
            'Token invalide ou expiré.',
        );
    }

    if (
        !payload ||
        typeof payload._id !== 'string' ||
        !/^[a-fA-F0-9]{24}$/.test(payload._id)
    ) {
        throw new UnauthorizedException(
            'Identifiant utilisateur invalide.',
        );
    }

    const user = await this.usersService.findOne(payload._id);

    if (!user) {
        throw new UnauthorizedException(
            'Utilisateur introuvable.',
        );
    }

    const accessToken = await this.jwtService.signAsync(
        {
            _id: String(user._id),
        },
        {
            expiresIn: '7d',
        },
    );

    return {
        // Ajoute ici les champs publics nécessaires au front.
        // Ne renvoie pas le mot de passe ou son hash.
        user: {
            _id: String(user._id),
        },
        accessToken,
    };
  }

  async connectUser(user: UserDocument) {
    const payload = {
      _id: user._id,
    };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
      exp: moment().add(7, 'days').unix(),
    };
  }
}