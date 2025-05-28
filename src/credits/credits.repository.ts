import { Injectable, Logger } from '@nestjs/common';
import { CreditCalculation } from './credits.service';

@Injectable()
export class CreditsRepository {
  private readonly logger = new Logger(CreditsRepository.name);
  private calculations: CreditCalculation[] = [];
  private idCounter = 1;

  getAll(): CreditCalculation[] {
    this.logger.log('Obteniendo todos los cálculos de crédito del repositorio');
    const results = [...this.calculations];
    this.logger.log(`Encontrados ${results.length} cálculos de crédito`);
    return results;
  }

  add(calculation: CreditCalculation): CreditCalculation {
    this.logger.log(`Agregando nuevo cálculo: ${JSON.stringify(calculation)}`);
    const newCalculation = {
      ...calculation,
      id: this.idCounter++,
      fechaInicio: new Date(calculation.fechaInicio)
    };
    this.calculations.push(newCalculation);
    this.logger.log(`Agregado cálculo con ID: ${newCalculation.id}`);
    return newCalculation;
  }

  findById(id: number): CreditCalculation | undefined {
    this.logger.log(`Buscando cálculo con ID: ${id}`);
    const result = this.calculations.find(calc => calc.id === id);
    this.logger.log(`Cálculo encontrado: ${result ? 'sí' : 'no'}`);
    return result;
  }

  delete(id: number): boolean {
    this.logger.log(`Intentando eliminar cálculo con ID: ${id}`);
    const index = this.calculations.findIndex(calc => calc.id === id);
    if (index === -1) {
      this.logger.log('Cálculo no encontrado');
      return false;
    }
    this.calculations.splice(index, 1);
    this.logger.log('Cálculo eliminado exitosamente');
    return true;
  }
}
