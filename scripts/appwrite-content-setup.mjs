import { Client, Databases, Query } from "node-appwrite";
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);
const db = new Databases(client),
  databaseId = process.env.APPWRITE_DATABASE_ID || "sbh",
  collectionId = "content";
try {
  await db.getCollection({ databaseId, collectionId });
} catch (e) {
  if (e.code !== 404) throw e;
  await db.createCollection({
    databaseId,
    collectionId,
    name: "Website pages and blog",
    permissions: [],
    documentSecurity: false,
  });
}
const existing = await db.listAttributes({
  databaseId,
  collectionId,
  queries: [Query.limit(100)],
});
for (const [key, size] of [
  ["kind", 16],
  ["path", 180],
  ["draft", 60000],
  ["published", 60000],
  ["archived", 8],
])
  if (!existing.attributes.some((a) => a.key === key)) {
    await db.createStringAttribute({
      databaseId,
      collectionId,
      key,
      size,
      required: false,
      xdefault: "",
    });
    console.log(`Created content.${key}`);
  }
for (let attempt = 0; attempt < 60; attempt++) {
  const attributes = await db.listAttributes({
    databaseId,
    collectionId,
    queries: [Query.limit(100)],
  });
  if (attributes.attributes.some((a) => a.status === "failed"))
    throw new Error("Content attribute provisioning failed");
  if (attributes.attributes.every((a) => a.status === "available")) break;
  if (attempt === 59) throw new Error("Content provisioning timed out");
  await new Promise((r) => setTimeout(r, 1000));
}
const indexes = await db.listIndexes({ databaseId, collectionId });
if (!indexes.indexes.some((i) => i.key === "unique_path"))
  await db.createIndex({
    databaseId,
    collectionId,
    key: "unique_path",
    type: "unique",
    attributes: ["path"],
  });
for (let attempt = 0; attempt < 60; attempt++) {
  const indexes = await db.listIndexes({ databaseId, collectionId });
  if (indexes.indexes.every((a) => a.status === "available")) break;
  if (indexes.indexes.some((a) => a.status === "failed") || attempt === 59)
    throw new Error("Content index provisioning failed");
  await new Promise((r) => setTimeout(r, 1000));
}
console.log(
  "Website content collection is ready and private. No existing content was overwritten.",
);
