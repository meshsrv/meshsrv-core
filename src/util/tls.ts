import { $ } from 'bun';

export async function generateTLSCert(): Promise<boolean> {
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

  try {
    await $`openssl ecparam -name prime256v1 -genkey -noout -out key.pem`;
  } catch (err) {
    console.error('key generation failed');
    return false;
  }

  try {
    await $`openssl req -new -x509 -key key.pem -out cert.pem -days 36500 -subj "/CN=meshsrv-core" -addext "subjectAltName = DNS:*"`;
  } catch (err) {
    console.error('cert generation failed');
    return false;
  }

  return true;
}
