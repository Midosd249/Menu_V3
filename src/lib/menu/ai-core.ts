import { z } from "zod";
import { getSql } from "@/lib/db";
import { callStructuredProvider, AI_PROVIDER_DEFAULTS } from "@/lib/menu/ai-providers";

export const AI_PROMPT_VERSION = "menu-v3-r1-2026-09-11";
export const AI_DEFAULT_PROVIDER = "auto";
export const AI_DEFAULT_MODEL = AI_PROVIDER_DEFAULTS.mercury;
export const AI_DEFAULT_RATE_LIMIT_PER_MINUTE = 20;
export const AI_DEFAULT_GUEST_ASSISTANT_DAILY_LIMIT = 500;
export const AI_MAX_PROMPT_CHARS = 12_000;
export const AI_TIMEOUT_MS = 60_000;

type Sql = Awaited<ReturnType<typeof getSql>>;
type JsonSchema = Record<string, unknown>;

type AiFailure = {
  ok: false;
  code: "ai_not_configured" | "ai_unavailable" | "ai_invalid" | "ai_rate_limited" | "ai_provider_unavailable";
  error: string;
};

type GenerateStructuredAiInput<T extends z.ZodTypeAny> = {
  sql: Sql;
  tenantId: string;
  userId: string;
  operation: string;
  prompt: string;
  responseFormat: JsonSchema;
  responseSchema: T;
  maxTokens: number;
  temperature?: number;
  systemPrompt: string;
};

function getRateLimit() {
  const configured = Number(process.env.AI_REQUESTS_PER_MINUTE ?? AI_DEFAULT_RATE_LIMIT_PER_MINUTE);
  if (!Number.isFinite(configured)) return AI_DEFAULT_RATE_LIMIT_PER_MINUTE;
  return Math.max(1, Math.min(120, Math.floor(configured)));
}

function getGuestAssistantDailyLimit() {
  const configured = Number(
    process.env.AI_GUEST_ASSISTANT_REQUESTS_PER_TENANT_PER_DAY ?? AI_DEFAULT_GUEST_ASSISTANT_DAILY_LIMIT,
  );
  if (!Number.isFinite(configured)) return AI_DEFAULT_GUEST_ASSISTANT_DAILY_LIMIT;
  return Math.max(1, Math.min(10_000, Math.floor(configured)));
}

async function consumeRateLimit(sql: Sql, tenantId: string, userId: string, operation: string) {
  const windowStart = new Date(Math.floor(Date.now() / 60_000) * 60_000);
  const rows = await sql<{ request_count: number }>`
    insert into ai_request_rate_limits (tenant_id, user_id, window_start, request_count)
    values (${tenantId}, ${userId}, ${windowStart}, 1)
    on conflict (tenant_id, user_id, window_start)
    do update set request_count = ai_request_rate_limits.request_count + 1, updated_at = now()
    returning request_count
  `;
  if (Number(rows[0]?.request_count ?? 0) > getRateLimit()) return false;

  if (operation !== "guest.menu_assistant") return true;

  const dailyLimit = getGuestAssistantDailyLimit();
  const dailyWindowStart = new Date();
  dailyWindowStart.setUTCHours(0, 0, 0, 0);
  const dailyRows = await sql<{ request_count: number }>`
    insert into ai_guest_assistant_daily_limits (tenant_id, window_start, request_count)
    values (${tenantId}, ${dailyWindowStart}, 1)
    on conflict (tenant_id, window_start)
    do update
      set request_count = ai_guest_assistant_daily_limits.request_count + 1,
          updated_at = now()
      where ai_guest_assistant_daily_limits.request_count < ${dailyLimit}
    returning request_count
  `;
  return Number(dailyRows[0]?.request_count ?? dailyLimit + 1) <= dailyLimit;
}

export async function generateStructuredAi<T extends z.ZodTypeAny>(args: GenerateStructuredAiInput<T>): Promise<{ ok: true; data: z.output<T> } | AiFailure> {
  try {
    if (!(await consumeRateLimit(args.sql, args.tenantId, args.userId, args.operation))) {
      return { ok: false, code: "ai_rate_limited", error: "تم تجاوز حد استخدام مساعد الذكاء الاصطناعي مؤقتاً. حاول لاحقاً." };
    }

    const result = await callStructuredProvider({
      prompt: args.prompt.slice(0, AI_MAX_PROMPT_CHARS),
      responseFormat: args.responseFormat,
      maxTokens: args.maxTokens,
      temperature: args.temperature ?? 0.3,
      systemPrompt: args.systemPrompt,
      operation: args.operation,
      validateContent: (content) => {
        try {
          const parsed = JSON.parse(content) as unknown;
          return args.responseSchema.safeParse(parsed).success;
        } catch {
          return false;
        }
      },
    });

    if (!result.ok) return result;

    const parsed = (() => {
      try {
        return JSON.parse(result.content) as unknown;
      } catch {
        return null;
      }
    })();

    if (parsed === null) {
      console.warn("AI structured output was not JSON", {
        operation: args.operation,
        provider: result.provider,
        model: result.model,
        promptVersion: AI_PROMPT_VERSION,
      });
      return { ok: false, code: "ai_invalid", error: "نتيجة مساعد الذكاء الاصطناعي ليست JSON صالحة" };
    }

    const validated = args.responseSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("AI structured output validation failed", {
        operation: args.operation,
        provider: result.provider,
        model: result.model,
        promptVersion: AI_PROMPT_VERSION,
      });
      return { ok: false, code: "ai_invalid", error: "نتيجة مساعد الذكاء الاصطناعي غير صالحة" };
    }

    console.info("AI request completed", {
      operation: args.operation,
      provider: result.provider,
      model: result.model,
      promptVersion: AI_PROMPT_VERSION,
    });
    return { ok: true, data: validated.data };
  } catch (error) {
    console.error("AI request failed", {
      operation: args.operation,
      promptVersion: AI_PROMPT_VERSION,
      error: error instanceof Error ? error.message : "unknown",
    });
    return { ok: false, code: "ai_unavailable", error: "تعذر تشغيل مساعد الذكاء الاصطناعي" };
  }
}
