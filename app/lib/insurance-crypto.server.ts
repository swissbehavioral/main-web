import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
} from "node:crypto";
import type { InsuranceDetails } from "./insurance";
import { sessionSecret } from "./security.server.ts";
// Domain-separated key derivation. Keep SESSION_SECRET backed up; rotation requires re-encryption.
const key = () =>
  Buffer.from(
    hkdfSync("sha256", sessionSecret, "sbh-insurance-storage", "v1", 32),
  );
export function sealInsurance(details: InsuranceDetails) {
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(details), "utf8"),
    cipher.final(),
  ]);
  return (
    "v1." +
    Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url")
  );
}
export function openInsurance(value: string): InsuranceDetails {
  if (!value.startsWith("v1.")) throw Error("Unknown insurance payload");
  const bytes = Buffer.from(value.slice(3), "base64url"),
    decipher = createDecipheriv("aes-256-gcm", key(), bytes.subarray(0, 12));
  decipher.setAuthTag(bytes.subarray(12, 28));
  return JSON.parse(
    Buffer.concat([
      decipher.update(bytes.subarray(28)),
      decipher.final(),
    ]).toString("utf8"),
  );
}
