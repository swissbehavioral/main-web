import type { ShouldRevalidateFunctionArgs } from "react-router";
import { Link, data, useSearchParams } from "react-router";
import { requirePermission } from "../lib/auth.server";
import { listContentRecords } from "../lib/content.server";
import { privateHeaders } from "../lib/security.server";
import type { Route } from "./+types/admin.content";
export async function loader({ request }: Route.LoaderArgs) {
  await requirePermission(request, "content");
  const records = await listContentRecords();
  return data(
    {
      pages: records.filter((r) => r.kind === "page"),
      posts: records.filter((r) => r.kind === "post"),
    },
    { headers: privateHeaders },
  );
}
export function shouldRevalidate({currentUrl,nextUrl,defaultShouldRevalidate}:ShouldRevalidateFunctionArgs) {
  return currentUrl.pathname===nextUrl.pathname && currentUrl.search!==nextUrl.search ? false : defaultShouldRevalidate;
}
export function meta() {
  return [{ title: "Pages & blog | SBH Admin" }];
}
export default function Content({ loaderData: { pages, posts } }: Route.ComponentProps) {
  const [params, setParams] = useSearchParams();
  const view = params.get("view") === "blog" ? "blog" : "pages";
  const q = params.get("q") || "", status = params.get("status") || "all";
  const records = (view === "blog" ? posts : pages).filter(r =>
    `${r.draft.title} ${r.draft.eyebrow} ${r.path}`.toLowerCase().includes(q.toLowerCase()) &&
    (status === "all" || (status === "archived" ? r.archived : status === "published" ? !!r.published && !r.archived : !r.archived && JSON.stringify(r.draft) !== JSON.stringify(r.published)))
  );
  const page = Math.max(1, Math.min(Math.ceil(records.length / 9) || 1, Number(params.get("page")) || 1));
  function change(key: string, value: string) { const next = new URLSearchParams(params);next.set(key, value);if(key!=="page")next.delete("page");setParams(next,{replace:true,preventScrollReset:true}); }
  return <div className="management content-library">
    <div className="management-heading"><div><h2>{view === "blog" ? "Blog articles" : "Website pages"}</h2><p>{view === "blog" ? "Write, preview and publish articles in Resources." : "Find a page, then open only the content you want to edit."}</p></div><Link className="admin-button" to="/admin/content/new">Write an article +</Link></div>
    <nav className="workspace-tabs" aria-label="Content library"><Link to="/admin/content?view=pages" aria-current={view==="pages"?"page":undefined}>Website pages <span>{pages.length}</span></Link><Link to="/admin/content?view=blog" aria-current={view==="blog"?"page":undefined}>Blog articles <span>{posts.length}</span></Link></nav>
    <div className="library-toolbar"><label>Find {view === "blog" ? "an article" : "a page"}<input type="search" value={q} onChange={e=>change("q",e.target.value)} placeholder="Search by title or URL" /></label><label>Visibility<select value={status} onChange={e=>change("status",e.target.value)}><option value="all">All</option><option value="published">Published</option><option value="draft">Unpublished edits</option>{view==="blog"&&<option value="archived">Archived</option>}</select></label><span>{records.length} result{records.length===1?"":"s"}</span></div>
    <div className="content-library-grid">{records.slice((page-1)*9,page*9).map(r=><article className="library-item" key={r.id}>
      <span className="management-badge">{r.archived ? "Archived" : !r.published ? "Draft" : JSON.stringify(r.draft)===JSON.stringify(r.published)?"Published":"Unpublished edits"}</span>
      <h3><Link to={`/admin/content/${r.id}`}>{r.kind==="page" ? r.path==="/" ? "Home" : r.draft.eyebrow || r.draft.title : r.draft.title || "Untitled article"}</Link></h3><p>{r.path}</p>
      <div><Link to={`/admin/content/${r.id}`}>{r.kind==="page"?"Edit page":"Edit article"} →</Link>{r.published&&!r.archived&&<a href={r.path} target="_blank" rel="noopener noreferrer">View ↗<span className="sr-only"> in a new tab</span></a>}</div>
    </article>)}</div>
    {!records.length&&<p className="management-empty">No matching {view==="blog"?"articles":"pages"}. Try a different search or filter.</p>}
    {records.length>9&&<div className="library-pagination"><button className="admin-button secondary" disabled={page===1} onClick={()=>change("page",String(page-1))}>Previous</button><span>Page {page} of {Math.ceil(records.length/9)}</span><button className="admin-button secondary" disabled={page*9>=records.length} onClick={()=>change("page",String(page+1))}>Next</button></div>}
  </div>;
}
