import "server-only";

import type { AiCapability } from "./ai-capabilities";
import type { AiProviderFamily } from "./ai-provider-registry";
import { AI_PROVIDER_REGISTRY } from "./ai-provider-registry";
import type { AiProvider } from "./ai-providers";
import { getProviderModel } from "./ai-providers";

export type AiExecutionCandidate = {
  id: string;
  provider: AiProvider;
  model: string;
  capabilities: readonly AiCapability[];
};

export type AiRoutingPolicyContext = {
  authorizationVerified: boolean;
  entitlementVerified: boolean;
  tenantScopeVerified: boolean;
  branchScopeVerified: boolean;
  pricingPolicyVerified: boolean;
};

export type AiRoutingSelection = {
  ok: true;
  candidate: AiExecutionCandidate;
} | {
  ok: false;
  code: "ai_no_eligible_candidate" | "ai_policy_blocked" | "ai_invalid_selection";
  error: string;
};

const EXECUTION_PROVIDER_IDS = new Set<AiProviderFamily>([
  "mercury",
  "gemini",
  "zai",
  "openrouter",
  "xkiro",
  "groq",
  "nvidia",
  "cloudflare",
  "cerebras",
]);

function isPolicySafe(context: AiRoutingPolicyContext) {
  return context.authorizationVerified
    && context.entitlementVerified
    && context.tenantScopeVerified
    && context.branchScopeVerified
    && context.pricingPolicyVerified;
}

export function getCapabilityEligibleExecutionCandidates(
  capability: AiCapability,
  configuredOrder: readonly AiProvider[] = [],
): AiExecutionCandidate[] {
  const configured = configuredOrder.length ? new Set(configuredOrder) : null;

  return Object.values(AI_PROVIDER_REGISTRY)
    .filter((descriptor) => descriptor.runtimeEligible)
    .filter((descriptor) => descriptor.role === "execution")
    .filter((descriptor) => EXECUTION_PROVIDER_IDS.has(descriptor.id))
    .filter((descriptor) => descriptor.candidateCapabilities.includes(capability))
    .filter((descriptor) => !configured || configured.has(descriptor.id as AiProvider))
    .map((descriptor) => {
      const provider = descriptor.id as AiProvider;
      return {
        id: `${provider}:${getProviderModel(provider, capability)}`,
        provider,
        model: getProviderModel(provider, capability),
        capabilities: descriptor.candidateCapabilities,
      };
    })
    .filter((candidate) => Boolean(candidate.model));
}

export function buildTypeSafeSelectionQuestion(
  candidates: readonly AiExecutionCandidate[],
) {
  const criteria: Record<string, string> = {};
  for (const candidate of candidates) {
    criteria[candidate.id] = `${candidate.provider} / ${candidate.model} supports ${candidate.capabilities.join(", ")}`;
  }

  return {
    type: "choice" as const,
    instructions: "Select exactly one candidate from the server-generated eligible execution set. Do not introduce a provider or model that is not listed.",
    criteria,
  };
}

export function selectExecutionCandidate(
  candidates: readonly AiExecutionCandidate[],
  selectedCandidateId: string,
  capability: AiCapability,
  policy: AiRoutingPolicyContext,
): AiRoutingSelection {
  if (!isPolicySafe(policy)) {
    return {
      ok: false,
      code: "ai_policy_blocked",
      error: "AI execution routing requires verified authorization, entitlement, tenant scope, branch scope, and pricing policy",
    };
  }

  const candidate = candidates.find((item) => item.id === selectedCandidateId);
  if (!candidate) {
    return {
      ok: false,
      code: "ai_invalid_selection",
      error: "Selected AI candidate is outside the server-generated eligible set",
    };
  }

  const descriptor = AI_PROVIDER_REGISTRY[candidate.provider];
  if (!descriptor.runtimeEligible
    || descriptor.role !== "execution"
    || !descriptor.candidateCapabilities.includes(capability)
    || candidate.model !== getProviderModel(candidate.provider, capability)) {
    return {
      ok: false,
      code: "ai_invalid_selection",
      error: "Selected AI candidate no longer satisfies the current capability policy",
    };
  }

  return { ok: true, candidate };
}

export function canUseTypeSafeDecisionLayer() {
  return AI_PROVIDER_REGISTRY.typesafe.runtimeEligible
    && AI_PROVIDER_REGISTRY.typesafe.role === "decision_orchestrator"
    && AI_PROVIDER_REGISTRY.typesafe.candidateCapabilities.includes("typed_decision");
}
