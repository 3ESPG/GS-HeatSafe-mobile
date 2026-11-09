import { alertasPorCenario, leiturasPorCenario, minutosAtras, residenciaBase, visitasMock } from '../mocks/dados';
import { Alerta, Cenario, Residencia, Visita } from '../types';
import { ApiError } from './http';

/**
 * Cliente da API do HeatSafe.
 * Por enquanto responde com dados simulados (mock), com atraso de rede e
 * possibilidade de falha, para o app tratar loading, erro e lista vazia.
 * Para usar a API C# real, basta trocar o corpo das funções por getJson(`${BASE_URL}/...`).
 */

const ATRASO_MS = 700;

interface ConfigMock {
  cenario: Cenario;
  simularFalha: boolean;
}

let config: ConfigMock = { cenario: 'PERIGO', simularFalha: false };

export function configurarMock(novo: ConfigMock) {
  config = novo;
}

async function simularRede<T>(gerar: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ATRASO_MS));
  if (config.simularFalha) {
    throw new ApiError('Não foi possível falar com o servidor do HeatSafe. Tente de novo em instantes.');
  }
  return gerar();
}

export function buscarResidencia(): Promise<Residencia> {
  return simularRede(() => {
    const leitura = leiturasPorCenario[config.cenario];
    return {
      ...residenciaBase,
      temperatura: leitura.temperatura,
      umidade: leitura.umidade,
      ultimoMovimento: minutosAtras(leitura.minutosSemMovimento),
      ultimaAgua: minutosAtras(leitura.minutosSemAgua),
      atualizadoEm: minutosAtras(1),
    };
  });
}

export function listarAlertas(): Promise<Alerta[]> {
  return simularRede(() => alertasPorCenario(config.cenario));
}

export async function buscarAlerta(id: string): Promise<Alerta> {
  const alertas = await listarAlertas();
  const alerta = alertas.find((a) => a.id === id);
  if (!alerta) throw new ApiError('Este alerta não existe mais.');
  return alerta;
}

export function listarVisitasPrioritarias(): Promise<Visita[]> {
  return simularRede(() => {
    if (config.cenario === 'NORMAL') return [];
    return [...visitasMock].sort((a, b) => b.pontuacao - a.pontuacao);
  });
}
