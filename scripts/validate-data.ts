import { compatibility, cropOrganismOccurrences, crops, geographies, imageAssets, ingredients, labelUses, organisms, organismStages, products, recommendationRules, referenceUses, scoutingProtocols, seasonality, sources, thresholds } from "../src/data/crop-protection";
import { readPpqsImportRecords } from "../src/data/crop-protection/ppqs-import";

function assertUnique(values: { id: string }[], label: string) {
  const ids = new Set<string>();
  for (const value of values) {
    if (ids.has(value.id)) throw new Error(`Duplicate ${label} ID: ${value.id}`);
    ids.add(value.id);
  }
}

assertUnique(ingredients, "ingredient");
assertUnique(products, "product");
assertUnique(sources, "source");
assertUnique(referenceUses, "reference use");
assertUnique(crops, "crop");
assertUnique(organisms, "organism");
assertUnique(cropOrganismOccurrences, "crop-organism occurrence");
assertUnique(organismStages, "organism stage");
assertUnique(imageAssets, "image asset");
assertUnique(geographies, "geography");
assertUnique(seasonality, "seasonality record");
assertUnique(scoutingProtocols, "scouting protocol");
assertUnique(thresholds, "threshold");
assertUnique(labelUses, "label use");
assertUnique(compatibility, "compatibility record");
assertUnique(recommendationRules, "recommendation rule");
assertUnique(readPpqsImportRecords(), "PPQS import record");

const ingredientIds = new Set(ingredients.map((item) => item.id));
const sourceIds = new Set(sources.map((item) => item.id));
const cropIds = new Set(crops.map((item) => item.id));
const organismIds = new Set(organisms.map((item) => item.id));
const geographyIds = new Set(geographies.map((item) => item.id));
const productIds = new Set(products.map((item) => item.id));
for (const occurrence of cropOrganismOccurrences) {
  if (!cropIds.has(occurrence.cropId)) throw new Error(`${occurrence.id} references an unknown crop`);
  if (!organismIds.has(occurrence.organismId)) throw new Error(`${occurrence.id} references an unknown organism`);
}
for (const geography of geographies) {
  if (geography.parentId && !geographyIds.has(geography.parentId)) throw new Error(`${geography.id} references an unknown parent geography`);
}
for (const record of seasonality) {
  if (!cropIds.has(record.cropId) || !organismIds.has(record.organismId) || !geographyIds.has(record.geographyId)) throw new Error(`${record.id} has an unknown crop, organism, or geography`);
  for (const sourceId of record.sourceIds) if (!sourceIds.has(sourceId)) throw new Error(`${record.id} references an unknown source`);
}
const protocolIds = new Set(scoutingProtocols.map((item) => item.id));
for (const protocol of scoutingProtocols) {
  if (!cropIds.has(protocol.cropId) || !organismIds.has(protocol.organismId)) throw new Error(`${protocol.id} has an unknown crop or organism`);
  for (const sourceId of protocol.sourceIds) if (!sourceIds.has(sourceId)) throw new Error(`${protocol.id} references an unknown source`);
}
for (const threshold of thresholds) {
  if (!cropIds.has(threshold.cropId) || !organismIds.has(threshold.organismId) || !protocolIds.has(threshold.protocolId)) throw new Error(`${threshold.id} has an unknown crop, organism, or protocol`);
  if (threshold.geographyId && !geographyIds.has(threshold.geographyId)) throw new Error(`${threshold.id} references an unknown geography`);
  for (const sourceId of threshold.sourceIds) if (!sourceIds.has(sourceId)) throw new Error(`${threshold.id} references an unknown source`);
}
for (const use of labelUses) {
  if (!productIds.has(use.productId) || !cropIds.has(use.cropId) || !organismIds.has(use.organismId)) throw new Error(`${use.id} has an unknown product, crop, or organism`);
}
for (const record of compatibility) {
  if (!productIds.has(record.productAId) || !productIds.has(record.productBId)) throw new Error(`${record.id} has an unknown product`);
  if (record.scope.cropId && !cropIds.has(record.scope.cropId)) throw new Error(`${record.id} has an unknown crop`);
  for (const organismId of record.scope.organismIds) if (!organismIds.has(organismId)) throw new Error(`${record.id} has an unknown organism`);
  for (const sourceId of record.sourceIds) if (!sourceIds.has(sourceId)) throw new Error(`${record.id} references an unknown source`);
}
for (const rule of recommendationRules) {
  if (!cropIds.has(rule.scope.cropId) || !organismIds.has(rule.scope.organismId)) throw new Error(`${rule.id} has an unknown crop or organism`);
  for (const sourceId of rule.sourceIds) if (!sourceIds.has(sourceId)) throw new Error(`${rule.id} references an unknown source`);
}
for (const stage of organismStages) {
  if (!organismIds.has(stage.organismId)) throw new Error(`${stage.id} references an unknown organism`);
  for (const sourceId of stage.sourceIds) {
    if (!sourceIds.has(sourceId)) throw new Error(`${stage.id} references an unknown source`);
  }
}
const stageIds = new Set(organismStages.map((item) => item.id));
for (const image of imageAssets) {
  if (image.organismId && !organismIds.has(image.organismId)) throw new Error(`${image.id} references an unknown organism`);
  if (image.stageId && !stageIds.has(image.stageId)) throw new Error(`${image.id} references an unknown stage`);
  if (image.productId && !productIds.has(image.productId)) throw new Error(`${image.id} references an unknown product`);
  if (image.subjectType === "organism-stage" && (!image.organismId || !image.stageId)) throw new Error(`${image.id} needs an organism and stage`);
  if (image.subjectType === "product" && !image.productId) throw new Error(`${image.id} needs a product`);
  if (image.status === "available" && !image.path) throw new Error(`${image.id} needs a path when available`);
}
for (const product of products) {
  for (const component of product.components) {
    if (!ingredientIds.has(component.ingredientId)) throw new Error(`${product.id} references an unknown ingredient`);
  }
  for (const sourceId of product.sourceIds) {
    if (!sourceIds.has(sourceId)) throw new Error(`${product.id} references an unknown source`);
  }
}

for (const use of referenceUses) {
  if (!ingredientIds.has(use.ingredientId)) throw new Error(`${use.id} references an unknown ingredient`);
  if (!cropIds.has(use.cropId)) throw new Error(`${use.id} references an unknown crop`);
  if (!organismIds.has(use.organismId)) throw new Error(`${use.id} references an unknown organism`);
  if (!use.dose || !use.waterVolume) throw new Error(`${use.id} is missing dose or water volume`);
  for (const sourceId of use.sourceIds) {
    if (!sourceIds.has(sourceId)) throw new Error(`${use.id} references an unknown source`);
  }
}

console.log(`Validated ${ingredients.length} ingredients, ${products.length} products, ${referenceUses.length} reference uses, and ${sources.length} sources.`);
