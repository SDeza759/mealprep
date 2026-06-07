// Scratch diagnostic — runs the simulator at 7 target configs and reports which recipes
// have variants that are used at ANY config (KEEP_VARIANTS) vs. those whose variants are
// never selected at any config (FLATTEN_CANDIDATE).
//
// Output: tests/output/variant-multi-config-<timestamp>.json
//
// Runtime: ~30-40s for 7 × 1000-week simulator runs.

const fs = require('fs');
const path = require('path');

const data = require('../data.js');
const algorithm = require('../algorithm.js');
algorithm.initializeData();

const { state, generatePlan } = algorithm;

const CONFIGS = [
  { name: 'current',                cal: 2000, carbs: 175, protein: 200, fat: 55.6 },
  { name: 'high_calorie',           cal: 2500, carbs: 220, protein: 220, fat: 70 },
  { name: 'low_calorie',            cal: 1600, carbs: 140, protein: 160, fat: 50 },
  { name: 'balanced',               cal: 2000, carbs: 200, protein: 150, fat: 70 },
  { name: 'high_fat',               cal: 2000, carbs: 130, protein: 150, fat: 90 },
  { name: 'low_protein',            cal: 2000, carbs: 220, protein: 100, fat: 70 },
  { name: 'high_protein_more_fat',  cal: 2000, carbs: 175, protein: 200, fat: 75 },
];

// label → id mapping for every variant recipe (the meal output exposes label, not id).
const labelToId = {};
data.RECIPES.forEach((r) => {
  if (r.variants && r.variants.length > 0) {
    labelToId[r.name] = {};
    r.variants.forEach((v) => {
      labelToId[r.name][v.label] = v.id;
    });
  }
});

const variantRecipes = data.RECIPES.filter((r) => r.variants && r.variants.length > 0);

// Run a single 1000-week simulator at a config, return per-recipe counts.
function runAtConfig(cfg) {
  state.recipeRotation = { counts: {}, totalSlots: 0 };
  state.solverDiagnostics = [];

  const recipeCounts = {};
  variantRecipes.forEach((r) => {
    recipeCounts[r.name] = { base: 0 };
    r.variants.forEach((v) => { recipeCounts[r.name][v.id] = 0; });
  });

  let totalDays = 0;
  let passDays = 0;
  const recipesSeen = new Set();

  for (let w = 0; w < 1000; w++) {
    const plan = generatePlan(cfg.cal, cfg.carbs, cfg.protein, cfg.fat, {}, [], []);
    plan.forEach((day) => {
      if (!day) return;
      totalDays++;
      const t = day.totals;
      const cp = Math.round((t.calories / cfg.cal) * 100);
      const bp = Math.round((t.carbs / cfg.carbs) * 100);
      const pp = Math.round((t.protein / cfg.protein) * 100);
      const fp = Math.round((t.fat / cfg.fat) * 100);
      if (cp >= 95 && cp <= 105 && bp >= 95 && bp <= 105 && pp >= 95 && pp <= 105 && fp >= 95 && fp <= 105) {
        passDays++;
      }
      day.meals.forEach((meal) => {
        recipesSeen.add(meal.originalName);
        const c = recipeCounts[meal.originalName];
        if (!c) return; // recipe has no variants — we don't track here
        if (meal.variantLabel) {
          const id = labelToId[meal.originalName][meal.variantLabel];
          if (id !== undefined) c[id]++;
        } else {
          c.base++;
        }
      });
    });
  }

  return {
    counts: recipeCounts,
    totalDays,
    passDays,
    passRate: totalDays > 0 ? passDays / totalDays : 0,
    recipesSelected: recipesSeen.size,
  };
}

const results = [];
console.log(`Running ${CONFIGS.length} configs × 1000 weeks (≈${CONFIGS.length * 4}s)...`);
const startedAt = Date.now();

CONFIGS.forEach((cfg, i) => {
  const t0 = Date.now();
  const r = runAtConfig(cfg);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`  [${i + 1}/${CONFIGS.length}] ${cfg.name} ${cfg.cal}/${cfg.carbs}/${cfg.protein}/${cfg.fat} → pass ${r.passDays}/${r.totalDays} (${(r.passRate * 100).toFixed(1)}%), recipes ${r.recipesSelected}/${data.RECIPES.length} [${dt}s]`);
  results.push({ cfg, ...r });
});

console.log(`Total runtime: ${((Date.now() - startedAt) / 1000).toFixed(1)}s\n`);

// === Per-recipe verdict ===
const recipeRows = variantRecipes.map((r) => {
  const totalPicks = { base: 0 };
  r.variants.forEach((v) => { totalPicks[v.id] = 0; });
  const perConfig = {};

  results.forEach(({ cfg, counts }) => {
    const c = counts[r.name];
    perConfig[cfg.name] = { ...c };
    totalPicks.base += c.base;
    r.variants.forEach((v) => { totalPicks[v.id] += c[v.id]; });
  });

  // Verdict logic
  let verdict, verdictReason;
  if (totalPicks.base > 0) {
    verdict = 'KEEP_VARIANTS';
    const configsWithBase = results.filter(({ cfg, counts }) => counts[r.name].base > 0).map(({ cfg }) => cfg.name);
    verdictReason = `base picked ${totalPicks.base} times across configs: ${configsWithBase.join(', ')}`;
  } else {
    const variantsWithPicks = r.variants.filter((v) => totalPicks[v.id] > 0).map((v) => v.id);
    if (variantsWithPicks.length === 0) {
      verdict = 'KEEP_VARIANTS';
      verdictReason = 'recipe never selected at any config (no data to flatten on)';
    } else if (variantsWithPicks.length === 1) {
      verdict = 'FLATTEN_CANDIDATE';
      verdictReason = `single dominant variant "${variantsWithPicks[0]}" picked at every config`;
    } else {
      verdict = 'KEEP_VARIANTS';
      // Find which configs picked which variant
      const variantToConfigs = {};
      variantsWithPicks.forEach((vId) => {
        variantToConfigs[vId] = results.filter(({ cfg, counts }) => counts[r.name][vId] > 0).map(({ cfg }) => cfg.name);
      });
      const reasons = Object.entries(variantToConfigs).map(([vId, cfgs]) => `"${vId}" at ${cfgs.join('/')}`).join(' | ');
      verdictReason = `multiple variants picked across configs: ${reasons}`;
    }
  }

  return { name: r.name, variantCount: r.variants.length, verdict, verdictReason, totalPicks, perConfig };
});

// === Output JSON ===
const ts = new Date();
const pad = (n) => String(n).padStart(2, '0');
const tsStr = `${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}-${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}`;
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
const outputFile = path.join(outputDir, `variant-multi-config-${tsStr}.json`);

const flattenCandidates = recipeRows.filter((r) => r.verdict === 'FLATTEN_CANDIDATE').map((r) => r.name);
const keepVariants = recipeRows.filter((r) => r.verdict === 'KEEP_VARIANTS').map((r) => r.name);

const out = {
  timestamp: ts.toISOString(),
  configs: results.map(({ cfg, passRate, recipesSelected, totalDays, passDays }) => ({
    name: cfg.name,
    targets: { cal: cfg.cal, carbs: cfg.carbs, protein: cfg.protein, fat: cfg.fat },
    totalDays,
    passDays,
    passRate: Math.round(passRate * 10000) / 10000,
    recipesSelected,
  })),
  recipes: recipeRows,
  summary: {
    totalVariantRecipes: variantRecipes.length,
    flattenCandidates,
    keepVariants,
  },
};

fs.writeFileSync(outputFile, JSON.stringify(out, null, 2));

// === Stdout summary ===
console.log('Multi-config variant analysis');
console.log(`Configs tested: ${CONFIGS.length} (${CONFIGS.map((c) => c.name).join(', ')})`);
console.log(`Total variant recipes analyzed: ${variantRecipes.length}\n`);

console.log(`FLATTEN_CANDIDATE: ${flattenCandidates.length} recipes (variants never used across any config)`);
console.log(`KEEP_VARIANTS:     ${keepVariants.length} recipes (variants matter at least once)\n`);

console.log('--- FLATTEN_CANDIDATE ---');
recipeRows.filter((r) => r.verdict === 'FLATTEN_CANDIDATE').forEach((r) => {
  const dominant = Object.entries(r.totalPicks).find(([k, v]) => k !== 'base' && v > 0);
  console.log(`  ${r.name}  → dominant: "${dominant ? dominant[0] : '?'}" (${dominant ? dominant[1] : 0} picks total)`);
});

console.log('\n--- KEEP_VARIANTS ---');
recipeRows.filter((r) => r.verdict === 'KEEP_VARIANTS').forEach((r) => {
  console.log(`  ${r.name}  → ${r.verdictReason}`);
});

console.log('\n--- Pass rate per config ---');
results.forEach(({ cfg, passRate, totalDays, passDays }) => {
  const flag = passRate < 0.99 ? '  ⚠ BELOW 99%' : '';
  console.log(`  ${cfg.name.padEnd(24)} ${passDays}/${totalDays}  (${(passRate * 100).toFixed(2)}%)${flag}`);
});

console.log('\n--- Recipes selected per config ---');
results.forEach(({ cfg, recipesSelected }) => {
  const flag = recipesSelected < 130 ? '  ⚠ BELOW 130' : '';
  console.log(`  ${cfg.name.padEnd(24)} ${recipesSelected}/${data.RECIPES.length}${flag}`);
});

console.log(`\nOutput: ${outputFile}`);
