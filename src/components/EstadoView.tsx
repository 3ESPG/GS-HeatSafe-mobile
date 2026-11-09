import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';
import { BotaoGrande } from './BotaoGrande';
import { Texto } from './Texto';

type Props =
  | { tipo: 'carregando'; mensagem?: string }
  | { tipo: 'erro'; mensagem: string; onTentarDeNovo: () => void }
  | { tipo: 'vazio'; mensagem: string; icone?: ComponentProps<typeof FontAwesome>['name'] };

/** Estados de carregamento, erro e lista vazia, usados em todas as telas que buscam dados. */
export function EstadoView(props: Props) {
  if (props.tipo === 'carregando') {
    return (
      <View style={styles.caixa} accessibilityLiveRegion="polite" accessible accessibilityLabel={props.mensagem ?? 'Carregando'}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Texto variante="apoio">{props.mensagem ?? 'Carregando...'}</Texto>
      </View>
    );
  }

  if (props.tipo === 'erro') {
    return (
      <View style={styles.caixa} accessibilityLiveRegion="assertive">
        <FontAwesome name="wifi" size={40} color={colors.danger} accessibilityElementsHidden />
        <Texto variante="subtitulo" style={styles.centro}>
          Algo deu errado
        </Texto>
        <Texto style={styles.centro}>{props.mensagem}</Texto>
        <BotaoGrande rotulo="Tentar de novo" icone="refresh" onPress={props.onTentarDeNovo} variante="contorno" />
      </View>
    );
  }

  return (
    <View style={styles.caixa} accessible accessibilityLabel={props.mensagem}>
      <FontAwesome name={props.icone ?? 'inbox'} size={40} color={colors.textMuted} />
      <Texto style={styles.centro}>{props.mensagem}</Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
  centro: { textAlign: 'center' },
});
