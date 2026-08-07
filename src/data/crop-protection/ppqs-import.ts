import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sourceImportRecordSchema, type SourceImportRecord } from "./schemas";

// Astro bundles this module into dist during the static build, so module-relative
// paths would point at dist instead of the repository source import.
const root = process.cwd();
const recordsPath = resolve(root, "data/source/ppqs/2026-03-31-insecticides/records.ndjson");
const catalogPath = resolve(root, "data/source/ppqs/2026-03-31-insecticides/catalog.json");

type RawPpqsRecord = {
  id: string;
  formulation_heading_raw: string;
  crop_raw: string;
  pest_raw: string;
  active_ingredient_dose_raw: string | null;
  dose_raw: string;
  water_raw: string;
  phi_raw: string;
  pdf_page: number;
  confidence: "low";
  flags: string[];
};

export function readPpqsImportRecords(): SourceImportRecord[] {
  const raw = readFileSync(recordsPath, "utf8").trim();
  if (!raw) return [];
  return raw.split("\n").map((line) => {
    const record = JSON.parse(line) as RawPpqsRecord;
    return sourceImportRecordSchema.parse({
      id: record.id,
      sourceId: "ppqs-major-uses-2026",
      formulationHeadingRaw: record.formulation_heading_raw,
      cropRaw: record.crop_raw,
      pestRaw: record.pest_raw,
      activeIngredientDoseRaw: record.active_ingredient_dose_raw,
      doseRaw: record.dose_raw,
      waterRaw: record.water_raw,
      phiRaw: record.phi_raw,
      pdfPage: record.pdf_page,
      confidence: record.confidence,
      reviewStatus: "unreviewed",
      flags: record.flags,
    });
  });
}

export type PpqsCatalog = {
  sourceId: string;
  status: string;
  formulations: { id: string; nameRaw: string; sourceRecordIds: string[] }[];
  crops: { id: string; nameRaw: string; sourceRecordIds: string[] }[];
  targets: { id: string; nameRaw: string; type: "unclassified"; sourceRecordIds: string[] }[];
  uses: { id: string; sourceRecordId: string; formulationId: string; cropId: string; targetId: string; activeIngredientDoseRaw: string; formulationDoseRaw: string; waterRaw: string; waitingPeriodRaw: string; reviewStatus: "unreviewed" }[];
};

export function readPpqsCatalog(): PpqsCatalog {
  return JSON.parse(readFileSync(catalogPath, "utf8")) as PpqsCatalog;
}
