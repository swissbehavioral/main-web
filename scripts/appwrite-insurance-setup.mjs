import { Client, Databases } from "node-appwrite";
const db = new Databases(
  new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY),
);
const scope = {
  databaseId: process.env.APPWRITE_DATABASE_ID || "sbh",
  collectionId: "insurance_requests",
};
try {
  const collection = await db.getCollection(scope);
  if (collection.$permissions.length)
    throw Error(
      "Insurance collection must have no public or client permissions.",
    );
} catch (error) {
  if (error.code !== 404) throw error;
  await db.createCollection({
    ...scope,
    name: "Private insurance requests",
    permissions: [],
    documentSecurity: false,
  });
}
const params = { ...scope, key: "payload" };
try {
  await db.getAttribute(params);
} catch (error) {
  if (error.code !== 404) throw error;
  await db.createStringAttribute({ ...params, size: 4096, required: true });
}
for (let i = 0; i < 60; i++) {
  const field = await db.getAttribute(params);
  if (field.status === "available") {
    const transaction = await db.createTransaction({ ttl: 60 });
    await db.updateTransaction({
      transactionId: transaction.$id,
      rollback: true,
    });
    console.log(
      "Private insurance collection and atomic writes ready. No submissions modified.",
    );
    process.exit(0);
  }
  if (field.status === "failed")
    throw Error("Insurance attribute creation failed");
  await new Promise((r) => setTimeout(r, 1000));
}
throw Error("Insurance attribute is not ready; retry setup.");
