import { useCallback, useEffect, useState } from 'react';

interface EstadoRequisicao<T> {
  dados: T | null;
  carregando: boolean;
  erro: string | null;
  recarregar: () => void;
}

interface Resultado<T> {
  chave: string | null;
  dados: T | null;
  erro: string | null;
}

/**
 * Executa uma função assíncrona e controla os estados de carregamento e erro.
 * `chaves` funciona como as dependências do useEffect: quando mudam, a busca é refeita.
 * Enquanto recarrega, os dados anteriores continuam disponíveis (útil no "puxar para atualizar").
 */
export function useRequisicao<T>(buscar: () => Promise<T>, chaves: unknown[] = []): EstadoRequisicao<T> {
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<Resultado<T>>({ chave: null, dados: null, erro: null });
  const chave = JSON.stringify([tentativa, ...chaves]);

  useEffect(() => {
    let ativo = true;
    buscar()
      .then((dados) => {
        if (ativo) setResultado({ chave, dados, erro: null });
      })
      .catch((e: unknown) => {
        if (ativo) {
          setResultado({ chave, dados: null, erro: e instanceof Error ? e.message : 'Algo deu errado. Tente de novo.' });
        }
      });
    return () => {
      ativo = false;
    };
    // A busca só deve ser refeita quando as chaves mudam, não a cada nova função criada na renderização.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  const recarregar = useCallback(() => setTentativa((t) => t + 1), []);
  const carregando = resultado.chave !== chave;

  return { dados: resultado.dados, carregando, erro: carregando ? null : resultado.erro, recarregar };
}
