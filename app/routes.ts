import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Exhibit A: sixteen pages, including the reserved fourth program template.
  index("routes/home.tsx"),
  route("resources", "routes/resources.tsx"),
  route("resources/:slug", "routes/resource.tsx"),
  route("team/:member", "routes/team-profile.tsx"),
  route("treatment/:program", "routes/program.tsx"),
  route("verify-insurance", "routes/verify-insurance.tsx"),
  route(":page", "routes/contract-page.tsx"),

  // Admin dashboard (non-public). `admin.tsx` guards every child route.
  route("admin/login", "routes/admin.login.tsx"),
  route("admin/logout", "routes/admin.logout.tsx"),
  route("admin", "routes/admin.tsx", [
    index("routes/admin.dashboard.tsx"),
    route("leads/:id", "routes/admin.lead.tsx"),
    route("staff", "routes/admin.staff.tsx"),
    route("chat", "routes/admin.chat.tsx"),
    route("content", "routes/admin.content.tsx"),
    route("content/:id", "routes/admin.content-edit.tsx"),
    route("content/:id/preview", "routes/admin.content-preview.tsx"),
  ]),

  // Resource routes (no UI)
  route("admin/export", "routes/admin.export.ts"),
  route("api/chat", "routes/api.chat.ts"),
  route("api/chat/realtime", "routes/api.chat-realtime.ts"),
  route("api/lead", "routes/api.lead.tsx"),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("healthz", "routes/health.tsx"),
] satisfies RouteConfig;
