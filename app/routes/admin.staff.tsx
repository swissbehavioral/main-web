import { readFormData } from "../lib/security.server";
import { Form, data, useNavigation } from "react-router";
import { requirePermission } from "../lib/auth.server";
import { appwriteAuthEnabled, getUsers } from "../lib/appwrite.server";
import { createStaff, listStaff } from "../lib/staff.server";
import {
  STAFF_ROLES,
  roleLabels,
  roleFromLabels,
  type StaffRole,
} from "../lib/permissions";
import { sameOrigin, privateHeaders } from "../lib/security.server";
import { isEmail } from "../lib/validation";
import type { Route } from "./+types/admin.staff";
export async function loader({ request }: Route.LoaderArgs) {
  await requirePermission(request, "staff");
  return data(
    { staff: await listStaff(), enabled: appwriteAuthEnabled },
    { headers: privateHeaders },
  );
}
export async function action({ request }: Route.ActionArgs) {
  sameOrigin(request);
  const identity = await requirePermission(request, "staff");
  if (!appwriteAuthEnabled)
    return data(
      { error: "Staff account management is temporarily unavailable." },
      { status: 400 },
    );
  const form = await readFormData(request),
    intent = String(form.get("intent")),
    role = String(form.get("role")) as StaffRole;
  try {
    if (intent === "create") {
      const name = String(form.get("name") || "").trim(),
        email = String(form.get("email") || "").trim(),
        password = String(form.get("password") || "");
      if (
        name.length < 2 ||
        name.length > 128 ||
        !isEmail(email) ||
        email.length > 254 ||
        password.length < 12 ||
        password.length > 256 ||
        !STAFF_ROLES.includes(role)
      )
        return data(
          {
            error:
              "Enter a name, valid email, role, and password of 12–256 characters.",
          },
          { status: 400 },
        );
      await createStaff({ name, email, password, role });
      return data({
        success:
          "Staff account created. Share the credentials through your approved secure channel.",
      });
    }
    const id = String(form.get("id"));
    const user = await getUsers().get({ userId: id });
    if (!roleFromLabels(user.labels))
      return data({ error: "Staff account not found." }, { status: 404 });
    // Existing administrators are protected from accidental removal and concurrent last-admin changes.
    if (id === identity.id || user.labels.includes("sbhadmin"))
      return data(
        {
          error:
            "Existing administrator access is protected. Contact the account owner to change administrator access.",
        },
        { status: 400 },
      );
    if (intent === "update") {
      if (!STAFF_ROLES.includes(role))
        return data({ error: "Choose a valid role." }, { status: 400 });
      await getUsers().updateLabels({
        userId: id,
        labels: [
          ...user.labels.filter((l) => !l.startsWith("sbh")),
          `sbh${role}`,
        ],
      });
      const active = form.get("active") === "on";
      await getUsers().updateStatus({ userId: id, status: active });
      // Force old browser/realtime sessions to re-authenticate after any access change.
      await getUsers().deleteSessions({ userId: id });
      return data({
        success:
          "Staff access updated; existing sessions have been signed out.",
      });
    }
    if (intent === "password") {
      const password = String(form.get("password") || "");
      if (password.length < 12 || password.length > 256)
        return data(
          { error: "Use a password of 12–256 characters." },
          { status: 400 },
        );
      await getUsers().updatePassword({ userId: id, password });
      await getUsers().deleteSessions({ userId: id });
      return data({
        success: "Password changed and existing sessions signed out.",
      });
    }
    return data({ error: "Unknown action." }, { status: 400 });
  } catch (e) {
    return data(
      {
        error:
          (e as { code: number }).code === 409
            ? "An account with this email already exists."
            : "The account could not be updated. Please try again or contact the account owner.",
      },
      { status: 400 },
    );
  }
}
export default function Staff({
  loaderData: d,
  actionData,
}: Route.ComponentProps) {
  const busy = useNavigation().state !== "idle";
  return (
    <div className="management">
      <div className="management-heading">
        <div>
          <h2>Staff & access</h2>
          <p>Create accounts, assign roles, and deactivate access.</p>
        </div>
      </div>
      {actionData && "error" in actionData && (
        <p role="alert" className="management-error">
          {actionData.error}
        </p>
      )}
      {actionData && "success" in actionData && (
        <p role="status" className="management-success">
          {actionData.success}
        </p>
      )}
      <div className="management-card">
        <p>
          <strong>Administrator:</strong> full access, staff management, and
          website content publishing. <strong>Manager:</strong> all leads,
          assignments, export, deletion, chat, and website content publishing.{" "}
          <strong>Representative:</strong> assigned leads and chats, plus the
          unassigned chat queue. <strong>Viewer:</strong> read-only access.
        </p>
      </div>
      {d.enabled && (
        <section className="management-card staff-create" id="create-staff">
          <h3>Create a staff account</h3>
          <Form method="post" className="management-form">
            <input type="hidden" name="intent" value="create" />
            <label>
              Full name
              <input name="name" required maxLength={128} />
            </label>
            <label>
              Email
              <input name="email" type="email" required maxLength={254} />
            </label>
            <label>
              Initial password
              <input
                name="password"
                type="password"
                required
                minLength={12}
                maxLength={256}
                autoComplete="new-password"
              />
            </label>
            <label>
              Role
              <select name="role" defaultValue="agent">
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {roleLabels[r]}
                  </option>
                ))}
              </select>
            </label>
            <button className="admin-button" disabled={busy}>
              Create account
            </button>
            <p className="management-help">
              Verification indicates whether the account’s email address has been confirmed.
            </p>
          </Form>
        </section>
      )}
      <div className="staff-grid">
        {d.staff.map((s) => (
          <section className="management-card" key={s.id}>
            <h3>{s.name || s.email}</h3>
            <p>{s.email}</p>
            <p className="management-help">
              {s.active ? "Active" : "Disabled"} · Email{" "}
              {s.verified ? "verified" : "not verified"}
            </p>
            <Form method="post" className="management-form">
              <input type="hidden" name="id" value={s.id} />
              <fieldset disabled={busy || s.role === "admin"}>
                <label>
                  Role
                  <select name="role" defaultValue={s.role}>
                    {STAFF_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {roleLabels[r]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="check-label">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={s.active}
                  />
                  Account enabled
                </label>
                <button
                  name="intent"
                  value="update"
                  className="admin-button secondary"
                >
                  Save access
                </button>
              </fieldset>
            </Form>
            {s.role !== "admin" && (
              <details>
                <summary>Reset password</summary>
                <Form method="post" className="management-form">
                  <input type="hidden" name="id" value={s.id} />
                  <label>
                    New password
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={12}
                      maxLength={256}
                      autoComplete="new-password"
                    />
                  </label>
                  <button
                    className="admin-button secondary"
                    name="intent"
                    value="password"
                    disabled={busy}
                  >
                    Reset password
                  </button>
                </Form>
              </details>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
