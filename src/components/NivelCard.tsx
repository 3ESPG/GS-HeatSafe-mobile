import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { nivelInfo } from '../services/indiceCalor';
import { colors, fonts, nivelColors, radius, spacing } from '../theme';
import { Nivel } from '../types';
import { formatarGraus } from '../utils/formatar';

interface Props {
  nivel: Nivel;
  indiceCalor: number;
  legenda: string;
}

/** Cartão grande com o nível de risco. Comunica por cor, ícone e texto (não só por cor). */
export function NivelCard({ nivel, indiceCalor, legenda }: Props) {
  const info = nivelInfo[nivel];
  return (
    <View
      style={[styles.card, { backgroundColor: nivelColors[nivel] }]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${legenda}: índice de calor ${formatarGraus(indiceCalor)}. Nível ${info.rotulo}. ${info.orientacao}`}
    >
      <Text style={styles.legenda}>{legenda}</Text>
      <Text style={styles.valor}>{formatarGraus(indiceCalor)}</Text>
      <View style={styles.linha}>
        <FontAwesome name={info.icone as ComponentProps<typeof FontAwesome>['name']} size={26} color={colors.textOnColor} />
        <Text style={styles.nivel}>{info.rotulo.toUpperCase()}</Text>
      </View>
      <Text style={styles.orientacao}>{info.orientacao}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm },
  legenda: { color: colors.textOnColor, fontSize: fonts.size.md, fontWeight: fonts.weight.semibold },
  valor: { color: colors.textOnColor, fontSize: fonts.size.huge, fontWeight: fonts.weight.bold },
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  nivel: { color: colors.textOnColor, fontSize: fonts.size.lg, fontWeight: fonts.weight.bold },
  orientacao: { color: colors.textOnColor, fontSize: fonts.size.md, lineHeight: fonts.lineHeight.corpo },
});
