import { Controller, Get } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller('frontend')
export class FrontendController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
