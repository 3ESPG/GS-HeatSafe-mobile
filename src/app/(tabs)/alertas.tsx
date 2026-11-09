import { router } from 'expo-router';

import { AlertaItem } from '../../components/AlertaItem';
import { EstadoView } from '../../components/EstadoView';
import { Tela } from '../../components/Tela';
import { Texto } from '../../components/Texto';
import { usePerfil } from '../../contexts/PerfilContext';
import { useRegistros } from '../../hooks/useRegistros';
import { useRequisicao } from '../../hooks/useRequisicao';
import { listarAlertas } from '../../services/heatsafeApi';

export default function AlertasScreen() {
  const { perfil } = usePerfil();
  const { dados, carregando, erro, recarregar } = useRequisicao(listarAlertas, [perfil.cenario, perfil.simularFalha]);
  const { registros } = useRegistros();

  const confirmados = new Set(registros.filter((r) => r.tipo === 'CONFIRMACAO_ALERTA').map((r) => r.alertaId));

  return (
    <Tela atualizando={carregando && !!dados} onAtualizar={recarregar}>
      <Texto variante="apoio">Toque em um alerta para ver o que aconteceu e o que fazer.</Texto>
      {carregando && !dados ? (
        <EstadoView tipo="carregando" mensagem="Buscando alertas..." />
      ) : erro ? (
        <EstadoView tipo="erro" mensagem={erro} onTentarDeNovo={recarregar} />
      ) : !dados || dados.length === 0 ? (
        <EstadoView tipo="vazio" icone="smile-o" mensagem="Nenhum alerta por enquanto. A casa está com temperatura segura." />
      ) : (
        dados.map((alerta) => (
          <AlertaItem
            key={alerta.id}
            alerta={alerta}
            confirmado={confirmados.has(alerta.id)}
            onPress={() => router.push({ pathname: '/alerta/[id]', params: { id: alerta.id } })}
          />
        ))
      )}
    </Tela>
  );
}
