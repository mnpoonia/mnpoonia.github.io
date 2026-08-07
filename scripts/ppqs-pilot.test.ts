import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const records = readFileSync("data/source/ppqs/2026-03-31-insecticides/records.ndjson", "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));
const catalog = JSON.parse(readFileSync("data/source/ppqs/2026-03-31-insecticides/catalog.json", "utf8"));

test("PPQS page 2 grid pilot produces two formulations and five crop-target rows", () => {
  assert.equal(records.length, 5);
  assert.deepEqual([...new Set(records.map((record) => record.formulation_heading_raw))], ["Abamectin 01.90 % EC", "Acequinocyl 15% w/v SC"]);

  const abamectin = records.filter((record) => record.formulation_heading_raw === "Abamectin 01.90 % EC");
  assert.deepEqual(abamectin.map((record) => record.crop_raw), ["Rose(Ornamental)", "Grapes", "Apple", "Tomato"]);
  assert.deepEqual(abamectin.map((record) => record.active_ingredient_dose_raw), ["0.00048- 0.00096%", "0.014/L", "0.00095%", "8.6 – 11.4"]);
  assert.equal(abamectin[1].dose_raw, "0.75 ml/L water");
  assert.equal(abamectin[2].water_raw, "6-7 litre water/ tree");
});

test("PPQS pilot creates separate catalogs linked by formulation-crop-target uses", () => {
  assert.equal(catalog.formulations.length, 2);
  assert.equal(catalog.crops.length, 5);
  assert.equal(catalog.targets.length, 5);
  assert.equal(catalog.uses.length, 5);
  assert.ok(catalog.uses.every((use: { formulationId: string; cropId: string; targetId: string }) => use.formulationId && use.cropId && use.targetId));
});
