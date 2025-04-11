import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

const sqlite = new Database(Bun.env.DB_FILE_NAME || 'db.sqlite');
sqlite.exec('PRAGMA journal_mode = WAL;');

export const db = drizzle({ client: sqlite, schema });
