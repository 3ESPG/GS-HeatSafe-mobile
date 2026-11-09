import { PrevisaoClima } from '../types';
import { getJson } from './http';

/**
 * API pública e gratuita Open-Meteo (https://open-meteo.com), sem chave.
 * Traz o clima de agora e a previsão de amanhã para São Paulo.
 */
const SAO_PAULO = { latitude: -23.55, longitude: -46.63 };

const URL =
  'https://api.open-meteo.com/v1/forecast' +
  `?latitude=${SAO_PAULO.latitude}&longitude=${SAO_PAULO.longitude}` +
  '&current=temperature_2m,relative_humidity_2m,apparent_temperature' +
  '&daily=temperature_2m_max,apparent_temperature_max' +
  '&timezone=America%2FSao_Paulo&forecast_days=2';

interface RespostaOpenMeteo {
  current: { temperature_2m: number; relative_humidity_2m: number; apparent_temperature: number };
  daily: { time: string[]; temperature_2m_max: number[]; apparent_temperature_max: number[] };
}

export async function buscarPrevisaoSaoPaulo(): Promise<PrevisaoClima> {
  const dados = await getJson<RespostaOpenMeteo>(URL);
  return {
    temperaturaAgora: dados.current.temperature_2m,
    umidadeAgora: dados.current.relative_humidity_2m,
    sensacaoAgora: dados.current.apparent_temperature,
    maxAmanha: dados.daily.temperature_2m_max[1],
    sensacaoMaxAmanha: dados.daily.apparent_temperature_max[1],
    dataAmanha: dados.daily.time[1],
  };
}
