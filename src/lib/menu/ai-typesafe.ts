export const TYPESAFE_DEFAULT_MODEL = "jev-latest";
const TYPESAFE_ENDPOINT = "https://api.typesafe.ai/v1/systemone";
const MAX_STATE_CHARS = 48_000;
const MAX_QUESTIONS = 32;
const MAX_CANDIDATES = 64;

type JsonObject = Record<string, unknown>;

export type TypeSafeCandidate = {
  id: string;
  provider: string;
  model: string;
  capabilities: readonly string[];
};

export type TypeSafeQuestion =
  | {
      type: "noul";
      instructions: string;
      criteria?: { true: string; false: string };
    }
  | {
      type: "choice";
      instructions: string;
      criteria: Record<string, string>;
    }
  | {
      type: "score";
      instructions: string;
      criteria: readonly string[];
    };

export type TypeSafeDecisionArgs = {
  state: unknown;
  questions: Readonly<Record<string, TypeSafeQuestion>>;
  eligibleCandidates: readonly TypeSafeCandidate[];
  model?: string;
};

export type TypeSafeNoulAnswer = {
  type: "noul";
  noul: number;
};

export type TypeSafeChoiceAnswer = {
  type: "choice";
  choice: string;
  confidence?: number;
  probabilities?: Record<string, number>;
};

export type TypeSafeScoreAnswer = {
  type: "score";
  score: number;
  confidence?: number;
  probabilities?: Record<string, number>;
  legend?: Record<string, string>;
};

export type TypeSafeAnswer = TypeSafeNoulAnswer | TypeSafeChoiceAnswer | TypeSafeScoreAnswer;

export type TypeSafeDecisionSuccess = {
  ok: true;
  provider: "typesafe";
  model: string;
  answers: Record<string, TypeSafeAnswer>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
};

export type TypeSafeDecisionFailure = {
  ok: false;
  code: "ai_not_configured" | "ai_unavailable" | "ai_invalid";
  error: string;
  provider: "typesafe";
  model: string;
};

export type TypeSafeDecisionResult = TypeSafeDecisionSuccess | TypeSafeDecisionFailure;

function env(name: string) {
  return process.env[name]?.trim() || "";
}

function getKeys(): string[] {
  return [
    process.env.TYPESAFE_API_KEY,
    process.env.TYPESAFE_API_KEY_2,
    process.env.TYPESAFE_API_KEY_3,
  ]
    .filter((key): key is string => Boolean(key?.trim()))
    .map((key) => key.trim());
}

function orderedKeys(keys: string[]) {
  if (keys.length <= 1) return keys;
  const start = Math.floor(Date.now() / 60_000) % keys.length;
  return [...keys.slice(start), ...keys.slice(0, start)];
}

function isFiniteProbability(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
}

function validateAnswer(
  answer: unknown,
  question: TypeSafeQuestion,
  candidateIds: ReadonlySet<string>,
  questionId: string,
): answer is TypeSafeAnswer {
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) return false;
  const value = answer as JsonObject;

  if (value.type === "noul") {
    return typeof value.noul === "number" && Number.isFinite(value.noul) && value.noul >= 0 && value.noul <= 1;
  }

  if (value.type === "choice") {
    if (question.type !== "choice" || typeof value.choice !== "string") return false;
    const options = new Set(Object.keys(question.criteria));
    if (!options.has(value.choice)) return false;
    if (questionId === "selected_candidate" && !candidateIds.has(value.choice)) return false;
    if (value.confidence !== undefined && !isFiniteProbability(value.confidence)) return false;
    if (value.probabilities !== undefined) {
      if (!value.probabilities || typeof value.probabilities !== "object" || Array.isArray(value.probabilities)) return false;
      for (const [key, probability] of Object.entries(value.probabilities as JsonObject)) {
        if (!options.has(key) || !isFiniteProbability(probability)) return false;
      }
    }
    return true;
  }

  if (value.type === "score") {
    if (question.type !== "score" || typeof value.score !== "number" || !Number.isFinite(value.score)) return false;
    if (value.score < 0 || value.score > question.criteria.length - 1) return false;
    if (value.confidence !== undefined && !isFiniteProbability(value.confidence)) return false;
    if (value.probabilities !== undefined) {
      if (!value.probabilities || typeof value.probabilities !== "object" || Array.isArray(value.probabilities)) return false;
      for (const probability of Object.values(value.probabilities as JsonObject)) {
        if (!isFiniteProbability(probability)) return false;
      }
    }
    return true;
  }

  return false;
}

function validateResponse(payload: unknown, questions: Readonly<Record<string, TypeSafeQuestion>>, candidates: readonly TypeSafeCandidate[]) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const body = payload as JsonObject;
  if (typeof body.model !== "string" || !body.model.trim()) return null;
  if (!body.answers || typeof body.answers !== "object" || Array.isArray(body.answers)) return null;

  const answers = body.answers as JsonObject;
  const candidateIds = new Set(candidates.map((candidate) => candidate.id));
  const normalized: Record<string, TypeSafeAnswer> = {};

  for (const [id, question] of Object.entries(questions)) {
    const answer = answers[id];
    if (!validateAnswer(answer, question, candidateIds, id)) return null;
    normalized[id] = answer as TypeSafeAnswer;
  }

  const usage = body.usage;
  const normalizedUsage = usage && typeof usage === "object" && !Array.isArray(usage)
    ? {
        input_tokens: typeof (usage as JsonObject).input_tokens === "number" ? (usage as JsonObject).input_tokens as number : undefined,
        output_tokens: typeof (usage as JsonObject).output_tokens === "number" ? (usage as JsonObject).output_tokens as number : undefined,
      }
    : undefined;

  return { model: body.model.trim(), answers: normalized, usage: normalizedUsage };
}

function buildState(state: unknown, candidates: readonly TypeSafeCandidate[]) {
  const enriched = {
    state,
    eligible_candidates: candidates.map((candidate) => ({
      id: candidate.id,
      provider: candidate.provider,
      model: candidate.model,
      capabilities: [...candidate.capabilities],
    })),
  };
  const serialized = JSON.stringify(enriched);
  if (serialized.length > MAX_STATE_CHARS) return null;
  return enriched;
}

function validateCandidates(candidates: readonly TypeSafeCandidate[]) {
  if (!candidates.length || candidates.length > MAX_CANDIDATES) return false;
  const ids = new Set<string>();
  return candidates.every((candidate) => {
    if (!candidate || !candidate.id || !candidate.provider || !candidate.model || ids.has(candidate.id)) return false;
    ids.add(candidate.id);
    return candidate.capabilities.length > 0 && candidate.capabilities.length <= 16;
  });
}

export async function callTypeSafeDecision(args: TypeSafeDecisionArgs): Promise<TypeSafeDecisionResult> {
  if (typeof window !== "undefined") {
    throw new Error("TypeSafe decision adapter is server-only");
  }
  const model = env("TYPESAFE_MODEL") || args.model || TYPESAFE_DEFAULT_MODEL;
  const questions = args.questions;
  const questionEntries = Object.entries(questions);

  if (!validateCandidates(args.eligibleCandidates)) {
    return { ok: false, code: "ai_invalid", error: "TypeSafe requires a non-empty, bounded, unique server-generated candidate set", provider: "typesafe", model };
  }
  if (!questionEntries.length || questionEntries.length > MAX_QUESTIONS) {
    return { ok: false, code: "ai_invalid", error: "TypeSafe requires a non-empty, bounded question set", provider: "typesafe", model };
  }
  if (questionEntries.some(([id, question]) => !id.trim() || !question?.type || !question.instructions?.trim())) {
    return { ok: false, code: "ai_invalid", error: "TypeSafe question definitions are invalid", provider: "typesafe", model };
  }

  const enrichedState = buildState(args.state, args.eligibleCandidates);
  if (!enrichedState) {
    return { ok: false, code: "ai_invalid", error: "TypeSafe decision state exceeds the bounded request size", provider: "typesafe", model };
  }

  const keys = orderedKeys(getKeys());
  if (!keys.length) {
    return { ok: false, code: "ai_not_configured", error: "Provider typesafe is not configured", provider: "typesafe", model };
  }

  let lastFailure: TypeSafeDecisionFailure | null = null;
  for (const key of keys) {
    try {
      const response = await fetch(TYPESAFE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          state: enrichedState,
          model,
          questions,
        }),
        signal: AbortSignal.timeout(60_000),
      });

      if (!response.ok) {
        const code = response.status === 400 || response.status === 422
          ? "ai_invalid"
          : "ai_unavailable";
        lastFailure = {
          ok: false,
          code,
          error: `Provider typesafe returned HTTP ${response.status}`,
          provider: "typesafe",
          model,
        };
        continue;
      }

      const payload = await response.json();
      const validated = validateResponse(payload, questions, args.eligibleCandidates);
      if (!validated) {
        return {
          ok: false,
          code: "ai_invalid",
          error: "TypeSafe returned a malformed or policy-incompatible typed decision",
          provider: "typesafe",
          model,
        };
      }

      return {
        ok: true,
        provider: "typesafe",
        model: validated.model,
        answers: validated.answers,
        usage: validated.usage,
      };
    } catch {
      lastFailure = {
        ok: false,
        code: "ai_unavailable",
        error: "Unable to reach TypeSafe",
        provider: "typesafe",
        model,
      };
    }
  }

  return lastFailure ?? {
    ok: false,
    code: "ai_unavailable",
    error: "TypeSafe request failed",
    provider: "typesafe",
    model,
  };
}
