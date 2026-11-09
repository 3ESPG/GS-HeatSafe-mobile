import { useRequisicao } from '../hooks/useRequisicao';
import { buscarPrevisaoSaoPaulo } from '../services/climaService';
import { nivelDoIndice, nivelInfo } from '../services/indiceCalor';
import { colors } from '../theme';
import { formatarDiaSemana, formatarGraus } from '../utils/formatar';
import { Cartao } from './Cartao';
import { EstadoView } from './EstadoView';
import { InfoLinha } from './InfoLinha';
import { Texto } from './Texto';

/** Clima de São Paulo agora e amanhã, vindo da API pública Open-Meteo. */
export function PrevisaoCard() {
  const { dados, carregando, erro, recarregar } = useRequisicao(buscarPrevisaoSaoPaulo);

  return (
    <Cartao>
      <Texto variante="subtitulo">Clima em São Paulo</Texto>
      {carregando ? (
        <EstadoView tipo="carregando" mensagem="Buscando a previsão do tempo..." />
      ) : erro || !dados ? (
        <EstadoView tipo="erro" mensagem={erro ?? 'Previsão indisponível.'} onTentarDeNovo={recarregar} />
      ) : (
        <>
          <InfoLinha
            icone="thermometer-half"
            rotulo="Na rua, agora"
            valor={`${formatarGraus(dados.temperaturaAgora)} · sensação de ${formatarGraus(dados.sensacaoAgora)}`}
          />
          <InfoLinha
            icone="calendar"
            rotulo={`Amanhã (${formatarDiaSemana(dados.dataAmanha)})`}
            valor={`Máxima de ${formatarGraus(dados.maxAmanha)} · sensação de até ${formatarGraus(dados.sensacaoMaxAmanha)}`}
            destaque={dados.sensacaoMaxAmanha >= 32}
          />
          <Texto variante="apoio" cor={dados.sensacaoMaxAmanha >= 32 ? colors.danger : colors.textMuted}>
            {dados.sensacaoMaxAmanha >= 32
              ? `Amanhã será um dia de ${nivelInfo[nivelDoIndice(dados.sensacaoMaxAmanha)].rotulo.toLowerCase()}: o HeatSafe vai ficar em modo vigilância.`
              : 'Amanhã não há previsão de calor perigoso.'}
          </Texto>
          <Texto variante="apoio">Fonte: Open-Meteo (dados públicos). A casa costuma ficar mais quente que a rua.</Texto>
        </>
      )}
    </Cartao>
  );
}
