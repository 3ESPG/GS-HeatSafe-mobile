import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing, fonts } from '../theme';
import { Texto } from './Texto';

interface Props {
  icone: ComponentProps<typeof FontAwesome>['name'];
  rotulo: string;
  valor: string;
  destaque?: boolean;
}

/** Linha "ícone · rótulo · valor", lida como uma frase só pelo leitor de tela. */
export function InfoLinha({ icone, rotulo, valor, destaque = false }: Props) {
  return (
    <View style={styles.linha} accessible accessibilityLabel={`${rotulo}: ${valor}`}>
      <FontAwesome name={icone} size={22} color={destaque ? colors.danger : colors.textMuted} style={styles.icone} />
      <View style={styles.textos}>
        <Texto variante="apoio">{rotulo}</Texto>
        <Texto style={destaque ? styles.destaque : undefined}>{valor}</Texto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xs },
  icone: { width: 28, textAlign: 'center' },
  textos: { flex: 1 },
  destaque: { color: colors.danger, fontWeight: fonts.weight.bold },
});
