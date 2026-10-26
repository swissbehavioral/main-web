# Restored content — October 26, 2026

Source project: `/Users/fidaali/swissbehavioural` (the older project without “health” in the folder name). That source remains unchanged.

## Supplied leadership

The commented leadership block in `src/components/AboutSection.tsx` identifies:

- Dr. Brian Gadbois, MD — Medical Director; `Medical_Director.png`.
- Dr. Angela Turner, Ph.D., LMHC, MCAP — Clinical Director; `Angela_Turner.png`.
- Jey Roche, MA, MCAP — Program Director; `Director_Program.png`.

English biographies and Spanish translations were copied from `src/data/translations.ts`. Existing credential statements are supplied source content; no license numbers or additional qualifications were invented. The internal `verified` display flag represents the client's supplied roster, not a new independent credential-verification process.

The Home, About and Team cards link to dedicated `/team/brian-gadbois`, `/team/angela-turner` and `/team/jey-roche` profile pages. Each page places the portrait beside the complete supplied biography on desktop and stacks them on mobile. Staff biography dialogs have been removed. The pages read their copy from the same published Team CMS document, so names, credentials, roles and biographies remain editable in one place.

## Supplied facility sections

The commented environment and lodging blocks in `src/components/TreatmentSection.tsx`, with the image references in `src/components/FacilityGallery.tsx`, provide:

- `Around_Recovery.png` — campus and grounds.
- `Building2.webp` — building and entrance.
- `philippe_park.mp4` — the Philippe Park / supportive-lodging environment video.

The environment and lodging copy, including the distinction between supportive lodging and residential treatment, is retained from the source. These sections appear on Home and Treatment. The two photos are shown together rather than hidden behind an automatically advancing carousel.

The five photos were converted locally to WebP, retaining their original aspect ratios. Their combined size is approximately 740 KB, compared with approximately 8.7 MB for the five originals. A separate lightweight video poster was generated from the actual supplied video. Below-the-fold images are lazy-loaded with explicit dimensions; the portrait on each dedicated profile page loads eagerly as its primary image. Video is local, has controls, does not autoplay, and uses `preload="none"`.

## CMS compatibility

`app/data/recovered-content.ts` contains the restored source copy and media references. New editable blocks are appended after all existing slots in the Home, About, Team and Treatment schemas. `app/lib/content-migrations.ts` upgrades only the recognized previous schema lengths on read, preserving all existing edited text and publication state. It does not write to Appwrite or change staff accounts.

Public and admin content reads share this upgrade. Saving through the existing CMS stores the expanded schema through its normal authorized workflow. New English copy still requires corresponding Spanish dictionary entries if edited in future.
