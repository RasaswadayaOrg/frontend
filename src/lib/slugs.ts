/** Convert any string to a URL-safe slug */
export function slugify(str: string): string {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Build a readable artist URL slug: "amal-perera"
 * The id parameter is accepted but not used, so existing call-sites
 * don't need to change.
 */
export function toArtistSlug(name: string, _id?: string): string {
  return slugify(name);
}
