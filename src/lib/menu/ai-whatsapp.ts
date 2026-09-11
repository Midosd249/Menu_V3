import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { FnResult, Role } from "./types";

const inputSchema = z.object({
  reportText: z.string().trim().min(20).max(8000),
  lang: z.enum(["ar", "en"]),
});

type Member = { role: Role };

const responseSchema = {
  name: "whatsapp_report_message",
  strict: true,
  schema: {
    type: "object",
    properties: {
      message: { type: "string", minLength: 20, maxLength: 2000 },
    },
    required: ["message"],
    additionalProperties: false,
  },
};

async function callMercury(prompt: string) {
  const apiKey = process.env.INCEPTION_API_KEY?.trim();
  if (!apiKey) return { ok: false as const, code: "ai_not_configured", error: "مساعد الذكاء الاصطناعي غير مهيأ حالياً" };
  const response = await fetch("https://api.inceptionlabs.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.INCEPTION_MODEL?.trim() || "mercury-2.5",
      messages: [
        {
          role: "system",
          content: "You write concise professional WhatsApp messages for restaurant owners. Use only the supplied report facts. Never invent revenue, sales, conversion, customer sentiment, causes, percentages, guarantees, or business outcomes. Keep the message easy to scan on a phone. Do not mention AI. Do not add a subject line. Return only the message in the requested language.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.35,
      max_tokens: 500,
      reasoning_effort: "low",
      response_format: { type: "json_schema", json_schema: responseSchema },
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) return { ok: false as const, code: "ai_unavailable", error: "تعذر الوصول إلى مساعد الذكاء الاصطناعي" };
  const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string | null } }> };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return { ok: false as const, code: "ai_invalid", error: "تعذر قراءة رسالة واتساب" };
  try {
    const parsed = JSON.parse(content) as { message?: unknown };
    if (typeof parsed.message !== "string" || parsed.message.trim().length < 20) return { ok: false as const, code: "ai_invalid", error: "نتيجة رسالة واتساب غير صالحة" };
    return { ok: true as const, message: parsed.message.trim().slice(0, 2000) };
  } catch {
    return { ok: false as const, code: "ai_invalid", error: "تعذر قراءة رسالة واتساب" };
  }
}

export const generateWhatsAppReportMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(inputSchema)
  .handler(async ({ context, data }): Promise<FnResult<{ message: string }>> => {
    try {
      const sql = await getSql();
      const rows = await sql<Member>`select role from tenant_members where user_id = ${context.userId} and is_active = true order by created_at limit 1`;
      if (!rows[0]) return { ok: false, code: "not_found", error: "لا يوجد حساب مطعم نشط" };
      if (!(["owner", "admin"] as Role[]).includes(rows[0].role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية إنشاء رسالة التقرير" };
      const prompt = `Language: ${data.lang === "ar" ? "Arabic" : "English"}.\n\nWrite a polished WhatsApp message for the restaurant owner based only on this verified Menu V3 report. Keep it concise (roughly 5-9 short lines), mention the reporting period, 2-4 useful metrics, and 1-2 concrete priorities. End with a simple invitation to open the report in Menu V3. Do not add facts that are not in the report.\n\nREPORT:\n${data.reportText}`;
      const result = await callMercury(prompt);
      return result.ok ? { ok: true, data: { message: result.message } } : result;
    } catch (error) {
      console.error("generateWhatsAppReportMessage failed", error);
      return { ok: false, code: "ai_unavailable", error: "تعذر إنشاء رسالة واتساب" };
    }
  });
