import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateTableQrToken, hashTableQrToken } from "./table-qr-primitives.ts";

describe("table-qr token primitives", () => {
  it("generates high-entropy tokens and stable hashes", () => {
    const a = generateTableQrToken();
    const b = generateTableQrToken();
    assert.notEqual(a.plain, b.plain);
    assert.equal(a.hash.length, 64);
    assert.match(a.hash, /^[0-9a-f]{64}$/);
    assert.equal(hashTableQrToken(a.plain), a.hash);
    assert.notEqual(hashTableQrToken(a.plain), hashTableQrToken(b.plain));
  });

  it("rejects empty or short tokens at hash boundary (caller must still gate)", () => {
    assert.equal(hashTableQrToken("").length, 64);
    assert.notEqual(hashTableQrToken("short"), hashTableQrToken("short2"));
  });
});
