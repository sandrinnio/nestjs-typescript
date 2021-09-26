import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import User from '../users/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { CurrentUser } from './current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  authenticate(@CurrentUser() user: User) {
    return user;
  }

  @Post('register')
  register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @Post('log-in')
  @UseGuards(LocalAuthenticationGuard)
  logIn(@CurrentUser() user: User, @Req() req: Request) {
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    req.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @Post('log-out')
  @UseGuards(JwtAuthenticationGuard)
  logOut(@Res() res: Response) {
    res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return res.sendStatus(200);
  }
}
