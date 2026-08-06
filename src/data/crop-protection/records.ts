import crops from "./crops.json";
import kinnowOccurrences from "./occurrences/kinnow.json";
import cottonOccurrences from "./occurrences/cotton.json";
import organisms from "./organisms.json";
import asianCitrusPsyllidStages from "./stages/asian-citrus-psyllid.json";
import images from "./images.json";
import geographies from "./geographies.json";
import seasonality from "./seasonality.json";
import scouting from "./scouting.json";
import thresholds from "./thresholds.json";
import labelUses from "./label-uses.json";
import compatibility from "./compatibility.json";
import recommendationRules from "./recommendation-rules.json";
import cottonUses from "./uses/cotton.json";
import kinnowPsyllaUses from "./uses/kinnow-citrus-psylla.json";
import { compatibilitySchema, cropOrganismOccurrenceSchema, cropSchema, geographySchema, imageAssetSchema, labelUseSchema, organismSchema, organismStageSchema, recommendationRuleSchema, referenceUseSchema, scoutingProtocolSchema, seasonalitySchema, thresholdSchema, type CompatibilityRecord, type CropOrganismOccurrenceRecord, type CropRecord, type GeographyRecord, type ImageAssetRecord, type LabelUseRecord, type OrganismRecord, type OrganismStageRecord, type RecommendationRuleRecord, type ReferenceUseRecord, type ScoutingProtocolRecord, type SeasonalityRecord, type ThresholdRecord } from "./schemas";

function parseRecords<T>(records: unknown[], schema: { parse: (record: unknown) => T }) {
  return records.map((record) => schema.parse(record));
}

export const cropRecords: CropRecord[] = parseRecords(crops, cropSchema);
export const organismRecords: OrganismRecord[] = parseRecords(organisms, organismSchema);
export const cropOrganismOccurrenceRecords: CropOrganismOccurrenceRecord[] = parseRecords([...kinnowOccurrences, ...cottonOccurrences], cropOrganismOccurrenceSchema);
export const organismStageRecords: OrganismStageRecord[] = parseRecords(asianCitrusPsyllidStages, organismStageSchema);
export const imageAssetRecords: ImageAssetRecord[] = parseRecords(images, imageAssetSchema);
export const geographyRecords: GeographyRecord[] = parseRecords(geographies, geographySchema);
export const seasonalityRecords: SeasonalityRecord[] = parseRecords(seasonality, seasonalitySchema);
export const scoutingProtocolRecords: ScoutingProtocolRecord[] = parseRecords(scouting, scoutingProtocolSchema);
export const thresholdRecords: ThresholdRecord[] = parseRecords(thresholds, thresholdSchema);
export const labelUseRecords: LabelUseRecord[] = parseRecords(labelUses, labelUseSchema);
export const compatibilityRecords: CompatibilityRecord[] = parseRecords(compatibility, compatibilitySchema);
export const recommendationRuleRecords: RecommendationRuleRecord[] = parseRecords(recommendationRules, recommendationRuleSchema);
export const referenceUseRecords: ReferenceUseRecord[] = parseRecords([...kinnowPsyllaUses, ...cottonUses], referenceUseSchema);
