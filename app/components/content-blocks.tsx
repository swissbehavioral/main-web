// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T } from "./locale";
import { ArticleText } from "./article-text";
import type { ContentBlock } from "../lib/content.types";
export function ContentBlocks({ blocks }: {
    blocks: ContentBlock[];
}) {
    return (<div className="editorial-prose">
      <T>{blocks
            .filter((b) => b.text.trim())
            .map((b, i) => b.type === "heading" ? (<h2 key={i}><ArticleText text={b.text}/></h2>) : b.type === "list" ? (<ul key={i}>
              <T>{b.text
                .split("\n")
                .filter(Boolean)
                .map((item, j) => (<li key={j}><ArticleText text={item}/></li>))}</T>
            </ul>) : b.type === "quote" ? (<blockquote key={i}><ArticleText text={b.text}/></blockquote>) : b.type === "callout" ? (<aside className="editorial-notice" key={i}>
              <ArticleText text={b.text}/>
            </aside>) : (<p key={i}><ArticleText text={b.text}/></p>))}</T>
    </div>);
}
