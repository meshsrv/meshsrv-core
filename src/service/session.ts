import { db } from '@/db';
import { sessionTable, userTable, type SafeUser, type Session } from '@/db/schema';
import type { Nullable } from '@/util/type';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

export type SessionValidationResult =
  | { session: Session; user: SafeUser }
  | { session: null; user: null };

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
  const sessionId = Bun.CryptoHasher.hash('sha256', token).toHex();
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  };
  await db.insert(sessionTable).values(session);
  return session;
}

export async function validateSessionToken(
  token: Nullable<string>
): Promise<SessionValidationResult> {
  if (!token) return { session: null, user: null };
  const sessionId = Bun.CryptoHasher.hash('sha256', token).toHex();
  const result = await db
    .select({ session: sessionTable, user: userTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));
  if (!result[0]) {
    return { session: null, user: null };
  }
  const { session, user } = result[0];
  const { passwordHash: _, ...safeUser } = user;
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    // expires in 15 days, refresh
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionTable)
      .set({ expiresAt: session.expiresAt })
      .where(eq(sessionTable.id, session.id));
  }
  return { session, user: safeUser };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateAllSessions(userId: number): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}
