import { appwriteAuthEnabled, getUsers, ID, Query } from "./appwrite.server";
import { roleFromLabels, type StaffRole } from "./permissions";
export interface StaffMember { id: string; name: string; email: string; role: StaffRole; active: boolean; verified: boolean; }
export async function listStaff(): Promise<StaffMember[]> {
  if (!appwriteAuthEnabled) return [{ id: "local-admin", name: "Local administrator", email: "", role: "admin", active: true, verified: false }];
  const result: StaffMember[] = []; let cursor: string | undefined;
  for (;;) {
    const page = await getUsers().list({ queries: [Query.limit(100), ...(cursor ? [Query.cursorAfter(cursor)] : [])] });
    for (const u of page.users) { const role = roleFromLabels(u.labels); if (role) result.push({ id: u.$id, name: u.name, email: u.email, role, active: u.status, verified: u.emailVerification }); }
    if (page.users.length < 100) break; cursor = page.users.at(-1)!.$id;
  }
  return result;
}
export async function validateAssignee(id: string) {
  if (!id) return;
  const staff = (await listStaff()).find(s => s.id === id && s.active && s.role !== "viewer");
  if (!staff) throw new Response("Select an active representative or manager.", { status: 400 });
}
export async function createStaff(input: { name: string; email: string; password: string; role: StaffRole }) {
  const user = await getUsers().create({ userId: ID.unique(), email: input.email, password: input.password, name: input.name });
  try { await getUsers().updateLabels({ userId: user.$id, labels: [`sbh${input.role}`] }); }
  catch (e) { await getUsers().delete({ userId: user.$id }); throw e; }
}
