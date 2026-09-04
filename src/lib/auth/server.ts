/** Self-hosted Better Auth for Menu V3 (server-only). */
import { betterAuth } from "better-auth";
import { verifyPassword as verifyScryptPassword } from "better-auth/crypto";
import { bearer, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getCookie } from "@tanstack/react-start/server";
import { createHash } from "node:crypto";
import { Pool } from "pg";
import { ensureDbReady, getPglite, POSTGRES_SCHEMA } from "../db";
import { emailAndPasswordEnabled } from "./email-password";
import { GATE_PROVIDER_ID, gateIdentitySessions } from "./gate-session.server";
import { GROK_PROVIDERS } from "./providers";
import { pgliteDialect } from "./pglite-dialect";
import {
  GROK_ISSUER_DEFAULT,
  PREVIEW_ALLOWED_HOSTS,
  PREVIEW_CLIENT_ID,
  PREVIEW_CLIENT_SECRET,
} from "./preview";

void ensureDbReady();

const globalAuthRef = globalThis as typeof globalThis & { __grokAuthPreviewSecret__?: string };
function previewAuthSecret(): string {
  const explicit = process.env.BETTER_AUTH_SECRET?.trim();
  if (explicit) return explicit;
  // A random secret per serverless instance invalidates Better Auth's cookie
  // cache whenever a request lands on a different instance. Derive a stable
  // fallback from the production database credential when no explicit secret
  // has been configured, so warm/cold instances agree on the same secret.
  if (!globalAuthRef.__grokAuthPreviewSecret__) {
    const stableSource =
      process.env.SUPABASE_DB_URL?.trim() ??
      process.env.DATABASE_URL?.trim() ??
      process.env.POSTGRES_URL?.trim() ??
      "menu-v3-local-development-secret";
    globalAuthRef.__grokAuthPreviewSecret__ = createHash("sha256")
      .update(`menu-v3-auth:${stableSource}`)
      .digest("hex");
  }
  return globalAuthRef.__grokAuthPreviewSecret__;
}
const env = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
};

const authDisabled = env("VITE_AUTH_ENABLED") === "false";
const grokIssuer = env("GROK_AUTH_ISSUER") ?? GROK_ISSUER_DEFAULT;
const grokClientId = env("GROK_AUTH_CLIENT_ID") ?? PREVIEW_CLIENT_ID;
const grokClientSecret = env("GROK_AUTH_CLIENT_SECRET") ?? PREVIEW_CLIENT_SECRET;
export const authConfigured = !authDisabled && Boolean(grokClientId && grokClientSecret);

const explicitBaseURL = env("BETTER_AUTH_URL");
const previewAllowedHosts: string[] = [...PREVIEW_ALLOWED_HOSTS];
const LOCAL_DEV_ORIGINS = ["http://localhost:8080", "http://127.0.0.1:8080", "http://[::1]:8080"];
const VERCEL_ORIGINS = [
  "https://menu-v3-kohl.vercel.app",
  "https://menu-v3-midosd2s-projects.vercel.app",
  "https://menu-v3-git-main-midosd2s-projects.vercel.app",
  "https://menu-v3-*.vercel.app",
];
const baseURL = explicitBaseURL ?? {
  allowedHosts: [...previewAllowedHosts, "localhost", "127.0.0.1", "[::1]", "menu-v3-*.vercel.app"],
  protocol: "auto" as const,
  fallback: "https://menu-v3-kohl.vercel.app",
};
const trustedOrigins = explicitBaseURL
  ? [explicitBaseURL, ...VERCEL_ORIGINS, ...LOCAL_DEV_ORIGINS]
  : [
      ...previewAllowedHosts,
      ...previewAllowedHosts.flatMap((host) => [`https://${host}`, `http://${host}`]),
      ...VERCEL_ORIGINS,
      ...LOCAL_DEV_ORIGINS,
    ];

const databaseUrl =
  env("DATABASE_URL") ??
  env("POSTGRES_URL") ??
  env("POSTGRES_PRISMA_URL") ??
  env("SUPABASE_DB_URL") ??
  env("POSTGRES_URL_NON_POOLING");
const issuerBase = grokIssuer.replace(/\/+$/, "");
const database = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      options: `-c search_path=${POSTGRES_SCHEMA},public`,
      // Better Auth and application queries share the same Supavisor-backed
      // database. Keep this pool small to avoid connection spikes on Vercel.
      max: 2,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
      keepAlive: true,
    })
  : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const };

const grokOAuthPlugin = authConfigured
  ? genericOAuth({
      config: GROK_PROVIDERS.map(({ providerId, idp }) => ({
        providerId,
        clientId: grokClientId as string,
        clientSecret: grokClientSecret as string,
        authorizationUrl: `${issuerBase}/api/auth/oauth2/authorize`,
        tokenUrl: `${issuerBase}/api/auth/oauth2/token`,
        userInfoUrl: `${issuerBase}/api/auth/oauth2/userinfo`,
        scopes: ["openid", "profile", "email"],
        authorizationUrlParams: { idp, prompt: "login" },
      })),
    })
  : null;

async function verifyLegacyOrNativePassword({
  hash,
  password,
}: {
  hash: string;
  password: string;
}): Promise<boolean> {
  // Existing Supabase Auth accounts use bcrypt hashes. Better Auth's native
  // format is scrypt salt:key. Verify legacy bcrypt rows through PostgreSQL's
  // pgcrypto extension without introducing another runtime dependency.
  if (/^\$2[aby]?\$\d{2}\$/.test(hash)) {
    if (!(database instanceof Pool)) return false;
    try {
      const result = await database.query<{ valid: boolean }>(
        "select crypt($1, $2) = $2 as valid",
        [password, hash],
      );
      return result.rows[0]?.valid === true;
    } catch (error) {
      console.error("[auth] legacy bcrypt verification failed", error);
      return false;
    }
  }

  try {
    return await verifyScryptPassword({ hash, password });
  } catch {
    return false;
  }
}

export const SESSION_TOKEN_COOKIE = "__Host-grok-auth.session_token";
export const auth = betterAuth({
  baseURL,
  secret: previewAuthSecret(),
  database,
  trustedOrigins,
  account: {
    encryptOAuthTokens: true,
    accountLinking: {
      enabled: true,
      trustedProviders: [...GROK_PROVIDERS.map((p) => p.providerId), GATE_PROVIDER_ID],
      requireLocalEmailVerified: false,
    },
  },
  session: { cookieCache: { enabled: true, maxAge: 300 } },
  ...(emailAndPasswordEnabled
    ? {
        emailAndPassword: {
          enabled: true,
          password: {
            hash: async (password: string) => {
              const { hashPassword } = await import("better-auth/crypto");
              return hashPassword(password);
            },
            verify: verifyLegacyOrNativePassword,
          },
        },
      }
    : {}),
  advanced: {
    useSecureCookies: false,
    defaultCookieAttributes: { secure: true, sameSite: "lax", path: "/" },
    cookies: {
      session_token: { name: SESSION_TOKEN_COOKIE },
      session_data: { name: "__Host-grok-auth.session_data" },
      account_data: { name: "__Host-grok-auth.account_data" },
      dont_remember: { name: "__Host-grok-auth.dont_remember" },
    },
  },
  plugins: [gateIdentitySessions(), ...(grokOAuthPlugin ? [grokOAuthPlugin] : []), bearer(), tanstackStartCookies()],
});

export function readSessionToken(): string | null {
  return getCookie(SESSION_TOKEN_COOKIE) ?? null;
}
export { GROK_PROVIDERS } from "./providers";
