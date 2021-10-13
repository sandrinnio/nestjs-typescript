import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { CurrentUser } from './customs/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { TwoFactorAuthenticationDto } from './dto/two-factor-authentication.dto';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  authenticate(@CurrentUser() user: User) {
    return user;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@CurrentUser() user: User, @Req() req: Request) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      user.id,
    );
    req.res.setHeader('Set-Cookie', accessTokenCookie);
    return user;
  }

  @Post('register')
  register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @Post('log-in')
  @UseGuards(LocalAuthenticationGuard)
  async logIn(@CurrentUser() user: User, @Req() req: Request) {
    if (user.isTwoFactorAuthenticationEnabled) {
      return;
    }
    const accessToken = this.authenticationService.getCookieWithJwtToken(
      user.id,
    );
    const { cookie, token } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setJwtRefreshToken(user.id, token);
    req.res.setHeader('Set-Cookie', [accessToken, cookie]);
    return user;
  }

  @HttpCode(200)
  @Post('log-out')
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@CurrentUser() user: User, @Req() req: Request) {
    await this.usersService.removeJwtRefreshToken(user.id);
    req.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
  }

  @Post('2fa-generate')
  @UseGuards(JwtAuthenticationGuard)
  async generateTwoAuth(@CurrentUser() user: User, @Res() response: Response) {
    const { otpauthUri } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        user,
      );
    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUri,
    );
  }

  @Post('2fa-turn-on')
  @UseGuards(JwtAuthenticationGuard)
  async turnOnTwoFactorAuthentication(
    @CurrentUser() user: User,
    @Body() { secret }: TwoFactorAuthenticationDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        secret,
        user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication(user.id);
  }

  @Post('2fa-authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  authenticateTwoFactor(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Body() { secret }: TwoFactorAuthenticationDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        secret,
        user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      user.id,
      {
        isSecondFactorAuthenticated: true,
      },
    );
    req.res.setHeader('Set-Cookie', [accessTokenCookie]);
    return user;
  }
}
