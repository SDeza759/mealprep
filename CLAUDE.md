# CLAUDE.md — Project Context

## Last Updated
2026-08-14 — Sessions 12–13. S9–S11 merged to `main` and pushed. Mobile pass on the weekly table +
detail modal. Nut composites resolved as nut-free-brand-only. Swap modal's compatible/incompatible
scoring removed entirely — plain searchable list, which retires the S4 false-negative bug and
uncovered that `selectVariant` had been throwing there all along. 700/700 + 7000/7000.

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
  Tallarines Verdes.
- **`Pesto Sauce` and `Granola` are nut-free-brand-only** (S12, user's call): both stay in the registry,
  each carrying a comment on its line saying so — nut-free pesto (no pine nuts) and oat/seed granola.
  They are single registry rows for packaged products, so the data cannot express "this jar has nuts";
  the constraint lives in the shopping decision. Don't drop the comments and don't swap in macros from a
  pine-nut pesto or a nut granola.

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
- **The swap picker is an unranked list** (S13, user's call — reversed from S4): no macro-fit ranking,
  no compatible/incompatible split, no per-candidate solver dry run. It shows every recipe, favorites
  first then A–Z, searchable by name or cuisine, with each recipe's own macros. Any recipe is pickable;
  the day re-solves after the pick and `swapWarning` reports afterwards if it lands outside [95,105].
  This is what retired the S4 false-negative bug — the dry run's non-determinism was the cause, so the
  fix was deleting the dry run, not seeding it. Don't reintroduce pre-filtering into this modal.
- **`selectVariant` is module-scope in `algorithm.js` and exported** (S13). It used to be nested inside
  `generatePlan` while `index.html` called it anyway; the ReferenceError was swallowed by the scoring
  loop's try/catch, so Shawarma Bowl — the only variant recipe — silently scored "incompatible" in
  every swap for ~9 sessions. It's pure (closes over nothing), so module scope is safe. Keep it there:
  `handleSwap` needs it, because a recipe with a `variants` array has no usable base.
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
- **A swallowed exception hid a bug for 9 sessions**: the S4 swap dry-run scored each candidate inside a
  `try/catch` whose `catch` assigned score 99 — the same value meaning "incompatible". A plain
  ReferenceError was therefore indistinguishable from a genuinely infeasible recipe, which is how
  `selectVariant` being out of scope went unnoticed from S4 to S13. The scoring is gone, but the lesson
  stands: never let a catch-all map "the code broke" onto a meaningful domain value.
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
- **`.wk-narrow` is measured, not a breakpoint** (S12): the weekly table adds it when the scroller
  actually overflows (`scrollWidth > clientWidth`), re-checked every render plus a `ResizeObserver`.
  Whether meal columns sit at their `WK_MEAL_COL_W` (190px) floor depends on the day's meal count as
  much as on screen width — 6 meals bottoms out even on a wide desktop — so a `max-width` media query
  gets it wrong in both directions. Don't "simplify" it back into the `@media (max-width: 600px)` block.
- **Never set `display:flex` on `.wk-meal-cell`**: it is a `<td>`; changing its display drops it out of
  the table layout and every row collapses into a vertical stack. The narrow-mode stepper is repositioned
  with `top/bottom/left/right` on the existing absolute positioning for exactly this reason.
- **The weekly table frame lives on `.wk-table-scroll`, not `.wk-table`** (S12): `overflow:hidden` on the
  table (previously there to clip the border-radius) makes the table its own scrollport, which silently
  kills `position:sticky` on the day column. Border + radius + background belong to the scroller.
- **`.wk-name-row` reserves 56px on the right** for the absolutely-positioned stepper. Without it, long
  meal names and the favorite star render *underneath* the stepper: the star stops being tappable and a
  tap where it appears hits the stepper's "−" instead (silently changing servings). Verified by
  hit-testing `elementFromPoint` at the star's centre — 10/14 cells were unreachable before the fix.

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
- **Verify the mobile pass on a real phone.** Everything in S12 was checked at 375/768/1280px in the
  in-app browser, but `ResizeObserver` callbacks are not delivered there (the pane is hidden), so the
  *live re-check on rotate/resize* is the one path never exercised — only the measure-on-render path was.
  Rotate a phone with a 5–6 meal day and confirm `.wk-narrow` toggles. Also untested: real touch
  scrolling of the weekly table, and whether the pinned day column feels right under a thumb.
- **Variant labels now render only in the detail modal.** S13 surfaced `variantLabel` there (it had
  been stored by both `generatePlan` and `handleSwap` since S6 but displayed nowhere). The weekly-table
  cell and grocery list still don't show it — decide whether "Shawarma Bowl" needs its variant on the
  table too, where horizontal space is already tight on a phone.
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
- **Session 12**: Merged S9–S11 into `main` and pushed (`main` had been 3 commits behind). Resolved the
  nut composites as nut-free-brand-only. Mobile pass, driven by measuring the live page at 375/768/1280px
  rather than eyeballing: found the serving stepper was covering meal names and — worse — the favorite
  star, making 10/14 stars untappable and turning a tap on the star into a serving decrement; the day
  column scrolled out of view, leaving rows unidentifiable; and the detail modal's spice row was crushed
  into the narrow name column (8 wrapped lines). Fixed all three, plus the g/oz qty breaking mid-
  parenthetical. Narrow-mode is keyed on measured overflow after a viewport breakpoint proved wrong at
  tablet width with 6 meals (14 names still clipped). Two traps recorded in Fragile Areas along the way:
  `display:flex` on a `<td>` collapses the table, and `overflow:hidden` on the table kills sticky.
  For testing, the app was served over http via a throwaway `.claude/serve.js` + `launch.json` — note
  `.claude/` is gitignored, so those are local-only and a fresh clone will need them recreated (a
  no-deps Node static server on :8777; `file://` won't do, the modules need an http origin).
- **Session 13**: Gutted the swap modal's compatible/incompatible concept at the user's request —
  no ranking, no dry run, just a searchable list (favorites first, then A–Z, each row showing the
  recipe's own macros). This retires the S4 false-negative bug by deleting its cause rather than
  seeding the RNG, and drops ~100 lines plus 278 solver runs per modal open, so the picker is now
  instant instead of visibly "Scoring 139 recipes…". Removing the scoring exposed that its
  `selectVariant` call had always thrown ReferenceError (the function was nested inside
  `generatePlan`); the try/catch turned that into score 99, so Shawarma Bowl had been permanently
  mislabelled incompatible since S4. Hoisted `selectVariant` to module scope and exported it, moved
  variant selection into `handleSwap`, and rendered `variantLabel` in the detail modal — it had been
  stored on every meal since S6 and displayed nowhere. Verified swap, add-meal, the variant path and
  group propagation in-browser; 700/700 + 7000/7000, 139/139.
