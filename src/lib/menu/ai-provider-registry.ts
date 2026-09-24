import type { AiCapability } from "./ai-capabilities";

export type AiProviderFamily =
  | "mercury" | "gemini" | "zai" | "openrouter" | "xkiro"
  | "typesafe" | "nvidia" | "groq" | "cloudflare" | "cerebras" | "mistral" | "deepgram";

export type AiProviderTransport =
  | "openai_compatible" | "gemini_native" | "typesafe_system_one"
  | "mistral_document_ai" | "deepgram_stt";

export type AiProviderRole =
  | "execution" | "decision_orchestrator" | "document_specialist" | "audio_specialist";

export type AiProviderLifecycle = "active" | "planned";

export type AiProviderDescriptor = {
  id: AiProviderFamily;
  lifecycle: AiProviderLifecycle;
  transport: AiProviderTransport;
  role: AiProviderRole;
  candidateCapabilities: readonly AiCapability[];
  runtimeEligible: boolean;
  modelSelection: "fixed_default" | "configured" | "dynamic_catalog" | "typed_decision";
  keyPoolSize: number;
  notes: string;
};

export const AI_PROVIDER_REGISTRY: Readonly<Record<AiProviderFamily, AiProviderDescriptor>> = {
  mercury: { id:"mercury", lifecycle:"active", transport:"openai_compatible", role:"execution", candidateCapabilities:["structured"], runtimeEligible:true, modelSelection:"configured", keyPoolSize:6, notes:"Existing Inception/Mercury execution provider." },
  gemini: { id:"gemini", lifecycle:"active", transport:"gemini_native", role:"execution", candidateCapabilities:["structured","image","pdf"], runtimeEligible:true, modelSelection:"configured", keyPoolSize:1, notes:"Existing structured and multimodal provider; exact model capabilities remain model-specific." },
  zai: { id:"zai", lifecycle:"active", transport:"openai_compatible", role:"execution", candidateCapabilities:["structured","image","pdf"], runtimeEligible:true, modelSelection:"configured", keyPoolSize:1, notes:"Existing structured and multimodal path." },
  openrouter: { id:"openrouter", lifecycle:"active", transport:"openai_compatible", role:"execution", candidateCapabilities:["structured","image","pdf"], runtimeEligible:true, modelSelection:"configured", keyPoolSize:1, notes:"Existing OpenAI-compatible fallback; actual capabilities are model-specific." },
  xkiro: { id:"xkiro", lifecycle:"active", transport:"openai_compatible", role:"execution", candidateCapabilities:["structured"], runtimeEligible:true, modelSelection:"configured", keyPoolSize:1, notes:"Existing text path; vision remains explicit opt-in." },
  typesafe: { id:"typesafe", lifecycle:"planned", transport:"typesafe_system_one", role:"decision_orchestrator", candidateCapabilities:["typed_decision"], runtimeEligible:false, modelSelection:"typed_decision", keyPoolSize:3, notes:"Jev/System One is a typed-decision layer, not a generic prose fallback." },
  nvidia: { id:"nvidia", lifecycle:"active", transport:"openai_compatible", role:"execution", candidateCapabilities:["structured"], runtimeEligible:true, modelSelection:"dynamic_catalog", keyPoolSize:2, notes:"Hosted NVIDIA API Catalog structured execution is enabled for text-only models; multimodal routing remains disabled until a model-specific vision contract is verified." },
  groq: { id:"groq", lifecycle:"active", transport:"openai_compatible", role:"execution", candidateCapabilities:["structured"], runtimeEligible:true, modelSelection:"configured", keyPoolSize:1, notes:"Groq structured execution adapter verified against the current OpenAI-compatible Chat Completions and Structured Outputs contract; model is configurable with a production default." },
  cloudflare: { id:"cloudflare", lifecycle:"active", transport:"openai_compatible", role:"execution", candidateCapabilities:["structured"], runtimeEligible:true, modelSelection:"dynamic_catalog", keyPoolSize:1, notes:"Workers AI OpenAI-compatible structured execution; Account ID and API token are required." },
  cerebras: { id:"cerebras", lifecycle:"active", transport:"openai_compatible", role:"execution", candidateCapabilities:["structured"], runtimeEligible:true, modelSelection:"dynamic_catalog", keyPoolSize:1, notes:"Cerebras Inference structured execution via the official OpenAI-compatible Chat Completions contract; structured output remains subject to downstream schema validation." },
  mistral: { id:"mistral", lifecycle:"active", transport:"mistral_document_ai", role:"document_specialist", candidateCapabilities:["ocr_document","image","pdf"], runtimeEligible:true, modelSelection:"configured", keyPoolSize:1, notes:"Mistral Document AI OCR specialist with document annotations for structured menu extraction; generic text routing remains isolated." },
  deepgram: { id:"deepgram", lifecycle:"planned", transport:"deepgram_stt", role:"audio_specialist", candidateCapabilities:["audio_stt"], runtimeEligible:false, modelSelection:"dynamic_catalog", keyPoolSize:1, notes:"Speech-to-text specialist; isolated from generic LLM routing." },
};

export function getAiProviderDescriptor(provider: AiProviderFamily): AiProviderDescriptor {
  return AI_PROVIDER_REGISTRY[provider];
}

export function getRuntimeEligibleProviders(capability: AiCapability): AiProviderFamily[] {
  return Object.values(AI_PROVIDER_REGISTRY)
    .filter((descriptor) => descriptor.runtimeEligible && descriptor.candidateCapabilities.includes(capability))
    .map((descriptor) => descriptor.id);
}
