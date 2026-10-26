import {appendRestoredSections} from "./content-migrations";
import { validatePageStructure } from "./page-copy";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Models } from "node-appwrite";
import {
  appwriteConfig,
  getDatabases,
  isAppwriteConfigured,
  Query,
} from "./appwrite.server";
import { contentSeeds } from "../data/content-seeds";
import type { ContentDocument, ContentRecord } from "./content.types";
const collectionId = "content";
const localFile = path.join(
  process.env.CONTENT_DIR || path.join(process.cwd(), "storage"),
  "content.json",
);
interface ContentRow extends Models.Document {
  kind: "page" | "post";
  path: string;
  draft: string;
  published: string;
  archived: string;
}
const seedRecord = (doc: ContentDocument): ContentRecord => ({
  id: doc.id,
  kind: doc.kind,
  path: doc.path,
  draft: structuredClone(doc),
  published: structuredClone(doc),
  updatedAt: "seed",
  archived: false,
});
function withRestoredSections(record:ContentRecord):ContentRecord {
 const seed=contentSeeds.find(doc=>doc.id===record.id);
 return {...record,draft:appendRestoredSections(record.draft,seed),published:record.published?appendRestoredSections(record.published,seed):null};
}
function decode(row: ContentRow): ContentRecord {
  return withRestoredSections({
    id: row.$id,
    kind: row.kind,
    path: row.path,
    draft: JSON.parse(row.draft),
    published: row.published ? JSON.parse(row.published) : null,
    updatedAt: row.$updatedAt,
    archived: row.archived === "true",
  });
}
async function readLocal(): Promise<ContentRecord[]> {
  try {
    const records = JSON.parse(await fs.readFile(localFile, "utf8"));
    if (!Array.isArray(records)) throw new Error("Invalid content store");
    return records.map(withRestoredSections);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}
export async function listContentRecords(): Promise<ContentRecord[]> {
  let stored: ContentRecord[] = [];
  if (isAppwriteConfigured()) {
    let cursor: string | undefined;
    for (;;) {
      const result = await getDatabases().listDocuments<ContentRow>({
        databaseId: appwriteConfig.databaseId,
        collectionId,
        queries: [
          Query.limit(100),
          ...(cursor ? [Query.cursorAfter(cursor)] : []),
        ],
      });
      stored.push(...result.documents.map(decode));
      if (result.documents.length < 100) break;
      cursor = result.documents.at(-1)!.$id;
    }
  } else stored = await readLocal();
  const records = new Map(contentSeeds.map((s) => [s.id, seedRecord(s)]));
  for (const record of stored) records.set(record.id, record);
  return [...records.values()].filter(record => record.id !== "page-additional-program");
}
export async function getContentRecord(
  id: string,
): Promise<ContentRecord | undefined> {
  if (id === "page-additional-program") return undefined;
  if (isAppwriteConfigured()) {
    try {
      return decode(
        await getDatabases().getDocument<ContentRow>({
          databaseId: appwriteConfig.databaseId,
          collectionId,
          documentId: id,
        }),
      );
    } catch (e) {
      if ((e as { code: number }).code !== 404) throw e;
    }
  } else {
    const stored = (await readLocal()).find((r) => r.id === id);
    if (stored) return stored;
  }
  const seed = contentSeeds.find((s) => s.id === id);
  return seed ? seedRecord(seed) : undefined;
}
async function readPublishedContent(
  urlPath: string,
): Promise<ContentDocument | undefined> {
  if (urlPath === "/treatment/additional-program") return undefined;
  const seed = contentSeeds.find((s) => s.path === urlPath);
  if (seed) {
    const record = await getContentRecord(seed.id);
    return record && !record.archived && record.published?.path === urlPath
      ? record.published
      : undefined;
  }
  const record = (await listContentRecords()).find(
    (r) => r.path === urlPath && !r.archived,
  );
  return record?.published || undefined;
}
// Public contract pages remain available during a content-service outage. Never
// use this recovery path for admin reads/writes or user-submitted information.
const publishedPageCache = new Map<string, ContentDocument>();
export async function getPublishedContent(
  urlPath: string,
): Promise<ContentDocument | undefined> {
  if (urlPath === "/treatment/additional-program") return undefined;
  const seed = contentSeeds.find(
    (doc) => doc.path === urlPath && doc.kind === "page",
  );
  if (!seed) return readPublishedContent(urlPath);
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const doc = await Promise.race([
      readPublishedContent(urlPath),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("Content service timeout")),
          4000,
        );
      }),
    ]);
    if (doc) publishedPageCache.set(urlPath, structuredClone(doc));
    return doc;
  } catch (error) {
    console.warn(
      "Public content service unavailable; serving last published page or bundled contract page.",
      {
        path: urlPath,
        code: (error as { code?: number })?.code ?? "unavailable",
      },
    );
    return structuredClone(publishedPageCache.get(urlPath) ?? seed);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
export async function listPublishedPosts() {
  return (await listContentRecords())
    .filter((r) => r.kind === "post" && !r.archived && r.published)
    .map((r) => r.published!)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
let queue: Promise<unknown> = Promise.resolve();
async function serialize<T>(fn: () => Promise<T>) {
  const result = queue.then(fn, fn);
  queue = result.catch(() => undefined);
  return result;
}
export async function saveContent(
  doc: ContentDocument,
  intent: "save" | "publish" | "unpublish" | "archive" | "restore",
  expectedRevision: string,
  actor: string,
): Promise<ContentRecord> {
  const seed = contentSeeds.find((seed) => seed.id === doc.id);
  if (seed) {
    const errors = validatePageStructure(seed, doc);
    if (errors.length) throw new Response(errors.join(" "), { status: 400 });
  }
  return serialize(async () => {
    const current = await getContentRecord(doc.id);
    if (current && current.updatedAt !== expectedRevision)
      throw new Response(
        "Someone else updated this document. Copy your changes, reload, and try again.",
        { status: 409 },
      );
    if (!current && expectedRevision !== "new")
      throw new Response("Document not found", { status: 404 });
    if (current && current.kind !== doc.kind)
      throw new Response("Document type cannot change", { status: 400 });
    if (
      doc.kind === "page" &&
      (!current ||
        current.path !== doc.path ||
        ["unpublish", "archive"].includes(intent))
    )
      throw new Response(
        "Contract pages must keep their URLs and remain available. Use the review notice for incomplete content.",
        { status: 400 },
      );
    const duplicate = (await listContentRecords()).find(
      (r) => r.path === doc.path && r.id !== doc.id,
    );
    if (duplicate)
      throw new Response(
        "Another document already uses this URL. Choose a different slug.",
        { status: 409 },
      );
    if (current?.published && current.path !== doc.path)
      throw new Response(
        "A published article URL is fixed to preserve existing links. Unpublish it before changing the URL.",
        { status: 400 },
      );
    const now = new Date().toISOString();
    const published =
      intent === "publish"
        ? {
            ...doc,
            customized: true,
            publishedAt: current?.published?.publishedAt || now,
          }
        : intent === "unpublish"
          ? null
          : current?.published || null;
    const draft = intent === "publish" && published ? { ...published } : doc;
    const next: ContentRecord = {
      id: doc.id,
      kind: doc.kind,
      path: doc.path,
      draft,
      published,
      updatedAt: now,
      archived:
        intent === "archive"
          ? true
          : intent === "restore"
            ? false
            : current?.archived || false,
    };
    if (isAppwriteConfigured()) {
      const fields = {
        kind: doc.kind,
        path: doc.path,
        draft: JSON.stringify(draft),
        published: published ? JSON.stringify(published) : "",
        archived: next.archived ? "true" : "false",
      };
      // Application permissions are checked on each route. The collection grants no browser access.
      try {
        const row = await getDatabases().updateDocument<ContentRow>({
          databaseId: appwriteConfig.databaseId,
          collectionId,
          documentId: doc.id,
          data: fields,
        });
        return decode(row);
      } catch (e) {
        if ((e as { code: number }).code !== 404) throw e;
        return decode(
          await getDatabases().createDocument<ContentRow>({
            databaseId: appwriteConfig.databaseId,
            collectionId,
            documentId: doc.id,
            data: fields,
            permissions: [],
          }),
        );
      }
    }
    const records = await readLocal(),
      index = records.findIndex((r) => r.id === doc.id);
    if (index < 0) records.push(next);
    else records[index] = next;
    await fs.mkdir(path.dirname(localFile), { recursive: true });
    const temp = `${localFile}.${randomUUID()}.tmp`;
    await fs.writeFile(temp, JSON.stringify(records, null, 2), {encoding:"utf8",mode:0o600});
    await fs.rename(temp, localFile);
    return next;
  });
}
