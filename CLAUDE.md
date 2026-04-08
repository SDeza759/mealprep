# CLAUDE.md — Project Context

## Last Updated
2026-04-07 — Session 5. Data integrity overhaul (recipe instructions audit, per-recipe spice system, Ropa Vieja seasonings). Major UI redesign (dashboard layout with weekly overview table, meal detail modal, collapsible settings). Ingredient coverage gaps fixed (Pork Belly, Rolled Oats).

---

## Project Overview
Single-file HTML meal prep optimizer ("Actual Size Optimizer"). Generates weekly meal plans against macro targets (2000 cal, 175g carbs, 200g protein, 55.6g fat). React 18 + Babel via CDN, no build step, no server. 136 recipes, 14 cuisines, solver-driven selection algorithm. File: `/Users/sebas/Desktop/MealPrep/index.html`.

---

## Architecture

Single-file React SPA. Key sections (line numbers approximate — search by name):

- `UNIT_INGREDIENTS` — Unit-based display items (eggs, tortillas, etc.)
- `INGREDIENT_REGISTRY` — 93 entries, USDA per-100g raw macros. Single source of truth.
- `RECIPES[]` — 136 recipes, grams-only ingredients. Macros computed at startup from registry.
- `RECIPE_SPICE_OVERRIDES` — Per-recipe spice/seasoning lists. Every recipe has its own entry. Single source of truth for spices.
- `RECIPE_COOKING_DATA` — Compact cooking instructions for all recipes. Single source of truth for instructions (verbose `COOKING_INSTRUCTIONS` was deleted in Session 5).
- `_enrichFromRegistry()` — Startup: computes ingredient macros, totalMacros, injects spices from `RECIPE_SPICE_OVERRIDES` & cooking data.
- `comboFeasible()` — Pre-filter: range checks + multi-direction cross-constraint analysis. Rejects combos that are mathematically infeasible.
- `adjustDayMeals()` — Projected gradient descent solver. Finds scale factors for all adjustable ingredients simultaneously to hit macro targets.
- `generatePlan()` — Combo-first with solver-as-filter: samples combos, pre-filters, ranks by softmax, then tries top combos through the solver until one hits [95%, 105%] on all macros.
- `selectVariant()` — Picks best variant per recipe based on remaining macro budget during combo sampling.
- Debug panel (type "debug") — 100-week validator, 1000-week simulator, ingredient frequency analyzer.
- Autotest URL parameter — `index.html?autotest=CAL-CARBS-PRO-FAT` auto-runs 100-week validator with custom targets and downloads JSON results.

**UI architecture (Session 5)**: Dashboard layout. Settings panel (macro calculator, day grouping, saved plans) is always visible and compact at the top. Weekly overview table shows all days/meals in a grid. Clicking a meal cell opens a detail modal with ingredients, macros, servings stepper, swap, cooking instructions, and eaten toggle. Generate Plan button is always visible above the table.

**Data flow**: Set targets → Generate → sample 100 combos/day → feasibility pre-filter → softmax rank → solver-as-filter (try top 10 combos until one solves to zone) → add protein shake if needed → render in weekly table.

---

## Key Decisions (don't reverse these)

**Single HTML file**: No splitting, no build step, no npm. Absolute constraint.

**Combo-first selection**: Evaluates full day combos, not sequential meal picks. Prevents structural incompatibility (e.g. three ultra-lean meals with no fat recovery).

**Solver-as-filter architecture**: The gradient descent solver IS the definitive feasibility check. Combos are tried through the solver; if a combo can't solve to [95%, 105%] on all 4 macros, it's rejected and the next-best combo is tried (up to 10 attempts per day). This eliminates the need for perfect pre-filter thresholds — the pre-filter only needs to catch obviously bad combos quickly.

**Gradient descent solver (not greedy)**: The adjustment phase uses projected gradient descent with exact quadratic step sizes to find scale factors for ALL adjustable ingredients simultaneously. This replaces the original greedy 50-iteration loop that tweaked one ingredient at a time and got stuck in local optima (e.g., couldn't close a 6% protein gap because each move worsened fat). The solver treats this as a constrained linear optimization problem with 4 macro targets and K scale factors in [0.5, 3.0].

**Dynamic feasibility (no hardcoded thresholds)**: The feasibility pre-filter and solver derive all thresholds from user-configured target values. The only fixed threshold is the validation zone [95%, 105%]. The algorithm self-corrects for any calorie target, macro split, or recipe pool — no tuning required when adding/removing recipes or changing targets. Validated in Session 4 across 4 configurations (1600–2500 cal, 30–45% protein, 25–36% fat) — all 700/700.

**INGREDIENT_REGISTRY**: All macros come from one central lookup. Recipe ingredients are `{ name, grams }` only. Never add inline macros. Always use USDA raw/uncooked values.

**Unified recipe pool**: No separate breakfast pool. Any recipe can appear in any slot. Breakfast recipes sort first visually only.

**Variant system**: 40 recipes have `variants` arrays (chicken-breast↔thigh, beef 90%↔80% lean, salmon→cod, pork-shoulder→loin→belly, no-rice). Each variant has a complete ingredient list. `selectVariant()` picks per combo budget. Rotation tracker uses base recipe name across variants.

**Variant selection skew is accepted**: Session 4 analysis confirmed that `selectVariant()` structurally favors lean variants at even-split budgets due to the extreme protein/fat ratio. This is a theoretical suboptimality, not a regression — the solver compensates. 1000-week simulator showed healthy distribution (136/136 recipes selected, no over-representation). Don't change `selectVariant()` unless validation data shows actual failures.

**Per-recipe spice system (no cuisine defaults)**: Every recipe has its own spice list in `RECIPE_SPICE_OVERRIDES`. The old `CUISINE_SPICES` system (which auto-injected a default spice set per cuisine) was removed in Session 5 because it caused inconsistency — some cuisines had defaults, some didn't, and recipe-specific needs were often missed. Now each recipe explicitly declares its spices. When adding a new recipe, always add a corresponding `RECIPE_SPICE_OVERRIDES` entry.

**Smart swap modal**: Swap modal ranks candidates by solver-based scoring. Each candidate is dry-run through the solver against the day's remaining budget (target minus other meals). Candidates that solve to [95%, 105%] are shown with a green checkmark; incompatible ones are hidden behind a toggle. Variant selection runs per candidate. Protein shake rescue is factored into dry-run scoring.

**No swap guardrails for duplicates/cuisine**: The swap modal intentionally does NOT filter out duplicate recipes or enforce the 2-per-week cuisine limit. Manual swaps should give the user full freedom. Cuisine limits and dedup are enforced only during automated generation.

**Macro targets are extreme**: 200g protein / 55.6g fat is very high-protein low-fat. The solver handles this automatically but it's worth knowing when diagnosing edge cases.

**All macros use raw USDA data**: Audit in Session 2 found cooked values for ground beef, pork loin, and rice. All corrected. Always use raw values when adding ingredients.

**Weekly overview table (not day cards)**: Session 5 replaced the old expandable day cards with a compact weekly grid. All days visible at a glance, meal details accessed via click-to-modal. The table has fixed column widths to prevent layout shifting when regenerating plans.

---

## What to Do Next

1. **Fix swap modal false negatives** (carried from Session 4) — Some recipes marked "incompatible" in the dry-run scoring actually work when swapped. Root cause: solver non-determinism (random restarts produce different results between dry-run and real swap). Session 4 applied two fixes (double solver runs per candidate + protein shake in dry-run) which reduced but didn't eliminate the issue. Next step: investigate whether widening the dry-run zone slightly (e.g., [93%, 107%]) eliminates remaining false negatives without introducing false positives.

2. **Mobile UX** — The weekly overview table and meal detail modal have not been tested on mobile (≤600px). The table columns may be too narrow for recipe names on small screens. The modal should work reasonably but may need responsive adjustments.

---

## Fragile Areas & Warnings

**Registry name matching**: Ingredient `name` in recipes must exactly match a key in `INGREDIENT_REGISTRY`. Mismatch → zeroed macros + console warning. Ground Beef has two entries: `"Ground Beef (lean)"` and `"Ground Beef (80% lean)"`.

**totalMacros is computed, never hardcoded**: Changing grams or registry values auto-updates. Don't manually set totalMacros.

**selectedVariant is transient**: Overwritten on every `sampleCombo` call. Don't rely on it persisting.

**Combo fallback + 3-meal retry**: If all 200 combos are rejected, algorithm uses least-bad. If that fallback is below quality floor (65% cal or 55% protein) on a 2-meal day, it forces a 3-meal retry. Removing either path → possible infinite loop or catastrophic failures.

**Solver-as-filter retry loop**: The solver tries up to 10 combos per day. If this limit is reduced, hard days may accept bad results. If increased significantly, generation time grows on hard days.

**Solver scale bounds [0.5, 3.0]**: Ingredients scale between 0.5x and 3.0x original grams. These bounds affect feasibility analysis — changing them requires updating both the solver and `comboFeasible()`.

**Carb floor relaxation**: Carb weight is boosted 4x in the solver when carbs fall below 88% of target (relaxes to 80% when protein is the binding constraint). This prevents carb collapse. Don't remove without understanding the interaction with protein-heavy combos.

**Egg scaling**: 50g increments only. Binder eggs (not top protein source) capped at original grams. Eggs are snapped to valid increments after each solver step.

**isBreakfast set after adjustment**: Don't use meal index for breakfast detection inside `adjustDayMeals`. Use `tags.indexOf("breakfast")`.

**Validation is browser-only**: Debug tools are client-side. Code can't run them. Must test in browser and share JSON reports. The autotest URL parameter (`?autotest=CAL-CARBS-PRO-FAT`) can automate multi-config testing but still requires the browser.

**Feasibility pre-filter is intentionally loose**: The cross-constraint checks in `comboFeasible()` use slightly relaxed thresholds (e.g., 110% calorie ceiling on protein path). This is deliberate — the solver-as-filter is the real gate. Making the pre-filter too strict (e.g., 105%) caused a regression from 99.1% to 91.9% in Session 3. If adjusting thresholds, run the full 100-week validator before committing.

**Validator/simulator fallback targets**: When macro percentages are invalid, the 100-week validator, 1000-week simulator, and background validator all use hardcoded fallback targets (2000cal, 175g carbs, 200g protein, 55.6g fat). A Session 3 bug had the simulator using 2500cal — if adding new validation tools, verify they use the correct fallback.

**Swap modal dry-run scoring**: The dry-run solver calls use cloned meal data and must NOT modify actual plan state. The scoring runs the solver 2x per candidate (to reduce non-determinism from random restarts) and includes protein shake rescue logic. Batch size is 4 candidates per frame (setTimeout yielding). Try-catch wraps each candidate — a failed scoring gives fallback score 99 (incompatible). There are still some false negatives (see "What to Do Next").

**Day group colors are snapshot at generation time**: Group color assignments on day cards are captured when the plan is generated and stored with the plan. Changing day grouping after generation does NOT update the current plan's colors — they apply on next generation. Saved/loaded plans preserve their group color snapshot.

**Tabs work independently**: All Recipes, Ingredients, and Stats tabs render without a generated plan. Meal Plan and Grocery List tabs require a generated plan.

**Plans store stale data**: Plans are cloned and stored in localStorage at generation time. Changes to recipe data (ingredients, spices, variants) only appear after regenerating the plan. If a user reports missing spices or wrong ingredients, first check if they need to regenerate.

**Spice injection for variants**: Spices from `RECIPE_SPICE_OVERRIDES` are injected during `_enrichFromRegistry`. For variant-selected meals, the spice injection must happen after variant selection. A Session 5 bug caused spices to not appear for variant-selected meals in the plan — this was fixed by ensuring spice injection runs on the final selected variant, not just the base recipe.

---

## Conventions

**New ingredient**: Add to `INGREDIENT_REGISTRY` (USDA raw per-100g). Reference in recipe as `{ name: "...", grams: X }`.

**New variant**: Add `variants` array with `id`, `label`, complete `ingredients` (grams-only). Use separate registry entries for different proteins.

**New recipe checklist**:
1. Add recipe to `RECIPES[]` with grams-only ingredients. Verify all ingredient names match `INGREDIENT_REGISTRY` keys exactly.
2. Add a `RECIPE_SPICE_OVERRIDES` entry with the recipe's spices/seasonings. Research traditional spices for the dish. At minimum, savory recipes need Salt and Black Pepper.
3. Add cooking instructions to `RECIPE_COOKING_DATA`. Do NOT use numbered prefixes in the step strings (the `<ol>` element adds numbering automatically).
4. Verify instructions reference every non-spice ingredient in the ingredient list. Do NOT reference ingredients that aren't in the list (phantom ingredient bug).
5. Verify instructions name the specific spices from the `RECIPE_SPICE_OVERRIDES` entry (not vague terms like "spice blend" or "seasonings"). Salt and Black Pepper don't need explicit instruction steps.
6. Ensure every ingredient appears in ≥5 recipes. If adding a new ingredient, add it to enough recipes to meet the threshold.
7. Run 100-week validator after adding. Confirm 700/700.

**Editing cooking instructions**: Only edit `RECIPE_COOKING_DATA`. The legacy `COOKING_INSTRUCTIONS` object was deleted in Session 5. Do not recreate it. Steps should NOT include number prefixes (no "1. Cook rice" — just "Cook rice") because the `<ol>` rendering adds numbers automatically.

**canAdjust rules**: ≥50 cal, not spice, not soy sauce. Eggs in 50g steps (binder = capped). Unit items (bread, tortillas, lime, lemon, banana) not adjustable.

**Cuisine limit**: Max 2 per week (enforced during generation only, not manual swaps). **Protein shake**: Auto-added if protein >10% below target. Max 1/day, 25P/3C/1F/120cal.

**localStorage keys**: `mealprep_daygroups`, `mealprep_plans`, `mealprep_overrides`, `mealprep_stats`, `mealprep_stats_last_view`.

**Working with Claude Code**: Claude (Opus) acts as project manager, generates prompts for Code to execute. Code reads CLAUDE.md at the start of each session. Prompts should be copy/paste ready for CLI. No need to instruct Code to re-read CLAUDE.md mid-session. Split large changes into diagnostic-first, then fix prompts.

---

## Session History

- **Session 1 (2026-03-29 to 04-03)**: Built full app from scratch. 136 recipes, combo-first algorithm (pass rate 84.6%→97.6%), debug tools, day grouping, stats, variant system (22 recipes). Six major algorithm iterations.

- **Session 2 (2026-04-03)**: Data integrity overhaul. Built INGREDIENT_REGISTRY (85 entries). Comprehensive USDA audit: fixed Ground Beef (6 recipes, cooked→raw), Pork Loin (14 occurrences, wrong cut), White Rice in Egg Fried Rice (200g cooked→55g raw). Added 7 ground beef 80/90% variants. Cleaned 7 dead INGREDIENT_CATEGORIES entries. Removed duplicate Hearty Beef Tacos. Final: 135 recipes, 28 variants, 106 categories.

- **Session 3 (2026-04-04)**: Algorithm overhaul + recipe expansion. Added 8 variants (2 salmon→cod, 6 chicken→thigh) + 1 new base recipe (Baked Cod with Lemon & Herbs). Fixed critical bug: 1000-week simulator and background validator used 2500cal/187.5pro fallback instead of correct 2000cal/200pro — all previous simulator results were against wrong targets. Replaced greedy 50-iteration adjustment loop with projected gradient descent solver (exact quadratic step, random restarts). Added dynamic feasibility pre-filter with 7 cross-constraint directions. Implemented solver-as-filter architecture: tries top 10 combos through solver until one hits [95%, 105%] zone. Added solver diagnostic JSON dump (downloadable from debug panel). Final: 136 recipes, 36 variants, 100-week validation 700/700 (100%).

- **Session 4 (2026-04-04)**: Validation + UI overhaul. Validated all 5 Session 3 to-do items: solver logging already clean (1 gated warning), 1000-week simulator 700/700 with healthy distribution (136/136 recipes, no over-representation), combo variety confirmed good, variant selection skew confirmed theoretical but non-impactful (solver compensates), dynamic macro targets validated at 4 configs (1600–2500 cal) all 700/700. Added autotest URL parameter for automated multi-config validation. UI: fixed tabs to work independently without generated plan, added recipe card full-width breakout with cooking instructions, added weekly summary bar, cleaned up meal header density (2-line layout), improved protein shake visibility (styled pill), made variant labels visible (colored tag), carried group colors into day cards (snapshot at generation time), days default expanded. Smart swap modal: solver-based ranking of candidates with dry-run scoring, variant selection per candidate, protein shake in scoring, solver failure warning toast. Known issue: swap dry-run has residual false negatives from solver non-determinism.

- **Session 5 (2026-04-07)**: Data integrity + UI redesign + recipe expansion. **Data fixes**: Fixed Tuscan White Bean Soup instruction mismatch (tomato→tomato sauce). Added Ropa Vieja seasonings (oregano, cumin, black pepper, bay leaves, lemon, adobo, soy sauce) with rewritten braising instructions. Full audit of 136 recipes: fixed 43 phantom tomato references, 3 rice type mismatches, 3 duplicate Basmati Rice entries, added missing Sesame Oil/Garlic/Baked Cod instructions. **Spice system overhaul**: Replaced `CUISINE_SPICES` (per-cuisine defaults) with per-recipe `RECIPE_SPICE_OVERRIDES` for all 136 recipes — every recipe now has its own explicit spice list. Deleted legacy `COOKING_INSTRUCTIONS` object (fixed double-numbering bug in 27 recipes). Aligned all cooking instructions with spice overrides (eliminated vague "shawarma spices" etc.). Fixed spice injection bug for variant-selected meals. **UI redesign**: Renamed app to "Actual Size Optimizer". Replaced day cards with compact weekly overview table (all days visible at a glance, fixed column widths). Added meal detail modal (click any meal → ingredients, macros, servings, swap, instructions). Made settings panel always-visible and compact (macro inputs + day grouping side by side, scrollable saved plans). Pantry items show ounces in grocery list. **Recipe expansion**: Added 4 Pork Belly variants (Kimchi Fried Rice, Okonomiyaki, Miso Ramen, Egg Fried Rice) and Rolled Oats to 3 breakfast recipes (Smoothie Bowl, French Toast, Greek Yogurt Parfait) — both ingredients now meet ≥5 recipe convention. Final: 136 recipes, 40 variants, 93 registry entries, 100-week validation 700/700 (100%).
