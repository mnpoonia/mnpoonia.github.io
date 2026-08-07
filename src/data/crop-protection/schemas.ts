import { z } from "zod";

export const evidenceStatusSchema = z.enum(["verified", "conditional", "unverified", "research-only", "demonstration", "historical-do-not-use"]);
export const problemTypeSchema = z.enum(["insect pest", "mite", "disease", "weed", "nutrient disorder", "physiological disorder", "abiotic injury", "beneficial organism"]);

export const sourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  publisher: z.string().min(1),
  year: z.number().int(),
  url: z.string().url(),
  detail: z.string().min(1),
  status: evidenceStatusSchema,
});

export const ingredientSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  category: z.enum(["insecticide", "oil-based control"]),
  iracGroup: z.string().optional(),
  modeOfAction: z.string().optional(),
});

export const formulationSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  components: z.array(z.object({ ingredientId: z.string().regex(/^[a-z0-9-]+$/), concentration: z.string().min(1) })).min(1),
});

export const productSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  brand: z.string().min(1),
  manufacturer: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  formulationId: z.string().regex(/^[a-z0-9-]+$/),
  status: evidenceStatusSchema,
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  verifiedCropUses: z.array(z.string()).default([]),
});

export const cropSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  scientificName: z.string().optional(),
  aliases: z.array(z.string()).default([]),
});

export const organismSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  scientificName: z.string().optional(),
  aliases: z.array(z.string()).default([]),
  type: problemTypeSchema,
});

export const cropOrganismOccurrenceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  organismId: z.string().regex(/^[a-z0-9-]+$/),
  monitoringNote: z.string().min(1),
  href: z.string().startsWith("/").optional(),
});

export const cropGuidanceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  section: z.enum(["at-a-glance", "climate", "soil-and-drainage", "varieties", "planting", "training-and-pruning", "nutrition", "irrigation", "weed-management", "harvest", "post-harvest"]),
  title: z.string().min(1),
  summary: z.string().min(1),
  value: z.string().optional(),
  qualifiers: z.array(z.string()).default([]),
  geographyId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  evidenceStatus: evidenceStatusSchema,
});

export const cropCalendarTaskSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  months: z.array(z.number().int().min(1).max(12)).min(1),
  title: z.string().min(1),
  task: z.string().min(1),
  kind: z.enum(["crop-care", "monitoring", "harvest", "protection-restriction"]),
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  evidenceStatus: evidenceStatusSchema,
});

export const lookAlikeSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  organismId: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  distinction: z.string().min(1),
  action: z.string().min(1),
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  evidenceStatus: evidenceStatusSchema,
});

export const managementActionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  organismId: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(["monitor", "cultural", "mechanical", "sanitation", "biological", "expert-confirmation"]),
  title: z.string().min(1),
  action: z.string().min(1),
  limitations: z.string().optional(),
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  evidenceStatus: evidenceStatusSchema,
});

export const organismStageSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  organismId: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  kind: z.enum(["life-stage", "damage", "symptom-stage"]),
  order: z.number().int().nonnegative(),
  whereToLook: z.string().min(1),
  visibility: z.string().min(1),
  seasonality: z.string().min(1),
  identificationNotes: z.string().optional(),
  immediateAction: z.string().min(1),
  managementEvidence: z.string().min(1),
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
});

export const imageAssetSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  subjectType: z.enum(["organism-stage", "product", "ingredient", "crop", "symptom", "look-alike"]),
  organismId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  stageId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  productId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  ingredientId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  path: z.string().startsWith("/").optional(),
  status: z.enum(["planned", "available"]),
  role: z.enum(["primary", "detail", "comparison", "package-front", "package-back", "label", "damage"]),
  alt: z.string().min(1),
  caption: z.string().optional(),
  imageNote: z.string().min(1),
  displayOrder: z.number().int().nonnegative(),
});

export const geographySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  type: z.enum(["country", "state", "district", "agroclimatic-zone"]),
  parentId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  timezone: z.string().optional(),
});

export const seasonalitySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  organismId: z.string().regex(/^[a-z0-9-]+$/),
  stageId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  geographyId: z.string().regex(/^[a-z0-9-]+$/),
  months: z.array(z.number().int().min(1).max(12)).min(1),
  monitoringPriority: z.enum(["check-first", "routine", "conditional"]),
  likelihood: z.enum(["low", "moderate", "high", "very-high", "unknown"]),
  conditions: z.array(z.string()).default([]),
  evidenceStatus: evidenceStatusSchema,
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
});

export const scoutingProtocolSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  organismId: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  frequency: z.string().min(1),
  sampleUnit: z.string().min(1),
  sampleSize: z.string().min(1),
  method: z.array(z.string()).min(1),
  record: z.array(z.string()).min(1),
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  evidenceStatus: evidenceStatusSchema,
});

export const thresholdSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  organismId: z.string().regex(/^[a-z0-9-]+$/),
  stageId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  geographyId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  metric: z.string().min(1),
  operator: z.enum([">", ">=", "<", "<=", "presence-based"]),
  value: z.number().optional(),
  unit: z.string().min(1),
  protocolId: z.string().regex(/^[a-z0-9-]+$/),
  action: z.enum(["increase-monitoring", "confirm-diagnosis", "consider-management"]),
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  evidenceStatus: evidenceStatusSchema,
});

export const labelUseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  productId: z.string().regex(/^[a-z0-9-]+$/),
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  organismId: z.string().regex(/^[a-z0-9-]+$/),
  claim: z.enum(["control", "suppression"]),
  dose: z.string().min(1),
  waterVolume: z.string().optional(),
  minimumInterval: z.string().optional(),
  maxApplications: z.string().optional(),
  phi: z.string().optional(),
  rei: z.string().optional(),
  restrictions: z.array(z.string()).default([]),
  labelVersion: z.string().min(1),
  labelEffectiveDate: z.string().optional(),
  labelUrl: z.string().url(),
  verificationStatus: evidenceStatusSchema,
});

export const compatibilitySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  productAId: z.string().regex(/^[a-z0-9-]+$/),
  productBId: z.string().regex(/^[a-z0-9-]+$/),
  scope: z.object({
    cropId: z.string().regex(/^[a-z0-9-]+$/).optional(),
    organismIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
  }),
  classAssessment: z.enum(["compatible", "conditional", "incompatible", "unknown"]),
  exactPhysical: z.enum(["documented-compatible", "documented-incompatible", "jar-test-only", "unknown"]),
  chemical: z.enum(["documented-compatible", "documented-incompatible", "unknown"]),
  labelAuthorization: z.enum(["authorized", "prohibited", "unresolved"]),
  cropSafety: z.enum(["supported", "unsupported", "unknown"]),
  recommendation: z.enum(["tank-mix-supported", "sequential-only", "not-verified", "prohibited"]),
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  evidenceStatus: evidenceStatusSchema,
});

export const recommendationRuleSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  scope: z.object({
    cropId: z.string().regex(/^[a-z0-9-]+$/),
    organismId: z.string().regex(/^[a-z0-9-]+$/),
  }),
  inputs: z.array(z.enum(["days-since-application", "population-trend", "flowering", "water-stress", "prior-irac-groups", "stage", "threshold"])).min(1),
  condition: z.string().min(1),
  effect: z.enum(["monitor", "exclude", "not-preferred", "conditional", "recommendation-gate"]),
  explanation: z.string().min(1),
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  evidenceStatus: evidenceStatusSchema,
});

// A farmer-selected pest/disease and stage is the working scenario. The image
// guide can help select it, but does not block formulation recommendations.
export const recommendationRequestSchema = z.object({
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  geographyId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  organismId: z.string().regex(/^[a-z0-9-]+$/),
  stageId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  diagnosisSource: z.enum(["user-selected", "image-guide", "expert-confirmed"]),
  severity: z.enum(["low", "medium", "high", "unknown"]),
  observedOn: z.string().date(),
  priorApplications: z.array(z.object({
    productId: z.string().regex(/^[a-z0-9-]+$/),
    appliedOn: z.string().date(),
  })).default([]),
  advanced: z.object({
    cropStage: z.string().optional(),
    temperatureC: z.number().optional(),
    relativeHumidityPercent: z.number().min(0).max(100).optional(),
    rainfallAfterApplication: z.boolean().optional(),
    flowering: z.boolean().optional(),
    waterStress: z.boolean().optional(),
  }).default({}),
});

export const sourceImportRecordSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  sourceId: z.string().regex(/^[a-z0-9-]+$/),
  formulationHeadingRaw: z.string().min(1),
  cropRaw: z.string().min(1),
  pestRaw: z.string().min(1),
  activeIngredientDoseRaw: z.string().min(1).nullable(),
  doseRaw: z.string().min(1),
  waterRaw: z.string().min(1),
  phiRaw: z.string().min(1),
  pdfPage: z.number().int().positive(),
  confidence: z.enum(["high", "medium", "low"]),
  reviewStatus: z.enum(["unreviewed", "reviewed", "promoted", "rejected"]),
  flags: z.array(z.string()).default([]),
});

export const referenceUseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  ingredientId: z.string().regex(/^[a-z0-9-]+$/),
  cropId: z.string().regex(/^[a-z0-9-]+$/),
  organismId: z.string().regex(/^[a-z0-9-]+$/),
  target: z.string().min(1),
  formulation: z.string().min(1),
  formulationId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  sourceCrop: z.string().min(1).optional(),
  dose: z.string().min(1),
  waterVolume: z.string().min(1),
  acreEquivalent: z.object({
    dose: z.string().min(1),
    waterVolume: z.string().min(1),
  }).optional(),
  timing: z.string().optional(),
  conditions: z.string().optional(),
  status: evidenceStatusSchema,
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
});

export type CropRecord = z.infer<typeof cropSchema>;
export type SourceRecord = z.infer<typeof sourceSchema>;
export type IngredientRecord = z.infer<typeof ingredientSchema>;
export type FormulationRecord = z.infer<typeof formulationSchema>;
export type ProductRecord = z.infer<typeof productSchema>;
export type CropGuidanceRecord = z.infer<typeof cropGuidanceSchema>;
export type CropCalendarTaskRecord = z.infer<typeof cropCalendarTaskSchema>;
export type OrganismRecord = z.infer<typeof organismSchema>;
export type CropOrganismOccurrenceRecord = z.infer<typeof cropOrganismOccurrenceSchema>;
export type LookAlikeRecord = z.infer<typeof lookAlikeSchema>;
export type ManagementActionRecord = z.infer<typeof managementActionSchema>;
export type OrganismStageRecord = z.infer<typeof organismStageSchema>;
export type ImageAssetRecord = z.infer<typeof imageAssetSchema>;
export type GeographyRecord = z.infer<typeof geographySchema>;
export type SeasonalityRecord = z.infer<typeof seasonalitySchema>;
export type ScoutingProtocolRecord = z.infer<typeof scoutingProtocolSchema>;
export type ThresholdRecord = z.infer<typeof thresholdSchema>;
export type LabelUseRecord = z.infer<typeof labelUseSchema>;
export type CompatibilityRecord = z.infer<typeof compatibilitySchema>;
export type RecommendationRuleRecord = z.infer<typeof recommendationRuleSchema>;
export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;
export type SourceImportRecord = z.infer<typeof sourceImportRecordSchema>;
export type ReferenceUseRecord = z.infer<typeof referenceUseSchema>;
