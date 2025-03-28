import { db } from '@/db';
import { userTable, type User } from '@/db/schema';
import { hashPassword } from './password';

export async function createUser(username: string, password: string): Promise<User> {
  const passwordHash = await hashPassword(password);
  const row = await db.insert(userTable).values({ username, passwordHash }).returning();
  if (!row[0]) {
    throw new Error('Unexpected error');
  }
  return row[0];
}

export async function getUserPasswordHash(userId: number): Promise<string> {
  const row = await db.query.userTable.findFirst({
    columns: {
      passwordHash: true,
    },
    where: (user, { eq }) => eq(user.id, userId),
  });
  if (!row) {
    throw new Error('Invalid user ID');
  }
  return row.passwordHash;
}

export async function getUserFromUsername(
  username: string
): Promise<Omit<User, 'passwordHash'> | undefined> {
  return await db.query.userTable.findFirst({
    columns: {
      passwordHash: false,
    },
    where: (user, { eq }) => eq(user.username, username),
  });
}
