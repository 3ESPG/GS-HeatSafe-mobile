import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { BotaoGrande } from '../../components/BotaoGrande';
import { Cartao } from '../../components/Cartao';
import { EstadoView } from '../../components/EstadoView';
import { InfoLinha } from '../../components/InfoLinha';
import { NivelCard } from '../../components/NivelCard';
import { Tela } from '../../components/Tela';
import { Texto } from '../../components/Texto';
import { usePerfil } from '../../contexts/PerfilContext';
import { confirmacaoDoAlerta, inserirRegistro } from '../../database/registrosRepository';
import { useRequisicao } from '../../hooks/useRequisicao';
import { buscarAlerta } from '../../services/heatsafeApi';
import { colors, fonts, radius, spacing, touch } from '../../theme';
import { Registro } from '../../types';
import { formatarDataHora } from '../../utils/formatar';

export default function DetalheAlertaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const { perfil } = usePerfil();
  const { dados: alerta, carregando, erro, recarregar } = useRequisicao(() => buscarAlerta(id), [id]);
  const [confirmacao, setConfirmacao] = useState<Registro | null>(null);
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);

  // Recupera do SQLite se este alerta já foi confirmado antes
  useEffect(() => {
    confirmacaoDoAlerta(db, id).then(setConfirmacao);
  }, [db, id]);

  async function confirmar() {
    setSalvando(true);
    setErroSalvar(null);
    try {
      const texto = observacao.trim() || 'Falei com ela, está tudo bem.';
      setConfirmacao(await inserirRegistro(db, 'CONFIRMACAO_ALERTA', { alertaId: id, observacao: texto }));
    } catch {
      setErroSalvar('Não foi possível salvar a confirmação. Tente de novo.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <EstadoView tipo="carregando" mensagem="Abrindo o alerta..." />;
  if (erro || !alerta) return <EstadoView tipo="erro" mensagem={erro ?? 'Alerta não encontrado.'} onTentarDeNovo={recarregar} />;

  return (
    <Tela>
      <NivelCard nivel={alerta.nivel} indiceCalor={alerta.indiceCalor} legenda={alerta.moradora} />

      <Cartao>
        <Texto variante="subtitulo">{alerta.titulo}</Texto>
        <InfoLinha icone="clock-o" rotulo="Quando" valor={formatarDataHora(alerta.dataHora)} />
        <InfoLinha icone="question-circle" rotulo="Por que este alerta?" valor={alerta.motivo} />
        <InfoLinha icone="hand-o-right" rotulo="O que fazer" valor={alerta.orientacao} destaque />
      </Cartao>

      {perfil.modo === 'IDOSO' ? (
        <Cartao>
          <Texto>Sua família ({perfil.contatoNome}) recebeu este alerta e vai entrar em contato.</Texto>
        </Cartao>
      ) : confirmacao ? (
        <Cartao style={styles.confirmado} accessibilityLiveRegion="polite">
          <Texto variante="subtitulo" cor={colors.success}>
            Alerta confirmado
          </Texto>
          <Texto>{formatarDataHora(confirmacao.dataHora)}</Texto>
          {confirmacao.observacao ? <Texto variante="apoio">“{confirmacao.observacao}”</Texto> : null}
        </Cartao>
      ) : (
        <Cartao>
          <Texto variante="subtitulo">Já falou com ela?</Texto>
          <Texto variante="apoio">Ao confirmar, a UBS não precisa ser acionada para este alerta.</Texto>
          <TextInput
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Ex.: Liguei, ela está bem e bebeu água"
            placeholderTextColor={colors.textMuted}
            style={styles.campo}
            multiline
            accessibilityLabel="Observação sobre o contato (opcional)"
          />
          {erroSalvar ? <Texto cor={colors.danger}>{erroSalvar}</Texto> : null}
          <BotaoGrande
            rotulo="Confirmar que falei com ela"
            icone="check"
            cor={colors.success}
            carregando={salvando}
            onPress={confirmar}
          />
        </Cartao>
      )}
    </Tela>
  );
}

const styles = StyleSheet.create({
  confirmado: { backgroundColor: colors.successBg, borderColor: colors.success },
  campo: {
    minHeight: touch.big,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: fonts.size.md,
    color: colors.text,
    textAlignVertical: 'top',
  },
});
