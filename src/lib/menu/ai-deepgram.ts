type DeepgramSttCallArgs = {
  audio: ArrayBuffer | Uint8Array;
  mimeType: string;
  model?: string;
  language?: string;
};

export const DEEPGRAM_DEFAULT_MODEL = "nova-3";
const DEEPGRAM_LISTEN_URL = "https://api.deepgram.com/v1/listen";

export type DeepgramSttResult =
  | { ok: true; content: string; transcript: string; confidence?: number; provider: "deepgram"; model: string }
  | { ok: false; code: "ai_not_configured" | "ai_unavailable" | "ai_invalid"; error: string; provider: "deepgram"; model: string };

function readEnv(name: string) {
  return process.env[name]?.trim() || "";
}

function normalizeAudio(audio: ArrayBuffer | Uint8Array): Uint8Array {
  return audio instanceof Uint8Array ? audio : new Uint8Array(audio);
}

function extractTranscript(payload: unknown): { transcript: string; confidence?: number } | null {
  const alternative = (
    payload as {
      results?: {
        channels?: Array<{
          alternatives?: Array<{ transcript?: unknown; confidence?: unknown }>;
        }>;
      };
    }
  )?.results?.channels?.[0]?.alternatives?.[0];

  if (!alternative || typeof alternative.transcript !== "string" || !alternative.transcript.trim()) return null;

  return {
    transcript: alternative.transcript.trim(),
    confidence: typeof alternative.confidence === "number" ? alternative.confidence : undefined,
  };
}

function normalizeHttpFailure(status: number): DeepgramSttResult["code"] {
  if (status === 400 || status === 413 || status === 415 || status === 422) return "ai_invalid";
  return "ai_unavailable";
}

export async function callDeepgramStt(
  args: DeepgramSttCallArgs,
  key = readEnv("DEEPGRAM_API_KEY"),
): Promise<DeepgramSttResult> {
  const model = args.model?.trim() || readEnv("DEEPGRAM_MODEL") || DEEPGRAM_DEFAULT_MODEL;
  const mimeType = args.mimeType.trim().toLowerCase();
  const audio = normalizeAudio(args.audio);

  if (!key) {
    return { ok: false, code: "ai_not_configured", error: "Provider deepgram is not configured", provider: "deepgram", model };
  }

  if (!mimeType.startsWith("audio/")) {
    return { ok: false, code: "ai_invalid", error: "Deepgram STT requires an audio MIME type", provider: "deepgram", model };
  }

  if (audio.byteLength === 0) {
    return { ok: false, code: "ai_invalid", error: "Deepgram STT requires a non-empty audio payload", provider: "deepgram", model };
  }

  const url = new URL(DEEPGRAM_LISTEN_URL);
  url.searchParams.set("model", model);
  url.searchParams.set("smart_format", "true");
  if (args.language?.trim()) url.searchParams.set("language", args.language.trim());

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${key}`,
        "Content-Type": mimeType,
        Accept: "application/json",
      },
      body: audio,
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      return {
        ok: false,
        code: normalizeHttpFailure(response.status),
        error: `Provider deepgram returned HTTP ${response.status}`,
        provider: "deepgram",
        model,
      };
    }

    const payload = await response.json();
    const result = extractTranscript(payload);

    if (!result) {
      return { ok: false, code: "ai_invalid", error: "Deepgram did not return a valid transcript", provider: "deepgram", model };
    }

    return {
      ok: true,
      content: result.transcript,
      transcript: result.transcript,
      ...(result.confidence === undefined ? {} : { confidence: result.confidence }),
      provider: "deepgram",
      model,
    };
  } catch {
    return { ok: false, code: "ai_unavailable", error: "Unable to reach Deepgram", provider: "deepgram", model };
  }
}
