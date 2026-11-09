import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { PerfilProvider } from '../contexts/PerfilContext';
import { DATABASE_NAME, migrarBanco } from '../database/migrations';
import { colors, fonts } from '../theme';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrarBanco}>
      <PerfilProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.textOnColor,
            headerTitleStyle: { fontSize: fonts.size.lg, fontWeight: fonts.weight.bold },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="alerta/[id]" options={{ title: 'Detalhe do alerta', headerBackTitle: 'Voltar' }} />
        </Stack>
      </PerfilProvider>
    </SQLiteProvider>
  );
}
