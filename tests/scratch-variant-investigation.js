// Scratch diagnostic — DOES NOT PRODUCE PERSISTENT OUTPUT.
// Runs a 1000-week simulator and reports the base-vs-variant selection split for every
// recipe in the corpus. Used for Prompt 18 diagnostic.

const data = require('../data.js');
const algorithm = require('../algorithm.js');

algorithm.initializeData();

const { state, generatePlan } = algorithm;
const TARGETS = { cal: 2000, carbs: 175, protein: 200, fat: 55.6 };

// Reset state once (matches browser run pattern).
state.recipeRotation = { counts: {}, totalSlots: 0 };
state.solverDiagnostics = [];

// Aggregator: counts[recipeName] = { base: 0, byVariant: { label: count, ... } }
const counts = {};
data.RECIPES.forEach((r) => {
  counts[r.name] = { base: 0, byVariant: {}, variantList: r.variants ? r.variants.map(v => v.label) : [] };
});

const TOTAL_WEEKS = 1000;
for (let w = 0; w < TOTAL_WEEKS; w++) {
  const plan = generatePlan(TARGETS.cal, TARGETS.carbs, TARGETS.protein, TARGETS.fat, {}, [], []);
  plan.forEach((day) => {
    if (!day) return;
    day.meals.forEach((meal) => {
      const c = counts[meal.originalName];
      if (!c) return;
      if (meal.variantLabel) {
        c.byVariant[meal.variantLabel] = (c.byVariant[meal.variantLabel] || 0) + 1;
      } else {
        c.base++;
      }
    });
  });
}

// Report sections.
function pct(n, total) { return total > 0 ? ((n / total) * 100).toFixed(1) + '%' : '0.0%'; }

function summarize(name) {
  const c = counts[name];
  const totalVar = Object.values(c.byVariant).reduce((a, b) => a + b, 0);
  const total = c.base + totalVar;
  return { name, base: c.base, byVariant: c.byVariant, total, variantList: c.variantList };
}

// === Q1: Recipes with variants — base vs variant breakdown ===
console.log('=== Q1: Recipes with variants — base vs variant ===\n');
console.log('Recipe                                        | Variants | Base | Variant total | Base %');
console.log('----------------------------------------------|----------|------|---------------|--------');
const withVariants = data.RECIPES.filter((r) => r.variants && r.variants.length > 0);
let zeroBaseCount = 0;
let nonzeroBaseCount = 0;
withVariants.forEach((r) => {
  const s = summarize(r.name);
  const variantTotal = Object.values(s.byVariant).reduce((a, b) => a + b, 0);
  if (s.base === 0) zeroBaseCount++;
  else nonzeroBaseCount++;
  const padded = (r.name + '                                              ').slice(0, 46);
  console.log(`${padded}| ${String(r.variants.length).padStart(8)} | ${String(s.base).padStart(4)} | ${String(variantTotal).padStart(13)} | ${pct(s.base, s.total).padStart(6)}`);
});
console.log(`\nVariant recipes with base count > 0: ${nonzeroBaseCount}`);
console.log(`Variant recipes with base count = 0: ${zeroBaseCount}`);
console.log(`Total variant recipes:                ${withVariants.length}`);

// === Q2: Multi-variant recipes — selection split between variants ===
console.log('\n\n=== Q2: Recipes with 2+ variants — variant-vs-variant split ===\n');
const multiVariant = withVariants.filter((r) => r.variants.length >= 2);
if (multiVariant.length === 0) {
  console.log('(none — every variant recipe has exactly 1 variant)');
} else {
  multiVariant.forEach((r) => {
    const s = summarize(r.name);
    console.log(`\n${r.name}  (${r.variants.length} variants)`);
    console.log(`  base picks: ${s.base} (${pct(s.base, s.total)})`);
    s.variantList.forEach((label) => {
      const ct = s.byVariant[label] || 0;
      console.log(`  variant "${label}": ${ct} (${pct(ct, s.total)})`);
    });
  });
}

// === Q3: Recipes without variants — sanity check ===
console.log('\n\n=== Q3: Recipes WITHOUT variants — base picks (sanity) ===\n');
const withoutVariants = data.RECIPES.filter((r) => !r.variants || r.variants.length === 0);
let q3Anomaly = 0;
withoutVariants.forEach((r) => {
  const s = summarize(r.name);
  const variantTotal = Object.values(s.byVariant).reduce((a, b) => a + b, 0);
  if (variantTotal > 0) {
    q3Anomaly++;
    console.log(`  ANOMALY: ${r.name} has variant-labeled selections (${variantTotal}) despite no variants array`);
  }
});
console.log(`\nTotal recipes without variants: ${withoutVariants.length}`);
console.log(`Anomalies (variant-labeled but no variants array): ${q3Anomaly}`);

// === Task C: Chicken-breast / chicken-thigh variant pairs ===
console.log('\n\n=== Task C: Chicken Breast vs Chicken Thigh variant pairs ===\n');
const isChickenVariantRecipe = (r) => {
  if (!r.variants || r.variants.length === 0) return false;
  const baseHasChicken = r.ingredients.some(i => i.name === 'Chicken Breast' || i.name === 'Chicken Thigh');
  const variantHasChicken = r.variants.some(v =>
    v.ingredients.some(i => i.name === 'Chicken Breast' || i.name === 'Chicken Thigh')
  );
  return baseHasChicken && variantHasChicken;
};
const chickenRecipes = data.RECIPES.filter(isChickenVariantRecipe);

const groupBaseBreast = []; // base = breast, variant = thigh
const groupBaseThigh = [];  // base = thigh, variant = breast

chickenRecipes.forEach((r) => {
  const baseProtein = r.ingredients.find(i => i.name === 'Chicken Breast' || i.name === 'Chicken Thigh');
  if (!baseProtein) return;
  if (baseProtein.name === 'Chicken Breast') groupBaseBreast.push(r);
  else groupBaseThigh.push(r);
});

console.log(`\nGroup 1: base = Chicken Breast, variant = Chicken Thigh  (${groupBaseBreast.length} recipes)`);
console.log('Recipe                                  | Base picks | Variant picks | Base %');
console.log('----------------------------------------|------------|---------------|--------');
groupBaseBreast.forEach((r) => {
  const s = summarize(r.name);
  const vt = Object.values(s.byVariant).reduce((a, b) => a + b, 0);
  const padded = (r.name + '                                                ').slice(0, 40);
  console.log(`${padded}| ${String(s.base).padStart(10)} | ${String(vt).padStart(13)} | ${pct(s.base, s.total).padStart(6)}`);
});

console.log(`\nGroup 2: base = Chicken Thigh, variant = Chicken Breast  (${groupBaseThigh.length} recipes)`);
console.log('Recipe                                  | Base picks | Variant picks | Base %');
console.log('----------------------------------------|------------|---------------|--------');
groupBaseThigh.forEach((r) => {
  const s = summarize(r.name);
  const vt = Object.values(s.byVariant).reduce((a, b) => a + b, 0);
  const padded = (r.name + '                                                ').slice(0, 40);
  console.log(`${padded}| ${String(s.base).padStart(10)} | ${String(vt).padStart(13)} | ${pct(s.base, s.total).padStart(6)}`);
});

// === Task D: Shawarma Bowl deep dive ===
console.log('\n\n=== Task D: Shawarma Bowl variant distribution ===\n');
const shawarma = data.RECIPES.find(r => r.name === 'Shawarma Bowl');
if (shawarma) {
  const s = summarize('Shawarma Bowl');
  console.log('Base ingredients:', shawarma.ingredients.filter(i=>!i.isSpice).map(i=>i.name).join(', '));
  console.log('Base totalMacros:', JSON.stringify(shawarma.totalMacros));
  console.log();
  console.log(`Base (Chicken Thigh + Yogurt): ${s.base} picks (${pct(s.base, s.total)})`);
  shawarma.variants.forEach(v => {
    const ct = s.byVariant[v.label] || 0;
    console.log(`Variant "${v.label}": ${ct} picks (${pct(ct, s.total)})`);
    console.log(`  ingredients:`, v.ingredients.filter(i=>!i.isSpice).map(i=>i.name).join(', '));
    console.log(`  totalMacros:`, JSON.stringify(v.totalMacros));
  });
  console.log(`\nTotal Shawarma Bowl selections: ${s.total}`);
}
