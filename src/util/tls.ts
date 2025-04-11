import { $ } from 'bun';
import { networkInterfaces } from 'os';

export async function generateTLSCert(
  caCert: string,
  caKey: string,
  cert: string,
  key: string
): Promise<boolean> {
  try {
    const ver = await $`openssl version`.text();
    const match = ver.match(/(\d+)\.(\d+)\.(\d+)/);
    if (!match || !match[1] || !match[2] || !match[3]) {
      console.error('openssl version not found');
      return false;
    }

    const major = parseInt(match[1]);
    const minor = parseInt(match[2]);
    const patch = parseInt(match[3]);
    if (major <= 1 && minor <= 1 && patch < 1) {
      console.error(`openssl version too low!`);
      console.error(`Found: ${match[0]} Required: 1.1.1 or higher`);
      return false;
    }
  } catch (err) {
    console.error('openssl not found');
    return false;
  }

  await $`mkdir -p $(dirname "${caCert}")`;
  await $`mkdir -p $(dirname "${caKey}")`;
  await $`mkdir -p $(dirname "${cert}")`;
  await $`mkdir -p $(dirname "${key}")`;

  const isCAKeyExists = await Bun.file(caKey).exists();
  const isCACertExists = await Bun.file(caCert).exists();

  if (!isCAKeyExists || !isCACertExists) {
    console.log('⚠️ CA key or cert not found, generating CA...');

    try {
      await $`openssl ecparam -name prime256v1 -genkey -noout -out "${caKey}"`.quiet();
    } catch (err) {
      console.error('ca key generation failed');
      return false;
    }

    try {
      await $`openssl req -new -x509 -key "${caKey}" -out "${caCert}" -days 36500 -subj "/CN=Meshsrv CA"`.quiet();
    } catch (err) {
      console.error('ca cert generation failed');
      return false;
    }
  }

  try {
    await $`openssl ecparam -name prime256v1 -genkey -noout -out "${key}"`.quiet();
  } catch (err) {
    console.error('key generation failed');
    return false;
  }

  const ips = new Set(
    Object.values(networkInterfaces())
      .flat()
      .map((v) => v?.address)
      .filter((v) => v)
  );
  ips.add('127.0.0.1');
  const ipsStr = Array.from(ips).join(', IP:');

  try {
    const ext = `subjectAltName = DNS:localhost, DNS:*, IP:${ipsStr}`;
    const cnf = await $`echo "$(dirname "${cert}")/san.cnf"`.text();

    await $`echo "${ext}" > "${cnf}" && \
            openssl req -new -key "${key}" -subj "/CN=meshsrv-core" | \
            openssl x509 -req -out "${cert}" -CA "${caCert}" -CAkey "${caKey}" -days 36500 -extfile "${cnf}" && \
            rm "${cnf}"
          `.quiet();
  } catch (err) {
    console.error('cert generation failed');
    return false;
  }

  return true;
}
