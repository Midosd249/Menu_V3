export const PREPARATION_DURATION_PRESETS = [3, 5, 10, 15, 20, 30] as const;
export const CUSTOM_PREPARATION_DURATION_MINUTES = { min: 1, max: 120 } as const;
export type PreparationDurationPreset = (typeof PREPARATION_DURATION_PRESETS)[number];

export function validatePreparationDurationMinutes(value: unknown): { ok: true; data: number } | { ok: false; code: "invalid"; error: string } {
  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
    return { ok: false, code: "invalid", error: "مدة التحضير يجب أن تكون عدداً صحيحاً من الدقائق." };
  }
  if (value < CUSTOM_PREPARATION_DURATION_MINUTES.min) {
    return { ok: false, code: "invalid", error: "مدة التحضير يجب ألا تقل عن دقيقة واحدة." };
  }
  if (value > CUSTOM_PREPARATION_DURATION_MINUTES.max) {
    return { ok: false, code: "invalid", error: "مدة التحضير يجب ألا تتجاوز 120 دقيقة." };
  }
  return { ok: true, data: value };
}
