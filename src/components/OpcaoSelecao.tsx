import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing, touch, fonts } from '../theme';
import { Texto } from './Texto';

interface Opcao<T extends string> {
  valor: T;
  rotulo: string;
  descricao?: string;
}

interface Props<T extends string> {
  opcoes: Opcao<T>[];
  selecionado: T;
  onSelecionar: (valor: T) => void;
}

/** Grupo de opções (radio) com área de toque grande e estado lido pelo leitor de tela. */
export function OpcaoSelecao<T extends string>({ opcoes, selecionado, onSelecionar }: Props<T>) {
  return (
    <View style={styles.grupo} accessibilityRole="radiogroup">
      {opcoes.map((opcao) => {
        const ativo = opcao.valor === selecionado;
        return (
          <Pressable
            key={opcao.valor}
            onPress={() => onSelecionar(opcao.valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: ativo }}
            accessibilityLabel={opcao.descricao ? `${opcao.rotulo}. ${opcao.descricao}` : opcao.rotulo}
            style={[styles.opcao, ativo && styles.ativo]}
          >
            <FontAwesome
              name={ativo ? 'dot-circle-o' : 'circle-o'}
              size={26}
              color={ativo ? colors.primary : colors.textMuted}
            />
            <View style={styles.textos}>
              <Texto style={ativo ? styles.rotuloAtivo : undefined}>{opcao.rotulo}</Texto>
              {opcao.descricao ? <Texto variante="apoio">{opcao.descricao}</Texto> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { gap: spacing.sm },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: touch.min,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  ativo: { borderColor: colors.primary, backgroundColor: colors.background },
  textos: { flex: 1 },
  rotuloAtivo: { fontWeight: fonts.weight.bold, color: colors.primaryDark },
});
