import { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'heatsafe.db';

const VERSAO_ATUAL = 1;

/** Cria e atualiza as tabelas. Usa PRAGMA user_version para saber em que versão o banco está. */
export async function migrarBanco(db: SQLiteDatabase) {
  const linha = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let versao = linha?.user_version ?? 0;
  if (versao >= VERSAO_ATUAL) return;

  if (versao === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE IF NOT EXISTS perfil (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        nome TEXT NOT NULL,
        modo TEXT NOT NULL,
        contato_nome TEXT NOT NULL,
        contato_telefone TEXT NOT NULL,
        cenario TEXT NOT NULL,
        simular_falha INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS registros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        data_hora TEXT NOT NULL,
        observacao TEXT,
        alerta_id TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_registros_data ON registros (data_hora DESC);
    `);
    versao = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${versao}`);
}
