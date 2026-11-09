import { SQLiteDatabase } from 'expo-sqlite';

import { Registro, TipoRegistro } from '../types';

interface RegistroRow {
  id: number;
  tipo: TipoRegistro;
  data_hora: string;
  observacao: string | null;
  alerta_id: string | null;
}

const paraRegistro = (row: RegistroRow): Registro => ({
  id: row.id,
  tipo: row.tipo,
  dataHora: row.data_hora,
  observacao: row.observacao,
  alertaId: row.alerta_id,
});

export async function inserirRegistro(
  db: SQLiteDatabase,
  tipo: TipoRegistro,
  opcoes: { observacao?: string; alertaId?: string } = {},
): Promise<Registro> {
  const dataHora = new Date().toISOString();
  const resultado = await db.runAsync(
    'INSERT INTO registros (tipo, data_hora, observacao, alerta_id) VALUES (?, ?, ?, ?)',
    tipo,
    dataHora,
    opcoes.observacao ?? null,
    opcoes.alertaId ?? null,
  );
  return {
    id: resultado.lastInsertRowId,
    tipo,
    dataHora,
    observacao: opcoes.observacao ?? null,
    alertaId: opcoes.alertaId ?? null,
  };
}

export async function listarRegistros(db: SQLiteDatabase): Promise<Registro[]> {
  const rows = await db.getAllAsync<RegistroRow>('SELECT * FROM registros ORDER BY data_hora DESC LIMIT 100');
  return rows.map(paraRegistro);
}

export async function ultimoRegistroDoTipo(db: SQLiteDatabase, tipo: TipoRegistro): Promise<Registro | null> {
  const row = await db.getFirstAsync<RegistroRow>(
    'SELECT * FROM registros WHERE tipo = ? ORDER BY data_hora DESC LIMIT 1',
    tipo,
  );
  return row ? paraRegistro(row) : null;
}

export async function confirmacaoDoAlerta(db: SQLiteDatabase, alertaId: string): Promise<Registro | null> {
  const row = await db.getFirstAsync<RegistroRow>(
    "SELECT * FROM registros WHERE tipo = 'CONFIRMACAO_ALERTA' AND alerta_id = ? LIMIT 1",
    alertaId,
  );
  return row ? paraRegistro(row) : null;
}

export async function limparRegistros(db: SQLiteDatabase): Promise<void> {
  await db.runAsync('DELETE FROM registros');
}
