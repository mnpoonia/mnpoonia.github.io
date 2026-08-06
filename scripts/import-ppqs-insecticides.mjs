#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const SOURCE_URL = "https://ppqs.gov.in/sites/default/files/updated_mup_insecticide_as_on_31.03.2026_c.pdf";
const SOURCE_DATE = "2026-03-31";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIR = resolve(ROOT, "data/source/ppqs/2026-03-31-insecticides");
const PDF_PATH = resolve(OUTPUT_DIR, "source.pdf");
const TEXT_PATH = resolve(OUTPUT_DIR, "source.txt");
const RECORDS_PATH = resolve(OUTPUT_DIR, "records.ndjson");
const MANIFEST_PATH = resolve(OUTPUT_DIR, "manifest.json");
const FORMULATION = /(?:%|g\/l|g\/kg|w\/w|w\/v)\s*(?:EC|SC|SL|WG|WP|GR|OD|CS|FS|SP|EW|DP|SG)\b/i;

function normalize(text) {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function columnText(items, start, end) {
  return normalize(items.filter((item) => item.x >= start && item.x < end).map((item) => item.text).join(" ")) || null;
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

function rawRecord(items, heading) {
  const crop = columnText(items, 35, 145);
  const pest = columnText(items, 145, 255);
  const dose = columnText(items, 325, 405);
  const water = columnText(items, 405, 500);
  const phi = columnText(items, 500, 570);
  const complete = Boolean(heading && crop && pest && dose && water && phi);
  return {
    source: { publisher: "Plant Protection Quarantine and Storage, Government of India", title: "Major Uses of Pesticides", url: SOURCE_URL, published_through: SOURCE_DATE },
    formulation_heading_raw: heading,
    crop_raw: crop,
    pest_raw: pest,
    dose_raw: dose,
    water_raw: water,
    phi_raw: phi,
    row_raw: normalize(items.map((item) => item.text).join(" ")),
    confidence: complete ? "low" : "unusable",
    flags: complete ? ["position-based-table-reconstruction", "unreviewed-raw-extraction"] : ["insufficient-row-signals"],
  };
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  execFileSync("curl", ["--fail", "--location", "--retry", "3", "--connect-timeout", "30", "--output", PDF_PATH, SOURCE_URL], { stdio: "inherit" });
  const pdf = readFileSync(PDF_PATH);
  const pages = await extractPages();
  writeFileSync(TEXT_PATH, `${pages.map((page, index) => `--- PDF page ${index + 1} ---\n${page.text}`).join("\n\n")}\n`);

  const records = [];
  let currentHeading = null;
  // Agricultural insecticide and combination tables are PDF pages 2 through 84 (one-indexed).
  for (let pageIndex = 1; pageIndex < 84; pageIndex += 1) {
    const page = pages[pageIndex];
    for (const line of visualLines(page.items)) {
      const left = columnText(line, 35, 145);
      if (left && FORMULATION.test(left) && !columnText(line, 325, 570)) {
        currentHeading = left;
        continue;
      }
      // A visual baseline is the smallest safe unit: wrapped cells are intentionally not joined.
      const record = rawRecord(line, currentHeading);
      if (record.confidence !== "unusable") records.push({ id: `ppqs-insecticide-${String(records.length + 1).padStart(5, "0")}`, pdf_page: pageIndex + 1, ...record });
    }
  }

  if (records.length === 0) throw new Error("No usable records were extracted; inspect source.txt before changing parsing rules.");
  writeFileSync(RECORDS_PATH, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`);
  writeFileSync(MANIFEST_PATH, `${JSON.stringify({
    source_url: SOURCE_URL, published_through: SOURCE_DATE, downloaded_file: "source.pdf", sha256: createHash("sha256").update(pdf).digest("hex"),
    extracted_text_file: "source.txt", raw_records_file: "records.ndjson", pdf_pages: pages.length, records: records.length,
    extraction: { command: "pdfjs-dist text-position extraction", policy: "Only complete single-baseline cells assigned from fixed PDF table columns are emitted. Wrapped table rows are not merged; all records are low confidence pending visual review." },
  }, null, 2)}\n`);
  console.log(`Wrote ${records.length} low-confidence raw records to ${RECORDS_PATH}`);
}

await main();
