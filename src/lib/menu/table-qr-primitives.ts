import { createHash, randomBytes } from "node:crypto";

const TOKEN_BYTES = 32;

export function hashTableQrToken(plainToken: string): string {
  return createHash("sha256").update(plainToken, "utf8").digest("hex");
}

export function generateTableQrToken(): { plain: string; hash: string } {
  const plain = randomBytes(TOKEN_BYTES).toString("base64url");
  return { plain, hash: hashTableQrToken(plain) };
}
