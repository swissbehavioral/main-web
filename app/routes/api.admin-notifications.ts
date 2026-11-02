import { data } from "react-router";
import { requireAdmin } from "../lib/auth.server";
import { privateHeaders } from "../lib/security.server";
import { listLeads } from "../lib/leads.server";
import { listConversations, type ChatMessage } from "../lib/chat.server";
import {
  appwriteConfig,
  getDatabases,
  isAppwriteConfigured,
  Query,
} from "../lib/appwrite.server";
import { leadEvents, type WorkspaceEvent } from "../lib/admin-alerts";
export async function loader({ request }: { request: Request }) {
  const identity = await requireAdmin(request);
  const [leads, conversations] = await Promise.all([
    listLeads(),
    isAppwriteConfigured() ? listConversations(identity) : [],
  ]);
  const events: WorkspaceEvent[] = leadEvents(leads, identity);
  const open = conversations.filter((c) => c.status === "open");
  // Bounded parallel reads, restricted to conversations this staff member may read.
  for (let i = 0; i < open.length; i += 8)
    await Promise.all(
      open.slice(i, i + 8).map(async (c) => {
        const latest = await getDatabases().listDocuments<ChatMessage>({
          databaseId: appwriteConfig.databaseId,
          collectionId: "messages",
          queries: [
            Query.equal("conversationId", [c.$id]),
            Query.orderDesc("$createdAt"),
            Query.limit(1),
          ],
        });
        const message = latest.documents[0];
        if (message && message.senderRole !== "visitor") return;
        events.push({
          id: message ? `message:${message.$id}` : `chat:${c.$id}`,
          kind: "chat",
          at: message?.$createdAt || c.$createdAt,
          to: `/admin/chat?id=${encodeURIComponent(c.$id)}`,
        });
      }),
    );
  return data(
    { events, checkedAt: new Date().toISOString() },
    { headers: privateHeaders },
  );
}
