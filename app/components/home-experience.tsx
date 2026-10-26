import type { ContentDocument } from "../lib/content.types";
import OriginalHome from "./original-pages/home";
import { PageCopyProvider } from "./page-copy";
export function HomeExperience({
  doc,
}: {
  doc: ContentDocument;
  posts?: ContentDocument[];
}) {
  return (
    <PageCopyProvider doc={doc}>
      <OriginalHome />
    </PageCopyProvider>
  );
}
