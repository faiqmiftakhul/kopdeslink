import { Pool } from 'pg';
import { DB_CONFIG } from './env';

// Pool Postgres tunggal (di-cache pada globalThis agar tak dobel saat HMR dev).
const g = globalThis as unknown as { _pgPool?: Pool };

export function getPool(): Pool {
  if (!g._pgPool) {
    g._pgPool = new Pool({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      database: DB_CONFIG.database,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      ssl: DB_CONFIG.ssl,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });
  }
  return g._pgPool;
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}
