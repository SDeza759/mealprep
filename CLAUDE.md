# CLAUDE.md — Project Context

## Last Updated
2026-04-03 — Enriched by Code — codebase scan. Verified line numbers, recipe counts, function signatures, localStorage keys, and dead code state against actual implementation.

---

## Project Overview
A standalone HTML meal prep optimizer that generates personalized weekly meal plans based on user macro targets (calories, carbs, protein, fat). It produces daily recipe assignments, per-meal ingredient breakdowns with macro data, and an aggregated weekly grocery list. Built for personal use by one person (with occasional shared meals with a partner). The entire app lives in a single `index.html` file with no build step.

---

## Tech Stack & Environment

- **Runtime**: Single standalone `.html` file — opens directly in a browser, no server needed
- **UI Framework**: React 18 loaded via CDN (`react.production.min.js`, `react-dom.production.min.js`)
- **JSX Transpilation**: Babel Standalone via CDN (`@babel/standalone`) — transpiles JSX in-browser at load time
- **All scripts**: Inside `<script type="text/babel">` tags
- **No**: TypeScript, imports, module syntax, npm, build tools, bundlers, or external API calls
- **Persistence**: `localStorage` for macro targets, day grouping config, saved plans, ingredient overrides, stats history
- **Platform**: macOS (developer), accessed via browser. Mobile-compatible UI required.
- **File location**: `/Users/sebas/Desktop/MealPrep/index.html`
- **Total lines**: ~2709

---

## Architecture

The app is a single-file React SPA. All logic, data, and UI live in `index.html`.

```
index.html (2709 lines)
├── CSS Styles                           lines 10-214
├── UNIT_INGREDIENTS                     line 220  — Unit-based display (eggs, tortillas, etc.)
├── CUISINE_SPICES                       line 253  — Default spice profiles per cuisine
├── RECIPE_SPICE_OVERRIDES               line 289  — Per-recipe spice overrides
├── RECIPE_COOKING_DATA                  line 303  — Steps, prepTime, cookTime (2 formats)
├── RECIPES[]                            line 484  — Master recipe database (136 recipes)
│   └── Startup loop (line 696): totalMacros computed, spices injected,
│       cooking instructions merged, variant.totalMacros computed
│
├── INGREDIENT_CATEGORIES                line 710  — Grocery list grouping
├── DEFAULT_MACROS_PER100                line 738  — Per-100g macro lookup (auto-built)
├── applyIngredientOverrides()           line 751  — User macro overrides for ingredients
├── adjustDayMeals()                     line 770  — 50-iteration multi-objective scaling loop
│   ├── computeTotals()                  line 774  — Sum day macros
│   ├── canAdjust()                      line 787  — Ingredient eligibility (≥50cal, not unit-based)
│   └── Carb floor at 88%               line 847  — Prevents carb collapse
│
├── _recipeRotation                      line 948  — Session-level rotation tracker
├── generatePlan()                       line 959  — COMBO-FIRST meal plan generation
│   ├── rotationMultiplier()             line 981  — 0.1x–3.0x based on fair share
│   ├── selectVariant()                  line 996  — Picks best protein/carb variant per recipe
│   ├── sampleCombo()                    line 1014 — Samples 100 random day combos
│   ├── scoreCombo()                     line 1056 — Scores combos: worstDev*0.6 + avgDev*0.4
│   ├── Softmax weighted draw (τ=0.3)   line 1094
│   ├── adjustDayMeals() call            line 1168
│   ├── Breakfast display sort           line 1182
│   └── Protein shake (>10% deficit)     line 1184
│
├── buildGroceryList()                   line 1221 — Aggregates ingredients, handles servings
├── groceryQtyText()                     line 1255 — Practical unit display
├── groceryToText()                      line 1278 — Plain text export
├── STATS functions                      line 1298 — loadStats, saveStats, recordEatenMeals
├── StatsView component                  line 1357 — Stats display UI
├── App component                        line 1609 — Main React component
│   ├── State management                 line 1610-1650
│   ├── Debug panel state                line 1651-1656
│   ├── runValidation()                  line 1657 — 100-week macro accuracy validator
│   ├── runIngredientAnalysis()          line 1751 — Ingredient frequency report
│   ├── runSimulation()                  line 1782 — 1000-week distribution simulator
│   ├── UI rendering                     line 2075-2335
│   └── Swap modal                       line 2337
│
├── Background distribution sim          line 2467 — 1000-week auto-run on page load
└── Self-test suite                      line 2585 — Final architecture validation
```

**Data flow**: User sets macro targets → clicks Generate → `generatePlan()` samples 100 combos per day (with variant selection), scores them against daily targets, selects best combo via softmax draw, adjusts ingredient quantities via `adjustDayMeals()`, adds protein shake if needed → React state updated → UI renders meal plan and grocery list.

---

## File Map

- `index.html` — The entire application (2709 lines). Contains all React components, all recipe data (136 recipes), all algorithm logic, all CSS, and all JavaScript.
- `CLAUDE.md` — This file. Project context and development history.
- `.claude/` — Claude Code session configuration (auto-generated).

No other application files exist. This is intentional — the single-file constraint is a core requirement.

---

## Key Decisions & Rationale

**Single HTML file, no build step**
Chosen for simplicity and portability. The file can be opened directly from the desktop without any server, terminal, or installation. CDN-loaded React + Babel handles JSX transpilation in-browser.

**Combo-first meal selection (major architectural decision)**
Originally the algorithm selected meals sequentially (meal 1, then meal 2 aware of meal 1, then meal 3). This caused structural incompatibility failures — e.g. three ultra-lean recipes selected together with no way to recover fat targets. Replaced with combo-first: 100 candidate day combinations are sampled, hard-rejected if structurally incompatible (fat <70% or >135% of target, protein <65%, calories <72% or >140%), then scored and weighted-randomly selected. This moved pass rate from ~85% to ~97%.

**Hard rejection thresholds at combo level, not per-recipe level**
Previous approach used per-recipe hard gates (penalties applied to individual recipe scores). These were insufficient because incompatibility is a property of combinations, not individual recipes. Moved all structural checks to the combo level where the full day can be evaluated before any commitment.

**Unified recipe pool (no breakfast pool)**
Originally had separate BREAKFAST_RECIPES and MAIN_RECIPES pools with breakfast forced into certain slots. Greek Yogurt Parfait was dominating at 5.5% selection rate because it competed in a small 12-recipe pool. Unified all recipes into one pool — now any recipe can appear at any meal slot. Breakfast-appropriate recipes are visually sorted first in the day display but have no algorithmic advantage.

**Ingredient variant system**
Added a `variants` array to recipes where meaningful protein swaps exist (e.g. Chicken Breast ↔ Chicken Thigh, Pork Shoulder → Pork Loin, Salmon → Cod, with/without rice sides). Each variant is a complete ingredient array with `totalMacros` precomputed at startup. The combo scorer picks the variant that best fits the day's remaining macro budget via `selectVariant()`. Rotation tracker uses the base recipe name so variants of the same dish don't fragment distribution counts. Currently 22 recipes have variants across 5 swap types.

**Protein rescue and secondary boost: removed**
Both phases were removed during the combo-first rewrite simplification. The rescue phase (scaling best P:F ingredient up to 10x) and secondary boost (1.2x nudge) were causing protein overshoots and carb blowouts. Combo pre-validation at ≥65% protein makes them unnecessary. The protein shake handles any remaining deficit.

**RESCUE_ALLOWLIST and MEAT_FISH_NAMES: removed**
Both module-scope constants were removed after the protein rescue phase and macroNudge function were eliminated. Confirmed zero remaining references in the codebase (only in comments and dead-code test assertions).

**Shared ingredient registry: deferred**
Discussed but not yet implemented. Currently each recipe has its own inline ingredient definitions — macros are not shared. If Chicken Breast macros need updating it must be changed in every recipe. Plan is to implement a shared registry after the variant system is stable.

**Day grouping with localStorage persistence**
Users can group days to receive identical meals (e.g. Mon-Wed same meals, Thu-Fri same meals). Saved to localStorage so groupings persist across sessions. Individual days can be toggled off. Uses tap-to-select-then-tap-to-group interaction model (mobile-compatible, no drag-and-drop).

**Macro targets**
Current user targets: 2000 calories, 175g carbs, 200g protein, 55.6g fat. This is a very high-protein low-fat profile that significantly constrains recipe selection. Many algorithm decisions were made specifically to accommodate this extreme target ratio.

**5-recipe ingredient threshold**
Any ingredient appearing in fewer than 5 recipes was either consolidated into a more common ingredient or the recipe was removed. This prevents grocery waste from buying specialty ingredients that only appear once.

**No cooking instructions fetch**
Cooking instructions are hardcoded directly in the recipe database (steps array). External links were considered and rejected because recipe ingredients might differ from external sources, breaking macro accuracy.

---

## Current State

### What's Working
- Full meal plan generation with combo-first selection architecture (100 combos/day, softmax τ=0.3)
- 136 recipes across 14 cuisines: American (13), Japanese (11), Mexican (10), Italian (10), Indian (9), Middle Eastern (7), Mediterranean (7), Korean (5), Thai (4), Peruvian (4), Caribbean (4), Vietnamese (3), Spanish (3), Brazilian (3)
- 22 recipes with ingredient variants (9 chicken-breast, 6 chicken-thigh, 3 pork-loin, 2 cod, 2 no-rice)
- Macro adjustment loop (50 iterations, multi-objective scoring, anti-ping-pong, carb floor at 88%)
- Protein shake as final safety net (triggers when protein >10% below target after adjustment)
- Day grouping UI with localStorage persistence (tap to select, tap another to group, double-tap to ungroup)
- Collapsible meal plan view (day summary → meal cards → ingredient tables)
- Grocery list with practical units (e.g. "3 onions ~450g") grouped by category
- Per-meal serving size control (for sharing — affects grocery list but not personal macros)
- Stats view with recipe history, macro trends, cuisine variety, plan consistency scores
- Eaten meal tracking with Stats logging
- Swap button per meal card
- Cooking instructions per recipe (collapsible, hardcoded in two instruction objects)
- Visual breakfast-first sorting (cosmetic only, `isBreakfast` tag-based)
- Debug panel (type "debug" to activate) with:
  - 100-week macro accuracy validator (95-105% thresholds) with downloadable JSON report
  - 1000-week recipe distribution simulator with turkey recipe tracking
  - Ingredient frequency analysis with 5-recipe threshold flagging
  - Meal plan quality validator with 7 flag types and detailed flagged-day export
- Variant labels displayed as subtle muted tags on meal cards

### What's In Progress
- **Variant system tuning** — Infrastructure complete and 22 recipes have variant data. The variant selection logic (`selectVariant`) picks the best variant per recipe based on remaining macro budget during combo sampling. Self-tests show variant labels appearing correctly on meals from variant-equipped recipes. A possible regression in pass rate (97.6% → ~95.9%) was identified and a diagnosis approach is documented.

### Known Issues & Bugs

**MODERATE — Variant selection may cause fat-low regression**: After adding variant data to 22 recipes, fatLow flags may increase because `selectVariant` in `sampleCombo` (line 1035) recalculates remaining budget per meal slot within the combo, but the budget tracking uses the variant's totalMacros — if all early-combo picks choose lean variants, later picks also see a lean-favoring budget. Diagnosis and fix pending.

**Minor — Worst-case outliers**: A small number of days still hit worst-case values around 1360 calories (68%) and 135g protein (68%). These are structurally incompatible combos that survived hard rejection as the "least-bad" fallback. Not causing broad failures.

**Minor — Aji de Gallina distribution**: Consistently selects at 3.3-3.4% versus the 0.75% ideal uniform rate. Slightly over the 3% target.

**Minor — Turkey Lettuce Wraps**: Low selection rate (~4 per 1000 weeks). Structurally low-calorie and low-carb. Accepted as-is.

---

## Conventions & Patterns

**Recipe object structure** (runtime shape after startup enrichment at line 696):
```javascript
{
  name: "Grilled Chicken & Rice Bowl",   // string, unique identifier
  cuisine: "American",                    // string, one of 14 cuisines
  servingSize: "1 bowl",                 // string, display only
  tags: ["high-protein"],                // array: "breakfast", "high-protein", "comfort-food", etc.
  ingredients: [                         // base ingredient array
    { name: "Chicken Breast", grams: 180, calories: 297, carbs: 0, protein: 56, fat: 6.5 },
    // ... (spice ingredients appended at startup with isSpice: true)
  ],
  variants: [                            // optional, only on 22 recipes
    {
      id: "chicken-thigh",               // string identifier
      label: "with Chicken Thigh",       // shown as subtle tag in UI (line 2192)
      ingredients: [ /* complete ingredient list with protein swapped */ ]
      // totalMacros computed at startup (line 707-712), NOT hardcoded
    }
  ],
  totalMacros: { calories: X, carbs: X, protein: X, fat: X },  // computed at startup (line 703)
  steps: ["Step 1...", "Step 2..."],     // injected from RECIPE_COOKING_DATA (line 697)
  prepTime: "10 mins",                   // injected at startup
  cookTime: "25 mins",                   // injected at startup
  selectedVariant: null                  // set by selectVariant() during combo sampling, transient
}
```

**Macro values**: All macro values in the database use **raw uncooked** ingredient weights and nutritional values, not cooked. Source: USDA or equivalent reliable nutritional data.

**Ingredient eligibility for adjustment** (`canAdjust`, line 787):
- Must have ≥50 calories at current gram amount
- Must not be a spice (`isSpice: true`)
- Must not be Soy Sauce (excluded to prevent it dominating adjustments)
- Eggs: adjustable but only in whole increments (50g = 1 egg). If egg is not the top protein source in the recipe (binder role in pancakes, breaded dishes) it is capped at original gram amount (line 831-835).
- Bread, tortillas, lime, lemon, banana: unit-based (`UNIT_INGREDIENTS`, line 220), not adjustable

**Combo scoring formula** (`scoreCombo`, line 1056): `macroDevScore = worstDev * 0.6 + avgDev * 0.4` where deviations are absolute percentage errors against full daily targets. `macroFitWeight = clamp(2.0 - macroDevScore * 1.9, 0.1, 2.0)`. Final weight = macroFitWeight × rotationAvg.

**Combo hard rejection thresholds** (line 1071-1077):
- Fat < 70% of target → reject
- Fat > 135% of target → reject
- Protein < 65% of target → reject
- Calories < 72% of target → reject
- Calories > 140% of target → reject
- If all 100 combos rejected: relax by 10% and resample 100 more. If still all rejected: use least-bad combo (line 1085-1091).

**Rotation tracker** (`_recipeRotation`, line 948): Session-level (resets on page reload). Tracks selection count per recipe name. `rotationMultiplier` (line 981): under-selected recipes get up to 3.0x boost, over-selected get down to 0.1x. Fair share = totalSlots / RECIPES.length. Uses base recipe name so variants share the same rotation entry.

**Scale factors in adjustment loop** (line 825): `[0.5, 0.7, 0.8, 0.9, 1.1, 1.2, 1.5, 2.0, 3.0]`. Extreme factors (0, 0.2, 5.0, 8.0) were removed after combo pre-validation made structural extremes unnecessary.

**Ingredient frequency rule**: Every ingredient must appear in at least 5 recipes. Enforced via the debug panel ingredient frequency tool (`runIngredientAnalysis`, line 1751).

**Cuisine limit**: Maximum 2 appearances of any single cuisine per generated week (line 1024, 1031).

**Protein shake** (line 1184-1195): Added automatically if protein is still >10% below target after all 50 adjustment iterations. Max 1 per day. 25g protein, 3g carbs, 1g fat, 120 cal. Appears as a note on the day summary (line 2162), not as a meal card. Included in grocery list (line 2248) as total scoops needed.

**Debug panel**: Activated by typing the word `debug` anywhere on the page (keydown listener, line 1633). Hidden during normal use. All simulation results are in-memory only and never written to localStorage.

**Validator thresholds** (`runValidation`, line 1657): 95-105% of target for all four macros. ING_OVER_1000 flag at 1000g per ingredient. Pass = all four macros within threshold with no ingredient over 1000g.

**localStorage keys** (6 total):
- `mealprep_daygroups` — Day grouping config (groups array + excluded array)
- `mealprep_plans` — Saved meal plans (JSON array)
- `mealprep_overrides` — User ingredient macro overrides
- `mealprep_stats` — Stats tracking data (plan history, meals eaten)
- `mealprep_stats_last_view` — Timestamp of last stats view (for new-data badge)
- Macro target values are stored in React state, initialized from defaults (not persisted per se, but savedPlans contain the macro targets used when each plan was saved)

---

## Dependencies & External Services

- React 18 CDN: `https://unpkg.com/react@18/umd/react.production.min.js`
- ReactDOM 18 CDN: `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js`
- Babel Standalone CDN: `https://unpkg.com/@babel/standalone/babel.min.js`
- No API keys, no backend, no authentication, no external services
- No environment variables

---

## What to Do Next

1. **Diagnose and fix variant selection regression** — The `selectVariant` function in `sampleCombo` (line 996) may be causing all recipes in a combo to pick the same variant direction (all lean or all fatty) because the remaining budget calculation doesn't account for how early variant choices affect the budget for later picks. Fix should ensure variant selection produces balanced combos.

2. **Verify variant macro values** — Audit the macro values in all 22 variant ingredient arrays against USDA raw values, especially 80% vs 90% lean ground beef and Chicken Thigh values.

3. **Run full validation after variant fix** — Target: pass rate back above 97.6%, fatLow back to ≤5, protein shakes back to ≤1.5%.

4. **Implement shared ingredient registry** — After variant system is stable. This will allow updating a single ingredient's macros and having all recipes reflect the change automatically.

5. **Consider expanding variants** — Once the variant system is working correctly, evaluate whether additional protein swaps should be added beyond the current 22 recipes. Ground Beef fat-percentage variants (80%/90%) were discussed but not yet added to the 5 existing Ground Beef recipes.

6. **Clean up dead INGREDIENT_CATEGORIES entries** — Several removed ingredients still have entries in the categories object (harmless but cluttered). A previous cleanup removed 9 entries; verify no new dead entries accumulated.

---

## Fragile Areas & Warnings

**Single file constraint is absolute**: Do not suggest splitting into multiple files, adding a build step, or using npm. The app must remain a single openable HTML file.

**totalMacros is computed at startup, not hardcoded** (line 703-712): If you modify ingredient gram amounts or macros in a recipe, `totalMacros` will be recomputed correctly. Variant `totalMacros` is also computed in the same loop (line 707-712). Do not hardcode totalMacros values.

**`selectedVariant` is transient state on recipe objects**: `selectVariant()` sets `recipe.selectedVariant` directly on RECIPES array objects during combo sampling. This is overwritten on every `sampleCombo` call. Do not rely on `selectedVariant` persisting between plan generations — it reflects only the most recent sampling.

**Rotation tracker uses base recipe name for variants**: Variants of the same recipe must both use `recipe.name` (not `variant.id`) when updating the rotation tracker (line 1175). Breaking this fragments distribution counts.

**Combo hard rejection fallback** (line 1085-1091): If all 100+100 combos are rejected the algorithm falls back to the least-bad combo. Do not remove the fallback — without it the algorithm would hang.

**Carb floor in adjustment loop** (line 847 pre-check, line 908 post-check revert): Hard floor prevents day carbs from dropping below 88% during any iteration, with a post-application revert for cumulative drift. Added to fix Chicken Enchiladas + Chicken Quesadilla pairing collapse.

**Egg scaling rule** (line 831-835): Eggs adjustable only in 50g increments. If egg is NOT the top protein source in the recipe (binder role), it is capped at original gram amount. This check compares `ing.protein` against all other ingredients in the same meal.

**Olive oil eligibility**: At 8-15g (88-133 cal) passes the 50-cal threshold. At 3-5g (26-44 cal) it is correctly excluded. Documented in a code comment at line ~793.

**isBreakfast flag timing**: Set during display sort (line 1182) which runs AFTER `adjustDayMeals`. Inside `adjustDayMeals`, meal index 0 is NOT guaranteed to be a breakfast recipe. Use `meal.recipe.tags.indexOf("breakfast")` for breakfast detection.

**Two RECIPE_COOKING_DATA formats**: The file contains TWO instruction objects — one at ~line 303 (verbose format with numbered steps) and one at ~line 340 (compact format). The startup loop at line 697 uses a single `RECIPE_COOKING_DATA` variable. If a recipe's instructions are not found, check which object the name is in.

**Validator and simulations run in browser only**: The validation tools are client-side React components and `setTimeout`-based async loops. Claude Code cannot execute them directly. Run in the browser dev console and share downloaded JSON reports for analysis.

**Day grouping interacts with grocery list multiplier**: When days are grouped, ingredients are multiplied by the number of days in the group. If serving size is also >1 (for sharing meals with partner), multipliers stack. This is intentional.

---

## Session History

- **Session 1 (2026-03-29 to 2026-04-03)**: Full development session from initial build through extensive optimization. Key milestones:
  - Built complete meal prep app: macro calculator, recipe database, meal plan generation, grocery list, stats tracking
  - Iterated on recipe database extensively: removed low-protein recipes, added lean protein variants, fixed ingredient mismatches, consolidated duplicate ingredients (Cherry Tomatoes→Tomato, Mushrooms removed, Quinoa→Brown Rice, etc.)
  - Added 13 Vietnamese/Japanese/Mediterranean/American/Mexican/Indian/Caribbean/Peruvian lean recipes + 4 turkey recipes + 2 ground beef variants = 136 total
  - Added day grouping UI, collapsible meal plan view, serving size controls, eaten tracking, cooking instructions
  - Built debug panel with distribution simulator, macro validator, ingredient frequency analyzer, meal plan quality validator
  - Diagnosed and fixed severe recipe distribution bias (90 never-selected → 0 never-selected)
  - Evolved algorithm through 6 major iterations: original top-3 → softmax → sequential budget-aware → per-recipe hard gates → combo-first → combo-first + variants
  - Rewrote meal selection from sequential to combo-first architecture (pass rate 84.6% → 97.6%)
  - Unified breakfast and main recipe pools (eliminated Greek Yogurt Parfait dominance)
  - Removed protein rescue phase and secondary boost (replaced by combo pre-validation + shake)
  - Added ingredient variant system infrastructure + 22 recipes with variant data
  - Performed legacy code cleanup: hoisted constants to module scope, removed all Fix numbering comments, removed 9 dead INGREDIENT_CATEGORIES entries, updated design philosophy comments
  - Current state: variant system functional, self-tests passing, architecture rewrite complete
