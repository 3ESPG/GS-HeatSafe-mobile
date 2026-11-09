import { Alerta, Cenario, Visita } from '../types';

/**
 * Dados SIMULADOS do backend do HeatSafe (dispositivo ESP32 + API).
 * Todas as pessoas e endereços são fictícios. Os horários são calculados
 * em relação ao momento atual para a simulação parecer "ao vivo".
 */

const minutosAtras = (min: number) => new Date(Date.now() - min * 60_000).toISOString();

interface LeituraCasa {
  temperatura: number;
  umidade: number;
  minutosSemMovimento: number;
  minutosSemAgua: number;
}

export const leiturasPorCenario: Record<Cenario, LeituraCasa> = {
  NORMAL: { temperatura: 24.5, umidade: 55, minutosSemMovimento: 10, minutosSemAgua: 40 },
  CAUTELA: { temperatura: 34, umidade: 50, minutosSemMovimento: 50, minutosSemAgua: 150 },
  PERIGO: { temperatura: 38, umidade: 52, minutosSemMovimento: 135, minutosSemAgua: 200 },
};

export const residenciaBase = {
  id: 'HS-001',
  moradora: 'Dona Maria (fictícia)',
  bairro: 'Itaim Paulista, São Paulo',
};

export function alertasPorCenario(cenario: Cenario): Alerta[] {
  if (cenario === 'NORMAL') return [];

  const alertas: Alerta[] = [
    {
      id: 'AL-103',
      residenciaId: 'HS-001',
      moradora: residenciaBase.moradora,
      nivel: 'CAUTELA_EXTREMA',
      indiceCalor: 36.4,
      titulo: 'Casa muito quente e sem água há 2h',
      motivo: 'O índice de calor dentro da casa passou de 32 °C e ninguém apertou o botão "Bebi água" nas últimas 2 horas.',
      orientacao: 'Ligue e lembre de beber água e abrir as janelas.',
      dataHora: minutosAtras(25),
    },
    {
      id: 'AL-098',
      residenciaId: 'HS-001',
      moradora: residenciaBase.moradora,
      nivel: 'ATENCAO',
      indiceCalor: 29.8,
      titulo: 'Previsão: amanhã será um dia perigoso',
      motivo: 'O modelo de previsão (dados do INMET) indicou que amanhã o índice de calor deve passar de 32 °C. O modo vigilância foi ligado.',
      orientacao: 'Combine com sua familiar de ligar no início da tarde.',
      dataHora: minutosAtras(60 * 20),
    },
  ];

  if (cenario === 'PERIGO') {
    alertas.unshift({
      id: 'AL-104',
      residenciaId: 'HS-001',
      moradora: residenciaBase.moradora,
      nivel: 'PERIGO',
      indiceCalor: 47.2,
      titulo: 'Calor perigoso e sem movimento há 2h',
      motivo: 'O índice de calor dentro da casa está acima de 41 °C e o sensor de presença não detecta movimento há mais de 2 horas. O alarme tocou e não houve resposta.',
      orientacao: 'Ligue agora ou vá até a casa. Se ninguém confirmar em 20 minutos, a UBS será avisada.',
      dataHora: minutosAtras(4),
    });
  }
  return alertas;
}

export const visitasMock: Visita[] = [
  {
    id: 'V-01', moradora: 'Dona Maria (fictícia)', idade: 78, endereco: 'Rua das Acácias, 120 (fictício)',
    nivel: 'PERIGO', indiceCalor: 47.2, horasSemMovimento: 2.3, horasSemAgua: 3.3, pontuacao: 92,
    motivo: 'Calor perigoso, sem movimento e alerta da família sem resposta',
  },
  {
    id: 'V-02', moradora: 'Seu José (fictício)', idade: 72, endereco: 'Rua dos Ipês, 45 (fictício)',
    nivel: 'CAUTELA_EXTREMA', indiceCalor: 38.1, horasSemMovimento: 0.5, horasSemAgua: 4.1, pontuacao: 71,
    motivo: 'Sem registrar água há mais de 4 horas',
  },
  {
    id: 'V-03', moradora: 'Dona Lurdes (fictícia)', idade: 85, endereco: 'Travessa Jacarandá, 8 (fictício)',
    nivel: 'CAUTELA_EXTREMA', indiceCalor: 35.6, horasSemMovimento: 1.2, horasSemAgua: 1.5, pontuacao: 58,
    motivo: 'Idade avançada e casa em cautela extrema',
  },
  {
    id: 'V-04', moradora: 'Seu Antônio (fictício)', idade: 69, endereco: 'Rua Manacá, 300 (fictício)',
    nivel: 'ATENCAO', indiceCalor: 30.2, horasSemMovimento: 0.2, horasSemAgua: 0.8, pontuacao: 24,
    motivo: 'Casa esquentando, mas com atividade normal',
  },
];

export { minutosAtras };
