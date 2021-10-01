import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller('subscribers')
export class SubscribersController {
  @Inject('SUBSCRIBERS_SERVICE')
  private subscribersService: ClientProxy;

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getAllSubscribers() {
    return this.subscribersService.send('get-all-subscribers', '');
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createSubscriber(@Body() createSubscriber: CreateSubscriberDto) {
    return this.subscribersService.send('create-subscriber', createSubscriber);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  removeSubscriber(@Param('id') subscriberId: string) {
    return this.subscribersService.send('remove-subsriber', subscriberId);
  }
}
