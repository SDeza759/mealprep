# CLAUDE.md — Project Context

## Last Updated
2026-06-07 — Session 10. Two changes. (1) **Cooked→raw data fix**: 7 registry entries were stored as
COOKED macros paired with COOKED recipe grams (internally consistent, but violating the "always USDA
raw" convention that Rice/Flour/Oats follow). Converted Pasta, Rice Noodles, Sweet Potato Noodles,
Red Lentils, Black Beans, White Beans, Chickpeas to USDA raw macros AND proportionally rescaled every
recipe's grams by the calorie density ratio (grams ÷ k, k=cooked/raw cal) so each dish keeps its exact
nutrition — 45 recipe gram edits across ~35 recipes + 7 registry edits in `data.js`. Validator 700/700,
simulator 7000/7000. Surfaced by an Amazon-Fresh-vs-USDA audit (see `audit/macro-audit.html`, a
review-only HTML report; not app code). (2) **Per-serving macros in grocery list**: `grocery.js` now
tracks `totalServings` and exposes `groceryServingMacros()`/`groceryServingText()` (avg portion =
totalGrams÷totalServings, registry-scaled); shown as a `gi-serving` sub-row in the Grocery tab and in
the Copy List text (notes-app friendly). Protein powder gets a per-scoop line. Spices/zero-cal skipped.

## Project Overview
Multi-file HTML meal-prep optimizer ("Actual Size Optimizer"). Weekly plans vs macro targets
(default 2000cal/175C/200P/55.6F). React 18 + Babel via CDN, no build step, no server.
Entry: `index.html`. Path: `/Users/sebas/Desktop/MealPrep/`.

## File Map
- `index.html` — React App: all UI, weekly table, meal/swap modals, settings, stats; `MEAT_INGREDIENTS` Set.
- `data.js` — pure data: `INGREDIENT_REGISTRY` (99, USDA raw/100g), `RECIPES` (141, grams-only),
  `RECIPE_SPICE_OVERRIDES`, `RECIPE_COOKING_DATA`, `UNIT_INGREDIENTS`, `INGREDIENT_CATEGORIES`, `DAYS_NAMES`.
- `algorithm.js` — `generatePlan`, `adjustDayMeals` (solver), nested `selectVariant`/`comboFeasible`,
  `initializeData`, exported mutable `state` (`solverDiagnostics`, `recipeRotation`).
- `grocery.js` — grocery list build/format.
- `tests/` — Node CLI harness; `run.js` dispatches `validator` (100wk), `simulator` (1000wk), `compare` (A/B).

Load order: data.js → algorithm.js → grocery.js → `initializeData()` → babel App. Output → `tests/output/`.

## Data Flow
Set targets → sample 100 combos/day → feasibility pre-filter → softmax rank → solver-as-filter (try top 10
combos until one solves to [95%,105%] on all 4 macros) → add protein shake if protein >10% low → render table.

## Key Decisions (don't reverse)
- **Combo-first**: evaluate full-day combos, not sequential picks — avoids structural incompatibility.
- **Solver-as-filter**: gradient-descent solver IS the feasibility check; combos that can't hit [95%,105%]
  are rejected, next-best tried (≤10/day). Pre-filter only catches obviously-bad combos.
- **Dynamic feasibility**: thresholds derive from user targets; only fixed zone is [95%,105%].
- **Registry is single source**: recipes are `{name,grams}` only, never inline macros. Always USDA raw.
- **Unified pool**: any recipe in any slot; breakfast tag only sorts first visually.
- **Variants**: only Shawarma Bowl (2). `selectVariant` is variants-only — base is unreachable when a
  `variants` array exists. Never add 1-variant recipes (dead code); write the cut as the base instead.
- **Per-recipe spices**: each savory recipe owns its `RECIPE_SPICE_OVERRIDES`; sweet breakfasts may omit.
  No cuisine-default spice system (removed S5).
- **No swap guardrails**: swap modal does NOT enforce dedup or cuisine limit — manual swaps are free.
  Cuisine ≤2/wk and recipe dedup apply only during generation.
- **Partial regen** (`handleRegenerateSelected`): calls `generatePlan` with `excludedDays`=all non-selected
  days, merges returned days. Optional `seed` ({recipeNames,cuisineCounts}) pre-seeds week trackers from kept
  days so rerolls don't duplicate them. Transient call-`excludedDays` is unioned with the persistent setting.
  Grouped days reroll as a unit (slot logic clones one combo).
- **Manual edits per-day**: `handleSwap`/`handleRemoveMeal` touch only `plan[di]`; editing a grouped day makes
  it diverge from its group. Regeneration is the only group-respecting manual op.
- **Harness state reset**: reset `state.recipeRotation`/`solverDiagnostics` ONCE before the week loop, never
  per-week (per-week kills rotation fairness, starves recipes).

## Fragile Areas
- **Registry name match**: recipe `name` must exactly match a key or macros zero out. Two ground-beef entries:
  `"Ground Beef (lean)"`, `"Ground Beef (80% lean)"`.
- **Combo fallback + 3-meal retry**: all-rejected → least-bad; if below floor (65% cal / 55% pro) on a 2-meal
  day, force one 3-meal retry. Removing either path risks infinite loops / catastrophic days.
- **Solver bounds [0.5,3.0]**: scale range affects feasibility — changing it requires updating `comboFeasible`.
- **Carb floor**: carb weight ×4 when carbs <88% of target (relaxes to 80% if protein binds).
- **Egg scaling**: 50g increments; binder eggs capped at original grams; snapped after each solver step.
- **isBreakfast in `adjustDayMeals`**: detect via `tags.indexOf("breakfast")`, not meal index.
- **Pre-filter is intentionally loose** (e.g. 110% cal ceiling on protein path). Too strict caused a S3
  regression to 91.9%. Run validator after touching it.
- **Module `state`**: mutate in place (`arr.length=0`), never rebind from outside, or browser/harness diverge.
- **Swap dry-run scoring**: clones data (must not mutate plan); runs solver 2× per candidate; failure → score
  99 (incompatible). Known false negatives (see What to Do Next).
- **`handleRemoveMeal` shake**: re-solves remaining meals, re-evaluates protein shake and folds it into
  `totals` (mirrors `generatePlan`). `handleSwap` does NOT re-add shake to totals — if unifying, match remove.
  Both clear the day's `eatenMeals`/`mealServings` (indices shift). Button hidden at ≤1 meal.
- **Plans store stale data**: cloned to localStorage at gen time; recipe edits show only after regenerating.
- **Day-group colors snapshot at gen time**: regrouping after generation doesn't recolor the current plan.

## Conventions
- **New ingredient**: add to `INGREDIENT_REGISTRY` (USDA raw/100g); reference `{name,grams}`; add to
  `INGREDIENT_CATEGORIES` (grocery) and `MEAT_INGREDIENTS` Set if flesh meat.
- **New recipe**: add to `RECIPES` (names match registry) + `RECIPE_SPICE_OVERRIDES` (savory ≥ Salt + Black
  Pepper) + `RECIPE_COOKING_DATA` (no number prefixes; reference every non-spice ingredient, no phantoms, name
  specific spices). Aim ≥5 recipes/ingredient. Run validator (700/700) then simulator.
- **Edit cooking steps**: only `RECIPE_COOKING_DATA` (legacy `COOKING_INSTRUCTIONS` deleted S5).
- **canAdjust**: ≥50 cal, not spice, not soy sauce. Unit items (bread, tortillas, lime, lemon, banana) fixed.
- **Cuisine** 2/wk (generation only). **Protein shake**: auto if protein >10% low; 1/day, 25P/3C/1F/120cal.
- **localStorage**: `mealprep_daygroups`, `mealprep_plans`, `mealprep_overrides`, `mealprep_stats`,
  `mealprep_stats_last_view`, `mealprep_favorites` (object keyed by recipe name → true; UI-only
  bookmark list, does not affect generation).
- **Workflow**: run `node tests/run.js validator` (often `simulator`) before any data change is done.

## What to Do Next
- **Mobile UX**: weekly table + modal untested ≤600px; columns may be too narrow. Isolated to `index.html`.
- **Swap false negatives** (since S4): solver non-determinism flags workable recipes incompatible. Add
  seeded-RNG mode + A/B the dry-run zone width ([95,105] vs [93,107]).
- **Pending audit review**: `audit/macro-audit.html` (S10) compares 45 packaged ingredients vs Amazon
  Fresh; user is reviewing keep/adjust per item (decisions persist in localStorage, exportable). Open
  brand-variance candidates flagged: Pesto Sauce, Cheddar/Mozzarella (whole vs part-skim), Chickpeas
  (~17% cal), nonfat Greek Yogurt. Apply approved adjustments to `INGREDIENT_REGISTRY` then validate.
- **Backlog**: UI warn when `4C+4P+9F > cal`;
  add `Wild Rice`/`Shallots` to registry (Pan-Seared Duck uses fallbacks); raise below-5-recipe ingredients
  (Cherry Sauce, Duck Breast/Leg, Hoisin, Salmon, Cod, Flatbread, Flour, Kimchi, Paneer, etc.); optional
  `--seed=N` harness flag.

## Session History
- **Sessions 1–2**: Built app from scratch (combo-first algorithm, day grouping, stats). Data-integrity
  overhaul: built `INGREDIENT_REGISTRY`; USDA audit (ground beef/pork/rice cooked→raw).
- **Session 3**: Projected gradient-descent solver; dynamic feasibility pre-filter; solver-as-filter; fixed
  simulator fallback-target bug. 700/700.
- **Session 4**: Validated dynamic targets across 4 configs. UI overhaul; smart swap modal (solver-ranked).
  Known issue: swap false negatives.
- **Session 5**: `CUISINE_SPICES` → per-recipe `RECIPE_SPICE_OVERRIDES`; deleted `COOKING_INSTRUCTIONS`.
  Dashboard redesign (weekly table, detail modal). Added Pork Belly + Rolled Oats.
- **Session 6**: Data-integrity sweep (phantoms, dup carbs, variant mismatches). Extracted `data.js`/
  `algorithm.js`/`grocery.js` from `index.html`; built Node harness; fixed rotation-reset bug. Flattened
  40/41 variants (kept Shawarma Bowl). Added 5 duck recipes (Chinese, French).
- **Session 7**: Partial day regeneration (multi-select, group-aware, `seed`-deduped) + remove-meal
  (re-solve remaining, shake-correct). No data changes. 700/700 + 7000/7000.
- **Session 8**: Favorites tab — UI-only bookmark list keyed by recipe name (`mealprep_favorites`).
  `toggleFavorite` helper; ☆/★ star in weekly table cell, detail modal action row, and All Recipes
  cards (all sync the one key); new tab with live count + empty state. No algorithm/data changes.
  All in `index.html`. 700/700.
- **Session 9**: Grocery category revamp — old 7 buckets → 9-category store-walk taxonomy + "Other"
  fallback; mapped the 7 unmapped ingredients (only Water → Other now); fruit split out of the old
  overloaded "Other"; Kimchi placed in Condiments & Oils (not Produce). `INGREDIENT_CATEGORIES`
  (`data.js`) + `grocery.js` render `order` / oz-format key. No algorithm/recipe changes. 700/700.
- **Session 10**: (a) Cooked→raw fix for 7 legume/pasta/noodle entries (Pasta, Rice Noodles, Sweet
  Potato Noodles, Red Lentils, Black/White Beans, Chickpeas): USDA raw macros + proportional gram
  rescale (k=cooked/raw cal) across 45 recipe occurrences so dish nutrition is preserved; 700/700 +
  7000/7000. Found via Amazon-Fresh-vs-USDA audit (`audit/macro-audit.html`, sortable review report,
  not app code). (b) Per-serving macros in grocery list (`grocery.js` `groceryServingMacros`/
  `groceryServingText`, `totalServings`; `gi-serving` row + Copy List text in `index.html`).
