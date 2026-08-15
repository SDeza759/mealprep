#!/usr/bin/env node
// Phase B merge: apply agent JSONL records to data.js by line-level replacement.
//
// Every recipe lives on exactly one line in each of the three blocks (RECIPES,
// RECIPE_SPICE_OVERRIDES, RECIPE_COOKING_DATA), so replacement is keyed by name and
// leaves comments and untouched recipes byte-identical.
//
// Usage: node audit/cuisine-audit/phase-b/merge.js [--write]
// Without --write it validates and reports only.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../..");
const DATA = path.join(ROOT, "data.js");
const OUT = path.join(__dirname, "out");
const WRITE = process.argv.includes("--write");

// ---- load current data for the frozen vocabulary --------------------------------
const src = fs.readFileSync(DATA, "utf8");
const sandbox = {};
new Function("g", src.replace(/^var /gm, "g.") + "\n")(sandbox);
const REGISTRY = new Set(Object.keys(sandbox.INGREDIENT_REGISTRY));
const CATEGORIES = new Set(Object.keys(sandbox.INGREDIENT_CATEGORIES));
const SPICE_OK = new Set([...REGISTRY, ...CATEGORIES]); // spice names need a grocery category
const CURRENT_NAMES = new Set(sandbox.RECIPES.map((r) => r.name));

// ---- read agent output ----------------------------------------------------------
const errors = [];
const warnings = [];
const records = [];
const summaries = [];
const seen = new Map();

for (const f of fs.readdirSync(OUT).filter((f) => f.endsWith(".jsonl")).sort()) {
  const lines = fs.readFileSync(path.join(OUT, f), "utf8").split("\n");
  lines.forEach((line, i) => {
    const t = line.trim();
    if (!t) return;
    let rec;
    try {
      rec = JSON.parse(t);
    } catch (e) {
      errors.push(`${f}:${i + 1} unparseable JSON — ${e.message}`);
      return;
    }
    if (rec._summary) return summaries.push({ file: f, ...rec._summary });
    rec._file = `${f}:${i + 1}`;
    if (!rec.originalName) return errors.push(`${rec._file} missing originalName`);
    if (!CURRENT_NAMES.has(rec.originalName))
      return errors.push(`${rec._file} originalName "${rec.originalName}" is not a recipe in data.js`);
    if (seen.has(rec.originalName))
      return errors.push(`${rec._file} duplicate record for "${rec.originalName}" (also ${seen.get(rec.originalName)})`);
    seen.set(rec.originalName, rec._file);
    records.push(rec);
  });
}

// ---- validate --------------------------------------------------------------------
const noChange = [];
for (const rec of records) {
  const where = `${rec._file} [${rec.originalName}]`;
  if (!rec.recipe) {
    if ((rec.changed || []).length === 0 && !rec.spices && !rec.cooking) {
      noChange.push(rec.originalName);
      continue;
    }
    errors.push(`${where} has changes but no recipe object`);
    continue;
  }
  const r = rec.recipe;
  for (const k of ["name", "cuisine", "servingSize", "tags", "ingredients"])
    if (r[k] === undefined) errors.push(`${where} recipe missing "${k}"`);
  if (!Array.isArray(r.ingredients) || !r.ingredients.length)
    errors.push(`${where} recipe has no ingredients`);
  else
    r.ingredients.forEach((ing) => {
      if (!REGISTRY.has(ing.name)) errors.push(`${where} ingredient "${ing.name}" NOT IN REGISTRY`);
      if (!(typeof ing.grams === "number" && ing.grams > 0))
        errors.push(`${where} ingredient "${ing.name}" bad grams: ${ing.grams}`);
    });
  const dupIng = r.ingredients.map((i) => i.name).filter((n, i, a) => a.indexOf(n) !== i);
  if (dupIng.length) errors.push(`${where} duplicate ingredient(s): ${[...new Set(dupIng)].join(", ")}`);

  // Shawarma Bowl is the app's only variant recipe. A record that omits `variants` would serialize
  // the array away and silently delete the feature, so refuse rather than drop it.
  const live = sandbox.RECIPES.find((x) => x.name === rec.originalName);
  if (live && live.variants && !r.variants)
    errors.push(`${where} the live recipe has ${live.variants.length} variants and this record omits them — merging would delete them`);
  (r.variants || []).forEach((v, vi) => {
    if (!v.id || !v.label || !Array.isArray(v.ingredients) || !v.ingredients.length)
      errors.push(`${where} variant ${vi} is malformed`);
    else
      v.ingredients.forEach((ing) => {
        if (!REGISTRY.has(ing.name)) errors.push(`${where} variant "${v.id}" ingredient "${ing.name}" NOT IN REGISTRY`);
        if (!(typeof ing.grams === "number" && ing.grams > 0))
          errors.push(`${where} variant "${v.id}" ingredient "${ing.name}" bad grams: ${ing.grams}`);
      });
  });

  if (rec.spices) {
    if (!Array.isArray(rec.spices)) errors.push(`${where} spices is not an array`);
    else
      rec.spices.forEach((s) => {
        if (!SPICE_OK.has(s.name)) errors.push(`${where} spice "${s.name}" NOT IN VOCABULARY`);
        if (!(typeof s.grams === "number" && s.grams > 0))
          errors.push(`${where} spice "${s.name}" bad grams: ${s.grams}`);
      });
  }
  if (rec.cooking) {
    const c = rec.cooking;
    if (!c.prepTime || !c.cookTime || !Array.isArray(c.steps) || !c.steps.length)
      errors.push(`${where} cooking data incomplete`);
    else {
      const blob = c.steps.join(" ").toLowerCase();
      // every non-spice ingredient must be named somewhere in the steps
      r.ingredients.forEach((ing) => {
        const words = ing.name.toLowerCase().replace(/\(.*?\)/g, "").trim();
        const head = words.split(" ").filter((w) => w.length > 3);
        const hit = blob.includes(words) || head.some((w) => blob.includes(w));
        if (!hit) warnings.push(`${where} ingredient "${ing.name}" never named in steps`);
      });
      c.steps.forEach((s, i) => {
        if (/^\s*(\d+[.)]|step\s*\d)/i.test(s)) errors.push(`${where} step ${i + 1} has a number prefix`);
      });
    }
  }
}

// ---- serialize in data.js's existing style ---------------------------------------
const str = (s) =>
  JSON.stringify(s).replace(/[-￿]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));

const ingList = (ings) => ings.map((i) => `{name:${str(i.name)},grams:${i.grams}}`).join(",");

const recipeLine = (r) =>
  `  {name:${str(r.name)},cuisine:${str(r.cuisine)},servingSize:${str(r.servingSize)},` +
  `tags:[${r.tags.map(str).join(",")}],` +
  `ingredients:[${ingList(r.ingredients)}]` +
  (r.variants
    ? `,variants:[${r.variants
        .map((v) => `{id:${str(v.id)},label:${str(v.label)},ingredients:[${ingList(v.ingredients)}]}`)
        .join(",")}]`
    : "") +
  `},`;

const spiceLine = (name, spices) =>
  `  ${str(name)}: [${spices.map((s) => `{ name: ${str(s.name)}, grams: ${s.grams} }`).join(",")}],`;

const cookingLine = (name, c) =>
  `${str(name)}:{prepTime:${str(c.prepTime)},cookTime:${str(c.cookTime)},steps:[${c.steps.map(str).join(",")}]},`;

// ---- locate block boundaries -----------------------------------------------------
const lines = src.split("\n");
const blockStart = (decl) => lines.findIndex((l) => l.startsWith(decl));
const B = {
  spices: blockStart("var RECIPE_SPICE_OVERRIDES = {"),
  cooking: blockStart("var RECIPE_COOKING_DATA = {"),
  recipes: blockStart("var RECIPES = ["),
  categories: blockStart("var INGREDIENT_CATEGORIES = {"),
};
const blockEnd = (start) => {
  for (let i = start + 1; i < lines.length; i++) if (/^(\}|\]);?$/.test(lines[i].trim())) return i;
  throw new Error("unterminated block from line " + start);
};

// index: name -> line number, per block
const indexRecipes = new Map();
for (let i = B.recipes + 1; i < blockEnd(B.recipes); i++) {
  const m = lines[i].match(/^\s*\{name:"((?:[^"\\]|\\.)*)"/);
  if (m) indexRecipes.set(JSON.parse(`"${m[1]}"`), i);
}
const indexKeyed = (start) => {
  const map = new Map();
  for (let i = start + 1; i < blockEnd(start); i++) {
    const m = lines[i].match(/^\s*"((?:[^"\\]|\\.)*)"\s*:/);
    if (m) map.set(JSON.parse(`"${m[1]}"`), i);
  }
  return map;
};
const indexSpices = indexKeyed(B.spices);
const indexCooking = indexKeyed(B.cooking);

// ---- apply -----------------------------------------------------------------------
let touchedRecipes = 0,
  touchedSpices = 0,
  touchedCooking = 0,
  insertedSpices = 0;
const pendingSpiceInserts = [];

for (const rec of records) {
  if (!rec.recipe) continue;
  const on = rec.originalName;
  const nn = rec.recipe.name;

  const ri = indexRecipes.get(on);
  if (ri === undefined) {
    errors.push(`${rec._file} could not locate RECIPES line for "${on}"`);
    continue;
  }
  lines[ri] = recipeLine(rec.recipe);
  touchedRecipes++;

  // spices: rewrite when the array changed OR when the key must be renamed
  const si = indexSpices.get(on);
  if (rec.spices) {
    if (si !== undefined) {
      lines[si] = spiceLine(nn, rec.spices);
      touchedSpices++;
    } else {
      pendingSpiceInserts.push(spiceLine(nn, rec.spices));
      insertedSpices++;
    }
  } else if (nn !== on && si !== undefined) {
    lines[si] = lines[si].replace(/^(\s*)"(?:[^"\\]|\\.)*"(\s*:)/, `$1${str(nn)}$2`);
    touchedSpices++;
  }

  const ci = indexCooking.get(on);
  if (rec.cooking) {
    if (ci === undefined) errors.push(`${rec._file} no RECIPE_COOKING_DATA entry for "${on}"`);
    else {
      lines[ci] = cookingLine(nn, rec.cooking);
      touchedCooking++;
    }
  } else if (nn !== on && ci !== undefined) {
    lines[ci] = lines[ci].replace(/^"(?:[^"\\]|\\.)*"(\s*:)/, `${str(nn)}$1`);
    touchedCooking++;
  }
}

if (pendingSpiceInserts.length) {
  const at = blockEnd(B.spices);
  // The block's last entry may have no trailing comma — appending after it would
  // produce `] "Next": [...]` and a SyntaxError. Give it one first.
  for (let i = at - 1; i > B.spices; i--) {
    const t = lines[i].trim();
    if (!t || t.startsWith("//")) continue;
    if (!t.endsWith(",")) lines[i] = lines[i] + ",";
    break;
  }
  lines.splice(at, 0, ...pendingSpiceInserts);
}

// ---- report ----------------------------------------------------------------------
const out = lines.join("\n");
console.log(`records:        ${records.length} (${noChange.length} declared no-change)`);
console.log(`RECIPES lines:  ${touchedRecipes}`);
console.log(`spice lines:    ${touchedSpices} rewritten, ${insertedSpices} inserted`);
console.log(`cooking lines:  ${touchedCooking}`);
if (summaries.length) {
  const blocked = summaries.flatMap((s) => (s.blocked || []).map((b) => `  ${s.slice || s.file}: ${JSON.stringify(b)}`));
  console.log(`summaries:      ${summaries.length}${blocked.length ? "\nblocked:\n" + blocked.join("\n") : ""}`);
}
if (warnings.length) {
  console.log(`\nWARNINGS (${warnings.length}):`);
  warnings.forEach((w) => console.log("  " + w));
}
if (errors.length) {
  console.log(`\nERRORS (${errors.length}):`);
  errors.forEach((e) => console.log("  " + e));
  console.log("\nNOT WRITING — fix the errors above.");
  process.exit(1);
}

// syntax-check the result before touching disk
try {
  new Function("g", out.replace(/^var /gm, "g.") + "\n")({});
} catch (e) {
  const dump = path.join(__dirname, "merged.debug.js");
  fs.writeFileSync(dump, out);
  console.log("\nERROR: merged data.js does not parse — " + e.message);
  console.log("dumped the bad output to " + dump + " — run `node --check` on it to get a line number.");
  process.exit(1);
}

if (WRITE) {
  fs.writeFileSync(DATA, out);
  console.log("\nWROTE data.js");
} else {
  console.log("\nDry run OK. Re-run with --write to apply.");
}
