// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T } from "./locale";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { pageSeeds } from "../data/content-seeds";
import { buildPageCopy, mapPageData } from "../lib/page-copy";
import type { ContentDocument } from "../lib/content.types";
const identity = (text: string) => text;
const PageCopyContext = createContext({
    copy: identity,
    doc: undefined as ContentDocument | undefined,
});
export function PageCopyProvider({ doc, children, }: {
    doc: ContentDocument;
    children: ReactNode;
}) {
    const value = useMemo(() => ({
        doc,
        copy: buildPageCopy(pageSeeds.find((seed) => seed.id === doc.id) ?? doc, doc),
    }), [doc]);
    return (<PageCopyContext.Provider value={value}>
      <T>{children}</T>
    </PageCopyContext.Provider>);
}
export function usePageText() {
    return useContext(PageCopyContext).copy;
}
export function usePageDocument() {
    return useContext(PageCopyContext).doc;
}
export function usePageData<T>(value: T): T {
    const copy = usePageText();
    return useMemo(() => mapPageData(value, copy), [value, copy]);
}
export function usePageHeading() {
    const doc = usePageDocument();
    const seed = pageSeeds.find((seed) => seed.id === doc?.id);
    if (!doc || !seed)
        return {};
    return {
        ...(doc.title !== seed.title ? { title: doc.title } : {}),
        ...(doc.eyebrow !== seed.eyebrow ? { eyebrow: doc.eyebrow } : {}),
        ...(doc.summary !== seed.summary ? { intro: doc.summary } : {}),
    };
}
