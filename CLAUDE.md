# CLAUDE.md — Project Context

## Last Updated
2026-08-14 — Session 11. UI: group-aware manual edits, user-set meals/day, add-meal. Data: recipe-pool
cleanup (141→139), all nuts removed, Peruvian dishes rebuilt from researched traditional recipes.
700/700 + 7000/7000, 139/139 reachable. Details in Key Decisions / Fragile Areas / Session History.

## Project Overview
Multi-file HTML meal-prep optimizer ("Actual Size Optimizer"). Weekly plans vs macro targets
(default 2000cal/175C/200P/55.6F). React 18 + Babel via CDN, no build step, no server.
Entry: `index.html`. Path: `/Users/sebas/Desktop/MealPrep/`.

## File Map
- `index.html` — React App: all UI, weekly table, meal/swap modals, settings, stats; `MEAT_INGREDIENTS` Set.
- `data.js` — pure data: `INGREDIENT_REGISTRY` (104, USDA raw/100g), `RECIPES` (139, grams-only),
  `RECIPE_SPICE_OVERRIDES`, `RECIPE_COOKING_DATA`, `UNIT_INGREDIENTS`, `INGREDIENT_CATEGORIES`, `DAYS_NAMES`.
- `algorithm.js` — `generatePlan`, `adjustDayMeals` (solver), nested `selectVariant`/`comboFeasible`,
  `initializeData`, exported mutable `state` (`solverDiagnostics`, `recipeRotation`).
- `grocery.js` — grocery list build/format.
- `tests/` — Node CLI harness; `run.js` dispatches `validator` (100wk), `simulator` (1000wk), `compare` (A/B).

Load order: data.js → algorithm.js → grocery.js → `initializeData()` → babel App. Output → `tests/output/`.

## Data Flow
Set targets + meals/day → sample 100 combos/day → feasibility pre-filter → softmax rank → solver-as-filter
(try top 10 combos until one solves to [95%,105%] on all 4 macros) → add protein shake if protein >10% low
→ render table.

## User Constraints (non-negotiable)
- **No nuts, anywhere.** `Peanuts` was removed from the registry and from 5 recipes in S11. Do not
  reintroduce any nut — including pecans/walnuts, which are otherwise traditional in Aji de Gallina and
  Tallarines Verdes. `Pesto Sauce` (pine nuts) and `Granola` are unresolved composites — see What to Do Next.

## Key Decisions (don't reverse)
- **Combo-first**: evaluate full-day combos, not sequential picks — avoids structural incompatibility.
- **Solver-as-filter**: gradient-descent solver IS the feasibility check; combos that can't hit [95%,105%]
  are rejected, next-best tried (≤10/day). Pre-filter only catches obviously-bad combos.
- **Dynamic feasibility**: thresholds derive from user targets; only fixed zone is [95%,105%].
- **Meals/day is the user's call**: `generatePlan`'s optional 9th arg `mealCounts` ({dayIndex: n}, 1–6)
  overrides the legacy calorie/parity heuristic, and an explicit count is never silently overridden. The UI
  must pass a DENSE 7-day map (`resolvedMealCounts()`) — its state is sparse, and any gap falls through to
  the heuristic and contradicts the number on screen. Omit the arg entirely (as the harness does) for legacy.
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
  days so rerolls don't duplicate them. Grouped days reroll as a unit.
- **Manual edits are group-aware** (S11, reversed from S7): swap / remove / add / serving-steppers compute
  the result ONCE from the interacted day and write an identical deep clone to every member of its group
  (`planGroupMembers(di)`, membership from the `planGroups` gen-time snapshot, not live `dayGroups`). Grouped
  days therefore always hold identical data, and the first such edit heals a previously-diverged group.
  Ungrouped days return `[di]`. Exception: the "eaten" checkbox stays per-day.
- **Peruvian recipes are research-backed** (S11): built from Peruvian sources, not generic adaptations.
  Don't "simplify" them back — the specifics ARE the dish (aji amarillo not turmeric; fresh tomato and fried
  potato in lomo saltado; salsa criolla has no tomato; ceviche is white fish + aji limo, never mango).
- **Harness state reset**: reset `state.recipeRotation`/`solverDiagnostics` ONCE before the week loop, never
  per-week (per-week kills rotation fairness, starves recipes).

## Fragile Areas
- **Registry name match**: recipe `name` must exactly match a key or macros zero out. Two ground-beef entries:
  `"Ground Beef (lean)"`, `"Ground Beef (80% lean)"`.
- **Combo fallback + 3-meal retry**: all-rejected → least-bad; if below floor (65% cal / 55% pro) on a 2-meal
  day, force one 3-meal retry. Removing either path risks infinite loops / catastrophic days. The retry is
  gated on `!userCount` so an explicit meal count is honored even when the day lands off-target.
- **Solver bounds [0.5,3.0]**: scale range affects feasibility — changing it requires updating `comboFeasible`.
- **Carb floor**: carb weight ×4 when carbs <88% of target (relaxes to 80% if protein binds).
- **Egg scaling**: 50g increments; binder eggs capped at original grams; snapped after each solver step.
- **isBreakfast in `adjustDayMeals`**: detect via `tags.indexOf("breakfast")`, not meal index.
- **Pre-filter is intentionally loose** (e.g. 110% cal ceiling on protein path). Too strict caused a S3
  regression to 91.9%. Run validator after touching it.
- **Module `state`**: mutate in place (`arr.length=0`), never rebind from outside, or browser/harness diverge.
- **Swap dry-run scoring**: clones data (must not mutate plan); runs solver 2× per candidate; failure → score
  99 (incompatible). Known false negatives (see What to Do Next).
- **Add-meal rides on the swap modal**: `swapTarget.isAdd` sets `mealIdx = day.meals.length` (one past the
  end), so the candidate is appended and every existing meal counts as used budget. Both paths leave
  `newMeals[mi]` holding the chosen recipe — keep that invariant, everything downstream depends on it.
- **Protein shake on manual edits**: every manual-edit path re-solves and then re-evaluates the shake from
  scratch, mirroring `generatePlan`. Keep new paths on this pattern or the shake column and the day's totals
  will disagree. Remove clears `eatenMeals`/`mealServings` for every group member (indices shift); add does
  not (appending keeps indices valid). Remove is always offered (taking the last meal empties the day);
  add is hidden at ≥`MAX_MEALS` (6).
- **`plan` is a SPARSE array**: `generatePlan` returns `new Array(7)` and only assigns non-excluded days,
  so excluded days are holes. `Array.prototype.map` SKIPS holes, so `plan.map(...)` silently drops any day
  you try to write at a hole index — which broke re-including a day. Build new plans with
  `Array.from({length:7}, ...)` instead. (Loading a saved plan turns holes into nulls, so handle both.)
- **Empty days are a valid state**: removing a day's last meal leaves `meals: []`, zero totals and no shake.
  Such a day still renders its row so it can be refilled, but is skipped by the weekly averages — counting
  it would divide them down as if it were a 0-calorie day that was eaten. Any new per-day aggregate must
  skip `meals.length === 0` the same way.
- **Plans store stale data**: cloned to localStorage at gen time; recipe edits show only after regenerating.
- **Day-group colors snapshot at gen time**: regrouping after generation doesn't recolor the current plan.

## Conventions
- **New ingredient**: add to `INGREDIENT_REGISTRY` (USDA raw/100g); reference `{name,grams}`; add to
  `INGREDIENT_CATEGORIES` (grocery) and `MEAT_INGREDIENTS` Set if flesh meat. Non-USDA sources (jarred
  products) are acceptable when no USDA entry exists — note the provenance in a comment on the line.
- **New recipe**: add to `RECIPES` (names match registry) + `RECIPE_SPICE_OVERRIDES` (savory ≥ Salt + Black
  Pepper) + `RECIPE_COOKING_DATA` (no number prefixes; reference every non-spice ingredient, no phantoms, name
  specific spices). Aim ≥5 recipes/ingredient. Run validator (700/700) then simulator.
- **Zero-macro seasonings** (vinegar, fresh chilies) can live in `RECIPE_SPICE_OVERRIDES` instead of the
  registry — they get `isSpice:true` and zero macros automatically, and only need a grocery category.
- **Edit cooking steps**: only `RECIPE_COOKING_DATA` (legacy `COOKING_INSTRUCTIONS` deleted S5).
- **canAdjust**: ≥50 cal, not spice, not soy sauce. Unit items (bread, tortillas, lime, lemon, banana) fixed.
- **Cuisine** 2/wk (generation only). **Protein shake**: auto if protein >10% low; 1/day, 25P/3C/1F/120cal.
- **localStorage**: `mealprep_daygroups` (`{groups, excluded, mealCounts}` — one key holds all three),
  `mealprep_plans`, `mealprep_overrides`, `mealprep_stats`, `mealprep_stats_last_view`, `mealprep_favorites`.
- **Workflow**: run `node tests/run.js validator` (often `simulator`) before any data change is done.
- **Data hygiene after recipe changes**: sweep for registry entries no recipe references (an orphan is
  otherwise invisible), and scan all recipe pairs for ingredient overlap to catch near-duplicates. Those two
  checks found the Beef Japchae duplicate, the cod-labelled-as-salmon bug, and 3 orphaned ingredients in S11.

## What to Do Next
- **S11 is on an unmerged branch** — `s11-meal-editing-and-peruvian-overhaul`, pushed to origin. It also
  carries the S9 and S10 commits, which had never been pushed. `main` on GitHub is still 3 commits behind.
  Merge or PR it, then delete this bullet.
- **Nut-adjacent composites** (user decision pending): `Pesto Sauce` traditionally contains pine nuts (3
  recipes) and `Granola` commonly contains nuts (3 breakfasts). Single registry rows for packaged products,
  so the app can't tell if a given jar/bag has nuts. If the no-nuts rule is an allergy, these need nut-free
  brands or removal.
- **Mobile UX**: weekly table + modal untested ≤600px; columns may be too narrow. Isolated to `index.html`.
- **Swap false negatives** (since S4): solver non-determinism flags workable recipes incompatible. Add
  seeded-RNG mode + A/B the dry-run zone width ([95,105] vs [93,107]).
- **Pending audit review**: `audit/macro-audit.html` (S10) compares 45 packaged ingredients vs Amazon
  Fresh; user is reviewing keep/adjust per item. Open brand-variance candidates: Pesto Sauce,
  Cheddar/Mozzarella (whole vs part-skim), Chickpeas (~17% cal), nonfat Greek Yogurt.
- **Backlog**: UI warn when `4C+4P+9F > cal`; add `Wild Rice`/`Shallots` (Pan-Seared Duck uses fallbacks);
  raise below-5-recipe ingredients (Cherry Sauce, Duck Breast/Leg, Hoisin, Cod, Flour, Kimchi, Paneer);
  drop dead `UNIT_INGREDIENTS` keys `Sub Roll`/`Nori Seaweed`; optional `--seed=N` harness flag.

## Session History
- **Sessions 1–2**: Built app from scratch (combo-first algorithm, day grouping, stats). Data-integrity
  overhaul: built `INGREDIENT_REGISTRY`; USDA audit (ground beef/pork/rice cooked→raw).
- **Session 3**: Projected gradient-descent solver; dynamic feasibility pre-filter; solver-as-filter. 700/700.
- **Session 4**: Validated dynamic targets across 4 configs. UI overhaul; smart swap modal (solver-ranked).
  Known issue: swap false negatives.
- **Session 5**: `CUISINE_SPICES` → per-recipe `RECIPE_SPICE_OVERRIDES`; deleted `COOKING_INSTRUCTIONS`.
  Dashboard redesign (weekly table, detail modal).
- **Session 6**: Data-integrity sweep. Extracted `data.js`/`algorithm.js`/`grocery.js` from `index.html`;
  built Node harness; fixed rotation-reset bug. Flattened 40/41 variants (kept Shawarma Bowl).
- **Session 7**: Partial day regeneration (multi-select, group-aware, `seed`-deduped) + remove-meal.
- **Session 8**: Favorites tab — UI-only bookmark list keyed by recipe name (`mealprep_favorites`).
- **Session 9**: Grocery category revamp — 7 buckets → 9-category store-walk taxonomy + "Other" fallback.
- **Session 10**: Cooked→raw fix for 7 legume/pasta/noodle entries (USDA raw macros + proportional gram
  rescale across 45 occurrences so dish nutrition is preserved). Per-serving macros in the grocery list.
- **Session 11**: Large multi-part session. **UI**: manual edits made group-aware (reversing S7's per-day
  divergence); meals-per-day exposed to the user (was hardcoded to day-index parity, which pinned any
  Mon-starting group to 3 meals forever); add-meal built on the swap modal, since a removed meal previously
  could not be replaced without regenerating; weekly table given horizontal scroll for 4–6 meal days;
  a day can now be emptied (remove its last meal) and refilled, including one that was excluded when the
  plan was generated — which surfaced the sparse-array `map` bug now recorded in Fragile Areas.
  **Data** (141→139 recipes, registry 104): merged the Beef Japchae/Japchae duplicate; fixed three "salmon"
  recipes that were made of cod; removed Sausage Flatbread, Caprese Panini, Shrimp Ceviche Bowl; deleted all
  nuts app-wide; dropped 3 orphaned ingredients; rebuilt the 6 Peruvian dishes from researched sources and
  added Causa Limena + Tallarines Verdes con Bistec. 700/700 + 7000/7000 throughout.
