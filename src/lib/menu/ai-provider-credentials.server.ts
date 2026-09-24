import type { AiProviderFamily } from "./ai-provider-registry";

export type AiProviderCredentialState = "configured" | "partial" | "missing";

export type AiProviderCredentialDescriptor = {
  provider: AiProviderFamily;
  secretEnv: readonly string[];
  contextEnv?: readonly string[];
  requiredSecretCount: number;
  requiredContextCount: number;
};

export type AiProviderCredentialStatus = {
  provider: AiProviderFamily;
  state: AiProviderCredentialState;
  configuredSecretCount: number;
  requiredSecretCount: number;
  configuredContextCount: number;
  requiredContextCount: number;
};

export const AI_PROVIDER_CREDENTIALS: Readonly<Record<AiProviderFamily, AiProviderCredentialDescriptor>> = {
  mercury: {
    provider: "mercury",
    secretEnv: ["INCEPTION_API_KEY", "INCEPTION_API_KEY_2", "INCEPTION_API_KEY_3", "INCEPTION_API_KEY_4", "INCEPTION_API_KEY_5", "INCEPTION_API_KEY_6"],
    requiredSecretCount: 1,
    requiredContextCount: 0,
  },
  gemini: { provider: "gemini", secretEnv: ["GOOGLE_GEMINI_API_KEY"], requiredSecretCount: 1, requiredContextCount: 0 },
  zai: { provider: "zai", secretEnv: ["ZAI_API_KEY"], requiredSecretCount: 1, requiredContextCount: 0 },
  openrouter: { provider: "openrouter", secretEnv: ["OPENROUTER_API_KEY"], requiredSecretCount: 1, requiredContextCount: 0 },
  xkiro: { provider: "xkiro", secretEnv: ["XKIRO_API_KEY"], requiredSecretCount: 1, requiredContextCount: 0 },

  typesafe: {
    provider: "typesafe",
    secretEnv: ["TYPESAFE_API_KEY", "TYPESAFE_API_KEY_2", "TYPESAFE_API_KEY_3"],
    requiredSecretCount: 1,
    requiredContextCount: 0,
  },
  nvidia: {
    provider: "nvidia",
    secretEnv: ["NVIDIA_API_KEY", "NVIDIA_API_KEY_2"],
    requiredSecretCount: 1,
    requiredContextCount: 0,
  },
  groq: {
    provider: "groq",
    secretEnv: ["GROQ_API_KEY"],
    requiredSecretCount: 1,
    requiredContextCount: 0,
  },
  cloudflare: {
    provider: "cloudflare",
    secretEnv: ["CLOUDFLARE_API_TOKEN"],
    contextEnv: ["CLOUDFLARE_ACCOUNT_ID"],
    requiredSecretCount: 1,
    requiredContextCount: 1,
  },
  cerebras: {
    provider: "cerebras",
    secretEnv: ["CEREBRAS_API_KEY"],
    requiredSecretCount: 1,
    requiredContextCount: 0,
  },
  mistral: {
    provider: "mistral",
    secretEnv: ["MISTRAL_API_KEY"],
    requiredSecretCount: 1,
    requiredContextCount: 0,
  },
  deepgram: {
    provider: "deepgram",
    secretEnv: ["DEEPGRAM_API_KEY"],
    requiredSecretCount: 1,
    requiredContextCount: 0,
  },
};

function readEnv(name: string): string {
  return typeof process === "undefined" ? "" : process.env[name]?.trim() || "";
}

export function getAiProviderCredentialDescriptor(provider: AiProviderFamily): AiProviderCredentialDescriptor {
  return AI_PROVIDER_CREDENTIALS[provider];
}

export function getAiProviderSecretKeys(provider: AiProviderFamily): string[] {
  const descriptor = getAiProviderCredentialDescriptor(provider);
  return descriptor.secretEnv
    .map(readEnv)
    .filter(Boolean);
}

export function getAiProviderCredentialStatus(provider: AiProviderFamily): AiProviderCredentialStatus {
  const descriptor = getAiProviderCredentialDescriptor(provider);
  const configuredSecretCount = getAiProviderSecretKeys(provider).length;
  const configuredContextCount = (descriptor.contextEnv ?? []).filter((name) => Boolean(readEnv(name))).length;
  const state: AiProviderCredentialState =
    configuredSecretCount === 0 || configuredContextCount < descriptor.requiredContextCount
      ? "missing"
      : configuredSecretCount < descriptor.requiredSecretCount
        ? "partial"
        : "configured";

  return {
    provider,
    state,
    configuredSecretCount,
    requiredSecretCount: descriptor.requiredSecretCount,
    configuredContextCount,
    requiredContextCount: descriptor.requiredContextCount,
  };
}

export function getConfiguredAiProviderKeyPool(provider: AiProviderFamily): string[] {
  const status = getAiProviderCredentialStatus(provider);
  if (status.state !== "configured") return [];
  return getAiProviderSecretKeys(provider);
}

export function getCloudflareAccountId(): string | null {
  const descriptor = getAiProviderCredentialDescriptor("cloudflare");
  const accountEnv = descriptor.contextEnv?.[0];
  const value = accountEnv ? readEnv(accountEnv) : "";
  return value || null;
}
