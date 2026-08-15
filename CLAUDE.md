# CLAUDE.md — Project Context

## Last Updated
2026-08-15 — S15. **The cuisine audit is finished and closed** (Phase A S14, Phase B S15): all 133
non-Peruvian recipes rewritten, 13 renames, 21 relabels, 27 data bugs fixed. 700/700 + 7000/7000,
139/139 reachable, hygiene all-green. Nothing is blocked. Next job: `audit/macro-audit.html`.

## Project Overview
Multi-file HTML meal-prep optimizer ("Actual Size Optimizer"). Weekly plans vs macro targets
(default 2000cal/175C/200P/55.6F). React 18 + Babel via CDN, no build step, no server.
Entry: `index.html`. Path: `/Users/sebas/Desktop/MealPrep/`.

## File Map
- `index.html` — React App: all UI, weekly table, meal/swap modals, settings, stats; `MEAT_INGREDIENTS` Set.
- `data.js` — pure data: `INGREDIENT_REGISTRY` (147, USDA raw/100g), `RECIPES` (139, grams-only),
  `RECIPE_SPICE_OVERRIDES`, `RECIPE_COOKING_DATA`, `UNIT_INGREDIENTS`, `INGREDIENT_CATEGORIES`, `DAYS_NAMES`.
- `algorithm.js` — `generatePlan`, `adjustDayMeals` (solver), `selectVariant` (module scope, exported),
  nested `comboFeasible`, `initializeData`, exported mutable `state` (`solverDiagnostics`, `recipeRotation`).
- `grocery.js` — grocery list build/format.
- `tests/` — Node harness; `run.js` dispatches `validator` (100wk), `simulator` (1000wk), `compare` (A/B).
- `audit/cuisine-audit/phase-b/hygiene.js` — executable data-hygiene sweep. **Run after any data change.**
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
- **Nutmeg IS allowed** (S14). **`Sumac` stays out** (S15) — same family as cashew/pistachio. Both are
  settled user rulings. Don't re-ask, don't add sumac on your own judgement. Lamb Kofta Plate is the one
  recipe that wants it and is written without it.
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
  searchable by name or cuisine. The day re-solves after the pick and `swapWarning` reports afterwards if
  it lands outside [95,105]. Don't reintroduce pre-filtering — the dry run's non-determinism WAS the S4
  false-negative bug. The modal enforces no dedup either; dedup applies only during generation.
- **No cuisine cap** (S14, user's call — reverses the old ≤2/week rule). It blocked the relabelled cuisines
  from co-occurring. `weekCuisineCounts` and `seed.cuisineCounts` are gone from both files.
- **Partial regen** (`handleRegenerateSelected`): calls `generatePlan` with `excludedDays`=all non-selected
  days, merges returned days. Optional `seed` ({recipeNames}) pre-seeds week trackers from kept days so
  rerolls don't duplicate them. Grouped days reroll as a unit.
- **Manual edits are group-aware** (S11, reverses S7): swap / remove / add / serving-steppers compute the
  result ONCE from the interacted day and write an identical deep clone to every member of its group
  (`planGroupMembers(di)`, membership from the `planGroups` gen-time snapshot, not live `dayGroups`). The
  first such edit heals a previously-diverged group. Ungrouped → `[di]`. The "eaten" checkbox stays per-day.
- **Peruvian recipes are research-backed** (S11): the specifics ARE the dish (aji amarillo not turmeric;
  fresh tomato and fried potato in lomo saltado; salsa criolla has no tomato; ceviche is white fish +
  aji limo, never mango). Don't simplify them into generic adaptations. The S14/S15 audit applied the same
  bar to the other 133.
- **Harness state reset**: reset `state.recipeRotation`/`solverDiagnostics` ONCE before the week loop,
  never per-week (per-week kills rotation fairness and starves recipes).
- **All randomness goes through `rng()`** (S14), which defaults to `Math.random` so the browser is
  unchanged. `setRandomSeed(n)` (exported) swaps in mulberry32. Deliberately NOT named `seed` —
  `generatePlan`'s 8th arg already means the partial-regen dedup seed. Use `--seed=N` to replay a week.

## Fragile Areas
- **Registry name match**: recipe `name` must exactly match a key or macros silently zero out. Two
  ground-beef entries: `"Ground Beef (lean)"`, `"Ground Beef (80% lean)"`.
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
  Day-group colors likewise snapshot at gen time. **Renames orphan favorites and saved plans** (both keyed
  by recipe name) — S15 renamed 13 recipes, so expect some stale favorites.
- **Weekly-table layout, three traps** (S12): (1) `.wk-narrow` is *measured* (`scrollWidth > clientWidth`,
  per render + `ResizeObserver`), not a media query — the 190px floor depends on meal count as much as
  screen width, so 6 meals bottoms out on a wide desktop. (2) Never `display:flex` on `.wk-meal-cell` —
  it's a `<td>`; that drops it out of table layout and rows collapse into a stack. (3) The border/radius
  frame belongs on `.wk-table-scroll`, not `.wk-table` — `overflow:hidden` there makes the table its own
  scrollport and silently kills the sticky day column.
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
- **Zero-macro seasonings** (vinegars, fresh chilies, herbs) can live in `RECIPE_SPICE_OVERRIDES` instead of
  the registry — they get `isSpice:true` and zero macros automatically, and only need a grocery category.
  **Check the registry first**: `White Wine`, `Mirin`, `Dry Sherry`, `Sugar`, `Worcestershire Sauce` and
  `Parsley` are all real registry rows, and filing one as a spice silently discards 100+ cal.
- **Cooking liquid belongs in the step text, never as a `Water` ingredient.** State it proportional to the
  actual grams; a solver-shrunk 20g of lentils does not take 2 cups.
- **Edit cooking steps**: only `RECIPE_COOKING_DATA` (legacy `COOKING_INSTRUCTIONS` deleted S5).
- **canAdjust**: ≥50 cal, not spice, not soy sauce. Unit items (bread, tortillas, lime, lemon, banana) fixed.
- **Protein shake**: auto if protein >10% low; 1/day, 25P/3C/1F/120cal.
- **localStorage**: `mealprep_daygroups` (`{groups, excluded, mealCounts}` — one key holds all three),
  `mealprep_plans`, `mealprep_overrides`, `mealprep_stats`, `mealprep_stats_last_view`, `mealprep_favorites`.
- **Workflow**: `node tests/run.js validator` (700/700), then `simulator` (7000/7000), then
  `node audit/cuisine-audit/phase-b/hygiene.js`, before calling any data change done. Verify UI changes in
  the browser, don't eyeball the code.

## What to Do Next
- **`audit/macro-audit.html` (S10) — unblocked, the obvious next job.** It was held for the cuisine audit,
  which has landed. Compares 45 packaged ingredients vs Amazon Fresh; all 45 decisions still unmade. Three
  rows are dead (`Peanuts`, `Flatbread`, `Water`). Remove those, add rows for the new *packaged*
  ingredients only, then have the user review once. Decisions are keyed by ingredient name in
  localStorage, so renaming an entry loses its decision. Hand-edited 141KB static file, no generator.
- **Verify the mobile pass on a real phone.** S12 was checked at 375/768/1280px in the in-app browser, but
  `ResizeObserver` callbacks aren't delivered there, so the live re-check on rotate/resize is the one path
  never exercised. Rotate a phone with a 5–6 meal day and confirm `.wk-narrow` toggles. Touch scrolling of
  the weekly table is also untested.
- **Data backlog.** 72 registry entries are now used by fewer than 5 recipes (was 22) — an expected
  consequence of adding 46 rows to serve specific dishes, not a defect. `hygiene.js` prints the live list.
  The two that actually moved: **`Red Lentils` 5 → 1** and `Cauliflower` → 1. Raising any means authoring
  new recipes, so agree the dish list with the user first. `Wild Rice` still missing (Pan-Seared Duck uses
  a fallback).
- **Variant labels: grocery list deliberately skipped.** Table done S14. The grocery `appearances` line
  still says plain "Shawarma Bowl"; quantities are correct, so only attribution is ambiguous.

## The cuisine audit — CLOSED, do not re-run
`audit/cuisine-audit/` is a historical record, not a work queue. The reports describe the OLD recipes and
their "NOT in registry" notes are **stale** — Phase A added ~44 of the ingredients they call missing.
Do not act on those reports again.

Reusable tooling in `audit/cuisine-audit/phase-b/`: `hygiene.js` (the sweep — orphans, phantom ingredients
and seasonings, unnamed ingredients, near-duplicates, cooking-liquid ratios, `MEAT_INGREDIENTS` coverage);
`merge.js` (applies JSONL recipe records to `data.js` by line-level replacement keyed by name, validates
against a frozen vocabulary, refuses to write on any error — reusable for any future bulk recipe edit);
`out/*.jsonl` (every applied record, each with a one-line rationale in its `note` — that's the changelog).

## Session History
- **S1–S10**: built the app, the registry + USDA audit, the solver, the Node harness; split
  `data/algorithm/grocery.js` out of `index.html`; partial regen, favorites, grocery store-walk taxonomy;
  cooked→raw fix for 7 legume/pasta entries.
- **S11–S13**: group-aware manual edits, user-set meals/day, add-meal, empty days; Peruvian rebuild and
  nut removal; mobile pass on the weekly table; swap scoring → plain searchable list (retiring the S4
  false-negative bug); olives removed.
- **S14**: 14-subagent cuisine-authenticity audit of all 133 non-Peruvian recipes — **6 passed**, 32
  mislabeled, 45 minor drift, 50 needing rebuild, plus 27 data bugs I verified myself (several reviewer
  claims were wrong — always re-derive orphan/usage counts). Phase A applied: cuisine cap removed, 44
  registry rows added (103→147), `Ramen Noodles` re-based to dry, `--seed=N` added.
- **S15**: Phase B applied — all 133 recipes rewritten, 13 renames, 21 relabels, all 27 data bugs fixed,
  the 5 non-dishes rebuilt into real dishes, pool still 139. New labels `Greek` and `Moroccan` beyond the
  approved five (user approved after the fact). Registry stays 147: added `Green Lentils` + `Duck Fat`,
  removed orphans `Water` + `Lamb Leg`.
  Lessons: agents never touched `data.js` (JSONL records merged mechanically by name), which is why 7
  agent deaths from session limits cost nothing — but only because the spec forced a file write after
  *every* recipe. My own sweep found **4 phantom bugs beyond the documented 27** (`Rice Vinegar` ×2,
  `Canned Tuna`, `Mayonnaise`); `hygiene.js` now encodes every one of those checks.
