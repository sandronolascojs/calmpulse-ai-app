import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './src/config/env.config';
import * as schema from './src/schema';

const MAX_POOL_CONNECTIONS = 30;
const IDLE_TIMEOUT = 10000;
const CONNECTION_TIMEOUT = 10000;

const postgresPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: MAX_POOL_CONNECTIONS,
  idleTimeoutMillis: IDLE_TIMEOUT,
  connectionTimeoutMillis: CONNECTION_TIMEOUT,
});

export const db = drizzle(postgresPool, { schema: { ...schema } });

export type DB = typeof db;
export * as schema from './src/schema';
