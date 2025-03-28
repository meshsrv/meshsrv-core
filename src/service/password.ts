export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password, {
    algorithm: 'argon2id',
    memoryCost: 19456,
    timeCost: 2,
  });
}

export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  return await Bun.password.verify(password, hash, 'argon2id');
}

async function verifyPasswordStrength(password: string): Promise<boolean> {
  if (password.length < 8 || password.length > 255) {
    return false;
  }
  const hash = Bun.CryptoHasher.hash('sha1', password, 'hex');
  const hashPrefix = hash.slice(0, 5);
  const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
  const data = await response.text();
  const items = data.split('\n');
  for (const item of items) {
    const hashSuffix = item.slice(0, 35).toLowerCase();
    if (hash === hashPrefix + hashSuffix) return false;
  }
  return true;
}
