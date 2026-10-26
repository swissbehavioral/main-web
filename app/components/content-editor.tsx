import { safeArticleUrl } from "../lib/article-links";
import { designedPageIds } from "../lib/page-copy";
import { useRef, useState } from "react";
import { Form, Link, useNavigation } from "react-router";
import type { ContentRecord, ContentBlock } from "../lib/content.types";
import { BLOCK_TYPES, blockLabels } from "../lib/content.types";
import { ContentBlocks } from "./content-blocks";
export function ContentEditor({
  record,
  errors = [],
  saved = false,
}: {
  record: ContentRecord;
  errors?: string[];
  saved?: boolean;
}) {
  const [invalidMessage,setInvalidMessage]=useState("");
  const [editorView,setEditorView] = useState("write");
  const [blockQuery, setBlockQuery] = useState("");
  const [linkTarget, setLinkTarget] = useState<number | null>(null), [linkLabel,setLinkLabel] = useState(""), [linkUrl,setLinkUrl] = useState(""), [linkError,setLinkError]=useState("");
  const [seoTitle,setSeoTitle]=useState(record.draft.seoTitle || ""), [seoDescription,setSeoDescription]=useState(record.draft.metaDescription || ""), [slug,setSlug]=useState(record.path.replace("/resources/", ""));
  const fixedLayout = designedPageIds.has(record.id);
  const [blocks, setBlocks] = useState<ContentBlock[]>(
      record.draft.body.map((block, index) =>
        fixedLayout
          ? { ...block, slot: block.slot ?? `${record.id}:${index}` }
          : block,
      ),
    ),
    [preview, setPreview] = useState(false),
    [dirty, setDirty] = useState(false);
  const busy = useNavigation().state !== "idle";
  const form = useRef<HTMLFormElement>(null);
  function update(index: number, patch: Partial<ContentBlock>) {
    setDirty(true);
    setBlocks((items) =>
      items.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    );
  }
  function move(index: number, offset: number) {
    setDirty(true);
    setBlocks((items) => {
      const next = [...items];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }
  return (
    <div className="management">
      <div className="management-heading">
        <div>
          <h2>
            {record.kind === "page" ? "Edit website page" : "Blog editor"}
          </h2>
          <p>
            {record.kind === "page"
              ? "Update page text, preview your draft, and publish when ready."
              : "Compose an article using headings, paragraphs, lists, quotations, and notices."}
          </p>
        </div>
        <div className="management-actions">
          {!fixedLayout && (
            <button
              className="admin-button secondary"
              type="button"
              onClick={() => setPreview(!preview)}
            >
              {preview ? "Hide block preview" : "Preview current blocks"}
            </button>
          )}
          {record.updatedAt !== "new" && (
            <Link
              to={`/admin/content/${record.id}/preview`}
              target="_blank"
              rel="noreferrer"
            >
              Preview saved draft ↗
            </Link>
          )}
        </div>
      </div>
      {invalidMessage && <p role="alert" className="management-error">{invalidMessage}</p>}
      {errors.length > 0 && (
        <div role="alert" className="management-error">
          {errors.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </div>
      )}
      {saved && !dirty && (
        <p role="status" className="management-success">
          Changes saved.{" "}
          {record.published
            ? "The public site uses the last published version."
            : "This article is private until published."}
        </p>
      )}
      <nav className="editor-workflow" aria-label="Editor sections"><button type="button" aria-pressed={editorView==="write"} onClick={()=>setEditorView("write")}>{record.kind==="post"?"Write article":"Page text"}</button><button type="button" aria-pressed={editorView==="settings"} onClick={()=>setEditorView("settings")}>{record.kind==="post"?"Article details & SEO":"Search settings"}</button></nav>
      <Form
        method="post"
        ref={form}
        className="cms-editor"
        onInvalidCapture={e=>{e.preventDefault();const field=e.target as HTMLElement;setEditorView(field.closest(".cms-edit-details")?"settings":"write");setInvalidMessage("Complete the required fields before saving or publishing.");}}
        onChange={() => {setDirty(true);setInvalidMessage("");}}
        onSubmit={() => setDirty(false)}
      >
        <input type="hidden" name="revision" value={record.updatedAt} />
        <input type="hidden" name="body" value={JSON.stringify(blocks)} />
        <div className="cms-editor-main">
          <div hidden={editorView!=="write"}>
          <section className="management-card management-form">
            <label>
              {record.kind === "post" ? "Article title" : "Page title"}
              <input
                name="title"
                required
                maxLength={180}
                defaultValue={record.draft.title}
              />
            </label>
            <label>
              Introduction / excerpt
              <textarea
                name="summary"
                rows={3}
                maxLength={1000}
                defaultValue={record.draft.summary}
              />
            </label>
            <div className="cms-fields">
              <label>
                Section label
                <input
                  name="eyebrow"
                  maxLength={100}
                  defaultValue={record.draft.eyebrow}
                />
              </label>
              {record.kind === "post" ? (
                <label>
                  URL slug
                  <input
                    name="slug"
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    value={slug} onChange={e=>setSlug(e.target.value)}
                    readOnly={!!record.published}
                  />
                  <small>
                    Lowercase words separated by hyphens. Published URLs are
                    protected.
                  </small>
                </label>
              ) : (
                <label>
                  Public URL
                  <input value={record.path} readOnly />
                </label>
              )}
            </div>
          </section>
          <div className="management-heading">
            <h3>Content blocks</h3>
            <span>{blocks.length} / 80</span>
          </div>
          {fixedLayout && <label className="page-block-search">Find text on this page<input type="search" value={blockQuery} onChange={e=>setBlockQuery(e.target.value)} placeholder="Search a word or heading…" /></label>}
          {blocks.map((block, index) => (
            <details className="cms-block" key={index} open={!fixedLayout || undefined} hidden={fixedLayout && !!blockQuery && !block.text.toLowerCase().includes(blockQuery.toLowerCase())}>
              <summary className="cms-block-summary"><span>{String(index+1).padStart(2,"0")} · {blockLabels[block.type]}</span><strong>{block.text.slice(0,100) || "Empty block"}</strong></summary>
              <div className="cms-block-toolbar">
                <label>
                  <span className="sr-only">Block {index + 1} type</span>
                  <select
                    disabled={fixedLayout}
                    value={block.type}
                    onChange={(e) =>
                      update(index, {
                        type: e.target.value as ContentBlock["type"],
                      })
                    }
                  >
                    {BLOCK_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {blockLabels[t]}
                      </option>
                    ))}
                  </select>
                </label>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {!fixedLayout && <div>
                  <button
                    type="button"
                    aria-label={`Move block ${index + 1} up`}
                    disabled={fixedLayout || index === 0}
                    onClick={() => move(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label={`Move block ${index + 1} down`}
                    disabled={fixedLayout || index === blocks.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove block ${index + 1}`}
                    disabled={fixedLayout}
                    onClick={() => {
                      setDirty(true);
                      setBlocks((items) => items.filter((_, i) => i !== index));
                    }}
                  >
                    Remove
                  </button>
                </div>}
              </div>
              {!fixedLayout && <button className="admin-button secondary" type="button" onClick={()=>{setLinkTarget(index);setLinkError("");}}>Insert a link</button>}
              {linkTarget===index && <div className="cms-link-controls"><label>Link text<input value={linkLabel} onChange={e=>setLinkLabel(e.target.value)} /></label><label>Destination URL<input type="url" value={linkUrl} onChange={e=>setLinkUrl(e.target.value)} placeholder="https://…" /></label><button type="button" className="admin-button secondary" onClick={()=>{const url=safeArticleUrl(linkUrl.trim());if(!url || !linkLabel.trim() || /[\[\]\n]/.test(linkLabel) || /[()\s]/.test(url)){setLinkError("Enter link text and a valid website URL.");return;}update(index,{text:`${block.text} [${linkLabel.trim()}](${url})`});setLinkTarget(null);setLinkLabel("");setLinkUrl("");}}>Add link</button><button type="button" onClick={()=>setLinkTarget(null)}>Cancel</button>{linkError&&<p role="alert">{linkError}</p>}</div>}
              <label className="sr-only" htmlFor={`block-${index}`}>
                Block {index + 1} text
              </label>
              <textarea
                id={`block-${index}`}
                rows={block.type === "heading" ? 2 : 5}
                maxLength={6000}
                value={block.text}
                onChange={(e) => update(index, { text: e.target.value })}
                placeholder={
                  block.type === "list"
                    ? "One bullet per line…"
                    : "Write your content…"
                }
              />
            </details>
          ))}
          {!fixedLayout && <button
            type="button"
            className="cms-add-block"
            disabled={fixedLayout || blocks.length >= 80}
            onClick={() => {
              setDirty(true);
              setBlocks((items) => [...items, { type: "paragraph", text: "" }]);
            }}
          >
            + Add content block
          </button>}
          {preview && (
            <section className="management-card cms-live-preview">
              <h3>Current block preview</h3>
              <p className="management-help">
                This preview renders your unsaved blocks. Use “Preview saved
                draft” to see the whole page after saving.
              </p>
              <ContentBlocks blocks={blocks} />
            </section>
          )}
          </div>
          <div className="cms-edit-details" hidden={editorView!=="settings"}>
          {record.kind === "post" && <>
          <details className="management-card management-form">
            <summary>Editorial review (optional)</summary>
            <label className="check-label">
              <input
                type="checkbox"
                name="reviewRequired"
                defaultChecked={record.draft.reviewRequired}
              />
              Hold for editorial review
            </label>
            <label>
              Review notes
              <textarea
                name="reviewNotes"
                rows={5}
                maxLength={3000}
                defaultValue={record.draft.reviewNotes}
              />
            </label>

          </details>
          </>}
          {record.kind === "post" && (
            <section className="management-card management-form">
              <h3>Article details</h3>
              <label>
                Author
                <input
                  name="author"
                  maxLength={150}
                  defaultValue={record.draft.author}
                />
              </label>
              <label>
                Reviewed by (optional)
                <input
                  name="reviewer"
                  maxLength={150}
                  defaultValue={record.draft.reviewer}
                />
              </label>
              <label>
                Category
                <input
                  name="category"
                  maxLength={80}
                  defaultValue={record.draft.category}
                  placeholder="e.g. Family, Recovery, Insurance"
                />
              </label>
              <label>
                Sources and further reading
                <textarea
                  name="sources"
                  maxLength={3000}
                  rows={4}
                  defaultValue={record.draft.sources}
                />
              </label>
            </section>
          )}
          <section className="management-card management-form seo-settings">
            <h3>Search & sharing</h3>
            <label>SEO title<input name="seoTitle" maxLength={180} value={seoTitle} onChange={e=>setSeoTitle(e.target.value)} placeholder={record.draft.title || "Article title"} /></label>
            <div className="search-result-preview"><small>swissbehavioralhealth.com{record.kind==="post"?`/resources/${slug}`:record.path}</small><strong>{seoTitle || record.draft.title || "Article title"}</strong><p>{seoDescription || record.draft.summary || "Add a search description."}</p></div>
            <label>
              SEO description
              <textarea
                name="metaDescription"
                maxLength={300}
                rows={4}
                value={seoDescription} onChange={e=>setSeoDescription(e.target.value)}
              />
            </label>
          </section>
          </div>
        </div>
        <aside className="cms-settings">
          <section className="management-card management-form">
            <h3>Publishing</h3>
            <p className="management-help">
              {record.archived
                ? "Archived"
                : record.published
                  ? "Published version available"
                  : "Private draft"}
              {dirty ? " · Unsaved changes" : ""}
            </p>
            <button
              className="admin-button secondary"
              name="intent"
              value="save"
              disabled={busy}
            >
              {busy ? "Saving…" : "Save draft"}
            </button>
            <label className="check-label">
              <input type="checkbox" name="confirmPublish" />I have reviewed
              this content for publication.
            </label>
            <button
              className="admin-button"
              name="intent"
              value="publish"
              disabled={busy || record.archived}
            >
              Publish changes
            </button>
            {record.kind === "post" && record.updatedAt !== "new" && (
              <>
                <label className="check-label">
                  <input type="checkbox" name="confirmVisibility" />
                  Confirm removing or restoring this article’s public visibility
                </label>
                {record.published && (
                  <button
                    name="intent"
                    value="unpublish"
                    className="admin-button secondary"
                    disabled={busy}
                  >
                    Unpublish article
                  </button>
                )}
                <button
                  name="intent"
                  value={record.archived ? "restore" : "archive"}
                  className="admin-button secondary"
                  disabled={busy}
                >
                  {record.archived ? "Restore article" : "Archive article"}
                </button>
              </>
            )}
            <p className="management-help">
              Draft saves do not change the published page. Archiving hides an
              article and retains its content.
            </p>
          </section>
        </aside>
      </Form>
    </div>
  );
}
