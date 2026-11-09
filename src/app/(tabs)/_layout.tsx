import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { ColorValue } from 'react-native';

import { usePerfil } from '../../contexts/PerfilContext';
import { colors, fonts, touch } from '../../theme';

type Icone = ComponentProps<typeof FontAwesome>['name'];

const icone = (nome: Icone) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <FontAwesome name={nome} size={26} color={typeof color === "number" || color == null ? undefined : color} />;
  };

export default function TabsLayout() {
  const { perfil } = usePerfil();
  const ehAgente = perfil.modo === 'AGENTE';

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnColor,
        headerTitleStyle: { fontSize: fonts.size.lg, fontWeight: fonts.weight.bold },
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: fonts.size.xs, fontWeight: fonts.weight.semibold },
        tabBarStyle: { minHeight: touch.min + 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', headerTitle: 'HeatSafe', tabBarIcon: icone('home'), tabBarAccessibilityLabel: 'Início' }}
      />
      <Tabs.Screen
        name="visitas"
        options={{
          title: 'Visitas',
          headerTitle: 'Visitas prioritárias',
          tabBarIcon: icone('map-marker'),
          // Só aparece para o agente comunitário de saúde
          href: ehAgente ? '/visitas' : null,
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{ title: 'Alertas', tabBarIcon: icone('bell'), tabBarAccessibilityLabel: 'Alertas' }}
      />
      <Tabs.Screen
        name="historico"
        options={{ title: 'Histórico', tabBarIcon: icone('history'), tabBarAccessibilityLabel: 'Histórico' }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil', tabBarIcon: icone('user'), tabBarAccessibilityLabel: 'Perfil e configurações' }}
      />
    </Tabs>
  );
}
