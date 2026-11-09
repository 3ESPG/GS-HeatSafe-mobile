import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ComponentProps } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { BotaoGrande } from '../../components/BotaoGrande';
import { Cartao } from '../../components/Cartao';
import { EstadoView } from '../../components/EstadoView';
import { Tela } from '../../components/Tela';
import { Texto } from '../../components/Texto';
import { useRegistros } from '../../hooks/useRegistros';
import { colors, spacing, fonts } from '../../theme';
import { Registro, TipoRegistro } from '../../types';
import { formatarDataHora } from '../../utils/formatar';

const tipoInfo: Record<TipoRegistro, { rotulo: string; icone: ComponentProps<typeof FontAwesome>['name']; cor: string }> = {
  ESTOU_BEM: { rotulo: 'Estou bem', icone: 'thumbs-up', cor: colors.success },
  AGUA: { rotulo: 'Bebi água', icone: 'tint', cor: colors.info },
  CONFIRMACAO_ALERTA: { rotulo: 'Alerta confirmado', icone: 'check-circle', cor: colors.primaryDark },
};

export default function HistoricoScreen() {
  const { registros, carregando, erro, limpar, recarregar } = useRegistros();

  function confirmarLimpeza() {
    Alert.alert('Apagar histórico?', 'Os registros salvos neste celular serão apagados.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: limpar },
    ]);
  }

  const hoje = new Date().toDateString();
  const aguaHoje = registros.filter((r) => r.tipo === 'AGUA' && new Date(r.dataHora).toDateString() === hoje).length;

  return (
    <Tela atualizando={carregando && registros.length > 0} onAtualizar={recarregar}>
      <Texto variante="apoio">Tudo o que foi registrado neste celular (salvo no banco de dados do aparelho).</Texto>

      {carregando && registros.length === 0 ? (
        <EstadoView tipo="carregando" mensagem="Lendo o histórico..." />
      ) : erro ? (
        <EstadoView tipo="erro" mensagem={erro} onTentarDeNovo={recarregar} />
      ) : registros.length === 0 ? (
        <EstadoView
          tipo="vazio"
          icone="history"
          mensagem="Nada registrado ainda. Use os botões “Estou bem” e “Bebi água” na tela Início."
        />
      ) : (
        <>
          <Cartao accessible accessibilityLabel={`Copos de água registrados hoje: ${aguaHoje}`}>
            <Texto variante="subtitulo">Copos de água hoje: {aguaHoje}</Texto>
            <Texto variante="apoio">O recomendado no calor é beber pelo menos 1 copo por hora.</Texto>
          </Cartao>
          {registros.map((registro) => (
            <ItemHistorico key={registro.id} registro={registro} />
          ))}
          <BotaoGrande rotulo="Apagar histórico" icone="trash" variante="contorno" cor={colors.danger} onPress={confirmarLimpeza} />
        </>
      )}
    </Tela>
  );
}

function ItemHistorico({ registro }: { registro: Registro }) {
  const info = tipoInfo[registro.tipo];
  const quando = formatarDataHora(registro.dataHora);
  return (
    <Cartao style={styles.item} accessible accessibilityLabel={`${info.rotulo}, ${quando}. ${registro.observacao ?? ''}`}>
      <FontAwesome name={info.icone} size={26} color={info.cor} style={styles.icone} />
      <View style={styles.textos}>
        <Texto style={styles.rotulo}>{info.rotulo}</Texto>
        <Texto variante="apoio">{quando}</Texto>
        {registro.observacao ? <Texto variante="apoio">“{registro.observacao}”</Texto> : null}
      </View>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icone: { width: 32, textAlign: 'center' },
  textos: { flex: 1 },
  rotulo: { fontWeight: fonts.weight.semibold },
});
