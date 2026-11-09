import { SQLiteDatabase } from 'expo-sqlite';

import { Cenario, Modo, Perfil } from '../types';

interface PerfilRow {
  nome: string;
  modo: Modo;
  contato_nome: string;
  contato_telefone: string;
  cenario: Cenario;
  simular_falha: number;
}

// Valores iniciais fictícios: o app nunca usa dados pessoais reais.
export const PERFIL_PADRAO: Perfil = {
  nome: 'Maria (fictícia)',
  modo: 'IDOSO',
  contatoNome: 'Ana (filha, fictícia)',
  contatoTelefone: '(11) 90000-0000',
  cenario: 'PERIGO',
  simularFalha: false,
};

export async function obterPerfil(db: SQLiteDatabase): Promise<Perfil> {
  const row = await db.getFirstAsync<PerfilRow>('SELECT * FROM perfil WHERE id = 1');
  if (!row) return PERFIL_PADRAO;
  return {
    nome: row.nome,
    modo: row.modo,
    contatoNome: row.contato_nome,
    contatoTelefone: row.contato_telefone,
    cenario: row.cenario,
    simularFalha: row.simular_falha === 1,
  };
}

export async function salvarPerfil(db: SQLiteDatabase, perfil: Perfil): Promise<void> {
  await db.runAsync(
    `INSERT INTO perfil (id, nome, modo, contato_nome, contato_telefone, cenario, simular_falha)
     VALUES (1, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       nome = excluded.nome,
       modo = excluded.modo,
       contato_nome = excluded.contato_nome,
       contato_telefone = excluded.contato_telefone,
       cenario = excluded.cenario,
       simular_falha = excluded.simular_falha`,
    perfil.nome,
    perfil.modo,
    perfil.contatoNome,
    perfil.contatoTelefone,
    perfil.cenario,
    perfil.simularFalha ? 1 : 0,
  );
}
