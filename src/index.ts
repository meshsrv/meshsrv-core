import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { apiServer } from './api';
import { db } from './db';

migrate(db, { migrationsFolder: './drizzle' });
apiServer.listen(3090);
console.log(`✅ Server is running at ${apiServer.server?.hostname}:${apiServer.server?.port}`);
