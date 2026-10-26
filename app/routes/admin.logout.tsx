import { sameOrigin } from "../lib/security.server";
import { redirect } from "react-router";

import { endAdminSession } from "../lib/auth.server";
import type { Route } from "./+types/admin.logout";

/** Clears the admin session and returns to the login screen. */
export async function action({ request }: Route.ActionArgs) {
  sameOrigin(request);
  const cookie = await endAdminSession(request);
  return redirect("/admin/login", { headers: { "Set-Cookie": cookie } });
}

/** A GET here is a mistake — send the visitor to the login screen. */
export async function loader() {
  return redirect("/admin/login");
}