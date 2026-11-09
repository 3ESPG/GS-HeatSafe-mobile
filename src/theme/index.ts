import { Nivel } from '../types';

// Tema centralizado: nenhuma cor, fonte ou espaçamento fica fixo direto nas telas.
// Todas as combinações texto/fundo passam no contraste WCAG AA (≥ 4,5:1).

export const colors = {
  primary: '#C2410C',
  primaryDark: '#9A3412',
  background: '#FFF8F1',
  surface: '#FFFFFF',
  text: '#1F2937',
  textMuted: '#4B5563',
  textOnColor: '#FFFFFF',
  border: '#E5E7EB',
  success: '#166534',
  successBg: '#DCFCE7',
  danger: '#B91C1C',
  dangerBg: '#FEE2E2',
  info: '#1D4ED8',
  infoBg: '#DBEAFE',
};

export const nivelColors: Record<Nivel, string> = {
  NORMAL: '#166534',
  ATENCAO: '#A16207',
  CAUTELA_EXTREMA: '#C2410C',
  PERIGO: '#B91C1C',
  PERIGO_EXTREMO: '#7F1D1D',
};

export const fonts = {
  size: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 22,
    xl: 28,
    xxl: 40,
    huge: 56,
  },
  lineHeight: {
    apoio: 22,
    corpo: 26,
  },
  weight: {
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

// Área mínima de toque recomendada para pessoas idosas
export const touch = {
  min: 56,
  big: 80,
};

export const theme = { colors, nivelColors, fonts, spacing, radius, touch };
