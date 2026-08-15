#!/usr/bin/env node
// Compute before/after macros for every Phase B record, straight from the registry.
// Read-only, works against the UNMERGED data.js. Usage:
//   node audit/cuisine-audit/phase-b/deltas.js [--all]
// Default prints only recipes outside the +-25% calorie band; --all prints everything.

const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "../../..");
const g = {};
new Function("g", fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/^var /gm, "g.") + "\n")(g);
const REG = g.INGREDIENT_REGISTRY;
const BY_NAME = new Map(g.RECIPES.map((r) => [r.name, r]));
const ALL = process.argv.includes("--all");

const macros = (ings) =>
  ings.reduce(
    (a, i) => {
      const m = REG[i.name];
      if (!m) return a;
      const f = i.grams / 100;
      return {
        cal: a.cal + m.calories * f,
        c: a.c + m.carbs * f,
        p: a.p + m.protein * f,
        f: a.f + m.fat * f,
      };
    },
    { cal: 0, c: 0, p: 0, f: 0 }
  );

const rows = [];
const cuisineMoves = [];
const renames = [];
for (const file of fs.readdirSync(path.join(__dirname, "out")).filter((f) => f.endsWith(".jsonl")).sort()) {
  for (const line of fs.readFileSync(path.join(__dirname, "out", file), "utf8").split("\n")) {
    if (!line.trim()) continue;
    const rec = JSON.parse(line);
    if (rec._summary || !rec.recipe) continue;
    const old = BY_NAME.get(rec.originalName);
    if (!old) continue;
    const a = macros(old.ingredients);
    const b = macros(rec.recipe.ingredients);
    const pct = a.cal ? ((b.cal - a.cal) / a.cal) * 100 : 0;
    rows.push({
      slice: file.slice(0, 2),
      name: rec.recipe.name,
      renamed: rec.recipe.name !== rec.originalName,
      pct,
      a,
      b,
      dp: b.p - a.p,
      tags: rec.recipe.tags || [],
    });
    if (rec.recipe.cuisine !== old.cuisine) cuisineMoves.push(`${old.cuisine} -> ${rec.recipe.cuisine}   ${rec.recipe.name}`);
    if (rec.recipe.name !== rec.originalName) renames.push(`${rec.originalName}  ->  ${rec.recipe.name}`);
  }
}

rows.sort((x, y) => Math.abs(y.pct) - Math.abs(x.pct));
const shown = ALL ? rows : rows.filter((r) => Math.abs(r.pct) > 25 || r.dp < -8);

console.log(`${rows.length} records with macros. ${ALL ? "All" : "Showing those outside +-25% cal or losing >8g protein"}:\n`);
console.log("  slice  cal before -> after   delta    protein        recipe");
shown.forEach((r) => {
  const flag = Math.abs(r.pct) > 25 ? "!" : r.dp < -8 ? "p" : " ";
  console.log(
    `${flag} ${r.slice}     ${String(Math.round(r.a.cal)).padStart(4)} -> ${String(Math.round(r.b.cal)).padStart(4)}   ` +
      `${(r.pct >= 0 ? "+" : "") + r.pct.toFixed(0).padStart(3)}%   ` +
      `${r.a.p.toFixed(0).padStart(3)} -> ${r.b.p.toFixed(0).padStart(3)}g   ` +
      `${r.name}${r.tags.includes("high-protein") ? "  [high-protein]" : ""}`
  );
});

const over = rows.filter((r) => Math.abs(r.pct) > 25).length;
const proteinDrops = rows.filter((r) => r.dp < -8).length;
console.log(`\n${over} outside +-25% cal, ${proteinDrops} losing >8g protein.`);
console.log(`median |delta| = ${(() => {
  const s = rows.map((r) => Math.abs(r.pct)).sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)].toFixed(1) : "0";
})()}%`);

if (renames.length) console.log(`\nRenames (${renames.length}):\n  ` + renames.join("\n  "));
if (cuisineMoves.length) console.log(`\nCuisine relabels (${cuisineMoves.length}):\n  ` + cuisineMoves.join("\n  "));
