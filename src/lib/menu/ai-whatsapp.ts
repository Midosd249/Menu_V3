import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { generateStructuredAi } from "./ai-core";
import type { FnResult, Role } from "./types";

const inputSchema = z.object({
  reportText: z.string().trim().min(20).max(8000),
  lang: z.enum(["ar", "en"]),
});

type Member = { tenant_id: string; role: Role };

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

const runtimeResponseSchema = z.object({ message: z.string().trim().min(20).max(2000) });

export const generateWhatsAppReportMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(inputSchema)
  .handler(async ({ context, data }): Promise<FnResult<{ message: string }>> => {
    try {
      const sql = await getSql();
      const rows = await sql<Member>`select tenant_id, role from tenant_members where user_id = ${context.userId} and is_active = true order by created_at limit 1`;
      if (!rows[0]) return { ok: false, code: "not_found", error: "لا يوجد حساب مطعم نشط" };
      if (!(rows[0].role === "owner" || rows[0].role === "admin")) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية إنشاء رسالة التقرير" };
      const prompt = `Language: ${data.lang === "ar" ? "Arabic" : "English"}.\n\nWrite a polished WhatsApp message for the restaurant owner based only on this verified Menu V3 report. Keep it concise (roughly 5-9 short lines), mention the reporting period, 2-4 useful metrics, and 1-2 concrete priorities. End with a simple invitation to open the report in Menu V3. Do not add facts that are not in the report.\n\nREPORT:\n${data.reportText}`;
      const result = await generateStructuredAi({
        sql,
        tenantId: rows[0].tenant_id,
        userId: context.userId,
        operation: "analytics.whatsapp-report",
        prompt,
        responseFormat: responseSchema,
        responseSchema: runtimeResponseSchema,
        maxTokens: 500,
        temperature: 0.35,
        systemPrompt: "You write concise professional WhatsApp messages for restaurant owners. Use only the supplied report facts. Never invent revenue, sales, conversion, customer sentiment, causes, percentages, guarantees, or business outcomes. Keep the message easy to scan on a phone. Do not mention AI. Do not add a subject line. Return only the message in the requested language and structured format.",
      });
      if (result.ok) return { ok: true, data: { message: result.data.message } };
      return { ok: false, code: "unavailable", error: result.error };
    } catch (error) {
      console.error("generateWhatsAppReportMessage failed", error);
      return { ok: false, code: "unavailable", error: "تعذر إنشاء رسالة واتساب" };
    }
  });
