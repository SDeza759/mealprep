# CLAUDE.md — Project Context

## Last Updated
2026-04-03 — Session 2. Built shared ingredient registry, USDA macro audit, expanded variants to 28, removed duplicate recipe.

---

## Project Overview
Single-file HTML meal prep optimizer. Generates weekly meal plans against macro targets (2000 cal, 175g carbs, 200g protein, 55.6g fat). React 18 + Babel via CDN, no build step, no server. 136 recipes, 14 cuisines, combo-first selection algorithm. File: `/Users/sebas/Desktop/MealPrep/index.html` (~2812 lines).

---

## Architecture

Single-file React SPA. Key sections (line numbers approximate — search by name):

- `UNIT_INGREDIENTS` (~220) — Unit-based display items (eggs, tortillas, etc.)
- `INGREDIENT_REGISTRY` (~258) — 85 entries, USDA per-100g raw macros. Single source of truth.
- `RECIPES[]` (~570) — 136 recipes, grams-only ingredients. Macros computed at startup from registry.
- `_enrichFromRegistry()` (~787) — Startup: computes ingredient macros, totalMacros, injects spices & cooking data.
- `adjustDayMeals()` (~865) — 50-iteration scaling loop (carb floor 88%, egg rules, canAdjust eligibility).
- `generatePlan()` — Combo-first: samples 100 combos/day, hard-rejects bad ones, softmax draw (τ=0.3), then adjusts.
- `selectVariant()` — Picks best variant per recipe based on remaining macro budget during combo sampling.
- Debug panel (type "debug") — 100-week validator, 1000-week simulator, ingredient frequency analyzer.

**Data flow**: Set targets → Generate → sample 100 combos/day → hard-reject → softmax select → adjust ingredients → add protein shake if needed → render.

---

## Key Decisions (don't reverse these)

**Single HTML file**: No splitting, no build step, no npm. Absolute constraint.

**Combo-first selection**: Evaluates full day combos, not sequential meal picks. Prevents structural incompatibility (e.g. three ultra-lean meals with no fat recovery). Hard rejection thresholds: fat 70-135%, protein ≥65%, calories 72-140% of target.

**INGREDIENT_REGISTRY**: All macros come from one central lookup. Recipe ingredients are `{ name, grams }` only. Never add inline macros. Always use USDA raw/uncooked values.

**Unified recipe pool**: No separate breakfast pool. Any recipe can appear in any slot. Breakfast recipes sort first visually only.

**Variant system**: 36 recipes have `variants` arrays (chicken-breast↔thigh, beef 90%↔80% lean, salmon→cod, pork-shoulder→loin, no-rice). Each variant has a complete ingredient list. `selectVariant()` picks per combo budget. Rotation tracker uses base recipe name across variants.

**Macro targets are extreme**: 200g protein / 55.6g fat is very high-protein low-fat. Many algorithm decisions exist specifically for this ratio.

**All macros use raw USDA data**: Audit in Session 2 found cooked values for ground beef, pork loin, and rice. All corrected. Always use raw values when adding ingredients.

---

## What to Do Next

1. ~~**Add 8 remaining variants**~~ — DONE (Session 3). Added 2 salmon→cod (Teriyaki Salmon Bowl, Sushi Bowl Chirashi) + 6 chicken breast→thigh (Thai Basil Chicken, Dakgalbi, Chicken Yakitori Bowl, Tandoori Chicken, Jerk Chicken Rice Bowl, Arroz con Pollo). Total: 36 recipes with variants.

2. **Run in-browser validation** — USDA corrections changed many recipe profiles. Run 100-week validator + 1000-week simulator. Target: pass rate ≥97%, protein shakes ≤2%. Share JSON reports.

3. **Diagnose variant selection regression** — `selectVariant` may cause all combo picks to lean same direction (all lean or all fatty). Budget tracking doesn't account for early picks skewing later ones. Validate first, fix if still an issue.

4. ~~**Cod frequency**~~ — DONE (Session 3). Added "Baked Cod with Lemon & Herbs" base recipe. Cod now at 5 recipes (1 base + 4 variants). Meets ≥5 threshold.

---

## Fragile Areas & Warnings

**Registry name matching**: Ingredient `name` in recipes must exactly match a key in `INGREDIENT_REGISTRY`. Mismatch → zeroed macros + console warning. Ground Beef has two entries: `"Ground Beef (lean)"` and `"Ground Beef (80% lean)"`.

**totalMacros is computed, never hardcoded**: Changing grams or registry values auto-updates. Don't manually set totalMacros.

**selectedVariant is transient**: Overwritten on every `sampleCombo` call. Don't rely on it persisting.

**Combo fallback is required**: If all 200 combos are rejected, algorithm uses least-bad. Removing fallback → infinite loop.

**Carb floor at 88%**: Prevents carb collapse during adjustment. Has pre-check and post-check revert. Don't remove.

**Egg scaling**: 50g increments only. Binder eggs (not top protein source) capped at original grams.

**isBreakfast set after adjustment**: Don't use meal index for breakfast detection inside `adjustDayMeals`. Use `tags.indexOf("breakfast")`.

**Two RECIPE_COOKING_DATA objects**: Verbose and compact formats. Check both if a recipe's instructions are missing.

**Validation is browser-only**: Debug tools are client-side. Code can't run them. Must test in browser and share JSON reports.

---

## Conventions

**New ingredient**: Add to `INGREDIENT_REGISTRY` (USDA raw per-100g). Reference in recipe as `{ name: "...", grams: X }`.

**New variant**: Add `variants` array with `id`, `label`, complete `ingredients` (grams-only). Use separate registry entries for different proteins.

**canAdjust rules**: ≥50 cal, not spice, not soy sauce. Eggs in 50g steps (binder = capped). Unit items (bread, tortillas, lime, lemon, banana) not adjustable.

**Scoring**: `worstDev * 0.6 + avgDev * 0.4`. Scale factors: `[0.5, 0.7, 0.8, 0.9, 1.1, 1.2, 1.5, 2.0, 3.0]`.

**Cuisine limit**: Max 2 per week. **Ingredient threshold**: Must appear in ≥5 recipes. **Protein shake**: Auto-added if protein >10% below target. Max 1/day, 25P/3C/1F/120cal.

**localStorage keys**: `mealprep_daygroups`, `mealprep_plans`, `mealprep_overrides`, `mealprep_stats`, `mealprep_stats_last_view`.

---

## Session History

- **Session 1 (2026-03-29 to 04-03)**: Built full app from scratch. 136 recipes, combo-first algorithm (pass rate 84.6%→97.6%), debug tools, day grouping, stats, variant system (22 recipes). Six major algorithm iterations.

- **Session 2 (2026-04-03)**: Data integrity overhaul. Built INGREDIENT_REGISTRY (85 entries). Comprehensive USDA audit: fixed Ground Beef (6 recipes, cooked→raw), Pork Loin (14 occurrences, wrong cut), White Rice in Egg Fried Rice (200g cooked→55g raw). Added 7 ground beef 80/90% variants. Cleaned 7 dead INGREDIENT_CATEGORIES entries. Removed duplicate Hearty Beef Tacos. Final: 135 recipes, 28 variants, 106 categories.
