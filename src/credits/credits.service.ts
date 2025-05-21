import { Injectable } from '@nestjs/common';

export interface CreditCalculation {
  cliente: string;
  importe: number;
  modalidad: 'Mensual' | 'Quincenal' | 'Semanal';
  tazaInteres: number;
  numeroCuotas: number;
  fechaInicio: Date;
  importeCuota: number;
  importeTotal: number;
  ganancia: number;
}

@Injectable()
export class CreditsService {
  calculateCredit(params: Omit<CreditCalculation, 'importeCuota' | 'importeTotal' | 'ganancia'>): CreditCalculation {
    const { importe, tazaInteres, numeroCuotas } = params;

    // Calculate total amount with interest
    const importeTotal = importe * (1 + tazaInteres / 100);

    // Calculate installment amount
    const importeCuota = importeTotal / numeroCuotas;

    // Calculate profit
    const ganancia = importeTotal - importe;

    return {
      ...params,
      importeCuota,
      importeTotal,
      ganancia,
    };
  }
}
