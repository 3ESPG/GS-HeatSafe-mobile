import { ReactNode } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { colors, fonts } from '../theme';

type Variante = 'titulo' | 'subtitulo' | 'corpo' | 'apoio';

interface Props extends TextProps {
  variante?: Variante;
  cor?: string;
  children: ReactNode;
}

/** Texto padronizado. Respeita o tamanho de fonte escolhido no celular (allowFontScaling). */
export function Texto({ variante = 'corpo', cor, style, children, ...rest }: Props) {
  return (
    <Text
      style={[styles[variante], cor ? { color: cor } : null, style]}
      accessibilityRole={variante === 'titulo' ? 'header' : undefined}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: fonts.size.xl, fontWeight: fonts.weight.bold, color: colors.text },
  subtitulo: { fontSize: fonts.size.lg, fontWeight: fonts.weight.semibold, color: colors.text },
  corpo: { fontSize: fonts.size.md, color: colors.text, lineHeight: fonts.lineHeight.corpo },
  apoio: { fontSize: fonts.size.sm, color: colors.textMuted, lineHeight: fonts.lineHeight.apoio },
});
