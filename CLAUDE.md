# CLAUDE.md — Project Context

## Last Updated
2026-09-04 — S20. The macro audit review came back and was applied (see Key Decisions): 16 registry
rows re-based on retail labels, `Bacon` moved to USDA raw, five legume/edamame rows renamed to their
bought form, `Cherry Sauce` and `Pesto Sauce` deleted in favour of sauces made in the recipe. **The
macro audit is CLOSED** (74 rows) — don't re-review it. Registry 147 → 146, pool still 139;
700/700 + 7000/7000, 139/139, hygiene all-green, browser-verified.

## Project Overview
Multi-file HTML meal-prep optimizer ("Actual Size Optimizer"). Weekly plans vs macro targets
(default 2000cal/175C/200P/55.6F). React 18 + Babel via CDN, no build step, no server.
Entry: `index.html`. Path: `/Users/sebas/Desktop/MealPrep/`.

## File Map
- `index.html` — React App: all UI, weekly table, meal/swap modals, settings, stats; `MEAT_INGREDIENTS` Set.
- `data.js` — pure data: `INGREDIENT_REGISTRY` (146, USDA raw/100g unless a `// S20 macro audit` line
  comment names a retail label), `RECIPES` (139, grams-only),
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
over top 10 combos: accept first in-zone ([95%,105%] all 4 macros) solve with meal spread ≤1.35, else most
balanced in-zone, else shake-planned in-zone, else least-bad + deficit shake → render table.

## User Constraints (non-negotiable)
- **No nuts. No olives.** `Peanuts` (S11) and `Black Olives` (S13) removed from registry, categories and
  every recipe. `Olive Oil` is unrelated and stays — a careless grep for "olive" strips ~40 recipes.
- **Nutmeg IS allowed** (S14). **`Sumac` stays out** (S15) — same family as cashew/pistachio. Both are
  settled user rulings. Don't re-ask, don't add sumac on your own judgement. Lamb Kofta Plate is the one
  recipe that wants it and is written without it.
- **Preferences outrank authenticity.** Both bans landed on the research-backed Peruvian dishes, where
  walnuts and olives are traditional garnishes. Drop the ingredient, keep the rest of the dish, reword the
  `RECIPE_COOKING_DATA` step so it doesn't name what's gone. Never "restore" them as a data-integrity fix.
- **`Granola` is nut-free-brand-only** (S12) — the registry-line comment says so; keep it. A single row
  for a packaged product, so the rule lives in the shopping decision.
- **Pesto is made in the recipe, nut-free** (S20, user's call). `Pesto Sauce` is gone; Chicken Pesto
  Pasta, Pesto Shrimp Pasta and Grilled Salmon & Asparagus carry `Basil` + `Olive Oil` + `Parmesan
  Cheese` + `Garlic` with a pound-or-blitz step. Never write pine nuts (or any nut) back into those steps.

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
- **Manual edits are group-aware** (S11, reverses S7): swap / remove / add compute the result ONCE from
  the interacted day and deep-clone it to every group member (`planGroupMembers(di)`, membership from the
  `planGroups` gen-time snapshot, NOT live `dayGroups`). The first such edit heals a diverged group.
  Ungrouped → `[di]`. **The serving stepper is the exception** (S17, user's call): `changeServing` writes
  only `di`'s key, so grouped days can carry different serving counts. Servings feed nothing but the
  grocery list (quantities + the `(×N)` appearances label) — day macros, stats and the shake ignore them,
  so per-day servings can't desync a group's plan. The "eaten" checkbox is likewise per-day.
- **Meal balance is a preference, never a constraint** (S18). Targets constrain only DAY totals, so
  solutions are non-unique — a base-balanced pair could solve to a 3:1 calorie split. Two mechanisms,
  both of which only CHOOSE among already-in-zone solutions: (1) `adjustDayMeals` runs one extra
  deterministic solve from an even-calorie-share init, adopted only if all 4 macros stay in [95,105];
  (2) the solver-as-filter loop early-accepts an in-zone solve only at meal max/min calorie spread ≤
  `BALANCED_SPREAD` (1.35, sweep-tuned; 1.25 bought nothing more), else tries all top 10 and takes the
  most balanced in-zone result — the out-of-zone fallback (lowest maxDev) is untouched. Result: median
  spread ~1.2, 0% of days ≥2x, verified for 2–6 meals/day. Neither mechanism consumes rng (`--seed=N`
  intact). Don't turn the spread into a hard feasibility check — that WOULD cost solve rate. **6 meals
  at 2000cal fails ~96% of days in old AND new code** — six recipes can't shrink to ~333cal each;
  targets-vs-meal-count mismatch (fine at 3000cal), not a balance bug.
- **Shake-aware solving; shakes stay rare** (S18, user's call). The solver PLANS around one shake
  instead of only patching post-hoc. Preference order everywhere: (1) shakeless solve in [95,105];
  (2) solve against targets-minus-one-shake whose day-plus-shake lands in zone (`planShake`); (3)
  least-bad fallback + the legacy >10%-low deficit shake. `generatePlan` gates the shifted solve on no
  shakeless in-zone solve existing yet across combos; `solveDayShakeAware` (exported) serves
  index.html's manual edits — a fixed pair has no combo choice, which is where planning matters
  (generation: 0 shakes in 1400 days at both tested target sets). `PROTEIN_SHAKE` (exported) is the
  single macro definition. **Totals asymmetry trap**: `trySolveCombo(planShake)` counts the shake INTO
  dayTotals (the shake block only attaches the object), while `solveDayShakeAware` returns meals-only
  totals (index.html adds it exactly once). Don't "unify" one onto the other blindly.
- **The shake is removable, per day** (S18, user's call). The shake cell's × (`handleRemoveShake`,
  group-aware) re-solves the day shakeless, accepts the result even out of zone (the user's stated
  tradeoff), clears the shake slot's eaten mark, and sets `day.noShake` — which suppresses BOTH the
  planner and the deficit net on later edits of that day. Regenerating rebuilds the day object and so
  clears the opt-out — intentional, not a bug.
- **Manual re-solves anchor at the recipe's written grams** (S18, closes the bounds ratchet).
  Re-solves used to inherit the previous solution's grams as the next 0.5–3x window; repeated edits
  ratcheted anchors into infeasible corners (a sesame-oil anchor drifted to 21g forces >10g pure fat
  at its floor and alone made a day unsolvable). `baseMealIngredients` (index.html) rebuilds every
  meal from `RECIPES` by `originalName` (+ variant by `variantLabel`) before any swap/remove/
  remove-shake solve — solver output is a function of (recipes, targets), never edit history, matching
  generatePlan. Falls back to current ingredients when the name is missing (S15-renamed recipes in old
  saved plans). Deliberate side effects: one edit re-anchors ALL meals in the day, and "adjusted from
  Xg" always compares to the recipe as written.
- **Peruvian recipes are research-backed** (S11): the specifics ARE the dish (aji amarillo not turmeric;
  fresh tomato and fried potato in lomo saltado; salsa criolla has no tomato; ceviche is white fish + aji
  limo, never mango). Don't simplify into generic adaptations. S14/S15 held the other 133 to the same bar.
- **Harness state reset**: reset `state.recipeRotation`/`solverDiagnostics` ONCE before the week loop,
  never per-week (per-week kills rotation fairness and starves recipes).
- **All randomness goes through `rng()`** (S14), which defaults to `Math.random` so the browser is
  unchanged. `setRandomSeed(n)` (exported) swaps in mulberry32. Deliberately NOT named `seed` —
  `generatePlan`'s 8th arg already means the partial-regen dedup seed. Use `--seed=N` to replay a week.
- **Grocery list shows store-scale units; counts are eggs-only** (S19, user's calls). (1) The
  per-item serving-macros line is gone — `groceryServingMacros`/`groceryServingText` deleted.
  (2) All weights print as decimal pounds + total ounces ("1.5lbs / 24oz", `formatImperial`),
  no grams — grocery scales read decimal pounds. (3) Item counts survive ONLY for Egg (exact:
  the solver snaps eggs to 50g): `GROCERY_COUNTABLE` is Egg-only and `getUnitDisplay`
  (index.html — meal modal Qty + stats) is Egg-gated, so tortillas/pita/bread/banana and all
  produce show weight (grams in the meal modal). Real sizes vary too much for assumed-average
  counts — the old lime double-definition (15g/lime in `UNIT_INGREDIENTS` vs 70g/lime in
  `GROCERY_COUNTABLE`) had the meal modal claiming "4 limes" for ONE meal while the grocery tab
  claimed 4 limes for the whole week. `UNIT_INGREDIENTS` still exists for the solver (keeps unit
  items fixed). Don't reintroduce produce counts.
- **Citrus is juice + zest, never whole fruit** (S19, user's call). `Lime`/`Lemon` renamed
  `Lime Juice`/`Lemon Juice`: registry macros are USDA raw juice (25/8.4/0.4/0.1 and
  22/6.9/0.4/0.2), all 52 recipe references renamed, every cooking step reworded away from
  wedges/whole-fruit squeezing (Ceviche keeps its don't-twist-the-rinds technique note, phrased
  for fresh-squeezed juice). Both were removed from `UNIT_INGREDIENTS` — behavior-neutral: citrus
  never reaches the 50-cal canAdjust floor, so it stays solver-fixed either way. `Lemon Zest` is
  a zero-macro spice-override seasoning (category Fruit) on Shrimp Scampi, Greek Lemon Chicken
  and Baked Cod with Lemon & Herbs. `Lime Zest` deliberately does NOT exist yet — no current
  recipe uses it; add it with the first dish that does, not before. Old saved plans still carry
  "Lime"/"Lemon" ingredient names (same S15-rename staleness) until regenerated.
- **Macro audit decisions are applied** (S20; the user reviewed all 76 rows: 17 adjust / 59 keep).
  (1) Sixteen registry rows carry the retail label's per-100g values instead of USDA, each with a
  `// S20 macro audit:` comment naming the brand and the old USDA numbers: Panko Breadcrumbs, Flour
  Tortilla, Edamame, Grape Leaves, Hoisin Sauce, Hummus, Miso Paste, Soy Sauce, Fish Sauce (35 → 107),
  Mayonnaise, Mirin, Tonkatsu Sauce, Worcestershire Sauce, Feta Cheese, Paneer, Queso Fresco. Trace
  macros the label rounds to 0 went to 0 (hoisin protein, grape-leaf protein/fat, mayo carbs/protein,
  queso fresco carbs) — immaterial at recipe amounts. (2) **`Bacon` is USDA raw** (417/1.3/12.6/39.7,
  FDC 168277): the tick was "adjust" with the note "should've been raw not cooked" — bacon labels are
  per cooked slice and are never a valid target for a raw-weighed row, so don't re-base it on one.
  (3) **Bought-form names**: `Black Beans (Dry)`, `Chickpeas (Dry)`, `White Beans (Dry)`, `Kidney
  Beans (Dry)`, `Edamame (frozen)`. The dry rows kept their USDA dry macros; the 11 steps that read as
  canned ("warm the beans", "rinse and drain") now say soak overnight + simmer about an hour, so the
  grams and the method agree. (4) **`Cherry Sauce` and `Pesto Sauce` are deleted** — the jarred
  versions are dessert-sweet / nut-bearing. `Cherries (frozen)` (USDA sweet cherries raw, category
  Fruit, 60g in Pan-Seared Duck, sauce made in the pan) replaced the one; the pesto trio replaced the
  other (see User Constraints). Old saved plans carry the old ingredient names until regenerated.

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
- **Protein shake on manual edits**: every manual-edit path re-solves via `solveDayShakeAware`, then
  applies the shake exactly once (planned OR deficit), honoring `day.noShake`. Keep new paths on this
  pattern or the shake column and the day's totals disagree. Remove clears `eatenMeals`/`mealServings`
  for every group member (indices shift); add doesn't. Remove is always offered (can empty a day);
  add is hidden at ≥`MAX_MEALS` (6).
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
- **canAdjust**: ≥50 cal, not spice, not soy sauce. Unit items (bread, tortillas, banana) fixed.
  (Citrus juices sit under 50 cal at recipe amounts, so they are fixed by the calorie floor.)
- **Protein shake**: 1/day, 25P/3C/1F/120cal (`PROTEIN_SHAKE`); planned by the solver or auto-added
  at >10% protein deficit — preference order in Key Decisions.
- **localStorage**: `mealprep_daygroups` (`{groups, excluded, mealCounts}` — one key holds all three),
  `mealprep_plans`, `mealprep_overrides`, `mealprep_stats`, `mealprep_stats_last_view`, `mealprep_favorites`.
- **Workflow**: `node tests/run.js validator` (700/700), then `simulator` (7000/7000), then
  `node audit/cuisine-audit/phase-b/hygiene.js`, before calling any data change done. Verify UI changes in
  the browser, don't eyeball the code.

## What to Do Next
- **Nothing is queued from the macro audit.** The user kept `Tofu` at USDA (144/17.3) knowingly, and
  `Gram Flour`'s +56% carb delta was ruled a bad Swad label. If they revisit a row, edit the registry
  line and its `// S20 macro audit` comment, then rebuild the audit — the Δ reads live.
- **Verify the mobile pass on a real phone.** S12 was checked at 375/768/1280px in the in-app browser, but
  `ResizeObserver` callbacks aren't delivered there, so the live re-check on rotate/resize is the one path
  never exercised. Rotate a phone with a 5–6 meal day and confirm `.wk-narrow` toggles. Touch scrolling of
  the weekly table is also untested.
- **Data backlog.** 72 registry entries are used by fewer than 5 recipes — an expected consequence of
  adding 46 rows for specific dishes, not a defect; `hygiene.js` prints the live list. Only `Red Lentils`
  (5 → 1) and `Cauliflower` (→ 1) actually moved; `Cherries (frozen)` is a deliberate 1x (S20). Raising
  any means authoring recipes, so agree the dish list with the user first. `Wild Rice` still missing
  (Pan-Seared Duck uses a fallback).
- **Variant labels: grocery list deliberately skipped.** Table done S14. The grocery `appearances` line
  still says plain "Shawarma Bowl"; quantities are correct, so only attribution is ambiguous.

## The macro audit — CLOSED (S20), generator kept
The review is done and applied — don't re-review, re-verify or re-fetch rows. 74 records now (the
`Cherry Sauce`/`Pesto Sauce` records went with their registry rows); every adjusted row reads within
±1% because `ours` is live. `Bacon` deliberately still shows ⚠ cooked: the Hormel label is provenance
only. The `Kidney Beans (Dry)` record was re-based on Goya's dry bag (Fitia label) so it compares
like-for-like. The user's saved decisions are keyed by the OLD names for the 5 renamed rows, so those
cards look undecided in the browser — expected, not lost work.
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
- 70/74 rows have a label. Four cannot and say so: `Dry Sherry`, `Sake`, `White Wine` (alcohol is exempt
  from FDA labelling) and `Tteok` (imported, no US panel). Expected, not a gap.
- **Review state**: `mealprep_macro_audit_decisions` (name → keep/adjust), `mealprep_macro_audit_notes`
  (name → text, plus `__general`), `mealprep_macro_audit_sortmode` (Δ columns sort by percent or by
  grams/100g — toggle above the summary table). Note fields debounce **per field** and flush on
  blur/pagehide; one shared timer silently dropped a note when the user moved between boxes.
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
- **S17**: serving steppers unlinked from day groups (user's call) — `changeServing` writes one day's
  key instead of every group member's. Verified in the browser: a grouped pair kept identical meals
  while carrying 3 vs 1 servings, and the grocery list summed all 4. No data or algorithm change.
- **S18**: the balance-and-shake session; algorithm + index.html, no data change. Five steps, each
  gated (validator 700/700 at 5 target sets, simulator 7000/7000 + 139/139, A/B Δ0% pass rate with
  recipe shifts ≤19%, seeded replays deterministic, browser-verified): (a) meal balance — measured
  first: combos are PICKED balanced, the solver was creating the 3:1 days; (b) shake-aware solving —
  the user hand-found a legal beef-down/chicken-up + shake config the solver couldn't see while the
  shake was only a post-hoc patch; (c) removable shakes + `noShake`; (d) `BALANCED_SPREAD` 1.6→1.35
  by sweep; (e) base-anchored re-solves, after the user's Thu/Fri pair degraded across repeated edits
  (from base anchors it solves deterministically to 747/653 + shake, spread 1.14, macros 98–101%).
  Lessons: measure base-vs-solved before blaming selection; the "Japchae × Yakitori" artifact (every
  ingredient on a live slider) is what surfaced the shake insight — build the exploration tool.
- **S19**: grocery-display pass + citrus rework, all user's calls (see Key Decisions): serving-macros
  line deleted, weights → decimal-lbs + total-oz, item counts → eggs only across grocery/meal
  modal/stats. The user's screenshots exposed the lime 15g-vs-70g double-definition ("4 limes" for
  one meal AND for the whole week), which led to the citrus split: `Lime`/`Lemon` → `Lime Juice`/
  `Lemon Juice` (USDA juice macros, 52 refs, all steps reworded), `Lemon Zest` added as a spice
  seasoning on 3 recipes, `Lime Zest` intentionally deferred, both citrus rows dropped from
  `UNIT_INGREDIENTS`. Full gate green, browser-verified.
- **S20**: the macro audit review, applied. The user ticked all 76 rows (17 adjust / 59 keep, 10 notes).
  One throwaway script did the mechanical part — exact-line `replaceOnce` plus occurrence-count asserts
  on every rename, so a miscount (Chickpeas: 9, not 10) aborted before writing instead of half-applying.
  16 label re-bases + `Bacon` → USDA raw, 5 bought-form renames, 2 sauce rows replaced by in-recipe
  sauces (nut-free pesto trio; frozen cherries reduced in the duck pan), 11 canned-reading bean steps
  reworded to cook from dry. Gate green; browser-verified (meal modal shows `Chickpeas (Dry)`, grocery
  list has Basil/Parmesan/Garlic feeding Chicken Pesto Pasta, audit summary reads ok on every adjusted
  row). Lesson: an "adjust" tick with a note contradicting the label's form means re-base on the right
  form (raw), not copy the label — and say so in the record's notes.
