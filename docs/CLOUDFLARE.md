# Cloudflare Workers deployment

This repository supports both Node 24/VPS (`npm start`, Dockerfile) and Workers (`wrangler.jsonc`, `workers/app.mjs`). SSR remains enabled in both.

## Cloudflare build settings

- Repository: swissbehavioral/main-web; production branch: main.
- Root directory: repository root.
- Build command: `npm run build`.
- Deploy command: `npx wrangler deploy`.
- Worker name: `main-web`.
- Install dependencies with `npm ci` (include dev dependencies during build).

The Wrangler configuration supplies the Worker entry, static assets, Node compatibility, production React define, observability and native Appwrite transport alias. Do not deploy `build/server/index.js` directly as the Worker or use the Express `server.mjs` as its entry.

## Required runtime settings

Open Cloudflare → Workers & Pages → main-web → Settings → Variables and Secrets. Configure these runtime variables; build-only variables are not sufficient:

| Name | Value / type |
| --- | --- |
| `SESSION_SECRET` | Secret: the existing stable session signing secret, at least 32 characters. |
| `APPWRITE_API_KEY` | Secret: the server-side Appwrite key already configured for this project. |
| `APPWRITE_ENDPOINT` | Text: your HTTPS Appwrite API endpoint, including `/v1`. |
| `APPWRITE_PROJECT_ID` | Text: the Appwrite project ID. |
| `APPWRITE_AUTH_ENABLED` | Text: `true` (also specified in Wrangler). |

Copy any customized database/collection identifiers from the project's local configuration as text variables. Keep API keys and session secrets private. The local `.env` is intentionally not in Git and is not automatically available to a deployed Worker. Setup-only admin passwords and local HOST/PORT settings are not required by the Worker.

After saving settings, deploy the latest main commit. Existing secrets are preserved by Wrangler; `keep_vars` also preserves dashboard text variables. Without required settings, dynamic requests return a controlled 503 and the server log identifies missing variable names without printing values.

CLI alternative: `npx wrangler secret put SESSION_SECRET` and `npx wrangler secret put APPWRITE_API_KEY` prompt privately. Do not put secret values in shell arguments or source files.

## Compatibility fixes

- SSR uses React `renderToReadableStream`, supported by both Node 24 and Workers, replacing the Node-specific pipeable renderer.
- `process.env.NODE_ENV` is defined as production at bundle time so React development APIs are not selected.
- Workers use native HTTPS fetch for Appwrite. The Node SDK's Undici transport previously encountered unsupported TLS/ALPN options. Node/VPS deployments retain their original SDK transport.
- Custom/self-signed TLS agents are deliberately unsupported on Workers. Use a trusted HTTPS Appwrite endpoint.
- Production settings are checked before the server bundle is imported, preventing a missing session secret from becoming an uncaught startup exception.

## Verification performed locally

`npm test`, `npm run typecheck`, `npm run build` and Wrangler dry-run packaging. Actual Wrangler runtime smoke checks covered the home and verification SSR pages, private admin login and static logo, using dummy credentials. Appwrite native transport forwarding and rejection of custom TLS agents have regression tests. No live forms/accounts were created or modified. A live Appwrite or deployment success is not implied by these local tests.

To reproduce the smoke test, run `npm run preview:cloudflare` with private local `.dev.vars` settings, then `node scripts/check-worker-preview.mjs`. `.dev.vars` and `.wrangler` are ignored by Git.

## Worker exception logs

Error 1101 is a general uncaught exception indication. A `cf-worker-event` request record alone does not identify the exception. Expand the associated exception/console error in Observability → Logs, or use `npx wrangler tail main-web`. Look for the exception message/stack without sharing credentials, cookies or request bodies.

References: [Workers errors](https://developers.cloudflare.com/workers/observability/errors/), [Node compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/), [environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/).
