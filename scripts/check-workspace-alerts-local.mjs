import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const origin = "http://localhost:5188";
async function post(path, values, cookie = "") {
  return fetch(origin + path, {
    method: "POST",
    headers: { Origin: origin, Cookie: cookie },
    body: new URLSearchParams(values),
    redirect: "manual",
  });
}
let r = await fetch(origin + "/api/admin/notifications", {
  redirect: "manual",
});
assert.equal(r.status, 302);
r = await post("/admin/login", {
  email: "qa@example.invalid",
  password: "local-qa-only",
  redirectTo: "/admin",
});
assert.equal(r.status, 302);
const cookie = r.headers.get("set-cookie").split(";")[0];
r = await post("/api/lead", {
  kind: "insurance",
  name: "Synthetic Contact",
  phone: "2025550100",
  insurer: "Synthetic Plan",
  patientName: "Synthetic Patient",
  patientDob: "1990-05-02",
  relationship: "self",
  memberId: "SYNTHETIC-MEMBER-ONLY",
  groupNumber: "TEST",
  insuranceConsent: "on",
  consent: "on",
  source: "/verify-insurance",
});
assert.equal(r.status, 201);
const { id } = await r.json();
const file = await readFile("/tmp/sbh-workspace-qa/leads.json", "utf8");
assert(!file.includes("SYNTHETIC-MEMBER-ONLY"));
assert(!file.includes("Synthetic Patient"));
assert(file.includes("v1."));
r = await fetch(origin + "/api/admin/notifications", {
  headers: { Cookie: cookie },
});
assert.equal(r.status, 200);
const snapshot = await r.text();
assert(snapshot.includes("insurance"));
assert(!snapshot.includes("Synthetic"));
assert(!snapshot.includes("v1."));
assert(r.headers.get("cache-control").includes("no-store"));
r = await fetch(origin + "/admin/leads/" + id, { headers: { Cookie: cookie } });
const details = await r.text();
assert.equal(r.status, 200);
assert(details.includes("SYNTHETIC-MEMBER-ONLY"));
assert(details.includes("Synthetic Patient"));
r = await fetch(origin + "/admin/insurance?kind=inquiry", {
  headers: { Cookie: cookie },
});
const list = await r.text();
assert(list.includes("Synthetic Contact"));
assert(!list.includes("SYNTHETIC-MEMBER-ONLY"));
assert(!list.includes("v1."));
r = await fetch(origin + "/admin/export?kind=insurance", {
  headers: { Cookie: cookie },
});
assert(!(await r.text()).includes("SYNTHETIC-MEMBER-ONLY"));
r = await post("/api/lead", {
  kind: "insurance",
  name: "Synthetic",
  phone: "2025550101",
  insurer: "Synthetic",
  consent: "on",
  source: "/verify-insurance",
});
assert.equal(r.status, 400);
assert((await r.json()).errors.patientDob);
console.log(
  "PASS: authentication, insurance capture/encryption/decryption, dedicated queue isolation, generic alerts, private headers, CSV exclusion, and invalid submission rejection. Synthetic local records only.",
);
