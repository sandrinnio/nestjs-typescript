import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { CurrentUser } from './customs/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
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
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      user.id,
    );
    const { cookie, token } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setJwtRefreshToken(user.id, token);
    req.res.setHeader('Set-Cookie', [accessTokenCookie, cookie]);
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
}
