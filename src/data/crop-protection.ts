export type EvidenceStatus = "verified" | "conditional" | "unverified" | "research-only" | "demonstration" | "historical-do-not-use";

import { compatibilityRecords, cropCalendarTaskRecords, cropGuidanceRecords, cropOrganismOccurrenceRecords, cropRecords, formulationRecords, geographyRecords, imageAssetRecords, ingredientRecords, labelUseRecords, lookAlikeRecords, managementActionRecords, organismRecords, organismStageRecords, productRecords, recommendationRuleRecords, referenceUseRecords, scoutingProtocolRecords, seasonalityRecords, sourceRecords, thresholdRecords } from "./crop-protection/records";
import type { IngredientRecord, ProductRecord, SourceRecord } from "./crop-protection/schemas";

export type Source = SourceRecord;
export type Ingredient = IngredientRecord;

export const iracGroups: Record<string, string> = {
  "1B": "Organophosphates",
  "3A": "Pyrethroids",
  "4A": "Neonicotinoids",
};

export type Product = ProductRecord & { formulation: string; components: { ingredientId: string; concentration: string }[] };

export type { CompatibilityRecord, CropCalendarTaskRecord, CropGuidanceRecord, CropOrganismOccurrenceRecord as CropOrganismOccurrence, CropRecord, FormulationRecord, GeographyRecord, ImageAssetRecord as ImageAsset, IngredientRecord, LabelUseRecord, LookAlikeRecord, ManagementActionRecord, OrganismRecord, OrganismStageRecord as OrganismStage, ProductRecord, RecommendationRuleRecord, ReferenceUseRecord as ReferenceUse, ScoutingProtocolRecord, SeasonalityRecord, SourceRecord, ThresholdRecord } from "./crop-protection/schemas";
export const crops = cropRecords;
export const cropGuidance = cropGuidanceRecords;
export const cropCalendarTasks = cropCalendarTaskRecords;
export const organisms = organismRecords;
export const cropOrganismOccurrences = cropOrganismOccurrenceRecords;
export const organismStages = organismStageRecords;
export const lookAlikes = lookAlikeRecords;
export const managementActions = managementActionRecords;
export const imageAssets = imageAssetRecords;
export const geographies = geographyRecords;
export const seasonality = seasonalityRecords;
export const scoutingProtocols = scoutingProtocolRecords;
export const thresholds = thresholdRecords;
export const labelUses = labelUseRecords;
export const compatibility = compatibilityRecords;
export const recommendationRules = recommendationRuleRecords;
export const referenceUses = referenceUseRecords;
export const sources: Source[] = sourceRecords;
export const ingredients: Ingredient[] = ingredientRecords;
export const formulations = formulationRecords;
export const products: Product[] = productRecords.map((product) => {
  const formulation = formulations.find((item) => item.id === product.formulationId);
  if (!formulation) throw new Error(`Unknown formulation: ${product.formulationId}`);
  return { ...product, formulation: formulation.name, components: formulation.components };
});

// Dose belongs to a crop, target, and formulation. It is never a universal property of an ingredient.
export function referenceUsesForProduct(product: Product, cropId?: string) {
  return referenceUses.filter((use) =>
    use.formulationId === product.formulationId
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
