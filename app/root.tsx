import { PublicSchema } from "./components/public-schema";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T } from "./components/locale";
import { data, useRouteLoaderData } from "react-router";
import {localizedMeta,translateText} from "./lib/locale";
import { localeData, languageCookie } from "./lib/locale.server";
import { LocaleProvider } from "./components/locale";
import type { ReactNode } from "react";
import { isRouteErrorResponse, useLocation, Links, Meta, Outlet, Scripts, ScrollRestoration, } from "react-router";
import { CookieConsentProvider } from "./components/cookie-consent";
import { NoticeBar } from "./components/notice-bar";
import { LiveChat } from "./components/live-chat";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { pageMeta, site } from "./data/site";
import type { Route } from "./+types/root";
import "./app.css";
export async function loader({request}:Route.LoaderArgs) {
 const language=await localeData(request),headers=new Headers({Vary:"Cookie","Cache-Control":"private, no-cache"});
 if(new URL(request.url).searchParams.has("lang"))headers.append("Set-Cookie",await languageCookie.serialize(language.locale));
 return data(language,{headers});
}

export const links: Route.LinksFunction = () => [
    // Brand favicon (SBH isotipo on a cream tile)
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "apple-touch-icon", href: "/logos/SBH_Isotipo_Color.svg" },
    { rel: "stylesheet", href: "/fonts/fonts.css" },
];
export function meta({matches}: Route.MetaArgs) {
    return localizedMeta([
        { title: pageMeta.home.title },
        { name: "description", content: pageMeta.home.description },
    ],matches);
}
export function Layout({ children }: {
    children: ReactNode;
}) {
    const { pathname } = useLocation();
    const language = useRouteLoaderData<typeof loader>("root") ?? { locale: "en" as const, dictionary: {} };
    const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
    return (<LocaleProvider {...language}><html lang={language.locale}>
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        {/* Brand-wide defaults (leaf-route meta handles per-page titles) */}
        <meta name="theme-color" content="#082e6b"/>
        <meta property="og:site_name" content={site.name}/>

        <PublicSchema />
        <Meta />
        <Links nonce={import.meta.env.DEV ? "" : undefined} />
      </head>
      <body className={isAdmin ? "admin-body" : "public-body"}>
        <CookieConsentProvider enabled={!isAdmin}>
        <span id="top" aria-hidden className="absolute top-0"/>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy-800 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-cream"><T>{"Skip to content"}</T></a>
        <T>{!isAdmin && (<>
            <NoticeBar />
            <SiteHeader />
          </>)}</T>
        <T>{children}</T>
        <T>{!isAdmin && (<>
            <SiteFooter />
            <LiveChat />
          </>)}</T>
        </CookieConsentProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html></LocaleProvider>);
}
export default function App() {
    return <Outlet />;
}
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;
    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    }
    else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }
    return (<main id="main-content" className="bg-cream px-5 py-24 text-navy-950">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-semibold text-navy-950">
          <T>{message}</T>
        </h1>
        <p className="mt-3 text-navy-900/70"><T>{details}</T></p>
        <T>{stack ? (<pre className="mt-8 overflow-x-auto rounded-2xl bg-navy-950 p-4 text-left text-xs text-cream/80">
            <code><T>{stack}</T></code>
          </pre>) : null}</T>
        <a href="/" className="mt-8 inline-flex items-center justify-center rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-cream"><T>{"Back to home"}</T></a>
      </div>
    </main>);
}
