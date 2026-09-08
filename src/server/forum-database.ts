import type { Request, Response } from 'express';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { Pool } from 'pg';

const cookieName = 'tv_forum_session';
let pool: Pool | undefined;

export function forumConfigured() {
  return Boolean(
    process.env.FORUM_DATABASE_URL &&
      process.env.FORUM_SESSION_SECRET &&
      process.env.FORUM_RATE_LIMIT_SALT,
  );
}

export function forumDatabase() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.FORUM_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 4,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return pool;
}

function signature(id: string) {
  return createHmac('sha256', process.env.FORUM_SESSION_SECRET!)
    .update(id)
    .digest('hex');
}

function cookieValue(request: Request) {
  const cookies = request.headers.cookie?.split(';') || [];
  const entry = cookies.find((item) => item.trim().startsWith(`${cookieName}=`));
  return entry ? decodeURIComponent(entry.trim().slice(cookieName.length + 1)) : '';
}

export function forumIdentity(request: Request, response: Response, create = false) {
  const [id, supplied] = cookieValue(request).split('.');
  if (/^[0-9a-f-]{36}$/i.test(id || '') && supplied) {
    const expected = signature(id);
    if (
      supplied.length === expected.length &&
      timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
    ) {
      return { id, admin: id === process.env.FORUM_ADMIN_SESSION_ID };
    }
  }
  if (!create) return { id: null, admin: false };
  const newId = randomUUID();
  response.cookie(cookieName, `${newId}.${signature(newId)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });
  return { id: newId, admin: false };
}

export function forumIpHash(request: Request) {
  const ip =
    request.headers['x-vercel-forwarded-for']?.toString().split(',')[0]?.trim() ||
    request.ip ||
    'local-development';
  return createHmac('sha256', process.env.FORUM_RATE_LIMIT_SALT!)
    .update(ip)
    .digest('hex');
}

export function publicForumRow(row: Record<string, unknown>, actor?: string) {
  const { author_id, ...safe } = row;
  return { ...safe, mine: Boolean(actor && author_id === actor) };
}
