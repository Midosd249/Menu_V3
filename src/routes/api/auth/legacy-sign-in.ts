import { createFileRoute } from "@tanstack/react-router";
import { hashPassword } from "better-auth/crypto";
import { auth } from "@/lib/auth/server";
import { getSql } from "@/lib/db";

/**
 * One-time compatibility bridge for accounts that were originally created in
 * Supabase Auth before Menu V3 moved to Better Auth.
 *
 * The bridge never returns or stores the Supabase password hash. It verifies the
 * submitted password against Supabase's bcrypt hash server-side, upgrades the
 * matching Better Auth credential account to Better Auth's native scrypt hash,
 * then delegates session creation to Better Auth so the normal signed cookies
 * and session lifecycle remain authoritative.
 */
export const Route = createFileRoute("/api/auth/legacy-sign-in")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const origin = request.headers.get("origin");
        if (origin && origin !== requestUrl.origin) {
          return Response.json({ error: "Invalid origin" }, { status: 403 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const email =
          typeof body === "object" && body !== null && "email" in body
            ? String((body as { email?: unknown }).email ?? "").trim().toLowerCase()
            : "";
        const password =
          typeof body === "object" && body !== null && "password" in body
            ? String((body as { password?: unknown }).password ?? "")
            : "";

        if (!email || !password || password.length > 128) {
          return Response.json({ error: "Invalid credentials" }, { status: 400 });
        }

        const sql = await getSql();
        const matches = await sql.query<{ user_id: string }>(
          `select u."id" as user_id
             from menu_v3."user" u
             join auth.users s on lower(s.email) = lower(u.email)
            where lower(u.email) = $1
              and s.encrypted_password is not null
              and crypt($2, s.encrypted_password) = s.encrypted_password
              and exists (
                select 1
                  from menu_v3."account" a
                 where a."userId" = u."id"
                   and a."providerId" = 'credential'
                   and a."password" is not null
              )
            limit 1`,
          [email, password],
        );

        const user = matches[0];
        if (!user) {
          return Response.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const passwordHash = await hashPassword(password);
        await sql.query(
          `update menu_v3."account"
              set "password" = $1,
                  "updatedAt" = now()
            where "userId" = $2
              and "providerId" = 'credential'`,
          [passwordHash, user.user_id],
        );

        return auth.api.signInEmail({
          body: { email, password },
          headers: request.headers,
          asResponse: true,
        });
      },
    },
  },
});
