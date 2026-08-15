# Phase B — apply-the-fix spec (read this fully before writing anything)

The cuisine audit is **finished**. You are not auditing. You are the hand that applies an already-approved
set of fixes. Your job is mechanical translation with judgement: turn the prose "Proposed fix" in your
slice's report into exact JSON records.

**Do not re-research the cuisine. Do not second-guess the verdicts.** The owner approved the full scope.
The one thing you may override is a fix that is impossible under the frozen vocabulary (see below) — in
that case you substitute the closest legal thing and record it in `blocked`.

## Your three inputs

1. `audit/cuisine-audit/phase-b/VOCAB.md` — the **frozen** ingredient + spice vocabulary. Read it first.
2. `audit/cuisine-audit/briefs/<your-slice>.md` — the current state of every recipe in your slice,
   verbatim from `data.js`. This is what you are editing.
3. `audit/cuisine-audit/reports/<your-slice>.report.md` — the audit findings and the proposed fix per
   recipe. This is your instruction sheet. Read the "Cross-cutting issues" section at the top if present:
   it applies to several recipes and the per-recipe blocks refer back to it.

## NEVER touch `data.js` or any other project file

You write exactly one file: your output `.jsonl`. Another process merges it. If you edit `data.js`
you will corrupt a 145 KB file that four other agents are also being merged into.

## Hard constraints (these override authenticity, always)

- **No nuts.** No peanuts, walnuts, cashews, almonds, pine nuts, any tree nut. (`Olive Oil` is unrelated
  and fine. Nutmeg is fine and is allowed.)
- **No olives.** Not in any form.
- **No `Sumac`.** It is deliberately excluded pending an owner decision. If a report proposes it, leave it
  out and note it in `blocked`.
- **The vocabulary is FROZEN.** Every `ingredients[].name` must be an exact string from the
  INGREDIENT_REGISTRY list in VOCAB.md. Every `spices[].name` must be an exact string from either the
  spice vocabulary or the registry (the dual-listed names at the bottom of VOCAB.md are legal in both).
  A name that is off by one character silently zeroes that ingredient's macros — this is the single
  most common way to break the app. Copy-paste names; do not type them from memory.
  If your report says an ingredient is "NOT in registry", **check VOCAB.md anyway** — Phase A added 44
  registry rows and 20 spice names precisely to unblock these fixes. Most are now present.

## The five data-bug classes you must also fix in your slice

These are objective bugs verified against `data.js`, independent of the audit. Fix any that land in
your slice, whether or not the report mentions them.

1. **Phantom cooking oil.** A step says "heat oil in a pan" but no oil is in the ingredient list.
   Fix by ADDING the oil to `ingredients` with real grams (5–15 g), choosing the fat the cuisine uses
   (`Vegetable Oil`, `Olive Oil`, `Sesame Oil`, `Butter`). Known cases in scope: Palak Paneer,
   Chicken Korma, Mango Chicken Curry, Japanese Tamagoyaki, Pork Tonkatsu, Katsu Curry,
   Chicken Lettuce Wraps with Rice.
2. **Hard-coded cooking liquid.** Steps say "add 2.5 cups of water" for 20 g of dry lentils — the volume
   was never rescaled when the grams shrank to fit macros. **Fix in the step text only. Never add
   `Water` to an `ingredients` array.** Rewrite the volume to be proportional to the actual grams
   (dry legumes/rice ≈ 2.5–3× their weight in liquid; a one-portion soup is roughly 300–400 ml total).
   Prefer wording like "about ¾ cup" or "just enough to cover". Known cases in scope: Miso Ramen,
   Lamb & Lentil Soup, Spaghetti alle Vongole, Tuscan White Bean Soup, Dal Tadka, Chicken Alfredo,
   Minestrone Soup, Doenjang Jjigae, Lamb Tagine, Asian Noodle Soup, Feijoada, Paella Mixta,
   Arroz con Pollo, Beef Pho, Chicken Pho, Duck Confit with Lentils.
3. **Dish named after an ingredient it does not contain.** Add the ingredient. Known cases in scope:
   Spaghetti alle Vongole (no clams — `Clams` is in the registry), Thai Basil Chicken (no basil —
   `Basil` is in the registry), Stuffed Grape Leaves (no grape leaves — `Grape Leaves` is in the
   registry), Picanha with Farofa (no cassava flour — `Cassava Flour` is in the registry).
4. **Phantom ingredient in a step.** A step names something that is in neither `ingredients` nor
   `spices` (the classic is "a pinch of sugar"). Either add it — `Sugar` and `Honey` are both in the
   registry — or drop it from the step. Adding is usually right when the report says the dish needs it.
5. **Unused ingredient.** Something in `ingredients` that no step ever mentions. Every non-spice
   ingredient must be named in at least one step.

## Style rules for the records you emit

- **Steps**: no number prefixes ("1." / "Step 1:"). Each step is a full sentence. Every non-spice
  ingredient must be referenced somewhere across the steps. Name specific spices ("season with cumin and
  smoked paprika"), never "add spices". No phantom ingredients.
- **Spices**: every savory recipe carries at least `Salt` and `Black Pepper`. Sweet breakfasts may have
  none (emit `"spices": []` only if the recipe legitimately has no seasoning; omit the key to leave the
  existing spice row untouched).
- **Grams**: whole numbers, or one decimal for spices. A recipe is ONE serving. Spices run 0.5–3 g.
- **Macro discipline.** The solver rescales a whole recipe by a factor in [0.5, 3.0] to hit the day's
  targets, so the *ratio* of macros matters more than the absolute total, but a recipe that swings from
  500 cal to 1100 cal will start failing. Keep each recipe within roughly ±25% of its current calories
  unless your report explicitly justifies more. If a fix adds 150 cal of carb, consider trimming the
  rice or noodles by a matching amount — the reports often suggest exactly this. Protein-tagged recipes
  must stay protein-dense.
- **`tags`**: keep the existing tags unless the rebuild genuinely changes the dish's character.
  Legal tags in use: `breakfast`, `high-protein`, `high-fiber`, `balanced`, `comfort-food`,
  `vegetarian`, `light`, `quick`. `breakfast` controls visual sort order — do not add or remove it
  casually.
- **`cuisine`**: set it to whatever the report's "Cuisine label" line says it should be. These new
  labels are approved and you may use them freely: `Italian-American`, `Chinese-American`, `Tex-Mex`,
  `Hawaiian`, `British-Indian`. Existing labels: American, Mediterranean, Mexican, Middle Eastern,
  Japanese, Indian, Italian, Korean, Thai, Peruvian, Caribbean, Brazilian, Spanish, Vietnamese,
  Chinese, French.
- **Renames**: if the report renames a dish, put the new name in `recipe.name` and the OLD name in
  `originalName`. The merge keys on `originalName`.

## Output format — `audit/cuisine-audit/phase-b/out/<your-slice>.jsonl`

**One JSON object per line. No wrapping array. No pretty-printing across lines.** One line per recipe.

```
{"originalName":"Korean Chicken Wings","changed":["name","ingredients","spices","steps"],"recipe":{"name":"Yangnyeom Chicken Bowl","cuisine":"Korean","servingSize":"1 bowl","tags":["high-protein"],"ingredients":[{"name":"Chicken Breast","grams":200},{"name":"White Rice","grams":47}]},"spices":[{"name":"Gochujang","grams":12},{"name":"Salt","grams":1}],"cooking":{"prepTime":"10 mins","cookTime":"30 mins","steps":["Cook the white rice according to package directions.","..."]},"note":"BBQ Sauce -> gochujang + tomato sauce yangnyeom glaze; renamed off 'Wings' since it uses breast."}
```

Field rules:
- `originalName` — required, must exactly match the recipe name in your brief.
- `changed` — array of `"name"|"cuisine"|"ingredients"|"spices"|"steps"|"tags"|"servingSize"`.
- `recipe` — **always emit the COMPLETE recipe object**, even the unchanged fields. The merge replaces
  the whole line.
- `spices` — the complete new spice array. **Omit the key entirely** if spices are unchanged.
- `cooking` — the complete new `{prepTime,cookTime,steps}`. **Omit the key entirely** if steps are
  unchanged.
- `note` — one line, what changed and why. This becomes the session's record of the edit.

If a recipe genuinely needs no change at all, emit `{"originalName":"X","changed":[],"note":"clean, no change"}`.

**Write your file incrementally.** After you finish each recipe, rewrite the whole file with every
record you have completed so far. Do not do all the thinking and then save once at the end — agents have
died between those two points and lost everything. A partial `.jsonl` is still perfectly usable.

At the very end, append one final line:

```
{"_summary":{"slice":"11-korean","recipesChanged":7,"blocked":[{"recipe":"Dakgalbi","wanted":"Perilla Leaves as ingredient","did":"used it as a spice-override name instead"}],"newIngredientsUsed":["Doenjang","Tofu","Asian Pear"],"notes":"..."}}
```

`blocked` records anything the report asked for that you could not do under the frozen vocabulary, and
what you did instead. An empty `blocked` array is a fine and common answer.

## Your final chat response

Return only: how many recipes you changed, the `blocked` list, and anything the merge should know.
Do not paste the records — they are in the file.
