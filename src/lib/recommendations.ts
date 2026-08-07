import { ingredientFor, iracGroupLabel, products, type Product } from "../data/crop-protection";

export interface AssessmentInput {
  daysSinceApplication: number;
  populationTrend: "declining" | "stable" | "increasing";
  flowering: boolean;
  waterStress: boolean;
  priorProductIds: string[];
}

export interface CandidateResult {
  product: Product;
  status: "not-now" | "conditional" | "not-preferred";
  reason: string;
}

export function recentIracGroups(productIds: string[]) {
  return [...new Set(productIds.flatMap((id) => {
    const product = products.find((item) => item.id === id);
    return product ? product.components.map((component) => ingredientFor(component.ingredientId).iracGroup).filter((group): group is string => Boolean(group)) : [];
  }))] as string[];
}

export function assessKinnowPsylla(input: AssessmentInput) {
  const groups = recentIracGroups(input.priorProductIds);
  const followUp = input.daysSinceApplication <= 4 && input.populationTrend === "declining"
    ? "The reported population is declining only a few days after treatment. Record comparable counts now and reassess around day 7; this is an assessment date, not an automatic spray date."
    : "Use comparable scouting counts, confirmed pest stages, and the current container labels before deciding whether another application is needed.";

  const candidates: CandidateResult[] = products
    .filter((product) => product.id !== "sml-cypro-profenofos-40-cypermethrin-4-ec")
    .map((product) => {
      const candidateGroups = product.components.map((component) => ingredientFor(component.ingredientId).iracGroup).filter((group): group is string => Boolean(group));
      if (candidateGroups.some((group) => groups.includes(group))) {
        return { product, status: "not-preferred", reason: `It repeats recent IRAC group ${candidateGroups.filter((group) => groups.includes(group)).join(", ")} exposure.` };
      }
      const isOil = product.formulationId === "horticultural-mineral-oil";
      if (isOil && (input.flowering || input.waterStress)) {
        return { product, status: "conditional", reason: "Oil-based options require crop-condition and label checks; PAU warns against oil sprays during flowering and water stress." };
      }
      return { product, status: "conditional", reason: "A PAU option, but no fixed retreatment interval was verified. Confirm the current label, crop condition, and application history." };
    });

  return { groups, groupLabels: groups.map(iracGroupLabel), followUp, candidates };
}
