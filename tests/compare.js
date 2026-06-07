// compare.js — diff two simulator outputs (baseline vs experiment).
// No simulator logic here; only diffing of the JSON structures simulator.js produces.

function compare(baseline, experiment, opts) {
  const result = {
    mode: 'compare',
    timestamp: new Date().toISOString(),
    baselineFile: opts.baselineFile,
    experimentFile: opts.experimentFile,
    baselineTargets: baseline.targets,
    experimentTargets: experiment.targets,
    passRate: {
      baseline: baseline.passRate,
      experiment: experiment.passRate,
      delta: round4(experiment.passRate - baseline.passRate),
    },
    recipeFrequencyDelta: [],
    newlyMissingRecipes: [],
    newlyAppearingRecipes: [],
    variantDistributionDeltas: [],
    cuisineDistributionDelta: [],
    ingredientFrequencyDelta: [],
    summary: {},
  };

  // ===== RECIPE FREQUENCY DELTA =====
  const baseRecipes = new Map(baseline.recipeFrequency.map((r) => [r.name, r]));
  const expRecipes = new Map(experiment.recipeFrequency.map((r) => [r.name, r]));
  const allRecipeNames = new Set([...baseRecipes.keys(), ...expRecipes.keys()]);

  const recipeDeltas = [];
  for (const name of allRecipeNames) {
    const b = baseRecipes.get(name);
    const e = expRecipes.get(name);
    const baseCount = b ? b.count : 0;
    const expCount = e ? e.count : 0;
    const delta = expCount - baseCount;
    let deltaPct;
    if (baseCount > 0) {
      deltaPct = round1((delta / baseCount) * 100);
    } else if (expCount > 0) {
      deltaPct = null; // appeared from zero — undefined ratio
    } else {
      deltaPct = 0;
    }
    recipeDeltas.push({ name, baseline: baseCount, experiment: expCount, delta, deltaPct });

    // "Newly missing" = was selected in baseline, count went to zero in experiment
    if (baseCount > 0 && expCount === 0) result.newlyMissingRecipes.push(name);
    if (baseCount === 0 && expCount > 0) result.newlyAppearingRecipes.push(name);
  }

  // Sort: largest |deltaPct| first, then name asc as tiebreaker.
  // null deltaPct (appeared from zero) sorts to the top.
  recipeDeltas.sort((a, b) => {
    const aw = a.deltaPct === null ? Infinity : Math.abs(a.deltaPct);
    const bw = b.deltaPct === null ? Infinity : Math.abs(b.deltaPct);
    if (bw !== aw) return bw - aw;
    return a.name.localeCompare(b.name);
  });
  result.recipeFrequencyDelta = recipeDeltas;

  result.newlyMissingRecipes.sort();
  result.newlyAppearingRecipes.sort();

  // ===== VARIANT DISTRIBUTION DELTAS =====
  // Only include recipes where any variant moved by >=5% of that recipe's total picks.
  const baseVariants = new Map(baseline.variantDistribution.map((v) => [v.recipe, v]));
  const expVariants = new Map(experiment.variantDistribution.map((v) => [v.recipe, v]));
  const allVariantRecipes = new Set([...baseVariants.keys(), ...expVariants.keys()]);

  for (const recipe of allVariantRecipes) {
    const bv = baseVariants.get(recipe);
    const ev = expVariants.get(recipe);
    const bMap = new Map((bv ? bv.variants : []).map((v) => [v.label, v]));
    const eMap = new Map((ev ? ev.variants : []).map((v) => [v.label, v]));
    const labels = new Set([...bMap.keys(), ...eMap.keys()]);

    const baseTotal = (bv ? bv.variants : []).reduce((a, v) => a + v.count, 0);
    const expTotal = (ev ? ev.variants : []).reduce((a, v) => a + v.count, 0);
    const total = Math.max(baseTotal, expTotal, 1);

    const variantDeltas = [];
    let maxAbsRatio = 0;
    for (const label of labels) {
      const b = bMap.get(label);
      const e = eMap.get(label);
      const bc = b ? b.count : null;
      const ec = e ? e.count : null;
      const delta = (ec || 0) - (bc || 0);
      const ratio = Math.abs(delta) / total;
      if (ratio > maxAbsRatio) maxAbsRatio = ratio;
      variantDeltas.push({ label, baseline: bc, experiment: ec, delta });
    }

    if (maxAbsRatio >= 0.05) {
      // Sort variants alphabetically by label for stable output.
      variantDeltas.sort((a, b) => a.label.localeCompare(b.label));
      result.variantDistributionDeltas.push({ recipe, variants: variantDeltas });
    }
  }
  result.variantDistributionDeltas.sort((a, b) => a.recipe.localeCompare(b.recipe));

  // ===== CUISINE DISTRIBUTION DELTA =====
  // Only include cuisines whose share moved by >0.5%.
  const baseCuisines = new Map(baseline.cuisineDistribution.map((c) => [c.cuisine, c.percentage]));
  const expCuisines = new Map(experiment.cuisineDistribution.map((c) => [c.cuisine, c.percentage]));
  const allCuisines = new Set([...baseCuisines.keys(), ...expCuisines.keys()]);

  for (const cuisine of allCuisines) {
    const b = baseCuisines.get(cuisine) || 0;
    const e = expCuisines.get(cuisine) || 0;
    const delta = e - b;
    if (Math.abs(delta) > 0.005) {
      result.cuisineDistributionDelta.push({
        cuisine,
        baseline: round4(b),
        experiment: round4(e),
        delta: round4(delta),
      });
    }
  }
  result.cuisineDistributionDelta.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  // ===== INGREDIENT FREQUENCY DELTA =====
  const baseIngs = new Map(baseline.ingredientFrequency.map((i) => [i.name, i.count]));
  const expIngs = new Map(experiment.ingredientFrequency.map((i) => [i.name, i.count]));
  const allIngs = new Set([...baseIngs.keys(), ...expIngs.keys()]);
  for (const ing of allIngs) {
    const b = baseIngs.get(ing) || 0;
    const e = expIngs.get(ing) || 0;
    const delta = e - b;
    if (delta !== 0) {
      result.ingredientFrequencyDelta.push({ name: ing, baseline: b, experiment: e, delta });
    }
  }
  result.ingredientFrequencyDelta.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  // ===== SUMMARY =====
  const baseRatePct = round1(baseline.passRate * 100);
  const expRatePct = round1(experiment.passRate * 100);

  // Top recipe mover: largest |delta| where delta != 0. recipeDeltas is already sorted that way,
  // but the head can be a deltaPct=null entry (appeared from zero) — still valid.
  const topNonzero = recipeDeltas.find((r) => r.delta !== 0);

  // Second-order effects: recipes that moved >10% in either direction (excluding top mover).
  // Limit to 5 entries to keep summary readable.
  const secondOrder = recipeDeltas
    .filter((r) => r.deltaPct !== null && Math.abs(r.deltaPct) > 10)
    .filter((r) => !topNonzero || r.name !== topNonzero.name)
    .slice(0, 5)
    .map((r) => `${r.name}: ${signed(r.delta)} (${signedPct(r.deltaPct)}%)`);

  result.summary = {
    passRateChange: `${baseRatePct}% → ${expRatePct}%`,
    topRecipeMover: topNonzero
      ? {
          name: topNonzero.name,
          delta: `${signed(topNonzero.delta)} (${
            topNonzero.deltaPct === null ? 'new' : signedPct(topNonzero.deltaPct) + '%'
          })`,
        }
      : null,
    secondOrderEffects: secondOrder,
  };

  return result;
}

function formatSummary(diff, baselineJSON, experimentJSON, filename) {
  const bc = baselineJSON.passCount;
  const bd = baselineJSON.totalDays;
  const ec = experimentJSON.passCount;
  const ed = experimentJSON.totalDays;
  const bRate = round1(diff.passRate.baseline * 100);
  const eRate = round1(diff.passRate.experiment * 100);
  const dRate = round1(diff.passRate.delta * 100);

  let s = `Compare: baseline ${bc}/${bd} (${bRate}%) → experiment ${ec}/${ed} (${eRate}%) | Δ ${signedPct(dRate)}%`;

  const top = diff.summary.topRecipeMover;
  if (top) {
    // Look up the actual baseline/experiment counts for a richer display.
    const entry = diff.recipeFrequencyDelta.find((r) => r.name === top.name);
    if (entry) {
      const pctStr =
        entry.deltaPct === null ? 'new' : `${signedPct(entry.deltaPct)}%`;
      s += `\nTop mover: ${entry.name} ${entry.baseline} → ${entry.experiment} (${signed(entry.delta)}, ${pctStr})`;
    }
  } else {
    s += `\nTop mover: none — no recipes changed selection count`;
  }

  // Second-order: top 3 movers (>10% absolute) excluding the top one.
  const second = diff.recipeFrequencyDelta
    .filter((r) => r.deltaPct !== null && Math.abs(r.deltaPct) > 10)
    .filter((r) => !top || r.name !== top.name)
    .slice(0, 3);
  if (second.length > 0) {
    s += `\nSecond-order: ` + second.map((r) => `${r.name} ${signedPct(r.deltaPct)}%`).join(', ');
  }

  if (diff.newlyMissingRecipes.length > 0) {
    s += `\nNewly missing: ${diff.newlyMissingRecipes.join(', ')}`;
  }
  if (diff.newlyAppearingRecipes.length > 0) {
    s += `\nNewly appearing: ${diff.newlyAppearingRecipes.join(', ')}`;
  }

  s += `\nOutput: ${filename}`;

  if (diff.passRate.delta < -0.01) {
    const dropPp = Math.abs(round1(diff.passRate.delta * 100));
    s += `\nWARNING: pass rate dropped ${dropPp} percentage points. Experimental change may have introduced regressions.`;
  }

  return s;
}

// ---- helpers ----

function round1(n) {
  return Math.round(n * 10) / 10;
}

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

function signed(n) {
  if (n > 0) return '+' + n;
  return String(n);
}

function signedPct(n) {
  if (n === null || n === undefined) return 'n/a';
  if (n > 0) return '+' + n;
  return String(n);
}

module.exports = { compare, formatSummary };
