import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { apiServer } from './api';
import { db } from './db';
import { generateTLSCert } from './util/tls';

// migrate the database
migrate(db, { migrationsFolder: './drizzle' });

// generate tls certificate
if (!(await Bun.file('cert.pem').exists())) {
  console.log('⚠️ No certificate found, generating self-signed certificate...');
  console.log('Put your own certificate in cert.pem and key.pem to avoid self-signed warnings.');
  const res = await generateTLSCert();
  if (!res) {
    console.error('Failed to generate certificate');
    process.exit(1);
  }
}

// start api server
apiServer.listen(Bun.env.API_SERVER_PORT);
console.log(`✅ Server is running at ${apiServer.server?.hostname}:${apiServer.server?.port}`);
