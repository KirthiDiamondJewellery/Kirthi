import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';
import fs from 'fs';

declare global {
  var _postgresPool: Pool | undefined;
}

export function getResolvedSqlHost(): string {
  if (process.env.SQL_HOST && fs.existsSync(process.env.SQL_HOST)) {
    return process.env.SQL_HOST;
  }
  const baseCloudSqlDir = "/app/cloudsql";
  if (fs.existsSync(baseCloudSqlDir)) {
    try {
      const entries = fs.readdirSync(baseCloudSqlDir);
      const instanceDir = entries.find(e => e.includes(":"));
      if (instanceDir) {
        return `${baseCloudSqlDir}/${instanceDir}`;
      }
    } catch {}
  }
  return process.env.SQL_HOST || "/app/cloudsql/esoteric-portal-471501-t2:asia-southeast1:ai-studio-473f78a6";
}

export const createPool = () => {
  if (!global._postgresPool) {
    const host = getResolvedSqlHost();
    global._postgresPool = new Pool({
      host,
      user: process.env.SQL_USER || "ai_studio_app_user",
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME || "cloud_sql_development_database",
      max: 10,
      connectionTimeoutMillis: 15000,
    });
    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
      global._postgresPool = undefined;
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
