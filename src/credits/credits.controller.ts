import { Controller, Post, Body, Get, Param, Delete, Logger } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditCalculation } from './credits.service';

@Controller('credits')
export class CreditsController {
  private readonly logger = new Logger(CreditsController.name);
  constructor(private readonly creditsService: CreditsService) {}

  @Post('calculate')
  calculateCredit(@Body() params: Omit<CreditCalculation, 'id' | 'importeCuota' | 'importeTotal' | 'ganancia'>): CreditCalculation {
    this.logger.log(`Calculando crédito con parámetros: ${JSON.stringify(params)}`);
    const result = this.creditsService.calculateCredit(params);
    this.logger.log(`Resultado del cálculo de crédito: ${JSON.stringify(result)}`);
    return result;
  }

  @Get()
  getAllCalculations(): CreditCalculation[] {
    this.logger.log('Obteniendo todos los cálculos de crédito');
    const results = this.creditsService.getAllCalculations();
    this.logger.log(`Encontrados ${results.length} cálculos de crédito`);
    return results;
  }

  @Get(':id')
  getCalculation(@Param('id') id: number): CreditCalculation | undefined {
    this.logger.log(`Obteniendo cálculo de crédito con ID: ${id}`);
    const result = this.creditsService.getCalculation(id);
    this.logger.log(`Cálculo encontrado: ${result ? 'sí' : 'no'}`);
    return result;
  }

  @Delete(':id')
  deleteCalculation(@Param('id') id: number): boolean {
    this.logger.log(`Eliminando cálculo de crédito con ID: ${id}`);
    const success = this.creditsService.deleteCalculation(id);
    this.logger.log(`Delete operation ${success ? 'successful' : 'failed'}`);
    return success;
  }
}
