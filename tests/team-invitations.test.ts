import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function hashToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

test("team invitation email normalization is canonical", () => {
  assert.equal(normalizeEmail("  OWNER@Example.COM "), "owner@example.com");
  assert.equal(normalizeEmail("Editor@EXAMPLE.com"), "editor@example.com");
});

test("team invitation token hashing is deterministic and one-way", () => {
  const token = "invite-token-example";
  const hash = hashToken(token);
  assert.equal(hash.length, 64);
  assert.equal(hash, hashToken(token));
  assert.notEqual(hash, token);
  assert.notEqual(hash, hashToken("different-token"));
});
