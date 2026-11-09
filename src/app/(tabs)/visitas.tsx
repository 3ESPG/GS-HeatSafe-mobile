import { StyleSheet, View } from 'react-native';

import { Cartao } from '../../components/Cartao';
import { EstadoView } from '../../components/EstadoView';
import { InfoLinha } from '../../components/InfoLinha';
import { Tela } from '../../components/Tela';
import { Texto } from '../../components/Texto';
import { usePerfil } from '../../contexts/PerfilContext';
import { useRequisicao } from '../../hooks/useRequisicao';
import { listarVisitasPrioritarias } from '../../services/heatsafeApi';
import { nivelInfo } from '../../services/indiceCalor';
import { colors, fonts, nivelColors, radius, spacing } from '../../theme';
import { Visita } from '../../types';
import { formatarGraus } from '../../utils/formatar';

export default function VisitasScreen() {
  const { perfil } = usePerfil();
  const { dados, carregando, erro, recarregar } = useRequisicao(listarVisitasPrioritarias, [
    perfil.cenario,
    perfil.simularFalha,
  ]);

  return (
    <Tela atualizando={carregando && !!dados} onAtualizar={recarregar}>
      <Texto variante="apoio">Ordem sugerida de visitas: quem está em maior risco agora aparece primeiro.</Texto>
      {carregando && !dados ? (
        <EstadoView tipo="carregando" mensagem="Calculando prioridades..." />
      ) : erro ? (
        <EstadoView tipo="erro" mensagem={erro} onTentarDeNovo={recarregar} />
      ) : !dados || dados.length === 0 ? (
        <EstadoView tipo="vazio" icone="smile-o" mensagem="Nenhuma casa precisa de visita urgente hoje." />
      ) : (
        dados.map((visita, posicao) => <CartaoVisita key={visita.id} visita={visita} posicao={posicao + 1} />)
      )}
    </Tela>
  );
}

function CartaoVisita({ visita, posicao }: { visita: Visita; posicao: number }) {
  const info = nivelInfo[visita.nivel];
  return (
    <Cartao
      accessible
      accessibilityLabel={`Visita ${posicao}: ${visita.moradora}, ${visita.idade} anos, ${visita.endereco}. Nível ${info.rotulo}. Motivo: ${visita.motivo}.`}
    >
      <View style={styles.topo}>
        <View style={[styles.posicao, { backgroundColor: nivelColors[visita.nivel] }]}>
          <Texto cor={colors.textOnColor} style={styles.numero}>
            {posicao}
          </Texto>
        </View>
        <View style={styles.textos}>
          <Texto style={styles.nome}>
            {visita.moradora}, {visita.idade} anos
          </Texto>
          <Texto variante="apoio" cor={nivelColors[visita.nivel]} style={styles.nome}>
            {info.rotulo.toUpperCase()} · {formatarGraus(visita.indiceCalor)}
          </Texto>
        </View>
      </View>
      <InfoLinha icone="map-marker" rotulo="Endereço" valor={visita.endereco} />
      <InfoLinha icone="exclamation-circle" rotulo="Motivo" valor={visita.motivo} destaque={posicao === 1} />
      <InfoLinha
        icone="clock-o"
        rotulo="Sem movimento · sem água"
        valor={`${visita.horasSemMovimento.toFixed(1)}h · ${visita.horasSemAgua.toFixed(1)}h`}
      />
      <Texto variante="apoio">Pontuação de risco: {visita.pontuacao}/100</Texto>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  posicao: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  numero: { fontSize: fonts.size.lg, fontWeight: fonts.weight.bold },
  textos: { flex: 1 },
  nome: { fontWeight: fonts.weight.semibold },
});
