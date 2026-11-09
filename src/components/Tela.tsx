import { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

interface Props {
  children: ReactNode;
  atualizando?: boolean;
  onAtualizar?: () => void;
}

/** Container padrão das telas: rolagem, espaçamento e "puxar para atualizar". */
export function Tela({ children, atualizando = false, onAtualizar }: Props) {
  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      refreshControl={
        onAtualizar ? (
          <RefreshControl refreshing={atualizando} onRefresh={onAtualizar} colors={[colors.primary]} />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
});
