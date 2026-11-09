import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BotaoGrande } from '../../components/BotaoGrande';
import { Cartao } from '../../components/Cartao';
import { EstadoView } from '../../components/EstadoView';
import { InfoLinha } from '../../components/InfoLinha';
import { NivelCard } from '../../components/NivelCard';
import { PrevisaoCard } from '../../components/PrevisaoCard';
import { Tela } from '../../components/Tela';
import { Texto } from '../../components/Texto';
import { usePerfil } from '../../contexts/PerfilContext';
import { useRegistros } from '../../hooks/useRegistros';
import { useRequisicao } from '../../hooks/useRequisicao';
import { buscarResidencia, listarVisitasPrioritarias } from '../../services/heatsafeApi';
import { calcularIndiceCalor, nivelDoIndice } from '../../services/indiceCalor';
import { colors, spacing } from '../../theme';
import { Residencia, TipoRegistro } from '../../types';
import { formatarDataHora, formatarHora, tempoDesde } from '../../utils/formatar';

const DUAS_HORAS_MS = 2 * 60 * 60 * 1000;
const passouDuasHoras = (iso: string) => Date.now() - new Date(iso).getTime() > DUAS_HORAS_MS;

export default function InicioScreen() {
  const { perfil } = usePerfil();
  const residencia = useRequisicao(buscarResidencia, [perfil.cenario, perfil.simularFalha]);

  return (
    <Tela atualizando={residencia.carregando} onAtualizar={residencia.recarregar}>
      <Texto variante="titulo">{saudacao(perfil.nome, perfil.modo)}</Texto>

      {perfil.modo === 'AGENTE' ? (
        <ResumoAgente chave={`${perfil.cenario}-${perfil.simularFalha}`} />
      ) : residencia.carregando && !residencia.dados ? (
        <EstadoView tipo="carregando" mensagem="Lendo o sensor da casa..." />
      ) : residencia.erro || !residencia.dados ? (
        <EstadoView
          tipo="erro"
          mensagem={residencia.erro ?? 'Sem dados do sensor.'}
          onTentarDeNovo={residencia.recarregar}
        />
      ) : perfil.modo === 'IDOSO' ? (
        <PainelIdoso residencia={residencia.dados} />
      ) : (
        <PainelFamilia residencia={residencia.dados} />
      )}

      <PrevisaoCard />
    </Tela>
  );
}

function saudacao(nome: string, modo: string) {
  const primeiroNome = nome.split(' ')[0];
  if (modo === 'FAMILIA') return `Olá, ${primeiroNome}! Veja como está a casa.`;
  if (modo === 'AGENTE') return `Bom trabalho, ${primeiroNome}!`;
  return `Olá, ${primeiroNome}!`;
}

/** Modo idoso: o calor da casa e dois botões grandes. */
function PainelIdoso({ residencia }: { residencia: Residencia }) {
  const { registros, registrar } = useRegistros();
  const [salvando, setSalvando] = useState<TipoRegistro | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const indice = calcularIndiceCalor(residencia.temperatura, residencia.umidade);

  const ultimaAgua = registros.find((r) => r.tipo === 'AGUA');
  const ultimoEstouBem = registros.find((r) => r.tipo === 'ESTOU_BEM');

  async function onRegistrar(tipo: TipoRegistro) {
    setSalvando(tipo);
    try {
      const registro = await registrar(tipo);
      setMensagem(
        tipo === 'AGUA'
          ? `Muito bem! Água registrada às ${formatarHora(registro.dataHora)}.`
          : `Obrigado! Sua família sabe que você está bem (${formatarHora(registro.dataHora)}).`,
      );
    } catch {
      setMensagem('Não foi possível salvar agora. Tente de novo.');
    } finally {
      setSalvando(null);
    }
  }

  return (
    <>
      <NivelCard nivel={nivelDoIndice(indice)} indiceCalor={indice} legenda="Dentro da sua casa agora" />
      <View style={styles.botoes}>
        <BotaoGrande
          rotulo="ESTOU BEM"
          icone="thumbs-up"
          cor={colors.success}
          tamanho="grande"
          carregando={salvando === 'ESTOU_BEM'}
          onPress={() => onRegistrar('ESTOU_BEM')}
          dica="Avisa sua família que você está bem"
        />
        <BotaoGrande
          rotulo="BEBI ÁGUA"
          icone="tint"
          cor={colors.info}
          tamanho="grande"
          carregando={salvando === 'AGUA'}
          onPress={() => onRegistrar('AGUA')}
          dica="Registra que você bebeu um copo de água"
        />
      </View>
      {mensagem ? (
        <Cartao style={styles.mensagem} accessibilityLiveRegion="polite">
          <Texto cor={colors.success}>{mensagem}</Texto>
        </Cartao>
      ) : null}
      <Cartao>
        <InfoLinha
          icone="tint"
          rotulo="Última água registrada"
          valor={ultimaAgua ? formatarDataHora(ultimaAgua.dataHora) : 'Ainda não registrada hoje'}
          destaque={!ultimaAgua || passouDuasHoras(ultimaAgua.dataHora)}
        />
        <InfoLinha
          icone="thumbs-up"
          rotulo="Último “Estou bem”"
          valor={ultimoEstouBem ? formatarDataHora(ultimoEstouBem.dataHora) : 'Ainda não enviado'}
        />
      </Cartao>
    </>
  );
}

/** Modo família: situação da casa do idoso e atalho para os alertas. */
function PainelFamilia({ residencia }: { residencia: Residencia }) {
  const indice = calcularIndiceCalor(residencia.temperatura, residencia.umidade);
  const nivel = nivelDoIndice(indice);
  const semMovimento = passouDuasHoras(residencia.ultimoMovimento);
  const semAgua = passouDuasHoras(residencia.ultimaAgua);
  const emRisco = (nivel === 'PERIGO' || nivel === 'PERIGO_EXTREMO') && semMovimento;

  return (
    <>
      {emRisco ? (
        <Cartao style={styles.alerta} accessibilityLiveRegion="assertive">
          <Texto variante="subtitulo" cor={colors.danger}>
            Atenção: ligue agora
          </Texto>
          <Texto>A casa está com calor perigoso e sem movimento há mais de 2 horas.</Texto>
          <BotaoGrande rotulo="Ver alerta" icone="bell" cor={colors.danger} onPress={() => router.push('/alertas')} />
        </Cartao>
      ) : null}
      <NivelCard nivel={nivel} indiceCalor={indice} legenda={`Casa de ${residencia.moradora}`} />
      <Cartao>
        <InfoLinha icone="male" rotulo="Último movimento" valor={tempoDesde(residencia.ultimoMovimento)} destaque={semMovimento} />
        <InfoLinha icone="tint" rotulo="Última água" valor={tempoDesde(residencia.ultimaAgua)} destaque={semAgua} />
        <InfoLinha icone="map-marker" rotulo="Bairro" valor={residencia.bairro} />
        <InfoLinha icone="refresh" rotulo="Sensor atualizado" valor={tempoDesde(residencia.atualizadoEm)} />
      </Cartao>
    </>
  );
}

/** Modo agente: resumo das casas em risco hoje. */
function ResumoAgente({ chave }: { chave: string }) {
  const { dados, carregando, erro, recarregar } = useRequisicao(listarVisitasPrioritarias, [chave]);

  if (carregando) return <EstadoView tipo="carregando" mensagem="Buscando as casas acompanhadas..." />;
  if (erro || !dados) return <EstadoView tipo="erro" mensagem={erro ?? 'Sem dados.'} onTentarDeNovo={recarregar} />;

  const emRisco = dados.filter((v) => v.nivel === 'PERIGO' || v.nivel === 'PERIGO_EXTREMO').length;
  return (
    <Cartao>
      <Texto variante="subtitulo">Hoje no seu território</Texto>
      <InfoLinha icone="home" rotulo="Casas que precisam de visita" valor={String(dados.length)} />
      <InfoLinha icone="exclamation-circle" rotulo="Em nível Perigo" valor={String(emRisco)} destaque={emRisco > 0} />
      <BotaoGrande rotulo="Ver lista de visitas" icone="map-marker" onPress={() => router.push('/visitas')} />
    </Cartao>
  );
}

const styles = StyleSheet.create({
  botoes: { gap: spacing.md },
  mensagem: { backgroundColor: colors.successBg, borderColor: colors.success },
  alerta: { backgroundColor: colors.dangerBg, borderColor: colors.danger },
});
