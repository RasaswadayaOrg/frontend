/**
 * Reader-friendly slug helpers for detail-page URLs.
 *
 * URL pattern: `<slugified-title>--<id>` (e.g. `kandy-kandyan-dance-night--cmotyi1it001iw51nlyplh46n`).
 * The double-dash separator is used so academy IDs like `acd-sl-010` (which
 * already contain single dashes) remain unambiguous.
 *
 * `extractId` is backward-compatible: if no `--` is present, the whole input
 * is treated as the id, so pre-slug URLs still resolve.
 */

const SEP = "--";

export function slugify(input: string | null | undefined): string {
  if (!input) return "";
  return String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")     // strip accents
    .replace(/['’`]/g, "")               // drop apostrophes
    .replace(/[^a-z0-9]+/g, "-")         // non-alphanumerics → dash
    .replace(/^-+|-+$/g, "")             // trim leading/trailing dashes
    .slice(0, 60)
    .replace(/-+$/g, "");                // re-trim after slice
}

/** Build a `<slug>--<id>` URL segment. Falls back to `id` alone when no title. */
export function buildSlug(id: string | number, title?: string | null): string {
  const idStr = String(id);
  const slug = slugify(title || "");
  return slug ? `${slug}${SEP}${idStr}` : idStr;
}

/** Extract the canonical id from a slug-prefixed segment (or return as-is). */
export function extractId(segment: string): string {
  if (!segment) return segment;
  const idx = segment.lastIndexOf(SEP);
  return idx >= 0 ? segment.slice(idx + SEP.length) : segment;
}
