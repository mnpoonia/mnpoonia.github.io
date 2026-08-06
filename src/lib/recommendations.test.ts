import assert from "node:assert/strict";
import test from "node:test";
import { assessKinnowPsylla, recentIracGroups } from "./recommendations";

test("expands prior mixtures into all IRAC groups", () => {
  assert.deepEqual(recentIracGroups(["sml-cypro-profenofos-40-cypermethrin-4-ec", "sml-spike-thiamethoxam-25-wg"]), ["1B", "3A", "4A"]);
});

test("does not suggest an immediate repeat when the population is declining at day four", () => {
  const result = assessKinnowPsylla({
    daysSinceApplication: 4,
    populationTrend: "declining",
    flowering: false,
    waterStress: false,
    priorProductIds: ["sml-spike-thiamethoxam-25-wg"],
  });
  assert.match(result.followUp, /reassess around day 7/);
  assert.deepEqual(result.groupLabels, ["4A (Neonicotinoids)"]);
  assert.equal(result.candidates.find((item) => item.product.id === "pau-imidacloprid-17-8-sl")?.status, "not-preferred");
});
