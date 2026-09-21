export const ACTIVE_EXPERIMENT = "whatsapp-cta-v1" as const;
export type ExperimentVariant = "control" | "prominent";

/**
 * Stable, non-identifying assignment for the active experiment.
 * The session id is already part of the existing anonymous menu analytics contract.
 */
export function getExperimentVariant(sessionId: string): ExperimentVariant {
  let hash = 0;
  for (let index = 0; index < sessionId.length; index += 1) {
    hash = (hash * 31 + sessionId.charCodeAt(index)) | 0;
  }
  return Math.abs(hash) % 2 === 0 ? "control" : "prominent";
}

export const EXPERIMENT_DEFINITION = {
  key: ACTIVE_EXPERIMENT,
  hypothesis:
    "Making the existing WhatsApp action more visually prominent will increase WhatsApp-intent sessions without reducing product exploration.",
  control: "Existing WhatsApp action presentation.",
  treatment: "Existing WhatsApp action with stronger visual prominence only.",
  primaryMetric: "WhatsApp-click sessions / exposed sessions",
  guardrailMetric: "Product-view sessions / exposed sessions",
  minimumExposedSessionsPerVariant: 50,
  rollbackCondition: "Remove the treatment if it causes a clear product-exploration regression or a rendering/accessibility defect.",
} as const;
