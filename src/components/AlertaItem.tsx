import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { nivelInfo } from '../services/indiceCalor';
import { colors, nivelColors, radius, spacing, touch, fonts } from '../theme';
import { Alerta } from '../types';
import { formatarDataHora } from '../utils/formatar';
import { Texto } from './Texto';

interface Props {
  alerta: Alerta;
  confirmado: boolean;
  onPress: () => void;
}

export function AlertaItem({ alerta, confirmado, onPress }: Props) {
  const info = nivelInfo[alerta.nivel];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Alerta de ${info.rotulo}: ${alerta.titulo}. ${formatarDataHora(alerta.dataHora)}. ${confirmado ? 'Já confirmado.' : 'Aguardando confirmação.'}`}
      accessibilityHint="Abre os detalhes do alerta"
      style={({ pressed }) => [styles.item, { borderLeftColor: nivelColors[alerta.nivel] }, pressed && styles.pressionado]}
    >
      <View style={[styles.selo, { backgroundColor: nivelColors[alerta.nivel] }]}>
        <FontAwesome name={info.icone as ComponentProps<typeof FontAwesome>['name']} size={22} color={colors.textOnColor} />
      </View>
      <View style={styles.textos}>
        <Texto variante="apoio" cor={nivelColors[alerta.nivel]} style={styles.nivel}>
          {info.rotulo.toUpperCase()}
        </Texto>
        <Texto style={styles.titulo}>{alerta.titulo}</Texto>
        <Texto variante="apoio">
          {formatarDataHora(alerta.dataHora)} · {confirmado ? 'Confirmado' : 'Aguardando confirmação'}
        </Texto>
      </View>
      <FontAwesome name="chevron-right" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: touch.big,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 6,
  },
  pressionado: { opacity: 0.7 },
  selo: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  textos: { flex: 1, gap: spacing.xs },
  nivel: { fontWeight: fonts.weight.bold },
  titulo: { fontWeight: fonts.weight.semibold },
});
