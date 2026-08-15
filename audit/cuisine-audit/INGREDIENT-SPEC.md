# Ingredient research spec — Phase A

You are authoring new ingredient rows for a personal meal-prep app's `INGREDIENT_REGISTRY`.
An earlier cuisine-authenticity audit found these ingredients missing. Your job is to research
accurate nutrition data for the batch assigned to you and return it in a fixed format.

**Every ingredient in your batch is assigned to you and only you.** Do not research anything
outside your list — another agent has it, and duplicate work produces conflicting numbers.

## The single most important rule

**Macros are per 100g of the RAW, uncooked ingredient.** This app stores raw weights because a
previous session had to fix seven entries that had been entered cooked — dry pasta and dry legumes
roughly triple in weight when cooked, so a cooked-basis number understates calories by ~3x. If USDA
lists both raw and cooked, take RAW. If an ingredient is only ever sold cooked or as a prepared
product (a jarred sauce, a packaged noodle), use the as-sold product and say so in the note.

## For each ingredient, decide first: registry row, or zero-macro spice?

- **Registry row** — carries real macros, used in quantities that matter (≥ ~5 cal per serving).
  Goes in `INGREDIENT_REGISTRY` with calories/carbs/protein/fat per 100g.
- **Zero-macro spice** — used in pinch/garnish quantities where the macro contribution rounds to
  nothing: dried spices, fresh chilies, vinegars, aromatics used as seasoning. These do NOT need a
  registry row at all; they live in a per-recipe spice list and get zero macros automatically. They
  still need a grocery category.

Say which, per ingredient. When genuinely borderline, prefer the spice route — it keeps the registry
smaller and the macro effect is negligible either way. But do NOT route something like Fish Sauce,
Mirin or Sugar to spices just because it's a seasoning; those are used in gram quantities that carry
real sugar and sodium load, and the app's macro solver needs them.

## Output format — one block per ingredient, exactly this shape

```
### <Exact Ingredient Name>
- **Type:** `registry` | `spice`
- **Macros per 100g raw:** calories: <n>, carbs: <n>, protein: <n>, fat: <n>     (omit if spice)
- **Source:** USDA FDC ID if one exists, else the brand/label basis you used
- **Category:** one of — Produce | Fruit | Meat & Seafood | Eggs & Dairy | Bakery & Bread |
  Grains & Pasta | Canned & Legumes | Condiments & Oils | Spices & Seasonings
- **Flesh meat?:** yes | no   (yes only for actual animal flesh — beef, pork, poultry, fish, shellfish)
- **Unit-based?:** yes/no — is this bought and used in discrete countable units (a tortilla, a lime,
  a banana) rather than by weight? If yes, give grams per unit.
- **Note:** one line, ONLY if something is non-obvious — non-USDA provenance, a raw-vs-cooked trap,
  a brand-variance warning, or an allergen caveat. Omit entirely if there's nothing to say.
- **Confidence:** high | medium | low
```

Use one decimal place at most. Whole numbers for calories.

## Accuracy notes that have bitten this project before

- **Name collisions are silent failures.** Recipes reference ingredients by exact string match; a
  mismatch zeroes the macros without any error. Use the exact name given in your batch file, character
  for character. Do not rename, re-case, or "correct" it.
- **Culantro and Cilantro are different plants.** If your batch has one, do not research the other.
- **Mexican Oregano is a different plant from Mediterranean Oregano** (Lippia graveolens vs Origanum
  vulgare). The app already has `Oregano`; yours is the Mexican one if that's what your batch says.
- **Packaged products vary hugely by brand.** For jarred/bottled items (sauces, pastes) there is often
  no USDA entry. Use a mainstream brand's label, name the brand in the Source field, and flag brand
  variance in the Note.

## Allergen constraint

The app owner cannot eat nuts. Nothing in your batch should be a nut, but if you find that an
assigned ingredient is commonly nut-containing or nut-contaminated as sold (some pestos, some
granolas, some curry pastes), flag it in the Note. **Nutmeg is explicitly allowed** — it is not a
tree nut. Olives are separately banned; olive oil is fine.

## Research

Use WebSearch/WebFetch. USDA FoodData Central is the preferred source. Budget roughly one search per
two ingredients — batch related lookups (e.g. several fresh herbs in one query). Mark anything you
could not verify as `confidence: low` rather than continuing to search.

**Write your output file incrementally** — after the first 3 ingredients, then every 3 or 4 as you
go. A previous phase of this project lost complete research when agents saved only at the end.

Do not edit any project file. Your report file is the only thing you write.
