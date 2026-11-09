import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, touch } from '../theme';

interface Props {
  rotulo: string;
  onPress: () => void;
  icone?: ComponentProps<typeof FontAwesome>['name'];
  cor?: string;
  variante?: 'cheio' | 'contorno';
  tamanho?: 'normal' | 'grande';
  carregando?: boolean;
  desabilitado?: boolean;
  dica?: string;
}

/** Botão com área de toque grande, ícone e texto: pensado para pessoas idosas. */
export function BotaoGrande({
  rotulo,
  onPress,
  icone,
  cor = colors.primary,
  variante = 'cheio',
  tamanho = 'normal',
  carregando = false,
  desabilitado = false,
  dica,
}: Props) {
  const cheio = variante === 'cheio';
  const corTexto = cheio ? colors.textOnColor : cor;
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityHint={dica}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      style={({ pressed }) => [
        styles.botao,
        tamanho === 'grande' && styles.grande,
        cheio ? { backgroundColor: cor } : { borderColor: cor, borderWidth: 2, backgroundColor: colors.surface },
        (pressed || inativo) && styles.pressionado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <View style={styles.linha}>
          {icone ? <FontAwesome name={icone} size={tamanho === 'grande' ? 30 : 22} color={corTexto} /> : null}
          <Text style={[styles.texto, tamanho === 'grande' && styles.textoGrande, { color: corTexto }]}>{rotulo}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: touch.min,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grande: { minHeight: touch.big },
  pressionado: { opacity: 0.7 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  texto: { fontSize: fonts.size.md, fontWeight: fonts.weight.bold },
  textoGrande: { fontSize: fonts.size.lg },
});
