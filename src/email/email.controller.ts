import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { EmailScheduleDto } from './dto/email-schedule.dto';
import { EmailSchedulingService } from './email-schedule.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  scheduleEmail(@Body() email: EmailScheduleDto) {
    return this.emailSchedulingService.scheduleEmail(email);
  }
}
