import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { app } from './api';
import { db } from './db';

migrate(db, { migrationsFolder: './drizzle' });
app.listen(3000);
console.log(`✅ Server is running at ${app.server?.hostname}:${app.server?.port}`);
