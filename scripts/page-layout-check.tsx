import { StaffProfile } from "../app/components/staff-profile";
import { getStaffProfile } from "../app/lib/staff-profile";
import { team } from "../app/data/team";
import { ResourcesExperience } from "../app/components/resources-experience";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router";
import { HomeExperience } from "../app/components/home-experience";
import { ContractPage } from "../app/components/contract-page";
import { pageSeeds } from "../app/data/content-seeds";
import {
  designedPageIds,
  validatePageStructure,
  mapPageData,
} from "../app/lib/page-copy";
import type { ContentDocument } from "../app/lib/content.types";
function render(doc: ContentDocument) {
  const router = createMemoryRouter([
    {
      path: "*",
      element:
        doc.id === "page-resources" ? (
          <ResourcesExperience doc={doc} posts={[]} />
        ) : doc.id === "page-home" ? (
          <HomeExperience doc={doc} />
        ) : (
          <ContractPage doc={doc} />
        ),
    },
  ]);
  return renderToStaticMarkup(<RouterProvider router={router} />);
}
function renderProfile(doc:ContentDocument,id:string) {
 const member=getStaffProfile(doc,id);
 assert(member);
 const router=createMemoryRouter([{path:"*",element:<StaffProfile member={member}/>}]);
 return renderToStaticMarkup(<RouterProvider router={router}/>);
}
const structure = (html: string) =>
  html
    .match(/<\/?[a-z][^>]*>/g)
    ?.map((tag) =>
      tag.replace(/ aria-label="[^"]*"/g, "").replace(/ title="[^"]*"/g, "").replace(/ alt="[^"]*"/g, ""),
    );
export function checkPageLayouts() {
  const missing: string[] = [];
  for (const seed of pageSeeds.filter((doc) => designedPageIds.has(doc.id))) {
    const baseline = render(seed);
    const published = structuredClone(seed);
    published.customized = true;
    assert.deepEqual(
      structure(render(published)),
      structure(baseline),
      `${seed.id}: publishing unchanged text changes markup`,
    );
    for (const field of ["title", "summary", "eyebrow"] as const) {
      const edited = structuredClone(published);
      edited[field] += " EDITED";
      assert(
        render(edited).includes("EDITED"),
        `${seed.id}: ${field} edit missing`,
      );
      assert.deepEqual(
        structure(render(edited)),
        structure(baseline),
        `${seed.id}: ${field} changes structure`,
      );
    }
    seed.body.forEach((block, index) => {
      const edited = structuredClone(published);
      edited.body[index].text += " EDITED";
      const biography = seed.id === "page-team" ? team.members.find(member=>member.bio===block.text) : undefined;
      const result = biography ? renderProfile(edited,biography.id) : render(edited);
      if (!result.includes("EDITED"))
        missing.push(`${seed.id} block ${index}: ${block.text.slice(0, 60)}`);
      assert.deepEqual(
        structure(result),
        structure(biography ? renderProfile(seed,biography.id) : baseline),
        `${seed.id}: block ${index} changes markup`,
      );
    });
    const removed = structuredClone(seed);
    removed.body.pop();
    assert(validatePageStructure(seed, removed).length);
    const reordered = structuredClone(seed);
    reordered.body = reordered.body.map((block, i) => ({
      ...block,
      slot: `${seed.id}:${i}`,
    }));
    [reordered.body[0], reordered.body[1]] = [
      reordered.body[1],
      reordered.body[0],
    ];
    assert(validatePageStructure(seed, reordered).length);
  }
  const teamSeed=pageSeeds.find(seed=>seed.id==='page-team')!;
  for(const member of team.members) {
    assert.equal(getStaffProfile(teamSeed,member.id)?.bio,member.bio,'Profile must preserve the complete supplied biography');
    assert(render(teamSeed).includes(`/team/${member.id}`),'Directory must link to dedicated profiles');
    assert(!render(teamSeed).includes('<dialog'),'Staff directory must not contain biography modals');
    assert(renderProfile(teamSeed,member.id).includes(member.photo));
  }
  assert.equal(getStaffProfile(teamSeed,'unknown-profile'),undefined);
  assert.deepEqual(
    mapPageData(
      { title: "Old", href: "Old", to: "Old", id: "Old" },
      () => "Edited",
    ),
    { title: "Edited", href: "Old", to: "Old", id: "Old" },
  );
  assert.deepEqual(
    missing,
    [],
    `Editable blocks must appear inside their designed sections:\n${missing.join("\n")}`,
  );
  console.log(
    "PASS: all 15 designed pages preserve markup when published or edited; every editable text field renders; structural changes rejected.",
  );
}
