import { Injectable, Logger } from '@nestjs/common';
import { CreditsRepository } from './credits.repository';

export interface CreditCalculation {
  id?: number;
  cliente: string;
  importe: number;
  modalidad: 'Mensual' | 'Quincenal' | 'Semanal';
  tasaInteres: number;
  numeroCuotas: number;
  fechaInicio: Date;
  importeCuota?: number;
  importeTotal?: number;
  ganancia?: number;
}

@Injectable()
export class CreditsService {
  private readonly logger = new Logger(CreditsService.name);
  constructor(private readonly repository: CreditsRepository) {}

  calculateCredit(params: Omit<CreditCalculation, 'id' | 'importeCuota' | 'importeTotal' | 'ganancia'>): CreditCalculation {
    this.logger.log(`Calculating credit with params: ${JSON.stringify(params)}`);
    const { importe, tasaInteres, numeroCuotas } = params;

    // Convertir la tasa de interés anual a mensual
    const tasaMensual = tasaInteres / 1200; // Dividir por 12 meses y 100 para convertir a decimal

    // Cálculo usando la fórmula de interés compuesto
    const importeCuota = importe * (tasaMensual * Math.pow(1 + tasaMensual, numeroCuotas)) / (Math.pow(1 + tasaMensual, numeroCuotas) - 1);
    const importeTotal = importeCuota * numeroCuotas;
    const ganancia = importeTotal - importe;

    const result = {
      ...params,
      importeCuota: Number(importeCuota.toFixed(2)),
      importeTotal: Number(importeTotal.toFixed(2)),
      ganancia: Number(ganancia.toFixed(2)),
    };

    this.logger.log(`Resultado del cálculo de crédito: ${JSON.stringify(result)}`);
    return this.repository.add(result);
  }

  getAllCalculations(): CreditCalculation[] {
    this.logger.log('Obteniendo todos los cálculos de crédito');
    const results = this.repository.getAll();
    this.logger.log(`Encontrados ${results.length} cálculos de crédito`);
    return results;
  }

  getCalculation(id: number): CreditCalculation | undefined {
    this.logger.log(`Obteniendo cálculo de crédito con ID: ${id}`);
    const result = this.repository.findById(id);
    this.logger.log(`Cálculo encontrado: ${result ? 'sí' : 'no'}`);
    return result;
  }

  deleteCalculation(id: number): boolean {
    this.logger.log(`Eliminando cálculo de crédito con ID: ${id}`);
    const success = this.repository.delete(id);
    this.logger.log(`Operación de eliminación ${success ? 'exitosa' : 'fallida'}`);
    return success;
  }
}
