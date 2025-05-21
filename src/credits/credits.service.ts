import { Injectable } from '@nestjs/common';

export interface CreditCalculation {
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
  calculateCredit(params: CreditCalculation): CreditCalculation {
    const { importe, tasaInteres, numeroCuotas } = params;

    // Convertir la tasa de interés anual a mensual
    const tasaMensual = tasaInteres / 1200; // Dividir por 12 meses y 100 para convertir a decimal

    // Cálculo usando la fórmula de interés compuesto
    const importeCuota = importe * (tasaMensual * Math.pow(1 + tasaMensual, numeroCuotas)) / (Math.pow(1 + tasaMensual, numeroCuotas) - 1);
    const importeTotal = importeCuota * numeroCuotas;
    const ganancia = importeTotal - importe;

    return {
      ...params,
      importeCuota: Number(importeCuota.toFixed(2)),
      importeTotal: Number(importeTotal.toFixed(2)),
      ganancia: Number(ganancia.toFixed(2)),
    };
  }
}
