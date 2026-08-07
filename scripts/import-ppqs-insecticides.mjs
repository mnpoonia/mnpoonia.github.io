#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";

const SOURCE_URL = "https://ppqs.gov.in/sites/default/files/updated_mup_insecticide_as_on_31.03.2026_c.pdf";
const SOURCE_DATE = "2026-03-31";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIR = resolve(ROOT, "data/source/ppqs/2026-03-31-insecticides");
const PDF_PATH = resolve(OUTPUT_DIR, "source.pdf");
const TEXT_PATH = resolve(OUTPUT_DIR, "source.txt");
const RECORDS_PATH = resolve(OUTPUT_DIR, "records.ndjson");
const CATALOG_PATH = resolve(OUTPUT_DIR, "catalog.json");
const MANIFEST_PATH = resolve(OUTPUT_DIR, "manifest.json");
const PILOT_FORMULATIONS = new Set(["Abamectin 01.90 % EC", "Acequinocyl 15% w/v SC"]);
const FORMULATION = /(?:%|g\/l|g\/kg|w\/w|w\/v)\s*(?:EC|SC|SL|WG|WP|GR|OD|CS|FS|SP|EW|DP|SG)\b/i;

function normalize(text) {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function slug(text) {
  return normalize(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildCatalog(records) {
  const formulations = new Map();
  const crops = new Map();
  const targets = new Map();
  const uses = [];

  for (const record of records) {
    const formulationId = `ppqs-formulation-${slug(record.formulation_heading_raw)}`;
    const cropId = `ppqs-crop-${slug(record.crop_raw)}`;
    const targetId = `ppqs-target-${slug(record.pest_raw)}`;
    formulations.set(formulationId, { id: formulationId, nameRaw: record.formulation_heading_raw, sourceRecordIds: [] });
    crops.set(cropId, { id: cropId, nameRaw: record.crop_raw, sourceRecordIds: [] });
    targets.set(targetId, { id: targetId, nameRaw: record.pest_raw, type: "unclassified", sourceRecordIds: [] });
    formulations.get(formulationId).sourceRecordIds.push(record.id);
    crops.get(cropId).sourceRecordIds.push(record.id);
    targets.get(targetId).sourceRecordIds.push(record.id);
    uses.push({
      id: `ppqs-use-${record.id.replace("ppqs-insecticide-", "")}`,
      sourceRecordId: record.id,
      formulationId,
      cropId,
      targetId,
      activeIngredientDoseRaw: record.active_ingredient_dose_raw,
      formulationDoseRaw: record.dose_raw,
      waterRaw: record.water_raw,
      waitingPeriodRaw: record.phi_raw,
      reviewStatus: "unreviewed",
    });
  }

  return {
    sourceId: "ppqs-major-uses-2026",
    status: "unreviewed-pilot",
    formulations: [...formulations.values()],
    crops: [...crops.values()],
    targets: [...targets.values()],
    uses,
  };
}

function visualLines(items) {
  const lines = new Map();
  for (const item of items) {
    const y = Math.round(item.y);
    const line = lines.get(y) ?? [];
    line.push(item);
    lines.set(y, line);
  }
  return [...lines.entries()].sort(([left], [right]) => right - left).map(([, line]) => line.sort((left, right) => left.x - right.x));
}

async function extractPages() {
  const document = await getDocument({ data: new Uint8Array(readFileSync(PDF_PATH)) }).promise;
  const pages = [];
  for (let number = 1; number <= document.numPages; number += 1) {
    const content = await (await document.getPage(number)).getTextContent();
    const items = content.items.filter((item) => "str" in item && item.str.trim()).map((item) => ({ x: item.transform[4], y: item.transform[5], text: item.str }));
    const text = visualLines(items).map((line) => line.map((item) => item.text).join(" ")).join("\n");
    pages.push({ items, text });
  }
  return pages;
}

function textInRect(items, rect) {
  return normalize(items
    .filter((item) => item.x >= rect.left - 1 && item.x < rect.right - 1 && item.y > rect.bottom + 1 && item.y < rect.top - 1)
    .sort((first, second) => second.y - first.y || first.x - second.x)
    .map((item) => item.text)
    .join(" "));
}

function pageRects(operatorList) {
  const rects = [];
  for (let index = 0; index < operatorList.fnArray.length; index += 1) {
    if (operatorList.fnArray[index] !== OPS.constructPath) continue;
    const coordinates = Object.values(operatorList.argsArray[index][1]?.[0] ?? {});
    for (let coordinateIndex = 0; coordinateIndex + 11 < coordinates.length; coordinateIndex += 13) {
      const left = coordinates[coordinateIndex + 1];
      const bottom = coordinates[coordinateIndex + 2];
      const right = coordinates[coordinateIndex + 4];
      const top = coordinates[coordinateIndex + 8];
      if (right > left && top > bottom) rects.push({ left, right, bottom, top });
    }
  }
  return rects;
}

function matchesRect(rect, left, right) {
  return Math.abs(rect.left - left) < 2 && Math.abs(rect.right - right) < 2;
}

async function pilotRecords() {
  const document = await getDocument({ data: new Uint8Array(readFileSync(PDF_PATH)) }).promise;
  const page = await document.getPage(2);
  const content = await page.getTextContent();
  const items = content.items
    .filter((item) => "str" in item && item.str.trim())
    .map((item) => ({ x: item.transform[4], y: item.transform[5], text: item.str }));
  const rects = pageRects(await page.getOperatorList());
  const headings = rects
    .filter((rect) => matchesRect(rect, 36.48, 568.2))
    .map((rect) => ({ ...rect, text: textInRect(items, rect) }))
    .filter((rect) => FORMULATION.test(rect.text));
  const targetCells = rects.filter((rect) => matchesRect(rect, 140.42, 249.16));
  const cropCells = rects.filter((rect) => matchesRect(rect, 36.48, 139.94));
  const fields = [
    [249.65, 320.71],
    [321.31, 395.11],
    [395.59, 485.25],
    [485.74, 568.2],
  ];
  const records = new Map();

  for (const [headingIndex, heading] of headings.entries()) {
    if (!PILOT_FORMULATIONS.has(heading.text)) continue;
    const nextHeading = headings[headingIndex + 1];
    for (const targetCell of targetCells.filter((cell) => cell.top < heading.bottom && (!nextHeading || cell.bottom > nextHeading.top))) {
      const cropCell = cropCells.find((candidate) => candidate.top >= targetCell.top - 1 && candidate.bottom <= targetCell.bottom + 1);
      const crop = cropCell && textInRect(items, cropCell);
      const pest = textInRect(items, targetCell);
      const values = fields.map(([left, right]) => {
        const cell = rects.find((candidate) => matchesRect(candidate, left, right) && Math.abs(candidate.top - targetCell.top) < 2 && Math.abs(candidate.bottom - targetCell.bottom) < 2);
        return cell ? textInRect(items, cell) : "";
      });
      if (!crop || !pest || values.some((value) => !value)) continue;
      const record = {
      source: { publisher: "Plant Protection Quarantine and Storage, Government of India", title: "Major Uses of Pesticides", url: SOURCE_URL, published_through: SOURCE_DATE },
      formulation_heading_raw: heading.text,
      crop_raw: crop,
      pest_raw: pest,
      active_ingredient_dose_raw: values[0],
      dose_raw: values[1],
      water_raw: values[2],
      phi_raw: values[3],
      row_raw: `${crop} ${pest} ${values.join(" ")}`,
      confidence: "medium",
      flags: ["vector-grid-extraction", "pilot", "unreviewed-raw-extraction", "not-for-dose-or-target-use"],
      };
      records.set(record.row_raw, record);
    }
  }
  return [...records.values()];
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  execFileSync("curl", ["--fail", "--location", "--retry", "3", "--connect-timeout", "30", "--output", PDF_PATH, SOURCE_URL], { stdio: "inherit" });
  const pdf = readFileSync(PDF_PATH);
  const pages = await extractPages();
  writeFileSync(TEXT_PATH, `${pages.map((page, index) => `--- PDF page ${index + 1} ---\n${page.text}`).join("\n\n")}\n`);

  const records = (await pilotRecords()).map((record, index) => ({ id: `ppqs-insecticide-${String(index + 1).padStart(5, "0")}`, pdf_page: 2, ...record }));

  if (records.length === 0) throw new Error("No usable records were extracted; inspect source.txt before changing parsing rules.");
  writeFileSync(RECORDS_PATH, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`);
  writeFileSync(CATALOG_PATH, `${JSON.stringify(buildCatalog(records), null, 2)}\n`);
  writeFileSync(MANIFEST_PATH, `${JSON.stringify({
    source_url: SOURCE_URL, published_through: SOURCE_DATE, downloaded_file: "source.pdf", sha256: createHash("sha256").update(pdf).digest("hex"),
    extracted_text_file: "source.txt", raw_records_file: "records.ndjson", catalog_file: "catalog.json", pdf_pages: pages.length, records: records.length,
    extraction: { command: "pdfjs-dist text-position and vector-grid extraction", policy: "Pilot import uses page 2 vector cell borders for Abamectin 01.90% EC and Acequinocyl 15% w/v SC. Records remain unreviewed and must not be used for dose or crop-target recommendations until visually reviewed and normalized." },
  }, null, 2)}\n`);
  console.log(`Wrote ${records.length} unreviewed raw evidence rows to ${RECORDS_PATH}`);
}

await main();
