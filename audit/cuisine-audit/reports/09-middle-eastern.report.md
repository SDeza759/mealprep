# Cuisine authenticity audit — Middle Eastern (11 recipes)

Mode: **traditional** (the specifics ARE the dish).

Constraints honored throughout: no nuts (pine nuts are traditional garnish on kofta, baba ganoush,
hummus and warak enab — noted where relevant, never proposed), no olives, `Olive Oil` untouched.

Registry note: fresh **Parsley**, fresh **Mint**, **Bulgur** and **Grape Leaves** are NOT in
`INGREDIENT_REGISTRY` and are the recurring gap across this slice. `Dried Parsley` exists only as a
spice override, which is not a substitute where the herb is the bulk of the dish.

---

### Shakshuka Breakfast
- **Verdict:** `minor-drift`
- **Cuisine label:** Defensible but imprecise. Shakshuka is **Tunisian/Libyan (North African/Maghrebi)**
  in origin — first documented in French sources describing it as Tunisian — and reached the Levant and
  Israel with Tunisian Jews. It is now genuinely pan-Middle-Eastern on breakfast menus, so
  `Middle Eastern` is not a mislabel the way `Lamb Tagine` is. If the app ever splits North African out,
  this moves with it.
- **Findings:**
  1. **No garlic.** Garlic is in essentially every documented version (Tunisian, Israeli, Levantine) —
     eggs poached in tomato, pepper, olive oil, *garlic* and warm spices. Its absence is the one real
     ingredient gap.
  2. **No heat.** Tunisian shakshuka is defined partly by harissa; Libyan versions are notably spicy.
     Cumin + sweet paprika alone gives a mild Israeli-café rendition, not the North African dish.
     Caraway is the other Tunisian signature.
  3. **Jarred `Tomato Sauce` instead of tomatoes.** Traditional shakshuka simmers fresh (or canned whole)
     tomatoes down with the peppers; `Tomato Sauce` is a convenience drift. The registry has `Tomato`.
     This is a mild finding — a reduced tomato base is the right end state, just reached the wrong way.
  4. Feta is a modern Israeli-restaurant addition, not North African. It is not wrong for a dish labelled
     Middle Eastern, and it carries protein the app needs — **keep it**, no finding.
- **Proposed fix:**
  - Ingredients: add `Garlic` 8g. Optionally swap `Tomato Sauce` 150g → `Tomato` 120g + `Tomato Sauce` 60g
    so a fresh tomato is actually present.
  - Spices: add `Cayenne` 1g (stands in for harissa's heat) and `Caraway` 1g if a new zero-macro spice is
    acceptable; otherwise `Cayenne` alone. Keep Cumin + Paprika.
  - Steps: step 1 → "Dice the onion and bell pepper, mince the garlic." Step 2 → sauté onion, pepper and
    garlic. Step 3 → "Add the diced tomato and tomato sauce and simmer until thickened, about 5 minutes,
    then stir in cumin, paprika and cayenne."
- **New ingredients required:** `Garlic` (in registry), `Tomato` (in registry). `Caraway` — NOT in the
  spice list; zero-macro, so it can live in `RECIPE_SPICE_OVERRIDES` only. Optional.
- **Ingredients no longer used:** none (Tomato Sauce reduced, not removed).
- **Macro impact:** negligible. Garlic 8g ≈ 12 cal. Tomato-for-sauce swap is roughly calorie-neutral.
- **Confidence:** high
- **Sources:** mychakchouka.com/origin-of-shakshuka; themediterraneandish.com/shakshuka-recipe;
  curiouscuisiniere.com/chakchouka; kitchenbee.substack.com "A Thousand And One Shakshukas"

---

### Falafel Plate
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` (Levantine falafel — chickpea, as opposed to Egyptian *ta'ameya*, which is
  fava-based. The chickpea choice is a legitimate national tradition, just worth knowing which one).
- **Findings:**
  1. **The defining technique is wrong.** Falafel is made from **dried chickpeas soaked 12–24 hours and
     ground raw** — never cooked or canned. Every source in the tradition says this explicitly: canned
     chickpeas do not bind and produce soggy patties that disintegrate in the fryer. The step
     *"Drain and rinse chickpeas"* is the canned-chickpea instruction. This is the single biggest finding
     in the recipe: as written it does not produce falafel.
  2. **No fresh herbs.** Fresh flat-leaf parsley and cilantro are what give falafel its green interior and
     its flavor. `Dried Parsley` 2g in the spice overrides is not a stand-in for a large handful of fresh
     herbs — it is a different ingredient doing a different job.
  3. **No onion, no garlic.** Both are standard in the paste and currently absent entirely.
  4. Pan-frying is a home adaptation; deep-frying is traditional. Under the traditional bar this is a
     drift, but it is a defensible one for a meal-prep app and I would not change it — just say so in the
     step rather than implying it is the real method.
  5. Missing raising agent (baking soda / baking powder), which is what makes the interior fluffy.
- **Proposed fix:**
  - Ingredients: keep `Chickpeas` 52g but the *step* must specify dried, soaked overnight, ground raw.
    Add `Cilantro` 15g, `Onion` 25g, `Garlic` 6g. Add fresh `Parsley` 20g if the ingredient is created.
  - Spices: keep Cumin + Coriander Powder. **Drop `Dried Parsley`** once fresh parsley/cilantro are in the
    ingredient list (keeping both is redundant). Optionally add `Cayenne` 0.5g.
  - Steps: rewrite step 1 → "Soak dried chickpeas in plenty of cold water for at least 12 hours, then
    drain and pat dry. Do not cook them." Step 2 → "Pulse the raw soaked chickpeas in a food processor
    with onion, garlic, parsley, cilantro, cumin and coriander until coarsely ground — stop before it
    becomes a paste." Add "Rest the mixture 30 minutes, then stir in a pinch of baking soda." Keep the
    pan-fry step but word it as the shallow-fry adaptation.
- **New ingredients required:** `Cilantro`, `Onion`, `Garlic` — all in registry. **`Parsley`** (fresh
  flat-leaf) — **NOT in registry**, would need adding.
- **Ingredients no longer used:** none. (`Dried Parsley` drops out of this recipe's spice override.)
- **Macro impact:** small increase — roughly +40–60 cal from onion/garlic/herbs, protein essentially flat.
  If the app currently treats the 52g as canned-drained weight the raw-dried reading is already correct,
  so no macro change from the technique fix itself.
- **Confidence:** high
- **Sources:** themediterraneandish.com/how-to-make-falafel; feelgoodfoodie.net/recipe/falafel;
  alphafoodie.com/authentic-falafel-recipe; toriavey.com/falafel; thelemonbowl.com/authentic-lebanese-falafel

---

### Shawarma Bowl
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` (Levantine chicken shawarma; the rice-bowl format is a modern diaspora
  presentation, which the name "Bowl" already declares — not a finding).
- **Findings:**
  1. **The marinade lacks its acid and its garlic.** Authentic chicken shawarma marinade is yogurt +
     **lemon juice + vinegar + garlic** + the spice blend. Here the yogurt marinade is right, but lemon is
     squeezed on *after* cooking (step 5) rather than marinated in, and garlic is absent altogether. Acid
     is not a garnish in shawarma — it is what tenderizes the meat and defines the flavor.
  2. **No garlic sauce.** Toum (whipped garlic-lemon-oil) is the canonical Lebanese chicken shawarma
     condiment. Not required, but its absence plus the absent marinade garlic means the dish has zero
     garlic, which is the most un-shawarma thing about it.
  3. The spice blend is **good** — cumin, paprika, turmeric, cinnamon, allspice reads as a credible
     seven-spice/baharat approximation. Cardamom and coriander would round it out; no correction needed.
  4. Chicken thigh as the base is the right call (thigh is traditional on the spit). No finding.
  5. Pan-searing instead of vertical-spit roasting is an unavoidable home adaptation. Not a finding.
- **Variants:** both are fine. `with Chicken Breast` is a leaner substitution, common enough; `without
  Yogurt` removes the marinade dairy but the spice rub alone is also a legitimate shawarma style. Neither
  variant is inauthentic on its own.
- **Proposed fix:**
  - Ingredients: add `Garlic` 6g. Keep `Lemon` 15g but move it into the marinade. **Apply the same
    ingredient change to all three variants** — variant ingredient lists are independent copies.
  - Spices: add `Red Wine Vinegar` 5g (already an accepted zero-macro override elsewhere in the app) and
    optionally `Cardamom` 0.5g + `Coriander Powder` 1g.
  - Steps: merge steps 2–3 and 5 → "Slice the chicken into strips and marinate with greek yogurt, lemon
    juice, vinegar, minced garlic, cumin, paprika, turmeric, cinnamon and allspice for at least 30
    minutes." Then cook. Drop the standalone post-cook lemon squeeze.
- **New ingredients required:** `Garlic` (in registry). `Red Wine Vinegar` / `Cardamom` /
  `Coriander Powder` all already appear in `RECIPE_SPICE_OVERRIDES` elsewhere.
- **Ingredients no longer used:** none.
- **Macro impact:** negligible (+~10 cal).
- **Confidence:** high
- **Sources:** maureenabood.com/grilled-chicken-shawarma; zaatarandzaytoun.com/chicken-shawarma;
  apinchofadventure.com/lebanese-chicken-shawarma; hadiaslebanesecuisine.com/blog/smoky-chicken-shawarma

---

### Lamb Kofta Plate
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` (Levantine *kafta*; the hummus/pita/tahini plate is the standard service).
- **Findings:**
  1. **No parsley.** Kafta is *defined* as ground meat + grated onion + finely chopped flat-leaf parsley.
     Parsley is not a garnish here, it is one of the three components of the mixture. It is absent from
     both the ingredient list and the spice overrides.
  2. **Wrong spice family.** Cumin + paprika + coriander is a generic Middle-Eastern-ish rub. Levantine
     kafta is seasoned with **seven spice / baharat** — allspice, cinnamon, nutmeg, clove, black pepper —
     with allspice the single most important note. Sumac and dried mint are common additions. Paprika is
     not a kafta spice.
  3. **The 30g of `Red Onion` is spent twice.** Step 1 mixes "minced onion" into the meat; step 4 dices
     "red onion" for the plate. The ingredient list has one 30g entry. Traditionally these are two
     different onions doing two different jobs: grated yellow onion (squeezed dry) *in* the mixture, and
     raw red onion tossed with sumac *on* the plate. As written the steps overspend the ingredient list.
  4. Pine nuts appear in some kafta preparations — **excluded by the owner's constraint**, noted and
     dropped. No substitute proposed.
- **Proposed fix:**
  - Ingredients: add `Onion` 25g (yellow, for the meat mixture) and keep `Red Onion` 30g strictly as the
    plate garnish. Add fresh `Parsley` 20g if the ingredient is created; otherwise add `Dried Parsley` 2g
    to the spice overrides as a weak stand-in and say so.
  - Spices: add `Allspice` 1.5g and `Cinnamon` 0.5g; add `Sumac` 1g for the onion garnish. Consider
    dropping `Paprika`. Keep Cumin (used in Levantine kafta) and Coriander Powder.
  - Steps: step 1 → "Grate the yellow onion and squeeze out the liquid. Mix ground lamb with the grated
    onion, chopped parsley, allspice, cinnamon, cumin, coriander, salt and pepper — do not overmix."
    Step 4 → "Thinly slice the red onion and toss with sumac."
- **New ingredients required:** `Onion` (in registry). **`Parsley`** — **NOT in registry**. `Sumac` — NOT
  in the spice list, but zero-macro, so `RECIPE_SPICE_OVERRIDES` only.
- **Ingredients no longer used:** none.
- **Macro impact:** negligible (+~15 cal from the second onion and herbs).
- **Confidence:** high
- **Sources:** maureenabood.com/lebanese-grilled-kafta; feelgoodfoodie.net/recipe/beef-kafta;
  thelebanesedish.com/lebanese-kofta-kebab; themediterraneandish.com/kofta-kebab-recipe

---

### Lamb Shawarma Wrap
- **Verdict:** `significantly-off`
- **Cuisine label:** `Middle Eastern` is fine; the **dish name** is what's wrong.
- **Findings:**
  1. **This is not shawarma.** Shawarma is by definition *thin slices* of marinated meat stacked in an
     inverted cone on a **vertical spit**, roasted slowly and shaved off. Ground lamb formed into a patty
     and pan-crumbled is a different preparation entirely. The name promises something the ingredients
     cannot deliver. Ground lamb in flatbread has its own real Levantine name — **arayes** (spiced ground
     meat pressed into pita and griddled) — or it is simply a kafta wrap.
  2. **Wrapped in a `Whole Wheat Tortilla`.** The tortilla is Mexican. Levantine shawarma is rolled in
     thin markook/saj bread or stuffed into pita. `Pita Bread` is already in the registry.
  3. **The tahini is raw paste, not sauce.** Straight tahini is bitter and stiff; the shawarma condiment
     is *tarator* — tahini thinned with **lemon juice, water and garlic**. Neither lemon nor garlic is
     present anywhere in this recipe.
  4. **No acid in the marinade.** Lamb shawarma marinade is notably vinegar-forward. The spice blend
     itself (cumin, paprika, turmeric, cinnamon, allspice) is a credible baharat and needs no change.
  5. Missing the standard fillings: tomato, and pickles (pickled turnip or cucumber) — the pickle is
     close to a signature of the sandwich.
- **Proposed fix:** two honest routes; **route A is recommended** because the registry has no whole-muscle
  lamb cut, so a true shawarma cannot be built from `Ground Lamb` at all.
  - **Route A (rename):** rename the recipe to **`Lamb Arayes Wrap`** (or `Lamb Kafta Wrap`), swap
    `Whole Wheat Tortilla` 70g → `Pita Bread` 70g, add `Garlic` 5g, `Lemon` 15g, `Tomato` 40g, and add
    `Parsley` 15g to the meat if the ingredient is created. Steps: press the seasoned lamb into the split
    pita, griddle both sides until the bread is crisp and the meat cooked, then open and add tomato,
    onion and tahini thinned with lemon and garlic.
  - **Route B (keep the name):** requires a new registry ingredient — `Lamb Shoulder` or `Lamb Leg` — and
    rewriting steps to thin-slice, marinate with vinegar/lemon/garlic, and sear hard in a stacked pile.
    More work, and it duplicates `Chicken Shawarma Plate`'s role.
  - Spices (either route): add `Red Wine Vinegar` 5g.
- **New ingredients required:** `Pita Bread`, `Garlic`, `Lemon`, `Tomato` — all in registry.
  **`Parsley`** — NOT in registry (optional). `Lamb Shoulder` — NOT in registry (route B only).
- **Ingredients no longer used:** `Whole Wheat Tortilla` (in this recipe; it is used elsewhere in the app,
  so it is not orphaned).
- **Macro impact:** modest. Pita 70g vs whole-wheat tortilla 70g is roughly comparable in calories, a
  little higher in carbs. Tomato/garlic/lemon add ~20 cal. Protein unchanged.
- **Confidence:** high
- **Sources:** britannica.com/topic/shawarmah; en.wikipedia.org/wiki/Shawarma;
  denverlibrary.org "The World on a Spit"; zaatarandzaytoun.com/chicken-shawarma

---

### Tabbouleh with Grilled Chicken
- **Verdict:** `significantly-off` — this is the worst offender in the slice.
- **Cuisine label:** `Middle Eastern` is fine (tabbouleh is Lebanese/Levantine); the **contents** are not
  tabbouleh at all.
- **Findings:**
  1. **There is no parsley.** Tabbouleh is a **herb salad**, not a grain salad — this is the whole point
     of the dish. Authentic Lebanese proportions run to roughly four bunches of flat-leaf parsley against
     a few tablespoons of fine bulgur; the salad reads visibly green. Every source in the tradition draws
     this contrast explicitly against the Western deli version, which is exactly what this recipe is: a
     grain bowl with no herbs whatsoever.
  2. **No mint.** Mint is the second herb and non-optional.
  3. **No tomato, no green onion.** Both are core.
  4. **Brown rice instead of fine bulgur.** Wrong grain, and wrong technique — bulgur is *soaked*, never
     boiled, and is present as a light dusting rather than the base.
  5. **Cucumber does not belong in tabbouleh.** Cucumber is a *fattoush* ingredient. This is the same
     class of error as putting tomato in salsa criolla.
  6. **Chickpeas do not belong in tabbouleh either.**
  7. Net: the dish as written is a brown-rice, cucumber and chickpea salad with grilled chicken. It is a
     perfectly reasonable meal — it is just not tabbouleh, and nothing in it is.
- **Proposed fix:** two routes; pick based on whether new registry ingredients are acceptable.
  - **Route A (make it actually tabbouleh — requires 3 new ingredients):**
    ingredients become `Chicken Breast` 150g, **`Parsley` 120g**, **`Mint` 20g**, **`Bulgur` 25g**,
    `Tomato` 100g, `Green Onion` 25g, `Olive Oil` 12g, `Lemon` 20g. Remove `Brown Rice`, `Cucumber`,
    `Chickpeas`. Spices: keep Salt + Black Pepper, optionally add `Allspice` 0.5g (used in some Lebanese
    families). Steps: soak the fine bulgur in cold water 15 min and squeeze dry; chop parsley and mint
    very finely; dice tomato and slice green onion; toss with olive oil, lemon, salt and pepper; grill and
    dice the chicken and lay it over the top.
  - **Route B (no new ingredients — rename instead):** if `Parsley`/`Mint`/`Bulgur` will not be added,
    the honest move is to **stop calling it tabbouleh**. Rename to something like
    `Grilled Chicken Chickpea Bowl`, add `Tomato` 80g and `Red Onion` 20g so it is at least a coherent
    Levantine salad, and leave the cuisine label as-is. Do not keep the current name.
- **New ingredients required:** **`Parsley`, `Mint`, `Bulgur`** — **all three NOT in registry.**
  `Tomato`, `Green Onion` are in registry.
- **Ingredients no longer used (route A):** `Brown Rice`, `Cucumber`, `Chickpeas` in this recipe. All
  three are used by other recipes, so none is orphaned.
- **Macro impact:** **material — flag this for the solver.** Real tabbouleh is mostly herbs: 120g parsley
  ≈ 43 cal, and 25g bulgur replaces 52g brown rice, so the plate loses roughly 130–170 calories and a
  chunk of its carbohydrate. Protein is essentially unchanged (chicken carries it), but this recipe would
  become a much lighter, low-carb entry and the day solver will lean on it differently. Consider raising
  chicken or bulgur grams to compensate rather than padding with non-traditional ingredients.
- **Confidence:** high
- **Sources:** maureenabood.com/lebanese-tabbouleh-salad-recipe;
  feelgoodfoodie.net/recipe/traditional-lebanese-tabbouleh-salad;
  sweetandsavourypursuits.com/tabbouleh; sinfulkitchen.com/best-lebanese-tabule-salad-tabouli

---

### Baba Ganoush Plate
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` (Levantine).
- **Naming note, not a finding:** in the Levant proper, the tahini-based eggplant dip is strictly
  **mutabbal**, while *baba ghanouj* denotes a tahini-less version with tomato, onion, pomegranate
  molasses and walnuts. Outside the region the tahini version is universally called baba ganoush. This is
  legitimate regional variation and the recipe's usage is the mainstream one — leave the name alone.
  (The walnut version is excluded by the owner's constraint regardless.)
- **Findings:**
  1. **No garlic.** The canonical formula is eggplant + tahini + **garlic** + lemon + salt. Garlic's
     absence is a genuine missing component, not a seasoning preference.
  2. **Oven roasting does not produce the defining flavor.** Sources in the tradition are blunt that there
     is no shortcut: the eggplant must be charred over an **open flame or grill** until the skin is
     blackened and collapsing. "Roast at 220°C for 25–30 minutes" gives soft eggplant with no smoke, and
     smoke is the whole character of the dish.
  3. **No draining step.** Roasted eggplant flesh must sit in a colander to shed liquid, or the dip is
     watery. Minor, but it is why home versions fail.
  4. Pine nuts are the traditional garnish — **excluded by constraint**, noted and dropped.
- **Proposed fix:**
  - Ingredients: add `Garlic` 6g.
  - Spices: no change needed. (Cumin is a legitimate inclusion in the baba-ghanouj style; keep it.)
  - Steps: step 1 → "Char the whole eggplant directly over a gas flame or on a hot grill, turning, until
    the skin is blackened all over and the flesh has collapsed, 15–20 minutes. If no flame is available,
    broil close to the element until the skin blisters and blackens." Insert after: "Scoop out the flesh
    and let it drain in a sieve for 10 minutes." Step 2 → mash with tahini, **minced garlic**, olive oil
    and lemon juice.
- **New ingredients required:** `Garlic` (in registry).
- **Ingredients no longer used:** none.
- **Macro impact:** negligible (~+9 cal).
- **Confidence:** high
- **Sources:** maureenabood.com/baba-gannouj-recipe; themediterraneandish.com/baba-ganoush-recipe;
  beitsitti.com "The difference between Moutabbal and Baba Ghanouj"; palestineinadish.com/recipes/mutabal-recipe

---

### Chicken Shawarma Plate
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` (Levantine).
- **Findings:**
  1. **The marinade has no acid and no garlic.** It is spices + olive oil. Authentic chicken shawarma
     marinade is built on **lemon juice and/or vinegar, garlic**, and usually yogurt, with the spice blend
     on top; the acid is what tenderizes and defines the flavor. Note that `Shawarma Bowl` — the same dish
     in bowl form — *does* have lemon and yogurt, so the two recipes disagree with each other.
  2. **No lemon anywhere in the ingredient list**, unlike every other shawarma-family recipe here.
  3. **The tahini is raw paste.** Straight tahini drizzled on a plate is stiff and bitter; the condiment is
     *tarator* — tahini let down with lemon juice, water and garlic. Same finding as the wrap.
  4. **Chicken breast rather than thigh.** Thigh is what is stacked on the spit for chicken shawarma
     (fattier, survives long roasting). This is a deliberate lean-protein choice for a macro app and I
     would leave it — noted as drift, not something to change.
  5. No pickles or tomato. Optional on a plate; not proposed.
- **Proposed fix:**
  - Ingredients: add `Garlic` 6g and `Lemon` 15g. Optionally add `Greek Yogurt` 40g to bring it in line
    with `Shawarma Bowl`'s marinade.
  - Spices: add `Red Wine Vinegar` 5g. Optionally `Cardamom` 0.5g + `Coriander Powder` 1g to round the
    blend, which is otherwise already a good baharat.
  - Steps: step 1 → "Slice chicken breast into strips and marinate at least 30 minutes with lemon juice,
    vinegar, minced garlic, olive oil, cumin, paprika, turmeric, cinnamon and allspice." Final step →
    "…and a drizzle of tahini thinned with lemon juice, water and a little crushed garlic."
- **New ingredients required:** `Garlic`, `Lemon` (both in registry); `Greek Yogurt` (in registry,
  optional).
- **Ingredients no longer used:** none.
- **Macro impact:** negligible without yogurt (+~15 cal); +~35 cal and +4g protein with it.
- **Confidence:** high
- **Sources:** maureenabood.com/grilled-chicken-shawarma; zaatarandzaytoun.com/chicken-shawarma;
  apinchofadventure.com/lebanese-chicken-shawarma; britannica.com/topic/shawarmah

---

### Stuffed Grape Leaves
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` (Levantine *warak enab* / *warak arish*; Ottoman-derived, cousin to Turkish
  *sarma* and Greek *dolmades*). The Lebanese/Palestinian meat-and-rice filling is what is described.
- **Findings:**
  1. **Grape leaves are a phantom ingredient.** The dish's defining, name-giving component appears only in
     the cooking steps ("Blanch grape leaves briefly…") and is **absent from the ingredient list**. As data
     this means the wrapper contributes zero macros and never reaches the grocery list — a recipe called
     Stuffed Grape Leaves that does not order grape leaves. This is the clearest data bug in the slice.
  2. **The filling uses cooked rice.** Authentic meat-filled warak enab mixes **raw, uncooked rice** with
     the raw ground meat; the rice absorbs the lemony braising liquid over the 35–40 minute simmer, which
     is exactly what step 6 already does. Pre-cooked rice in a 40-minute simmer produces mush.
     **Good news:** `INGREDIENT_REGISTRY` is raw-basis, so `White Rice` 40g is already the correct entry —
     the fix is step wording only, no gram change.
  3. Missing a weight/plate over the rolls during the simmer, which is what keeps them from unravelling.
     Step detail, worth adding.
  4. Pine nuts appear in some family versions — **excluded by constraint**, noted and dropped.
  5. Lamb rather than beef is fine; both are traditional. Allspice + cinnamon is exactly the right Lebanese
     filling profile — no spice change needed.
- **Proposed fix:**
  - Ingredients: **add `Grape Leaves` 70g** (jarred, in brine — rinsed). This is the essential change.
  - Spices: none.
  - Steps: step 1 → "Mix **raw** white rice with ground lamb, finely diced onion, allspice, cinnamon, salt
    and pepper." Step 2 → "Rinse the brined grape leaves and pat dry." Add to step 4/5 → "Set a small
    plate on top of the rolls to weigh them down, then add olive oil, lemon juice and water to just cover."
- **New ingredients required:** **`Grape Leaves`** — **NOT in registry.** Jarred/brined; no USDA raw entry
  applies, so per the project's own convention note the non-USDA provenance in a comment on the line.
- **Ingredients no longer used:** none.
- **Macro impact:** negligible. Brined grape leaves are ~25–30 cal/100g and almost entirely fiber, so 70g
  adds under 25 calories. The rice fix changes no macros at all.
- **Confidence:** high
- **Sources:** maureenabood.com/lebanese-stuffed-grape-leaves; thelemonbowl.com/meat-stuffed-grape-leaves;
  simplyleb.com/recipe/lebanese-stuffed-grape-leaves; cardamomandtea.com/lebanese-warak-enab

---

### Lamb Tagine
- **Verdict:** `mislabeled` (and `significantly-off` on construction — both apply; the label is the
  headline finding).
- **Cuisine label:** **Wrong. Should be `Moroccan`** (or `North African` / `Maghrebi`). A tagine is named
  for the conical Moroccan earthenware vessel and belongs to Maghrebi cuisine, not the Levant/Gulf. Filing
  it under `Middle Eastern` is the same class of error as filing a Levantine dish under a neighbour.
  **App-level consequence to weigh:** the cuisine cap is 2/week during generation, so relabelling creates a
  single-recipe `Moroccan` cuisine. That is correct but makes the cuisine rare — worth knowing before
  changing it, and an argument for eventually adding a second Moroccan dish.
- **Findings:**
  1. **Ground lamb.** A tagine is a slow braise of **bone-in shoulder or shank chunks**, seared then cooked
     2–2½ hours until fork-tender. Ground lamb browned for 5 minutes and simmered 35 minutes is a mince
     stew. The technique and the cut are both wrong, and technique is the point of the dish.
  2. **None of the three Moroccan signatures is present:** **preserved lemon** (sources call it not
     optional — its fermented saltiness is what makes the dish Moroccan rather than a lamb stew),
     **ras el hanout**, and **saffron**.
  3. **`White Beans` do not belong.** Chickpeas are legitimate in a tagine; white beans are not, and having
     chickpeas *and* white beans *and* eggplant *and* carrot in one pot makes it a kitchen-sink stew.
     Eggplant belongs to a different tagine or to zaalouk, not alongside all of the above.
  4. **No finishing herb.** Moroccan tagines are finished with chopped fresh cilantro and/or parsley.
     `Cilantro` is already in the registry.
  5. The existing spice set (cumin, cinnamon, ginger, turmeric, paprika) is actually a decent
     ras-el-hanout-adjacent base — **that part is fine** and should be kept under the new blend.
  6. Dried apricots or prunes are the classic sweet counterweight; almonds are the classic garnish —
     **almonds excluded by constraint**, noted and dropped. Neither dried fruit is in the registry, so this
     is a suggestion only, not a proposed change.
- **Proposed fix:**
  - **Cuisine: `Middle Eastern` → `Moroccan`.** Do this regardless of the rest.
  - Ingredients: remove `White Beans` 19g. Add `Cilantro` 10g. Keep chickpeas, carrot, onion, garlic,
    tomato sauce, olive oil. Consider dropping `Eggplant` 60g to tighten the dish (optional).
  - Cut: ideally add a `Lamb Shoulder` registry entry and use 160g cubed, with cook time raised to
    ~2 hours. If a new lamb cut is not acceptable, keep `Ground Lamb` but say so honestly — a mince
    version is a weeknight adaptation, not a tagine, and the steps should not claim otherwise.
  - Spices: add `Ras el Hanout` 3g, `Saffron` 0.1g and `Preserved Lemon` 10g (all zero/near-zero macro, so
    all three can live in `RECIPE_SPICE_OVERRIDES` without registry entries). Keep the existing five.
  - Steps: sear the lamb hard, add aromatics, add spices and saffron with the liquid, braise covered
    2 hours; stir in preserved lemon in the last 20 minutes; finish with chopped cilantro.
- **New ingredients required:** `Cilantro` (in registry). `Lamb Shoulder` — **NOT in registry** (optional
  but recommended). `Ras el Hanout`, `Saffron`, `Preserved Lemon` — **NOT in the spice list**; all
  addable as `RECIPE_SPICE_OVERRIDES` entries only.
- **Ingredients no longer used:** `White Beans` (and `Eggplant` if the optional tightening is taken).
  **Check before deleting:** verify whether any other recipe references `White Beans`, or the registry
  entry becomes an orphan — the project's data-hygiene sweep exists for exactly this.
- **Macro impact:** modest. Dropping `White Beans` 19g removes ~65 cal and ~4g protein. Swapping ground
  lamb for braised shoulder shifts fat depending on the cut chosen and would need a macro check.
- **Confidence:** high
- **Sources:** recipetineats.com/lamb-tagine; linsfood.com/lamb-tagine; moroccanfoodie.com/lamb-shank-tagine;
  thewildepicurean.com Moroccan Lamb Tagine with Ginger and Apricots

---

### Turkey Kofta Plate
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` for the kofta itself (Levantine); the **sauce** is labelled Greek — see
  finding 1.
- **Findings:**
  1. **"Tzatziki" is Greek, not Middle Eastern.** Step 5 says "Mix Greek yogurt with a pinch of garlic for
     tzatziki." The Levantine equivalent — and the traditional partner to kafta specifically — is
     **khyar bi laban** (laban bi khyar): yogurt with **diced** cucumber, freshly mashed garlic, **fresh
     and dried mint**, salt and lemon. The differences are real and named in the tradition: tzatziki
     shreds the cucumber, is thicker, and often carries dill; khyar bi laban dices the cucumber, is
     thinner (plain laban, not strained Greek yogurt), and is mint-led. The recipe's components are close
     but the mint is missing and the name points at the wrong cuisine.
  2. **Step 5 names an ingredient that does not exist.** "A pinch of garlic" — there is no `Garlic` in the
     ingredient list, only `Garlic Powder` in the spice overrides. Khyar bi laban specifically calls for
     freshly mashed garlic, so this should become a real ingredient rather than be reworded away.
  3. **No parsley in the kofta mixture** — same finding as `Lamb Kofta Plate`; parsley is one of kofta's
     three defining components.
  4. **No allspice / seven-spice** — same finding as `Lamb Kofta Plate`. Cumin + coriander + garlic powder
     is a generic rub.
  5. **Turkey is not a traditional kofta meat** (lamb, beef, or a blend). This is an obvious deliberate
     lean-protein choice for a macro app and I would keep it — noted for completeness, not proposed for
     change.
  6. Step 1's "Mince or finely chop turkey breast" is not realistic for a whole breast; kofta is made from
     ground meat. A wording fix only, since the registry has no ground-turkey entry.
- **Proposed fix:**
  - Ingredients: add `Garlic` 5g. Add `Parsley` 15g if the ingredient is created.
  - Spices: add `Allspice` 1.5g and `Dried Mint` 1g (both zero-macro; `Dried Mint` can live in
    `RECIPE_SPICE_OVERRIDES` and avoids needing a fresh `Mint` registry entry for this recipe). Keep
    Cumin and Coriander Powder; `Garlic Powder` can stay or be dropped now that fresh garlic is present.
  - Steps: step 1 → "Use ground turkey, or pulse turkey breast in a food processor until coarsely ground.
    Mix with finely grated onion, chopped parsley, cumin, coriander, allspice, salt and pepper."
    Step 5 → "Dice the cucumber and slice the red onion. Stir the diced cucumber into the yogurt with
    crushed garlic, dried mint, salt and a squeeze of lemon, loosening with a splash of water, to make
    **khyar bi laban**." Remove the word "tzatziki".
- **New ingredients required:** `Garlic` (in registry). **`Parsley`** — **NOT in registry** (optional).
  `Dried Mint` — NOT in the spice list; zero-macro, `RECIPE_SPICE_OVERRIDES` only.
- **Ingredients no longer used:** none (`Garlic Powder` optionally drops from this recipe's overrides).
- **Macro impact:** negligible (+~15 cal).
- **Confidence:** high
- **Sources:** anediblemosaic.com/cucumber-yogurt-salad-recipe-khyar-bi-laban;
  alphafoodie.com/lebanese-creamy-cucumber-yogurt-salad; thematbakh.com/cucumber-yogurt-sauce;
  maureenabood.com/lebanese-grilled-kafta

---

## Summary

### Counts by verdict
| Verdict | Count | Recipes |
|---|---|---|
| `authentic` | 0 | — |
| `minor-drift` | 6 | Shakshuka Breakfast, Shawarma Bowl, Lamb Kofta Plate, Baba Ganoush Plate, Chicken Shawarma Plate, Turkey Kofta Plate |
| `significantly-off` | 4 | Falafel Plate, Lamb Shawarma Wrap, Tabbouleh with Grilled Chicken, Stuffed Grape Leaves |
| `mislabeled` | 1 | Lamb Tagine |
| `not-a-real-dish` | 0 | — |

**Honest framing of the zero `authentic` count.** This is not eleven independently bad recipes. Three
causes explain nearly all of it, and two are cheap to fix:
- **Garlic is missing from 7 of the 11 recipes** (shakshuka, falafel, both shawarmas, shawarma bowl, baba
  ganoush, turkey kofta). Garlic is already in the registry. One systematic pass closes most of the
  `minor-drift` column.
- **Fresh parsley and mint are not in the registry at all** (only `Dried Parsley` as a spice), and they
  are load-bearing in 4–5 of these dishes. This single gap is what turns tabbouleh into a rice salad and
  both koftas into generic meat patties.
- What the app already does **well**: the shared cumin/paprika/turmeric/cinnamon/allspice blend on the
  three shawarma recipes is a genuinely credible baharat, `Stuffed Grape Leaves`' allspice-and-cinnamon
  filling is exactly right, and `Shawarma Bowl` correctly uses chicken thigh and a yogurt marinade. The
  spice architecture is not the problem.

### The 3 worst offenders
1. **Tabbouleh with Grilled Chicken** — contains none of tabbouleh's ingredients. No parsley, no mint, no
   tomato, no bulgur; instead brown rice, cucumber (a fattoush ingredient) and chickpeas. Tabbouleh is a
   herb salad, not a grain salad, and this is precisely the Western-deli version the tradition defines
   itself against. Either add the three missing ingredients or stop calling it tabbouleh.
2. **Stuffed Grape Leaves** — grape leaves are a **phantom ingredient**: named in the cooking steps,
   absent from the ingredient list, therefore contributing no macros and never appearing on the grocery
   list. Also uses cooked rice where the raw rice must absorb the braising liquid.
3. **Lamb Tagine** — **mislabeled**: a tagine is Moroccan/Maghrebi, not Middle Eastern. Also built wrong:
   ground lamb simmered 35 minutes instead of shoulder chunks braised two hours, with none of preserved
   lemon, ras el hanout or saffron, plus white beans that do not belong.

*(Runner-up: `Lamb Shawarma Wrap` — a ground-lamb patty in a Mexican tortilla is not shawarma, which is
by definition thin slices shaved off a vertical spit.)*

### Consolidated NEW ingredients required
**Must be added to `INGREDIENT_REGISTRY` (not currently present):**
| Ingredient | Needed by | Notes |
|---|---|---|
| `Parsley` (fresh flat-leaf) | Falafel, Lamb Kofta, Tabbouleh, Turkey Kofta, (Lamb Shawarma Wrap) | **Highest leverage single change in the slice.** 4–5 recipes on its own, so it clears the project's ≥5-recipes-per-ingredient guideline almost immediately. `Dried Parsley` is a spice and is not a substitute where the herb is bulk. |
| `Mint` (fresh) | Tabbouleh | `Dried Mint` in `RECIPE_SPICE_OVERRIDES` covers Turkey Kofta without a registry entry, but tabbouleh needs the real leaf by weight. |
| `Bulgur` (fine, #1) | Tabbouleh | Soaked, never boiled. |
| `Grape Leaves` (jarred, brined) | Stuffed Grape Leaves | No USDA raw entry applies — note non-USDA provenance in a line comment per project convention. |
| `Lamb Shoulder` | Lamb Tagine (recommended), Lamb Shawarma Wrap (route B only) | Optional. Only needed if the tagine is rebuilt as a proper braise. |

**Zero-macro seasonings — `RECIPE_SPICE_OVERRIDES` only, no registry entry needed:**
`Sumac` (Lamb Kofta) · `Dried Mint` (Turkey Kofta) · `Ras el Hanout`, `Saffron`, `Preserved Lemon`
(Lamb Tagine) · `Caraway` (Shakshuka, optional).
Already available and merely newly referenced: `Red Wine Vinegar`, `Cayenne`, `Allspice`, `Cinnamon`,
`Cardamom`, `Coriander Powder`.

**Already in the registry, just newly referenced by these recipes:**
`Garlic` (7 recipes — the big one), `Onion` (2), `Tomato` (3), `Cilantro` (2), `Lemon` (2),
`Green Onion` (1), `Pita Bread` (1), `Red Onion` (1), `Greek Yogurt` (1, optional).

### Consolidated ingredients this slice would STOP using
| Ingredient | Dropped from | Orphan risk |
|---|---|---|
| `Whole Wheat Tortilla` | Lamb Shawarma Wrap | None — used by other recipes in the app. |
| `Brown Rice` | Tabbouleh (route A) | None — used elsewhere. |
| `Cucumber` | Tabbouleh (route A) | None — still used by 5+ recipes in this slice alone. |
| `Chickpeas` | Tabbouleh (route A) | None — used elsewhere. |
| `White Beans` | Lamb Tagine | **Check this one.** If no other recipe references `White Beans`, removing it orphans the registry entry. Run the project's data-hygiene sweep before deleting. |
| `Eggplant` | Lamb Tagine (optional tightening only) | None — Baba Ganoush Plate still uses it. |
| `Dried Parsley` (spice) | Falafel, if fresh `Parsley` is added | Spice-override only; harmless either way. |
| `Paprika` (spice) | Lamb Kofta, optional | Spice-override only; used widely elsewhere. |

### Constraint compliance
Pine nuts are traditional on kofta, baba ganoush and warak enab, and almonds on lamb tagine. All four were
identified and **deliberately not proposed**, in line with the owner's no-nuts constraint. No olives were
proposed anywhere; `Olive Oil` was left untouched and is not flagged in any recipe.
