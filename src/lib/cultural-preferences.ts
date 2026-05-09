export type CulturalPreferenceOption = {
  id: string;
  name: string;
  image: string;
};

export type CulturalCategoryOption = {
  id: "music" | "dance" | "film" | "drama";
  name: string;
  shortName: string;
  examples: CulturalPreferenceOption[];
};

export type DistrictOption = {
  id: string;
  name: string;
};

export const SRI_LANKAN_DISTRICTS: DistrictOption[] = [
  { id: "ampara", name: "Ampara" },
  { id: "anuradhapura", name: "Anuradhapura" },
  { id: "badulla", name: "Badulla" },
  { id: "batticaloa", name: "Batticaloa" },
  { id: "colombo", name: "Colombo" },
  { id: "galle", name: "Galle" },
  { id: "gampaha", name: "Gampaha" },
  { id: "hambantota", name: "Hambantota" },
  { id: "jaffna", name: "Jaffna" },
  { id: "kalutara", name: "Kalutara" },
  { id: "kandy", name: "Kandy" },
  { id: "kegalle", name: "Kegalle" },
  { id: "kilinochchi", name: "Kilinochchi" },
  { id: "kurunegala", name: "Kurunegala" },
  { id: "mannar", name: "Mannar" },
  { id: "matale", name: "Matale" },
  { id: "matara", name: "Matara" },
  { id: "monaragala", name: "Monaragala" },
  { id: "mullaitivu", name: "Mullaitivu" },
  { id: "nuwara_eliya", name: "Nuwara Eliya" },
  { id: "polonnaruwa", name: "Polonnaruwa" },
  { id: "puttalam", name: "Puttalam" },
  { id: "ratnapura", name: "Ratnapura" },
  { id: "trincomalee", name: "Trincomalee" },
  { id: "vavuniya", name: "Vavuniya" },
];

export const CULTURAL_CATEGORIES: CulturalCategoryOption[] = [
  {
    id: "music",
    name: "Music (සංගීතය)",
    shortName: "Music",
    examples: [
      { id: "sinhala_classical", name: "Classical (ශාස්ත්‍රීය)", image: "🎶" },
      { id: "folk_fusion", name: "Folk Fusion / Jana Gee", image: "🪕" },
      { id: "light_classical", name: "Sarala Gee (සරල ගී)", image: "🎵" },
      { id: "classical_fusion", name: "Fusion / Modern", image: "🎸" },
      { id: "orchestral_scores", name: "Instrumental", image: "🥁" },
    ],
  },
  {
    id: "dance",
    name: "Dance (නර්තනය)",
    shortName: "Dance",
    examples: [
      { id: "ves_dance", name: "Upcountry / Kandyan", image: "💃" },
      { id: "kolam_dance", name: "Low Country / Kolam", image: "👹" },
      { id: "harvest_dances", name: "Folk / Festival Dance", image: "👯" },
      { id: "sri_lankan_contemporary", name: "Contemporary Dance", image: "🩰" },
    ],
  },
  {
    id: "film",
    name: "Film (සිනමාව)",
    shortName: "Film",
    examples: [
      { id: "social_realism", name: "Social Realism", image: "🎞️" },
      { id: "romantic_drama", name: "Romantic Drama", image: "🎬" },
      { id: "ancient_sri_lanka", name: "Historical Cinema", image: "🏛️" },
      { id: "low_budget_indie", name: "Independent Film", image: "📽️" },
    ],
  },
  {
    id: "drama",
    name: "Drama (නාට්‍ය කලාව)",
    shortName: "Drama",
    examples: [
      { id: "nadagam", name: "Nadagam / Stylized", image: "🎭" },
      { id: "social_drama", name: "Realistic / Social Drama", image: "🎬" },
      { id: "stage_musicals", name: "Musical Theatre", image: "🎤" },
      { id: "political_theatre", name: "Street / Political Drama", image: "🗣️" },
    ],
  },
];

const LEGACY_ALIASES: Record<string, string> = {
  classical_music: "sinhala_classical",
  folk_music: "folk_fusion",
  sarala_gee: "light_classical",
  fusion_modern: "classical_fusion",
  classical_instrumental: "orchestral_scores",
  instrumental: "orchestral_scores",
  upcountry_dance: "ves_dance",
  lowcountry_dance: "kolam_dance",
  sabaragamuwa_dance: "harvest_dances",
  contemporary_dance: "sri_lankan_contemporary",
  stylized_drama: "nadagam",
  realistic_drama: "social_drama",
  comedy_drama: "stage_musicals",
  street_drama: "political_theatre",
  theater: "drama",
  theatre: "drama",
  concerts: "music",
};

const normaliseId = (value?: string | null) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const preferenceLabels = new Map<string, string>();
for (const category of CULTURAL_CATEGORIES) {
  preferenceLabels.set(category.id, category.shortName);
  for (const example of category.examples) {
    preferenceLabels.set(example.id, example.name.replace(/\s*\([^)]*\)/g, ""));
  }
}

const cityLabels = new Map(SRI_LANKAN_DISTRICTS.map((district) => [district.id, district.name]));

export function normalizePreferenceId(value?: string | null) {
  const normalised = normaliseId(value);
  return LEGACY_ALIASES[normalised] || normalised;
}

export function formatPreferenceLabel(value?: string | null) {
  const normalised = normalizePreferenceId(value);
  if (!normalised) return "Not selected";
  return preferenceLabels.get(normalised) || normalised.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function formatCityLabel(value?: string | null) {
  const normalised = normalizePreferenceId(value);
  if (!normalised) return "Sri Lanka";
  return cityLabels.get(normalised) || formatPreferenceLabel(normalised);
}

export function normalizePreferenceList(values?: string[] | null) {
  return Array.from(new Set((values || []).map(normalizePreferenceId).filter(Boolean)));
}
