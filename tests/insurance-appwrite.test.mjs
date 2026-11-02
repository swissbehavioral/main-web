import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
test("Insurance persistence commits both private payload and lead atomically; failures roll back", async () => {
  process.env.APPWRITE_ENDPOINT = "https://example.invalid/v1";
  process.env.APPWRITE_PROJECT_ID = "fixture";
  process.env.APPWRITE_API_KEY = "fixture";
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true, watch: null, ws: false },
    appType: "custom",
  });
  try {
    const backend = await server.ssrLoadModule("/app/lib/appwrite.server.ts"),
      provider = await server.ssrLoadModule(
        "/app/lib/leads.appwrite.server.ts",
      ),
      db = backend.getDatabases();
    let fail = false;
    const writes = [],
      transactions = [];
    db.createTransaction = async () => ({ $id: "transaction" });
    db.updateTransaction = async (input) => {
      transactions.push(input);
      return {};
    };
    db.createDocument = async (...args) => {
      const input =
        typeof args[0] === "object"
          ? args[0]
          : { collectionId: args[1], documentId: args[2], data: args[3] };
      writes.push(input);
      if (fail && input.collectionId !== "insurance_requests")
        throw Error("Synthetic failure");
      return {
        $id: input.documentId,
        $createdAt: "2026-11-02T10:00:00Z",
        $updatedAt: "2026-11-02T10:00:00Z",
        ...input.data,
      };
    };
    const input = {
      kind: "insurance",
      name: "Fixture",
      phone: "2025550100",
      insurer: "Fixture",
      consent: true,
      source: "/verify-insurance",
      insuranceDetails: "v1.encrypted-fixture",
    };
    await provider.createLead(input);
    assert.equal(writes.length, 2);
    assert.equal(writes[0].documentId, writes[1].documentId);
    assert.equal(writes[0].transactionId, "transaction");
    assert.equal(writes[1].transactionId, "transaction");
    assert(!JSON.stringify(writes[1]).includes("encrypted-fixture"));
    assert.deepEqual(transactions, [
      { transactionId: "transaction", commit: true },
    ]);
    fail = true;
    transactions.length = 0;
    await assert.rejects(provider.createLead(input));
    assert.deepEqual(transactions, [
      { transactionId: "transaction", rollback: true },
    ]);
  } finally {
    await server.close();
  }
});
