import { randomUUID } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import type { getSql } from "@/lib/db";

export const ANONYMOUS_SESSION_COOKIE = "__Host-menu_v3_sid";
export const ANONYMOUS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type Sql = Awaited<ReturnType<typeof getSql>>;
type AnonymousSessionRow = {
  id: string;
  tenant_id: string;
  expires_at: string;
  revoked_at: string | null;
};

export type AnonymousSessionResolution = {
  id: string;
  fromValidCookie: boolean;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function setAnonymousSessionCookie(id: string): void {
  setCookie(ANONYMOUS_SESSION_COOKIE, id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ANONYMOUS_SESSION_MAX_AGE_SECONDS,
  });
}

export async function resolveAnonymousSession(
  sql: Sql,
  tenantId: string,
): Promise<AnonymousSessionResolution> {
  const cookie = getCookie(ANONYMOUS_SESSION_COOKIE)?.trim() ?? null;

  if (cookie && UUID_RE.test(cookie)) {
    const rows = await sql<AnonymousSessionRow>`
      select id, tenant_id, expires_at, revoked_at
      from anonymous_sessions
      where id = ${cookie}
      limit 1
    `;
    const session = rows[0];
    if (
      session &&
      session.tenant_id === tenantId &&
      !session.revoked_at &&
      new Date(session.expires_at).getTime() > Date.now()
    ) {
      await sql`
        update anonymous_sessions
        set last_seen_at = now()
        where id = ${session.id} and tenant_id = ${tenantId}
      `;
      return { id: String(session.id), fromValidCookie: true };
    }
  }

  const id = randomUUID();
  await sql`
    insert into anonymous_sessions (id, tenant_id, expires_at)
    values (${id}, ${tenantId}, now() + interval '30 days')
  `;
  setAnonymousSessionCookie(id);
  return { id, fromValidCookie: false };
}
