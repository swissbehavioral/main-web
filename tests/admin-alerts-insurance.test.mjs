import test from "node:test";
import assert from "node:assert/strict";
import { readInsurance } from "../app/lib/insurance.ts";
import {
  leadEvents,
  unreadEvents,
  shouldShowDesktopAlert,
} from "../app/lib/admin-alerts.ts";
import {
  sealInsurance,
  openInsurance,
} from "../app/lib/insurance-crypto.server.ts";
const form = () => {
  const f = new FormData();
  for (const [key, value] of Object.entries({
    patientName: "Synthetic Test",
    patientDob: "1990-05-02",
    relationship: "self",
    insuranceConsent: "on",
    memberId: "TEST-ONLY",
  }))
    f.set(key, value);
  return f;
};
test("Insurance dates, authorization, relationship and length are validated", () => {
  assert.deepEqual(readInsurance(form()).errors, {});
  const invalid = form();
  invalid.set("patientDob", "2026-02-30");
  invalid.set("relationship", "invalid");
  invalid.set("insuranceConsent", "false");
  invalid.set("memberId", "a".repeat(121));
  const errors = readInsurance(invalid).errors;
  for (const k of [
    "patientDob",
    "relationship",
    "insuranceConsent",
    "memberId",
  ])
    assert(errors[k]);
  invalid.set("patientDob", "2099-01-01");
  assert(readInsurance(invalid).errors.patientDob);
});
test("Insurance payload uses authenticated randomized encryption and rejects tampering", () => {
  const values = readInsurance(form()).values,
    a = sealInsurance(values),
    b = sealInsurance(values);
  assert.notEqual(a, b);
  assert(!a.includes("TEST-ONLY"));
  assert.deepEqual(openInsurance(a), values);
  const bytes = Buffer.from(a.slice(3), "base64url");
  bytes[30] ^= 1;
  assert.throws(() => openInsurance("v1." + bytes.toString("base64url")));
});
test("Notification snapshots expose no contact or insurance data and isolate agents", () => {
  const lead = {
    id: "a",
    kind: "insurance",
    status: "new",
    assignedTo: "one",
    createdAt: "2026-11-02T10:00:00Z",
    name: "Private",
    insuranceDetails: "secret",
    email: "private@example.invalid",
  };
  const events = leadEvents(
    [
      lead,
      { ...lead, id: "b", assignedTo: "two" },
      { ...lead, id: "gone", status: "deleted" },
    ],
    { id: "one", role: "agent" },
  );
  assert.equal(events.length, 1);
  assert(!JSON.stringify(events).includes("Private"));
  assert(!JSON.stringify(events).includes("secret"));
  assert.equal(unreadEvents(events, {}).length, 1);
  assert.equal(
    unreadEvents(events, { insurance: "2026-11-02T11:00:00Z" }).length,
    0,
  );
  assert.equal(
    unreadEvents(events, { "/admin/leads/a": "2026-11-02T11:00:00Z" }).length,
    0,
  );
});

test("Desktop alerts require permission, background activity, opt-in, and no active staff tab", () => {
  const state = {
    hidden: true,
    enabled: true,
    permission: "granted",
    activeUntil: 0,
    now: 100,
  };
  assert(shouldShowDesktopAlert(state));
  for (const change of [
    { hidden: false },
    { enabled: false },
    { permission: "denied" },
    { permission: "default" },
    { activeUntil: 101 },
  ])
    assert.equal(shouldShowDesktopAlert({ ...state, ...change }), false);
});
