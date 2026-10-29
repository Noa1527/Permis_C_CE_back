import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/modules/users/schemas/users.schema';
import { AuthService } from 'src/modules/auth/auth.service';
import { LocalAuthGuard } from 'src/modules/auth/guards/local-auth.guard';
import type {CookieOptions, Response as ExpressResponse, Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) { }

   private get cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
      path: '/',
    };
  }

  private publicUser(user: UserDocument) {
    return {
      _id: String(user._id),
      email: user.email,
      role: user.role,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(200)
  async signIn(
    @Req() req: Request & { user: UserDocument },
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const { accessToken } = await this.authService.signIn(req.user);
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const proce = this.configService.get<string>('FRONTEND_URL')

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      partitioned: isProduction ? true : false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours, en millisecondes
    });

    res.setHeader('Cache-Control', 'no-store');

    return {
      user: {
        _id: String(req.user._id),
        email: req.user.email,
        role: req.user.role,
      },
    };
  }

  // @Post('sign-in-with-token')
  // async signInWithToken(
  //   @Body('accessToken') accessToken: unknown,
  // ) {
  //   return this.authService.signInWithToken(accessToken);
  // }
  @Post('sign-in-with-token')
  async signInWithToken(@Req() req: ExpressRequest) {
      const token: unknown = req.cookies?.accessToken;

      const result = await this.authService.signInWithToken(token);

      return {
          user: result.user,
      };
  }

  @Get('check-system')
  async getAuthSystem(@Req() req) {
    console.log(req);
    
    return this.authService.getAuthSystem(req.query.email);
  }

  @Post('sign-out')
    @HttpCode(200)
    signOut(@Res({ passthrough: true }) res: ExpressResponse) {
      console.log('LogOut');
      
      res.clearCookie('accessToken', this.cookieOptions);
      res.setHeader('Cache-Control', 'no-store');
  
      return { success: true };
    }
}
