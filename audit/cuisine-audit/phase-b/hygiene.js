#!/usr/bin/env node
// Post-merge data hygiene sweep. Read-only — reports, never edits.
// Usage: node audit/cuisine-audit/phase-b/hygiene.js

const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "../../..");

const g = {};
new Function("g", fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/^var /gm, "g.") + "\n")(g);
const { INGREDIENT_REGISTRY, RECIPES, RECIPE_SPICE_OVERRIDES, RECIPE_COOKING_DATA, INGREDIENT_CATEGORIES } = g;

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const meatBlock = html.match(/var MEAT_INGREDIENTS = new Set\(\[([\s\S]*?)\]\)/)[1];
const MEAT = new Set([...meatBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]));

let fails = 0;
const section = (t) => console.log("\n\x1b[1m" + t + "\x1b[0m");
const ok = (m) => console.log("  \x1b[32mok\x1b[0m   " + m);
const bad = (m) => {
  fails++;
  console.log("  \x1b[31mFAIL\x1b[0m " + m);
};
const note = (m) => console.log("  \x1b[33mnote\x1b[0m " + m);

// ---------------------------------------------------------------- shape
section("Shape");
console.log(`  recipes=${RECIPES.length}  registry=${Object.keys(INGREDIENT_REGISTRY).length} ` +
  `spiceRows=${Object.keys(RECIPE_SPICE_OVERRIDES).length} cookingRows=${Object.keys(RECIPE_COOKING_DATA).length}`);
const names = RECIPES.map((r) => r.name);
const dupNames = names.filter((n, i) => names.indexOf(n) !== i);
dupNames.length ? bad(`duplicate recipe names: ${[...new Set(dupNames)].join(", ")}`) : ok("recipe names unique");
const nameSet = new Set(names);
const orphanCook = Object.keys(RECIPE_COOKING_DATA).filter((k) => !nameSet.has(k));
const orphanSpice = Object.keys(RECIPE_SPICE_OVERRIDES).filter((k) => !nameSet.has(k));
orphanCook.length ? bad(`RECIPE_COOKING_DATA keys with no recipe: ${orphanCook.join(", ")}`) : ok("no orphan cooking rows");
orphanSpice.length ? bad(`RECIPE_SPICE_OVERRIDES keys with no recipe: ${orphanSpice.join(", ")}`) : ok("no orphan spice rows");
const missCook = names.filter((n) => !RECIPE_COOKING_DATA[n]);
missCook.length ? bad(`recipes with no cooking data: ${missCook.join(", ")}`) : ok("every recipe has cooking data");

const cuisines = {};
RECIPES.forEach((r) => (cuisines[r.cuisine] = (cuisines[r.cuisine] || 0) + 1));
console.log("  cuisines: " + Object.entries(cuisines).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(" "));

// ---------------------------------------------------------------- names resolve
section("Name resolution");
let badIng = [];
RECIPES.forEach((r) =>
  r.ingredients.forEach((i) => {
    if (!INGREDIENT_REGISTRY[i.name]) badIng.push(`${r.name} -> "${i.name}"`);
    if (!(i.grams > 0)) badIng.push(`${r.name} -> "${i.name}" grams=${i.grams}`);
  })
);
badIng.length ? badIng.forEach((b) => bad("unresolved ingredient: " + b)) : ok("every recipe ingredient resolves to the registry");

const spiceNames = new Set();
Object.values(RECIPE_SPICE_OVERRIDES).forEach((a) => a.forEach((s) => spiceNames.add(s.name)));
const spiceNoCat = [...spiceNames].filter((s) => !INGREDIENT_CATEGORIES[s]);
spiceNoCat.length ? bad(`spice names with no grocery category (land in "Other"): ${spiceNoCat.join(", ")}`)
                  : ok("every spice name has a grocery category");
const regNoCat = Object.keys(INGREDIENT_REGISTRY).filter((k) => !INGREDIENT_CATEGORIES[k]);
regNoCat.length ? note(`registry entries with no category: ${regNoCat.join(", ")}`) : ok("every registry entry has a category");

// ---------------------------------------------------------------- orphans
section("Orphans");
const usedIng = new Set();
RECIPES.forEach((r) => r.ingredients.forEach((i) => usedIng.add(i.name)));
const orphans = Object.keys(INGREDIENT_REGISTRY).filter((k) => !usedIng.has(k) && !spiceNames.has(k));
orphans.length ? bad(`registry entries no recipe or spice row references: ${orphans.join(", ")}`)
               : ok("no orphan registry entries");
const viaSpice = Object.keys(INGREDIENT_REGISTRY).filter((k) => !usedIng.has(k) && spiceNames.has(k));
if (viaSpice.length) note(`registry entries reached only via spice rows (expected): ${viaSpice.join(", ")}`);

// ---------------------------------------------------------------- steps vs ingredients
section("Steps vs ingredients");
const stem = (n) => n.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z ]/g, " ").trim();
let unnamed = [], phantomOil = [], numbered = [];
RECIPES.forEach((r) => {
  const cd = RECIPE_COOKING_DATA[r.name];
  if (!cd) return;
  const blob = cd.steps.join(" ").toLowerCase();
  r.ingredients.forEach((i) => {
    const s = stem(i.name);
    const words = s.split(" ").filter((w) => w.length > 3);
    if (!blob.includes(s) && !words.some((w) => blob.includes(w.replace(/e?s$/, "")))) unnamed.push(`${r.name} -> "${i.name}"`);
  });
  const fats = ["Olive Oil", "Vegetable Oil", "Sesame Oil", "Butter", "Palm Oil (Dendê)", "Bacon", "Pork Belly", "Mayonnaise", "Tahini", "Coconut Milk", "Duck Leg", "Duck Breast"];
  const hasFat = r.ingredients.some((i) => fats.includes(i.name));
  if (/\b(heat|warm|add)\s+(the\s+)?(oil|olive oil|vegetable oil|sesame oil|butter)\b/.test(blob) && !hasFat)
    phantomOil.push(r.name);
  cd.steps.forEach((s, i) => { if (/^\s*(\d+[.)]|step\s*\d)/i.test(s)) numbered.push(`${r.name} step ${i + 1}`); });
});
unnamed.length ? unnamed.forEach((u) => bad("ingredient never named in steps: " + u)) : ok("every ingredient is named in its steps");

// A step naming a spice the recipe does not carry is the same phantom-ingredient bug, one level down.
// Skip names that are ordinary cooking English ("add water", "season with salt") or that collide with
// a registry ingredient of the same word, which would drown the signal in false positives.
const SKIP = new Set(["Water", "Sugar", "Corn", "Flour", "Butter", "Basil", "Mint", "Ginger", "Orange",
  "Lime", "Lemon", "Garlic", "Onion", "Tomato", "Adobo", "Bay Leaf", "Bay Leaves", "Dill", "Parsley"]);
const VOCAB = [...new Set([...spiceNames, ...Object.keys(INGREDIENT_CATEGORIES)])].filter((n) => !SKIP.has(n));
const phantomSpice = [];
RECIPES.forEach((r) => {
  const cd = RECIPE_COOKING_DATA[r.name];
  if (!cd) return;
  const blob = " " + cd.steps.join(" ").toLowerCase() + " ";
  const have = new Set([...(RECIPE_SPICE_OVERRIDES[r.name] || []).map((s) => s.name), ...r.ingredients.map((i) => i.name)]);
  const haveStems = [...have].map((n) => n.toLowerCase().replace(/\s*\(.*?\)/g, ""));
  VOCAB.forEach((v) => {
    if (have.has(v)) return;
    const needle = v.toLowerCase().replace(/\s*\(.*?\)/g, "");
    if (needle.length < 5) return;
    // "Potato" inside "sweet potato", "Paprika" inside "smoked paprika", "Ground Beef (lean)" vs
    // "Ground Beef (80% lean)" — if the recipe carries an overlapping name, the step is covered.
    if (haveStems.some((h) => h.includes(needle) || needle.includes(h))) return;
    if (new RegExp(`(^|[^a-z])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z])`).test(blob))
      phantomSpice.push(`${r.name} -> step names "${v}" but the recipe does not carry it`);
  });
});
phantomSpice.length ? phantomSpice.forEach((p) => bad("phantom seasoning: " + p)) : ok("no step names a seasoning the recipe lacks");
phantomOil.length ? phantomOil.forEach((p) => bad("steps cook in a fat that is not an ingredient: " + p))
                  : ok("no phantom cooking fat");
numbered.length ? numbered.forEach((n) => bad("numbered step prefix: " + n)) : ok("no numbered step prefixes");

// ---------------------------------------------------------------- the 27 data bugs
section("Phase A data bugs");
// The bug signature is a whole 2+ cups of liquid against a solver-shrunk gram amount. The
// lookbehind keeps mixed fractions out — "1 1/4 cups" must not match on its trailing "4 cups".
// In a soup or a noodle-soup bowl the broth IS the dish, so cups of liquid are correct there and
// only non-soups get failed. The original bug was 2-3 cups against a solver-shrunk gram amount in a
// dish that was never meant to be brothy.
const isSoup = (name) => {
  const r = RECIPES.find((x) => x.name === name);
  return /soup|stew|pho|ramen|jjigae|broth|chowder|bisque/i.test(name) || /cup/i.test((r && r.servingSize) || "");
};
const measured = [], soupy = [];
Object.entries(RECIPE_COOKING_DATA).forEach(([k, v]) => {
  const hits = [...v.steps.join(" ").matchAll(/(?<![\d/.])(\d+(?:\.\d+)?)\s*(cups?|liters?|litres?|quarts?)\b/gi)]
    .filter((m) => parseFloat(m[1]) >= 2)
    .map((m) => m[0]);
  if (hits.length) (isSoup(k) ? soupy : measured).push(`${k} — ${[...new Set(hits)].join(", ")}`);
});
measured.length ? measured.forEach((m) => bad("hard-coded cooking liquid: " + m))
                : ok("no hard-coded multi-cup liquid outside soups");
soupy.forEach((m) => note("cups of liquid in a soup (expected, the broth is the dish): " + m));

const namedAfter = [
  ["Spaghetti alle Vongole", "Clams"], ["Thai Basil Chicken", "Basil"],
  ["Stuffed Grape Leaves", "Grape Leaves"], ["Picanha with Farofa", "Cassava Flour"],
];
namedAfter.forEach(([rn, ing]) => {
  const r = RECIPES.find((x) => x.name === rn);
  if (!r) return note(`"${rn}" no longer exists (renamed?) — check its replacement carries ${ing}`);
  r.ingredients.some((i) => i.name === ing) ? ok(`${rn} contains ${ing}`) : bad(`${rn} still lacks ${ing}`);
});

// ---------------------------------------------------------------- spices
section("Spices");
const noSpice = RECIPES.filter((r) => !RECIPE_SPICE_OVERRIDES[r.name] && !r.tags.includes("breakfast"));
noSpice.length ? noSpice.forEach((r) => note(`savory recipe with no spice row: ${r.name}`)) : ok("every savory recipe has spices");
const thin = Object.entries(RECIPE_SPICE_OVERRIDES).filter(([k, v]) => {
  const r = RECIPES.find((x) => x.name === k);
  return r && !r.tags.includes("breakfast") && !v.some((s) => s.name === "Salt");
});
thin.length ? thin.forEach(([k]) => note(`savory recipe with no Salt: ${k}`)) : ok("every savory spice row includes Salt");

// ---------------------------------------------------------------- meat set
section("MEAT_INGREDIENTS");
const meatCat = Object.keys(INGREDIENT_REGISTRY).filter((k) => INGREDIENT_CATEGORIES[k] === "Meat & Seafood");
const missingMeat = meatCat.filter((k) => !MEAT.has(k));
missingMeat.length ? bad(`in the Meat & Seafood aisle but missing from MEAT_INGREDIENTS (no oz display): ${missingMeat.join(", ")}`)
                   : ok("MEAT_INGREDIENTS covers every Meat & Seafood registry entry");
const strayMeat = [...MEAT].filter((k) => !INGREDIENT_REGISTRY[k]);
if (strayMeat.length) bad(`MEAT_INGREDIENTS names not in the registry: ${strayMeat.join(", ")}`);

// ---------------------------------------------------------------- near-duplicates
section("Near-duplicate recipes");
const sets = RECIPES.map((r) => ({ name: r.name, cuisine: r.cuisine, s: new Set(r.ingredients.map((i) => i.name)) }));
const pairs = [];
for (let i = 0; i < sets.length; i++)
  for (let j = i + 1; j < sets.length; j++) {
    const inter = [...sets[i].s].filter((x) => sets[j].s.has(x)).length;
    const jac = inter / (sets[i].s.size + sets[j].s.size - inter);
    if (jac >= 0.7) pairs.push(`${(jac * 100) | 0}%  ${sets[i].name} (${sets[i].cuisine})  ~  ${sets[j].name} (${sets[j].cuisine})`);
  }
pairs.length ? pairs.forEach((p) => note("high ingredient overlap: " + p)) : ok("no recipe pair above 70% ingredient overlap");

// ---------------------------------------------------------------- thin coverage
section("Ingredient coverage");
const counts = {};
Object.keys(INGREDIENT_REGISTRY).forEach((k) => (counts[k] = 0));
RECIPES.forEach((r) => r.ingredients.forEach((i) => counts[i.name] !== undefined && counts[i.name]++));
const thinCov = Object.entries(counts).filter(([k, v]) => v > 0 && v < 5).sort((a, b) => a[1] - b[1]);
console.log(`  ${thinCov.length} registry entries appear in fewer than 5 recipes:`);
thinCov.forEach(([k, v]) => console.log(`    ${v}x  ${k}`));

// ---------------------------------------------------------------- verdict
console.log("\n" + (fails ? `\x1b[31m${fails} FAILURE(S)\x1b[0m` : "\x1b[32mAll hygiene checks passed.\x1b[0m"));
process.exit(fails ? 1 : 0);
