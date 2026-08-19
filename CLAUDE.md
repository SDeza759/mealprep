# CLAUDE.md — Project Context

## Last Updated
2026-08-18 — S16. **The macro audit is built and awaiting the user's review.** `macro-audit.html` is
now GENERATED (45 → 76 rows) with per-row + general notes fields, and all 76 keep/adjust decisions are
still unmade — that review is the only thing blocking it. `data.js` untouched; 700/700 + 7000/7000,
139/139, hygiene all-green.

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
- `audit/macro-audit.html` — GENERATED, never hand-edit. Built by `audit/macro-audit/build.js` from
  `records.json` (per-ingredient Amazon listing + label) and `template.html` (the static shell).
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
- **Variants**: only Shawarma Bowl (2). `selectVariant` is variants-only — the base is unreachable once a
  `variants` array exists, so never add 1-variant recipes (dead code); write the cut as the base instead.
  It is module-scope and exported (S13) because `handleSwap` needs it; it's pure, so that's safe. Don't re-nest.
- **Per-recipe spices**: each savory recipe owns its `RECIPE_SPICE_OVERRIDES`; sweet breakfasts may omit.
  No cuisine-default spice system (removed S5).
- **The swap picker is an unranked list** (S13, user's call — reverses S4): no ranking, no
  compatible/incompatible split, no dry run. Every recipe, favorites first then A–Z, searchable by name or
  cuisine; the day re-solves after the pick and `swapWarning` reports if it lands outside [95,105]. Don't
  reintroduce pre-filtering — the dry run's non-determinism WAS the S4 false-negative bug. No dedup here
  either; dedup applies only during generation.
- **No cuisine cap** (S14, user's call — reverses the old ≤2/week rule). It blocked the relabelled cuisines
  from co-occurring. `weekCuisineCounts` and `seed.cuisineCounts` are gone from both files.
- **Partial regen** (`handleRegenerateSelected`): calls `generatePlan` with `excludedDays`=all non-selected
  days, merges returned days. Optional `seed` ({recipeNames}) pre-seeds week trackers from kept days so
  rerolls don't duplicate them. Grouped days reroll as a unit.
- **Manual edits are group-aware** (S11, reverses S7): swap / remove / add / serving-steppers compute the
  result ONCE from the interacted day and deep-clone it to every group member (`planGroupMembers(di)`,
  membership from the `planGroups` gen-time snapshot, NOT live `dayGroups`). The first such edit heals a
  diverged group. Ungrouped → `[di]`. The "eaten" checkbox stays per-day.
- **Peruvian recipes are research-backed** (S11): the specifics ARE the dish (aji amarillo not turmeric;
  fresh tomato and fried potato in lomo saltado; salsa criolla has no tomato; ceviche is white fish + aji
  limo, never mango). Don't simplify into generic adaptations. S14/S15 held the other 133 to the same bar.
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
- **The macro audit needs ONE user review — that is the whole job.** Serve the repo, open
  `audit/macro-audit.html`, tick keep/adjust on all 76 rows (per-row notes optional), "Copy decisions",
  paste back. Only then touch the registry. Reading order:
  - **`Tofu` first**: US retail firm-tofu labels read ~86cal/10.9g protein against our USDA 144/17.3 —
    −40% cal, −37% protein, and it moves protein targets. **`Fish Sauce`** next: brands ~107 vs our 35.
  - **Ignore −100% deltas on trace macros** (`Aji Amarillo Paste`, `Mayonnaise`, `Grape Leaves`,
    `Cornstarch`) and the ±5% calorie noise on pure oils — both are label rounding at tiny servings.
  - **`Bacon`, `Kidney Beans`, `Edamame` are ⚠ form mismatches**: only cooked/canned labels exist. The
    gap is water, not error. `Gram Flour`'s +56% carb delta is a bad Swad label — Deep and USDA match us.
- **Verify the mobile pass on a real phone.** S12 was checked at 375/768/1280px in the in-app browser, but
  `ResizeObserver` callbacks aren't delivered there, so the live re-check on rotate/resize is the one path
  never exercised. Rotate a phone with a 5–6 meal day and confirm `.wk-narrow` toggles. Touch scrolling of
  the weekly table is also untested.
- **Data backlog.** 72 registry entries are used by fewer than 5 recipes — an expected consequence of
  adding 46 rows for specific dishes, not a defect; `hygiene.js` prints the live list. Only `Red Lentils`
  (5 → 1) and `Cauliflower` (→ 1) actually moved. Raising any means authoring recipes, so agree the dish
  list with the user first. `Wild Rice` still missing (Pan-Seared Duck uses a fallback).
- **Variant labels: grocery list deliberately skipped.** Table done S14. The grocery `appearances` line
  still says plain "Shawarma Bowl"; quantities are correct, so only attribution is ambiguous.

## The macro audit — GENERATED (S16)
Edit `audit/macro-audit/records.json`, run `node audit/macro-audit/build.js`. Never edit the HTML.
- **`ours` is read live from `INGREDIENT_REGISTRY`**, never stored in records.json, so the audit cannot
  drift from the app. A record whose name is missing from the registry **fails the build** with an orphan
  list. Renaming a registry entry therefore breaks the build until you rename the record — and separately
  costs that row's saved decision, since localStorage keys on ingredient name.
- **Δ maths**: `per100 = label*100/serving`, `delta = per100 - ours`, both unrounded; printed grams round
  to 1dp but the percentage comes from the *unrounded* delta, which is what sorting uses. Bands: <5% ok,
  5–15% warn, >15% bad.
- **Amazon pages do not render nutrition labels to a fetcher.** Every row pairs a real Amazon listing
  (provenance) with an aggregator (values). Don't burn a session re-trying Amazon.
- 72/76 rows have a label. Four cannot and say so: `Dry Sherry`, `Sake`, `White Wine` (alcohol is exempt
  from FDA labelling) and `Tteok` (imported, no US panel). Expected, not a gap.
- **Review state**: `mealprep_macro_audit_decisions` (name → keep/adjust) and
  `mealprep_macro_audit_notes` (name → text, plus `__general`). Note fields debounce **per field** and
  flush on blur/pagehide; one shared timer silently dropped a note when the user moved between boxes.
- **localStorage is per-origin** — reviewing over `http://localhost:8777` then reopening as `file://`
  looks like the decisions vanished. Always review through the local server.
- `extract.js` and `add-s16.js` are spent one-shots, both guarded against a second run.

## The cuisine audit — CLOSED, do not re-run
`audit/cuisine-audit/` is a historical record, not a work queue. Its reports describe the OLD recipes and
their "NOT in registry" notes are **stale** — Phase A added ~44 of the ingredients they call missing.
Reusable tooling in `phase-b/`: `hygiene.js` (the sweep — orphans, phantom ingredients and seasonings,
unnamed ingredients, near-duplicates, cooking-liquid ratios, `MEAT_INGREDIENTS` coverage); `merge.js`
(applies JSONL records to `data.js` by name-keyed line replacement, validates against a frozen vocabulary,
refuses to write on any error); `out/*.jsonl` (every applied record + rationale — that's the changelog).

## Session History
- **S1–S10**: built the app, the registry + USDA audit, the solver, the Node harness; split
  `data/algorithm/grocery.js` out of `index.html`; partial regen, favorites, grocery store-walk taxonomy;
  cooked→raw fix for 7 legume/pasta entries.
- **S11–S13**: group-aware manual edits, user-set meals/day, add-meal, empty days; Peruvian rebuild and
  nut removal; mobile pass on the weekly table; swap scoring → plain searchable list (retiring the S4
  false-negative bug); olives removed.
- **S14–S15**: the cuisine audit, start to finish. 14 subagents reviewed all 133 non-Peruvian recipes
  (only 6 passed); Phase A removed the cuisine cap, took the registry 103→147 and added `--seed=N`;
  Phase B rewrote all 133, with 13 renames and 21 relabels. Pool still 139, registry still 147.
  Lessons: agents never touched `data.js` — they emitted JSONL merged mechanically by name, which is why
  7 agent deaths cost nothing. Several reviewer claims were wrong, so **always re-derive orphan/usage
  counts yourself**; my own sweep found 4 phantom bugs beyond the 27 documented, and `hygiene.js` now
  encodes every one of those checks.
- **S16**: macro audit rebuilt as a generator and expanded 45 → 76 rows (2 dead removed, 33 packaged
  ingredients added), plus per-row and general notes fields. No `data.js` change — every finding is queued
  behind one user review. Lesson: extracting the hand-written file into records and proving the generator
  **reproduced it byte-for-byte** before adding anything is what exposed 3 real arithmetic errors; they
  were the only diffs left once the round-trip was clean.
