import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

/**
 * Symmetric encryption for third-party tokens at rest (e.g. the Instagram
 * access token). Uses AES-256-GCM with a key derived from TOKEN_ENCRYPTION_KEY.
 * Format: base64(salt).base64(iv).base64(tag).base64(ciphertext).
 *
 * If no key is configured, values pass through unchanged (demo/dev) — never
 * store real production tokens without TOKEN_ENCRYPTION_KEY set.
 */

const KEY = process.env.TOKEN_ENCRYPTION_KEY;

function deriveKey(salt: Buffer): Buffer {
  return scryptSync(KEY!, salt, 32);
}

export function encryptSecret(plaintext: string): string {
  if (!KEY) return plaintext;
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = deriveKey(salt);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [salt, iv, tag, encrypted]
    .map((b) => b.toString("base64"))
    .join(".");
}

export function decryptSecret(payload: string): string {
  if (!KEY) return payload;
  const parts = payload.split(".");
  if (parts.length !== 4) return payload; // not encrypted (legacy/plaintext)
  const [salt, iv, tag, encrypted] = parts.map((p) => Buffer.from(p, "base64"));
  const key = deriveKey(salt);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");
}
