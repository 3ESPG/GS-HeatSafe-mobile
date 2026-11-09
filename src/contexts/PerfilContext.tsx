import { useSQLiteContext } from 'expo-sqlite';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { obterPerfil, PERFIL_PADRAO, salvarPerfil } from '../database/perfilRepository';
import { configurarMock } from '../services/heatsafeApi';
import { Perfil } from '../types';

interface PerfilContextValue {
  perfil: Perfil;
  carregando: boolean;
  atualizarPerfil: (novo: Perfil) => Promise<void>;
}

const PerfilContext = createContext<PerfilContextValue | null>(null);

/** Carrega o perfil salvo no SQLite e o deixa disponível para todas as telas. */
export function PerfilProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [perfil, setPerfil] = useState<Perfil>(PERFIL_PADRAO);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    obterPerfil(db)
      .then((salvo) => {
        setPerfil(salvo);
        configurarMock({ cenario: salvo.cenario, simularFalha: salvo.simularFalha });
      })
      .finally(() => setCarregando(false));
  }, [db]);

  const atualizarPerfil = useCallback(
    async (novo: Perfil) => {
      await salvarPerfil(db, novo);
      configurarMock({ cenario: novo.cenario, simularFalha: novo.simularFalha });
      setPerfil(novo);
    },
    [db],
  );

  return (
    <PerfilContext.Provider value={{ perfil, carregando, atualizarPerfil }}>{children}</PerfilContext.Provider>
  );
}

export function usePerfil() {
  const contexto = useContext(PerfilContext);
  if (!contexto) throw new Error('usePerfil precisa estar dentro de PerfilProvider');
  return contexto;
}
