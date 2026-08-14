# CLAUDE.md — Project Context

## Last Updated
2026-08-14 — S13. Swap picker is now an unranked searchable list (retires the S4 false-negative bug);
`selectVariant` hoisted + exported; olives removed app-wide. 700/700 + 7000/7000, 139/139 reachable.

## Project Overview
Multi-file HTML meal-prep optimizer ("Actual Size Optimizer"). Weekly plans vs macro targets
(default 2000cal/175C/200P/55.6F). React 18 + Babel via CDN, no build step, no server.
Entry: `index.html`. Path: `/Users/sebas/Desktop/MealPrep/`.

## File Map
- `index.html` — React App: all UI, weekly table, meal/swap modals, settings, stats; `MEAT_INGREDIENTS` Set.
- `data.js` — pure data: `INGREDIENT_REGISTRY` (103, USDA raw/100g), `RECIPES` (139, grams-only),
  `RECIPE_SPICE_OVERRIDES`, `RECIPE_COOKING_DATA`, `UNIT_INGREDIENTS`, `INGREDIENT_CATEGORIES`, `DAYS_NAMES`.
- `algorithm.js` — `generatePlan`, `adjustDayMeals` (solver), `selectVariant` (module scope, exported),
  nested `comboFeasible`, `initializeData`, exported mutable `state` (`solverDiagnostics`, `recipeRotation`).
- `grocery.js` — grocery list build/format.
- `tests/` — Node harness; `run.js` dispatches `validator` (100wk), `simulator` (1000wk), `compare` (A/B).
- Local-only: `.claude/serve.js` + `launch.json` serve the app on :8777 for browser testing. `.claude/` is
  gitignored, so recreate if missing (no-deps Node static server; `file://` won't work, modules need http).

Load order: data.js → algorithm.js → grocery.js → `initializeData()` → babel App. Output → `tests/output/`.

## Data Flow
Set targets + meals/day → sample 100 combos/day → feasibility pre-filter → softmax rank → solver-as-filter
(try top 10 combos until one solves to [95%,105%] on all 4 macros) → add protein shake if protein >10% low
→ render table.

## User Constraints (non-negotiable)
- **No nuts. No olives.** `Peanuts` (S11) and `Black Olives` (S13) removed from registry, categories and
  every recipe. `Olive Oil` is unrelated and stays — a careless grep for "olive" strips ~40 recipes.
- **Preferences outrank authenticity.** Both bans landed on the research-backed Peruvian dishes, where
  walnuts and olives are traditional garnishes. Drop the ingredient, keep the rest of the dish, reword the
  `RECIPE_COOKING_DATA` step so it doesn't name what's gone. Never "restore" them as a data-integrity fix.
- **`Pesto Sauce` / `Granola` are nut-free-brand-only** (S12) — a comment on each registry line says so.
  Single rows for packaged products, so the rule lives in the shopping decision. Keep the comments.

## Key Decisions (don't reverse)
- **Combo-first**: evaluate full-day combos, not sequential picks — avoids structural incompatibility.
- **Solver-as-filter**: the gradient-descent solver IS the feasibility check; combos that can't hit
  [95%,105%] are rejected, next-best tried (≤10/day). Pre-filter only catches obviously-bad combos.
- **Dynamic feasibility**: thresholds derive from user targets; only fixed zone is [95%,105%].
- **Meals/day is the user's call**: `generatePlan`'s optional 9th arg `mealCounts` ({dayIndex: n}, 1–6)
  overrides the legacy calorie/parity heuristic and is never silently overridden. The UI must pass a DENSE
  7-day map (`resolvedMealCounts()`) — its state is sparse and any gap falls back to the heuristic,
  contradicting the number on screen. Omit the arg entirely (as the harness does) for legacy behaviour.
- **Registry is single source**: recipes are `{name,grams}` only, never inline macros. Always USDA raw.
- **Unified pool**: any recipe in any slot; breakfast tag only sorts first visually.
- **Variants**: only Shawarma Bowl (2). `selectVariant` is variants-only — the base is unreachable when a
  `variants` array exists. Never add 1-variant recipes (dead code); write the cut as the base instead.
- **`selectVariant` is module-scope and exported** (S13). `handleSwap` needs it, since a recipe with a
  `variants` array has no usable base. It's pure, so module scope is safe. Don't re-nest it.
- **Per-recipe spices**: each savory recipe owns its `RECIPE_SPICE_OVERRIDES`; sweet breakfasts may omit.
  No cuisine-default spice system (removed S5).
- **The swap picker is an unranked list** (S13, user's call — reverses S4): no macro-fit ranking, no
  compatible/incompatible split, no per-candidate dry run. Every recipe, favorites first then A–Z,
  searchable by name or cuisine. Any recipe is pickable; the day re-solves after the pick and
  `swapWarning` reports afterwards if it lands outside [95,105]. Don't reintroduce pre-filtering here —
  the dry run's non-determinism WAS the S4 false-negative bug.
- **No swap guardrails**: the modal does not enforce dedup or cuisine limit. Cuisine ≤2/wk and recipe
  dedup apply only during generation.
- **Partial regen** (`handleRegenerateSelected`): calls `generatePlan` with `excludedDays`=all non-selected
  days, merges returned days. Optional `seed` ({recipeNames,cuisineCounts}) pre-seeds week trackers from
  kept days so rerolls don't duplicate them. Grouped days reroll as a unit.
- **Manual edits are group-aware** (S11, reverses S7): swap / remove / add / serving-steppers compute the
  result ONCE from the interacted day and write an identical deep clone to every member of its group
  (`planGroupMembers(di)`, membership from the `planGroups` gen-time snapshot, not live `dayGroups`). The
  first such edit heals a previously-diverged group. Ungrouped → `[di]`. The "eaten" checkbox stays per-day.
- **Peruvian recipes are research-backed** (S11): the specifics ARE the dish (aji amarillo not turmeric;
  fresh tomato and fried potato in lomo saltado; salsa criolla has no tomato; ceviche is white fish +
  aji limo, never mango). Don't simplify them into generic adaptations.
- **Harness state reset**: reset `state.recipeRotation`/`solverDiagnostics` ONCE before the week loop,
  never per-week (per-week kills rotation fairness and starves recipes).

## Fragile Areas
- **Registry name match**: recipe `name` must exactly match a key or macros zero out. Two ground-beef
  entries: `"Ground Beef (lean)"`, `"Ground Beef (80% lean)"`.
- **Combo fallback + 3-meal retry**: all-rejected → least-bad; if below floor (65% cal / 55% pro) on a
  2-meal day, force one 3-meal retry. Removing either path risks infinite loops / catastrophic days. The
  retry is gated on `!userCount` so an explicit meal count is honored even when the day lands off-target.
- **Solver bounds [0.5,3.0]**: changing the scale range requires updating `comboFeasible`.
- **Carb floor**: carb weight ×4 when carbs <88% of target (relaxes to 80% if protein binds).
- **Egg scaling**: 50g increments; binder eggs capped at original grams; snapped after each solver step.
- **isBreakfast in `adjustDayMeals`**: detect via `tags.indexOf("breakfast")`, not meal index.
- **Pre-filter is intentionally loose** (e.g. 110% cal ceiling on protein path). Too strict caused a S3
  regression to 91.9%. Run validator after touching it.
- **Module `state`**: mutate in place (`arr.length=0`), never rebind from outside, or browser/harness diverge.
- **Never map "code broke" onto a domain value**: the S4 dry run scored candidates in a `try/catch` whose
  `catch` assigned 99 — the same value meaning "incompatible". A ReferenceError was therefore
  indistinguishable from an infeasible recipe, hiding a real bug from S4 to S13.
- **Add-meal rides on the swap modal**: `swapTarget.isAdd` sets `mealIdx = day.meals.length` (one past the
  end), so the candidate is appended and every existing meal counts as used budget. Both paths leave
  `newMeals[mi]` holding the chosen recipe — everything downstream depends on that invariant.
- **Protein shake on manual edits**: every manual-edit path re-solves then re-evaluates the shake from
  scratch, mirroring `generatePlan`. Keep new paths on this pattern or the shake column and the day's
  totals disagree. Remove clears `eatenMeals`/`mealServings` for every group member (indices shift); add
  doesn't. Remove is always offered (can empty a day); add is hidden at ≥`MAX_MEALS` (6).
- **`plan` is a SPARSE array**: `generatePlan` returns `new Array(7)` and only assigns non-excluded days.
  `Array.prototype.map` SKIPS holes, so `plan.map(...)` silently drops any day written at a hole index.
  Build new plans with `Array.from({length:7}, ...)`. (A saved plan turns holes into nulls — handle both.)
- **Empty days are valid**: `meals: []`, zero totals, no shake. The row still renders so it can be refilled,
  but is skipped by the weekly averages — any new per-day aggregate must skip `meals.length === 0` too.
- **Plans store stale data**: cloned to localStorage at gen time; recipe edits show only after regenerating.
  Day-group colors likewise snapshot at gen time.
- **Weekly-table layout, three traps** (S12): (1) `.wk-narrow` is *measured* (`scrollWidth > clientWidth`,
  re-checked per render + `ResizeObserver`), not a media query — whether columns sit at their 190px floor
  depends on meal count as much as screen width, so 6 meals bottoms out even on a wide desktop. (2) Never
  `display:flex` on `.wk-meal-cell` — it's a `<td>`; that drops it out of table layout and rows collapse
  into a vertical stack. (3) The border/radius frame belongs on `.wk-table-scroll`, not `.wk-table` —
  `overflow:hidden` on the table makes it its own scrollport and silently kills the sticky day column.
- **`.wk-name-row` reserves 56px** for the absolutely-positioned stepper. Without it, long names and the
  favorite star render *underneath* it: the star stops being tappable and a tap there hits the stepper's
  "−", silently changing servings (was 10/14 cells).

## Conventions
- **New ingredient**: add to `INGREDIENT_REGISTRY` (USDA raw/100g); reference `{name,grams}`; add to
  `INGREDIENT_CATEGORIES` (grocery) and `MEAT_INGREDIENTS` Set if flesh meat. Non-USDA sources (jarred
  products) are fine when no USDA entry exists — note provenance in a comment on the line.
- **New recipe**: add to `RECIPES` (names match registry) + `RECIPE_SPICE_OVERRIDES` (savory ≥ Salt + Black
  Pepper) + `RECIPE_COOKING_DATA` (no number prefixes; reference every non-spice ingredient, no phantoms,
  name specific spices). Aim ≥5 recipes/ingredient.
- **Zero-macro seasonings** (vinegar, fresh chilies) can live in `RECIPE_SPICE_OVERRIDES` instead of the
  registry — they get `isSpice:true` and zero macros automatically, and only need a grocery category.
- **Edit cooking steps**: only `RECIPE_COOKING_DATA` (legacy `COOKING_INSTRUCTIONS` deleted S5).
- **canAdjust**: ≥50 cal, not spice, not soy sauce. Unit items (bread, tortillas, lime, lemon, banana) fixed.
- **Cuisine** 2/wk (generation only). **Protein shake**: auto if protein >10% low; 1/day, 25P/3C/1F/120cal.
- **localStorage**: `mealprep_daygroups` (`{groups, excluded, mealCounts}` — one key holds all three),
  `mealprep_plans`, `mealprep_overrides`, `mealprep_stats`, `mealprep_stats_last_view`, `mealprep_favorites`.
- **Workflow**: `node tests/run.js validator` (700/700), then `simulator` (7000/7000), before calling any
  data change done. Verify UI changes in the browser, don't eyeball the code.
- **Data hygiene after recipe changes**: sweep for registry entries no recipe references, for recipe
  ingredients missing from the registry, and for cooking steps naming a removed ingredient. Also scan
  recipe pairs for ingredient overlap to catch near-duplicates. These found the Japchae duplicate, the
  cod-labelled-as-salmon bug, and 3 orphans. Note ~8 registry entries look orphaned but are spices reached
  via `RECIPE_SPICE_OVERRIDES` — check there before deleting.

## What to Do Next
- **Verify the mobile pass on a real phone.** S12 was checked at 375/768/1280px in the in-app browser, but
  `ResizeObserver` callbacks aren't delivered there, so the live re-check on rotate/resize is the one path
  never exercised. Rotate a phone with a 5–6 meal day and confirm `.wk-narrow` toggles. Touch scrolling of
  the weekly table is also untested.
- **Variant labels render only in the detail modal** (S13). The weekly-table cell and grocery list don't
  show them — decide whether the table needs it, where horizontal space is already tight on a phone.
- **Pending audit review**: `audit/macro-audit.html` (S10) compares 45 packaged ingredients vs Amazon Fresh;
  user reviewing keep/adjust per item. Open brand-variance candidates: Pesto Sauce, Cheddar/Mozzarella
  (whole vs part-skim), Chickpeas (~17% cal), nonfat Greek Yogurt.
- **Data backlog**: add `Wild Rice`/`Shallots` (Pan-Seared Duck uses fallbacks); raise below-5-recipe
  ingredients (Cherry Sauce, Duck Breast/Leg, Hoisin, Cod, Flour, Kimchi, Paneer). Both mean authoring new
  recipes — agree the dish list with the user first.
- **`--seed=N` harness flag — deferred on purpose.** Cheap (only 2 `Math.random()` sites in `algorithm.js`)
  but its motivation died with the S13 dry run, and the harness has been 7000/7000 for many sessions. Add
  it the first time a run drops below 100% and a week needs reproducing. `generatePlan`'s existing `seed`
  arg is the partial-regen dedup seed — pick another name.

## Session History
- **S1–6**: built the app; `INGREDIENT_REGISTRY` + USDA audit; gradient-descent solver and solver-as-filter;
  per-recipe spices; split `data/algorithm/grocery.js` out of `index.html`; built the Node harness;
  flattened 40/41 variants.
- **S7–10**: partial day regeneration + remove-meal; favorites tab; grocery store-walk taxonomy;
  cooked→raw fix for 7 legume/pasta entries (with proportional gram rescale) + per-serving grocery macros.
- **S11**: manual edits made group-aware; meals/day exposed to the user; add-meal; days can be emptied and
  refilled. Data 141→139: merged a duplicate, fixed 3 cod-as-salmon recipes, removed all nuts, rebuilt the
  6 Peruvian dishes from research, added Causa Limena + Tallarines Verdes.
- **S12**: merged S9–S11 to `main`. Mobile pass on the weekly table + detail modal, driven by measuring the
  live page rather than eyeballing — found the stepper covering meal names and making 10/14 favorite stars
  untappable, the day column scrolling out of view, and a crushed spice row.
- **S13**: replaced swap scoring with a plain searchable list, which retired the S4 false-negative bug and
  exposed that `selectVariant` had been throwing there since S4 (hoisted + exported; variant selection
  moved into `handleSwap`; `variantLabel` finally rendered). Backlog: dropped 2 dead `UNIT_INGREDIENTS`
  keys; found the `4C+4P+9F > cal` warning already implemented and stricter than specified (and wrong as
  literally written — fat rounds to 1dp, so the shipped defaults give 2000.4 > 2000). Removed olives.
