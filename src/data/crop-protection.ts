export type EvidenceStatus = "verified" | "conditional" | "unverified" | "research-only";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  year: number;
  url: string;
  detail: string;
  status: EvidenceStatus;
}

export interface Ingredient {
  id: string;
  name: string;
  category: "insecticide" | "oil-based control";
  iracGroup?: string;
  modeOfAction?: string;
}

export const iracGroups: Record<string, string> = {
  "1B": "Organophosphates",
  "3A": "Pyrethroids",
  "4A": "Neonicotinoids",
};

export interface Product {
  id: string;
  brand: string;
  manufacturer: string;
  aliases: string[];
  formulation: string;
  components: { ingredientId: string; concentration: string }[];
  status: EvidenceStatus;
  sourceIds: string[];
  verifiedCropUses: string[];
}

import { compatibilityRecords, cropOrganismOccurrenceRecords, cropRecords, geographyRecords, imageAssetRecords, labelUseRecords, organismRecords, organismStageRecords, recommendationRuleRecords, referenceUseRecords, scoutingProtocolRecords, seasonalityRecords, thresholdRecords } from "./crop-protection/records";

export type { CompatibilityRecord, CropOrganismOccurrenceRecord as CropOrganismOccurrence, CropRecord, GeographyRecord, ImageAssetRecord as ImageAsset, LabelUseRecord, OrganismRecord, OrganismStageRecord as OrganismStage, RecommendationRuleRecord, ReferenceUseRecord as ReferenceUse, ScoutingProtocolRecord, SeasonalityRecord, ThresholdRecord } from "./crop-protection/schemas";
export const crops = cropRecords;
export const organisms = organismRecords;
export const cropOrganismOccurrences = cropOrganismOccurrenceRecords;
export const organismStages = organismStageRecords;
export const imageAssets = imageAssetRecords;
export const geographies = geographyRecords;
export const seasonality = seasonalityRecords;
export const scoutingProtocols = scoutingProtocolRecords;
export const thresholds = thresholdRecords;
export const labelUses = labelUseRecords;
export const compatibility = compatibilityRecords;
export const recommendationRules = recommendationRuleRecords;
export const referenceUses = referenceUseRecords;

export const sources: Source[] = [
  {
    id: "pau-fruits-2024",
    title: "Package of Practices for Cultivation of Fruits-2024",
    publisher: "Punjab Agricultural University",
    year: 2025,
    url: "https://old.pau.edu/content/ccil/pf/pp_fruits.pdf",
    detail: "Citrus psylla section, printed page 29 / PDF page 37. The package was finalized in January 2025.",
    status: "verified",
  },
  {
    id: "niphm-citrus-2014",
    title: "AESA Based IPM Package for Citrus",
    publisher: "National Institute of Plant Health Management",
    year: 2014,
    url: "https://niphm.gov.in/IPMPackages/Citrus.pdf",
    detail: "Weekly citrus scouting and identification guidance. National guidance, not Punjab-specific label authorization.",
    status: "conditional",
  },
  {
    id: "sml-spike",
    title: "Spike product page",
    publisher: "SML Limited",
    year: 2026,
    url: "https://sml-ltd.com/product/spike/",
    detail: "Manufacturer product identity: thiamethoxam 25% WG. Crop-use constraints must be verified against the purchased label.",
    status: "verified",
  },
  {
    id: "sml-cypro",
    title: "Cypro product page",
    publisher: "SML Limited",
    year: 2026,
    url: "https://sml-ltd.com/product/cypro/",
    detail: "Manufacturer product identity: profenofos 40% + cypermethrin 4% EC.",
    status: "verified",
  },
  {
    id: "ppqs-major-uses-2026",
    title: "Major Uses of Pesticides",
    publisher: "Plant Protection Quarantine and Storage, Government of India",
    year: 2026,
    url: "https://ppqs.gov.in/sites/default/files/updated_mup_insecticide_as_on_31.03.2026_c.pdf",
    detail: "Formulation-level major-use table updated through 31 March 2026. Relevant entries: thiamethoxam 25% WG, PDF page 54; imidacloprid 17.8% SL, page 37; profenofos 40% + cypermethrin 4% EC, page 83. This is not proof of a particular brand's current statutory label.",
    status: "verified",
  },
];

export const ingredients: Ingredient[] = [
  { id: "thiamethoxam", name: "Thiamethoxam", category: "insecticide", iracGroup: "4A", modeOfAction: "Nicotinic acetylcholine receptor competitive modulator" },
  { id: "imidacloprid", name: "Imidacloprid", category: "insecticide", iracGroup: "4A", modeOfAction: "Nicotinic acetylcholine receptor competitive modulator" },
  { id: "profenofos", name: "Profenofos", category: "insecticide", iracGroup: "1B", modeOfAction: "Acetylcholinesterase inhibitor" },
  { id: "cypermethrin", name: "Cypermethrin", category: "insecticide", iracGroup: "3A", modeOfAction: "Sodium-channel modulator" },
  { id: "horticultural-mineral-oil", name: "Horticultural mineral oil", category: "oil-based control" },
];

export const products: Product[] = [
  {
    id: "sml-spike-thiamethoxam-25-wg",
    brand: "Spike",
    manufacturer: "SML Limited",
    aliases: ["SML Spike", "Spike 25 WG"],
    formulation: "Thiamethoxam 25% WG",
    components: [{ ingredientId: "thiamethoxam", concentration: "25%" }],
    status: "verified",
    sourceIds: ["sml-spike", "ppqs-major-uses-2026"],
    verifiedCropUses: ["Citrus: psylla, subject to the current container label"],
  },
  {
    id: "sml-cypro-profenofos-40-cypermethrin-4-ec",
    brand: "Cypro",
    manufacturer: "SML Limited",
    aliases: ["SML Cypro", "Cypro 44 EC"],
    formulation: "Profenofos 40% + Cypermethrin 4% EC",
    components: [
      { ingredientId: "profenofos", concentration: "40%" },
      { ingredientId: "cypermethrin", concentration: "4%" },
    ],
    status: "verified",
    sourceIds: ["sml-cypro", "ppqs-major-uses-2026"],
    verifiedCropUses: ["Cotton: bollworm complex", "Sugarcane: early shoot borer", "Kinnow use not verified"],
  },
  {
    id: "pau-imidacloprid-17-8-sl",
    brand: "Confidor / Crocodile",
    manufacturer: "Brand varies by product",
    aliases: ["Imidacloprid 17.8 SL"],
    formulation: "Imidacloprid 17.8% SL",
    components: [{ ingredientId: "imidacloprid", concentration: "17.8%" }],
    status: "conditional",
    sourceIds: ["pau-fruits-2024"],
    verifiedCropUses: ["PAU citrus psylla guidance; verify current brand label before use"],
  },
];

// Dose belongs to a crop, target, and formulation. It is never a universal property of an ingredient.
export function referenceUsesForProduct(product: Product, cropId?: string) {
  return referenceUses.filter((use) =>
    product.components.some((component) => component.ingredientId === use.ingredientId)
    && (!cropId || use.cropId === cropId),
  );
}

export function sourceFor(id: string) {
  const source = sources.find((item) => item.id === id);
  if (!source) throw new Error(`Unknown source: ${id}`);
  return source;
}

export function ingredientFor(id: string) {
  const ingredient = ingredients.find((item) => item.id === id);
  if (!ingredient) throw new Error(`Unknown ingredient: ${id}`);
  return ingredient;
}

export function iracGroupLabel(group: string) {
  return iracGroups[group] ? `${group} (${iracGroups[group]})` : group;
}

export function productSearchIndex() {
  return products.map((product) => ({
    id: product.id,
    brand: product.brand,
    manufacturer: product.manufacturer,
    aliases: product.aliases,
    formulation: product.formulation,
    components: product.components.map((component) => ingredientFor(component.ingredientId).name),
    status: product.status,
  }));
}
