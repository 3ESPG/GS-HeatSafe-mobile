import { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { colors, radius, spacing } from '../theme';

interface Props extends ViewProps {
  children: ReactNode;
}

export function Cartao({ children, style, ...rest }: Props) {
  return (
    <View style={[styles.cartao, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
