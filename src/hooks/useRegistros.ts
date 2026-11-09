import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { inserirRegistro, limparRegistros, listarRegistros } from '../database/registrosRepository';
import { Registro, TipoRegistro } from '../types';

/** Lê e grava os registros do cidadão (Estou bem, Bebi água, confirmações) no SQLite. */
export function useRegistros() {
  const db = useSQLiteContext();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setRegistros(await listarRegistros(db));
    } catch {
      setErro('Não foi possível ler o histórico salvo no aparelho.');
    } finally {
      setCarregando(false);
    }
  }, [db]);

  // Recarrega sempre que a tela volta a ficar visível
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const registrar = useCallback(
    async (tipo: TipoRegistro, opcoes?: { observacao?: string; alertaId?: string }) => {
      const novo = await inserirRegistro(db, tipo, opcoes);
      setRegistros((atuais) => [novo, ...atuais]);
      return novo;
    },
    [db],
  );

  const limpar = useCallback(async () => {
    await limparRegistros(db);
    setRegistros([]);
  }, [db]);

  return { registros, carregando, erro, registrar, limpar, recarregar: carregar };
}
