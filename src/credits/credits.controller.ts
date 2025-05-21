import { Controller, Post, Body } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditCalculation } from './credits.service';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Post('calculate')
  calculateCredit(@Body() params: Omit<CreditCalculation, 'importeCuota' | 'importeTotal' | 'ganancia'>): CreditCalculation {
    return this.creditsService.calculateCredit(params);
  }
}
