import { z } from "zod";
import { getSql } from "@/lib/db";

export const AI_PROMPT_VERSION = "menu-v3-r1-2026-09-11";
export const AI_DEFAULT_PROVIDER = "mercury";
export const AI_DEFAULT_MODEL = "mercury-2.5";
export const AI_DEFAULT_RATE_LIMIT_PER_MINUTE = 20;
export const AI_MAX_PROMPT_CHARS = 12_000;
export const AI_TIMEOUT_MS = 20_000;

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

function getProvider() {
  return process.env.AI_PROVIDER?.trim().toLowerCase() || AI_DEFAULT_PROVIDER;
}

function getModel() {
  return process.env.INCEPTION_MODEL?.trim() || AI_DEFAULT_MODEL;
}

function getRateLimit() {
  const configured = Number(process.env.AI_REQUESTS_PER_MINUTE ?? AI_DEFAULT_RATE_LIMIT_PER_MINUTE);
  if (!Number.isFinite(configured)) return AI_DEFAULT_RATE_LIMIT_PER_MINUTE;
  return Math.max(1, Math.min(120, Math.floor(configured)));
}

async function consumeRateLimit(sql: Sql, tenantId: string, userId: string) {
  const windowStart = new Date(Math.floor(Date.now() / 60_000) * 60_000);
  const rows = await sql<{ request_count: number }>`
    insert into ai_request_rate_limits (tenant_id, user_id, window_start, request_count)
    values (${tenantId}, ${userId}, ${windowStart}, 1)
    on conflict (tenant_id, user_id, window_start)
    do update set request_count = ai_request_rate_limits.request_count + 1, updated_at = now()
    returning request_count
  `;
  return Number(rows[0]?.request_count ?? 0) <= getRateLimit();
}

async function callMercury(args: {
  prompt: string;
  responseFormat: JsonSchema;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}) {
  const apiKey = process.env.INCEPTION_API_KEY?.trim();
  if (!apiKey) return { ok: false as const, code: "ai_not_configured" as const, error: "مساعد الذكاء الاصطناعي غير مهيأ حالياً" };

  const response = await fetch("https://api.inceptionlabs.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: getModel(),
      messages: [
        { role: "system", content: args.systemPrompt },
        { role: "user", content: args.prompt.slice(0, AI_MAX_PROMPT_CHARS) },
      ],
      temperature: args.temperature,
      max_tokens: Math.max(64, Math.min(2_000, Math.floor(args.maxTokens))),
      reasoning_effort: "low",
      response_format: { type: "json_schema", json_schema: args.responseFormat },
    }),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
  });

  if (!response.ok) return { ok: false as const, code: "ai_unavailable" as const, error: "تعذر الوصول إلى مساعد الذكاء الاصطناعي" };
  const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string | null } }> };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return { ok: false as const, code: "ai_invalid" as const, error: "تعذر قراءة نتيجة مساعد الذكاء الاصطناعي" };

  try {
    return { ok: true as const, parsed: JSON.parse(content) as unknown };
  } catch {
    return { ok: false as const, code: "ai_invalid" as const, error: "نتيجة مساعد الذكاء الاصطناعي ليست JSON صالحة" };
  }
}

export async function generateStructuredAi<T extends z.ZodTypeAny>(args: GenerateStructuredAiInput<T>): Promise<{ ok: true; data: any } | AiFailure> {
  try {
    if (!(await consumeRateLimit(args.sql, args.tenantId, args.userId))) {
      return { ok: false, code: "ai_rate_limited", error: "تم تجاوز حد استخدام مساعد الذكاء الاصطناعي مؤقتاً. حاول لاحقاً." };
    }

    const provider = getProvider();
    if (provider !== "mercury") {
      return { ok: false, code: "ai_provider_unavailable", error: "مزود الذكاء الاصطناعي المحدد غير مدعوم حالياً" };
    }

    const result = await callMercury({
      prompt: args.prompt,
      responseFormat: args.responseFormat,
      maxTokens: args.maxTokens,
      temperature: args.temperature ?? 0.3,
      systemPrompt: args.systemPrompt,
    });
    if (!result.ok) return result;

    const parsed = args.responseSchema.safeParse(result.parsed);
    if (!parsed.success) {
      console.warn("AI structured output validation failed", {
        operation: args.operation,
        provider,
        model: getModel(),
        promptVersion: AI_PROMPT_VERSION,
      });
      return { ok: false, code: "ai_invalid", error: "نتيجة مساعد الذكاء الاصطناعي غير صالحة" };
    }

    console.info("AI request completed", {
      operation: args.operation,
      provider,
      model: getModel(),
      promptVersion: AI_PROMPT_VERSION,
    });
    return { ok: true, data: parsed.data };
  } catch (error) {
    console.error("AI request failed", {
      operation: args.operation,
      provider: getProvider(),
      model: getModel(),
      promptVersion: AI_PROMPT_VERSION,
      error: error instanceof Error ? error.message : "unknown",
    });
    return { ok: false, code: "ai_unavailable", error: "تعذر تشغيل مساعد الذكاء الاصطناعي" };
  }
}