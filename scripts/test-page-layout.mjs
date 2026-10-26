import { createServer } from "vite";
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, watch: null, ws: false },
  appType: "custom",
});
try {
  const check = await server.ssrLoadModule("/scripts/page-layout-check.tsx");
  check.checkPageLayouts();
} finally {
  await server.close();
}
