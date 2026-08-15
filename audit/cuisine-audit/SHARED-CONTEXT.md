# Shared context — cuisine authenticity audit

You are auditing recipes from a personal meal-prep app. The owner is auditing whether each recipe is
true to the cuisine it claims. A previous session audited the 6 Peruvian recipes (the owner is Peruvian
and spotted the problems by eye); that audit is DONE and those recipes are out of scope. Your job is the
same treatment for one other slice of the book.

## HARD CONSTRAINTS — these override authenticity, always

1. **NO NUTS.** The owner cannot eat nuts. `Peanuts` was deleted from the app in an earlier session.
   Never propose adding peanuts, walnuts, cashews, almonds, pine nuts, or any tree nut — not as a
   garnish, not as a sauce base, not "traditionally this dish has X". If a dish is traditionally
   nut-based, say so in one line and propose the best nut-free version instead.
2. **NO OLIVES.** `Black Olives` was deleted app-wide in an earlier session. Never propose olives in
   any form. **`Olive Oil` is a completely separate ingredient and is fine** — it stays, it is used in
   ~40 recipes, do not flag it.
3. **Preferences outrank authenticity.** A previous session recorded this rule explicitly after both
   bans landed on traditional garnishes. Do not propose "restoring" a banned ingredient as a
   data-integrity or authenticity fix. This is the single most important rule here.
4. **Do not edit any files.** You are a researcher and reporter only. Another process applies changes.
   Do not run Edit or Write on anything in the project directory. The ONLY file you write is your
   own report, at the path given in your task.

## What the app is

Weekly meal planner that solves each day to hit macro targets. Structure you need to know:

- A recipe is `{name, cuisine, servingSize, tags, ingredients:[{name, grams}]}`. **Ingredients are
  grams-only** and the `name` must exactly match a key in `INGREDIENT_REGISTRY` or macros silently
  zero out. The available ingredients are listed in `registry.md` (read it).
- Savory recipes carry spices separately in `RECIPE_SPICE_OVERRIDES`. Zero-macro seasonings (vinegars,
  fresh chilies, aromatics) can live there without being in the registry.
- Cooking steps live in `RECIPE_COOKING_DATA` and must reference every non-spice ingredient, name
  specific spices, and mention no phantom ingredients.

So a proposed fix has three possible parts: change the ingredient list, change the spices, change the
steps. Say which.

## Your bar

Your brief states a mode.

**Mode: traditional** — the standard applied to the Peruvian audit: *the specifics ARE the dish*. Wrong
chili variety, wrong technique, a substituted staple, or a missing defining component is a finding.
Example findings from that audit: using turmeric where aji amarillo is required; putting tomato in
salsa criolla, which has none; making ceviche with mango instead of white fish and aji limo. Hold this
line. Do not accept "close enough for a home cook".

**Mode: coherence** — for `American` and `Mediterranean`, which are catch-all labels, not single
traditions. Authenticity is the wrong question. Ask instead:
  - Does the dish match what its NAME means to a cook? (A "Cobb Salad" has a defined composition.)
  - Is it internally coherent — do the ingredients, technique and steps make sense together?
  - Is the cuisine label defensible, or is this actually a specific other cuisine's dish?

## Also check, in every mode

- **Is the `cuisine` label itself correct?** Report a mislabel as its own finding. Be specific about
  what it should be. (Watch for pan-Asian or Chinese-American dishes filed under a national cuisine,
  and dishes from one country filed under a neighbour.)
- **Does the dish name match the dish?** A name promising something the ingredients don't deliver.
- **Do the cooking steps match the ingredient list?** Phantom ingredients, or ingredients never used.

## Research requirement

Verify against real sources — use WebSearch and WebFetch. Do not rely on memory alone for a factual
claim about a cuisine. Prefer sources close to the tradition (regional/national food writing, a
cookbook author from that cuisine) over generic aggregator recipe sites. Cite what you used. Two or
three checks per dish is the right depth; you are not writing an essay.

Where a dish has legitimate regional variation, say so rather than declaring one version wrong.

## Output format

Write your report to the exact path given in your task, as markdown. For EVERY recipe in your brief,
emit one block in this shape:

```
### <Recipe Name>
- **Verdict:** one of `authentic` | `minor-drift` | `significantly-off` | `mislabeled` | `not-a-real-dish`
  (in coherence mode use: `coherent` | `minor-drift` | `incoherent` | `mislabeled`)
- **Cuisine label:** `correct` — or what it should be, and why
- **Findings:** what specifically is wrong. Be concrete. "No finding" is a fine answer.
- **Proposed fix:** the exact change — ingredients to add/remove/swap (with gram amounts), spice
  changes, and any step rewording. Say "none needed" if none.
- **New ingredients required:** exact names, or `none`. Flag if NOT already in registry.md.
- **Ingredients no longer used:** exact names, or `none`.
- **Macro impact:** would the fix materially change the dish's calories/protein? rough direction only.
- **Confidence:** high | medium | low
- **Sources:** URLs or publication names you actually consulted.
```

Then end the file with:

```
## Summary
- Counts by verdict.
- The 3 worst offenders, one line each.
- Consolidated list of ALL new ingredients required across your slice.
- Consolidated list of ALL ingredients your slice would stop using.
```

Be honest. If a recipe is genuinely fine, say `authentic` / `coherent` and move on — do not invent
findings to look thorough. An audit that flags everything is as useless as one that flags nothing.

## Your final response

Return ONLY a short summary: verdict counts, the worst offenders, and the consolidated ingredient
add/drop lists. The detail belongs in the report file, not in your reply.
