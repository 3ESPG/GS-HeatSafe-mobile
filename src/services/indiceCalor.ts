import { Nivel } from '../types';

/**
 * Índice de calor da NOAA (regressão de Rothfusz + ajustes).
 * É a mesma fórmula usada no dispositivo ESP32 e na preparação dos dados do INMET.
 */
export function calcularIndiceCalor(temperaturaC: number, umidade: number): number {
  const t = (temperaturaC * 9) / 5 + 32;
  const rh = umidade;
  const simples = 0.5 * (t + 61 + (t - 68) * 1.2 + rh * 0.094);
  if ((simples + t) / 2 < 80) return arredondar(((simples - 32) * 5) / 9);

  let hi =
    -42.379 + 2.04901523 * t + 10.14333127 * rh - 0.22475541 * t * rh -
    0.00683783 * t * t - 0.05481717 * rh * rh + 0.00122874 * t * t * rh +
    0.00085282 * t * rh * rh - 0.00000199 * t * t * rh * rh;
  if (rh < 13 && t >= 80 && t <= 112) {
    hi -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
  } else if (rh > 85 && t >= 80 && t <= 87) {
    hi += ((rh - 85) / 10) * ((87 - t) / 5);
  }
  return arredondar(((hi - 32) * 5) / 9);
}

export function nivelDoIndice(indice: number): Nivel {
  if (indice < 27) return 'NORMAL';
  if (indice < 32) return 'ATENCAO';
  if (indice < 41) return 'CAUTELA_EXTREMA';
  if (indice < 54) return 'PERIGO';
  return 'PERIGO_EXTREMO';
}

export const nivelInfo: Record<Nivel, { rotulo: string; icone: string; orientacao: string }> = {
  NORMAL: {
    rotulo: 'Normal',
    icone: 'check-circle',
    orientacao: 'Temperatura tranquila. Continue bebendo água ao longo do dia.',
  },
  ATENCAO: {
    rotulo: 'Atenção',
    icone: 'info-circle',
    orientacao: 'Está esquentando. Beba um copo de água agora.',
  },
  CAUTELA_EXTREMA: {
    rotulo: 'Cautela extrema',
    icone: 'exclamation-triangle',
    orientacao: 'Calor forte. Beba água, abra as janelas e fique no cômodo mais fresco.',
  },
  PERIGO: {
    rotulo: 'Perigo',
    icone: 'exclamation-circle',
    orientacao: 'Calor perigoso. Beba água, molhe a nuca e avise que está bem.',
  },
  PERIGO_EXTREMO: {
    rotulo: 'Perigo extremo',
    icone: 'ambulance',
    orientacao: 'Risco à saúde. Se sentir tontura ou confusão, ligue 192 (SAMU).',
  },
};

function arredondar(valor: number): number {
  return Math.round(valor * 10) / 10;
}
