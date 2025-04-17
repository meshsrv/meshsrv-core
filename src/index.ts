import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { runApiServer } from './api';
import { db } from './db';
import { getAgentSecret } from './util/agent';
import { generateTLSCert } from './util/tls';

if (import.meta.main) {
  // migrate the database
  migrate(db, { migrationsFolder: './drizzle' });

  // create tls cert if not exists
  const { cert, key } = await checkCert();

  // make sure agent secret exists
  getAgentSecret();

  // start api server
  const { server } = runApiServer(cert, key);
  console.log(`✅ Server is running at ${server?.hostname}:${server?.port}`);
}

async function checkCert() {
  const caCert = Bun.env.CA_CERT_FILE || 'cert/ca.cert.pem';
  const caKey = Bun.env.CA_KEY_FILE || 'cert/ca.key.pem';
  const cert = Bun.env.CERT_FILE || 'cert/cert.pem';
  const key = Bun.env.KEY_FILE || 'cert/key.pem';

  const isCACertExists = await Bun.file(caCert).exists();
  const isCertExists = await Bun.file(cert).exists();
  const isKeyExists = await Bun.file(key).exists();

  if (!isCACertExists || !isCertExists || !isKeyExists) {
    console.log('⚠️ Certificate not found, generating self-signed certificate...');
    const success = await generateTLSCert(caCert, caKey, cert, key);
    if (!success) {
      console.error('Failed to generate certificate');
      process.exit(1);
    }
  }

  return { cert, key };
}
