export type Nivel = 'NORMAL' | 'ATENCAO' | 'CAUTELA_EXTREMA' | 'PERIGO' | 'PERIGO_EXTREMO';

export type Modo = 'IDOSO' | 'FAMILIA' | 'AGENTE';

export type Cenario = 'NORMAL' | 'CAUTELA' | 'PERIGO';

export interface Residencia {
  id: string;
  moradora: string;
  bairro: string;
  temperatura: number;
  umidade: number;
  ultimoMovimento: string; // ISO
  ultimaAgua: string; // ISO
  atualizadoEm: string; // ISO
}

export interface Alerta {
  id: string;
  residenciaId: string;
  moradora: string;
  nivel: Nivel;
  indiceCalor: number;
  titulo: string;
  motivo: string;
  orientacao: string;
  dataHora: string; // ISO
}

export interface Visita {
  id: string;
  moradora: string;
  idade: number;
  endereco: string;
  nivel: Nivel;
  indiceCalor: number;
  horasSemMovimento: number;
  horasSemAgua: number;
  pontuacao: number;
  motivo: string;
}

export interface PrevisaoClima {
  temperaturaAgora: number;
  umidadeAgora: number;
  sensacaoAgora: number;
  maxAmanha: number;
  sensacaoMaxAmanha: number;
  dataAmanha: string; // YYYY-MM-DD
}

export type TipoRegistro = 'ESTOU_BEM' | 'AGUA' | 'CONFIRMACAO_ALERTA';

export interface Registro {
  id: number;
  tipo: TipoRegistro;
  dataHora: string; // ISO
  observacao: string | null;
  alertaId: string | null;
}

export interface Perfil {
  nome: string;
  modo: Modo;
  contatoNome: string;
  contatoTelefone: string;
  cenario: Cenario;
  simularFalha: boolean;
}
