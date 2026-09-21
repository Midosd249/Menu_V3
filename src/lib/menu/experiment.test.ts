import assert from "node:assert/strict";
import test from "node:test";
import { ACTIVE_EXPERIMENT, EXPERIMENT_DEFINITION, getExperimentVariant } from "./experiment";

test("R6 experiment has a stable two-variant assignment", () => {
  const sessionId = "session-r6-example-123";
  const first = getExperimentVariant(sessionId);
  assert.equal(first, getExperimentVariant(sessionId));
  assert.ok(first === "control" || first === "prominent");
  assert.equal(ACTIVE_EXPERIMENT, "whatsapp-cta-v1");
});

test("R6 experiment keeps an explicit hypothesis, primary metric, and guardrail", () => {
  assert.match(EXPERIMENT_DEFINITION.hypothesis, /WhatsApp/i);
  assert.match(EXPERIMENT_DEFINITION.primaryMetric, /sessions/i);
  assert.match(EXPERIMENT_DEFINITION.guardrailMetric, /Product-view/i);
  assert.equal(EXPERIMENT_DEFINITION.minimumExposedSessionsPerVariant, 50);
});
