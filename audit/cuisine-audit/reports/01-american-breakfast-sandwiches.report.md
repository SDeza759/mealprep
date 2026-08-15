# Audit report — American: breakfast, sandwiches, salads (12 recipes)

Mode: **coherence**. "American" is a catch-all label, so the questions are (a) does the dish match what
its NAME means to a cook, (b) is it internally coherent, (c) is the cuisine label defensible.

**How I use the verdicts.** In coherence mode `mislabeled` is ambiguous between "wrong cuisine tag" and
"wrong dish name". I use it for **name-level** failure — the dish name denotes a defined composition the
recipe does not deliver (Cobb, Caesar, Club) — and always say in the Findings which of the two it is.
The `Cuisine label` field is always answered separately. `incoherent` is reserved for a genuine internal
contradiction (ingredients vs technique).

**Cuisine labels that already exist in `data.js`** (relevant to relabel proposals): American 24, Mexican 16,
Japanese 16, Mediterranean 14, Indian 13, Middle Eastern 11, Italian 11, Korean 7, Peruvian 6, Thai 4,
Caribbean 4, Vietnamese 3, Spanish 3, Brazilian 3, French 2, Chinese 2.

---

### Classic Oatmeal with Berries
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — porridge is pan-Western but oatmeal-with-berries-and-maple is a standard
  American breakfast.
- **Findings:**
  1. **Wrong cooking liquid (real).** 80 g dry rolled oats is roughly 1 cup. Step 1 simmers only **120 g
     of milk** into it — a 1.5:1 liquid-to-oats ratio by weight. Stovetop rolled oats want ~1:2 by volume
     / ~1:3 by weight; 80 g of oats needs roughly **400–480 g of liquid**. At 120 g the pan goes dry
     before the oats hydrate — you get a stiff paste, not the "creamy" texture step 2 promises. This is
     the classic macro-app artifact: milk was sized for its calories, not for its job as cooking liquid.
  2. **Two sweeteners doing one job.** Honey 15 g *and* Maple Syrup 10 g, both drizzled in the same final
     step. Nothing is wrong with it, but no cook writes it that way — it reads as a solver artifact.
     Cosmetic; only worth fixing if the macro cost of consolidating is nil.
  3. No phantom ingredients; every one of the 8 ingredients is referenced by a step. Clean on that axis.
- **Proposed fix:**
  - *Ingredients:* add `{name:"Water", grams:300}`. `Water` is already in the registry and carries zero
    macros, so this fixes the ratio at **zero macro cost** — the preferred fix.
  - *Steps:* reword step 1 to "Bring the milk and water to a gentle simmer in a saucepan over medium heat."
  - *Optional (cosmetic):* drop `Maple Syrup` 10 g and raise `Honey` to 25 g, then reword the last step to
    "Drizzle with honey." Only if the solver tolerates it — otherwise leave both.
  - *Spices:* optionally add `{name:"Cinnamon", grams:1}` to `RECIPE_SPICE_OVERRIDES` (this recipe currently
    has none) and name it in step 2. Idiomatic for American oatmeal, zero macros.
- **New ingredients required:** `none` (Water, Honey, Cinnamon all already exist).
- **Ingredients no longer used:** `none` (or `Maple Syrup`, only if the optional consolidation is taken).
- **Macro impact:** none. Water is zero-macro; the sweetener consolidation is designed to be calorie-neutral.
- **Confidence:** high
- **Sources:** standard rolled-oat package ratios (1 part oats : 2 parts liquid by volume); no contested
  fact here.

---

### Scrambled Eggs & Toast
- **Verdict:** `coherent`
- **Cuisine label:** `correct`
- **Findings:**
  1. All five ingredients are referenced by a step; no phantoms, nothing unused. Butter is present and
     used for the pan, which is exactly the fat that the other recipes in this slice are missing.
  2. **One nit: the milk is heavy for the egg.** 40 g of milk to 150 g of egg is ~27% by weight — nearly
     3 tablespoons. The step calls it "a splash". The usual ratio is about 1 tbsp (15 g) per 2 eggs
     (100 g), i.e. ~20 g here. At 40 g the curds weep and set watery. Not a naming or cuisine problem,
     just a technique nit, and the grams were plainly chosen for macros.
- **Proposed fix:** none needed for coherence. If the milk is ever re-tuned, 20 g is the technically right
  number and the step wording ("a splash") already matches 20 g better than 40 g.
- **New ingredients required:** `none`
- **Ingredients no longer used:** `none`
- **Macro impact:** none if left as-is.
- **Confidence:** high
- **Sources:** no research needed; uncontested technique.

---

### Avocado Toast with Egg
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — avocado toast's modern popularization is Australian (Bill Granger, Sydney,
  1990s), but as a category on an American menu the label is entirely defensible and I would not change it.
- **Findings:**
  1. **Soft phantom fat.** Step 2 says "**Fry** or poach the eggs to your preference" and there is no fat
     in the ingredient list. The "or poach" branch rescues it — poaching needs no fat — so this is not as
     bad as the hard cases below, but half the instruction is unexecutable as written.
  2. **No acid.** Every standard avocado-toast formula finishes the mash with lemon or lime juice; it is
     what keeps the avocado from browning and greying as much as it is a seasoning. `Lemon` and `Lime` are
     both already in the registry. Its absence is the one genuine composition gap.
  3. Only three ingredients, all used. Clean otherwise.
- **Proposed fix:**
  - *Ingredients:* add `{name:"Lemon", grams:10}`.
  - *Steps:* reword step 3 to "Mash the avocado with a fork, squeeze in the lemon, and season with salt,
    pepper, and chili flakes."
  - *Steps:* reword step 2 to "**Poach the eggs**" (zero-cost, removes the phantom), **or** add
    `{name:"Olive Oil", grams:5}` and keep the fry option. Poaching is the cheaper fix and the more
    idiomatic presentation for this dish.
- **New ingredients required:** `none` (Lemon, Olive Oil both in registry).
- **Ingredients no longer used:** `none`
- **Macro impact:** negligible (~3 cal for lemon; +45 cal / +5 g fat only if the olive-oil branch is taken).
- **Confidence:** high
- **Sources:** no contested fact.

---

### Protein Pancakes
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — the blended oat/banana/egg protein pancake is an American fitness-food
  genre, and the maple-syrup finish is squarely American.
- **Findings:**
  1. **Phantom fat — confirmed instance of the flagged bug class.** Step 3: "Heat a non-stick pan over
     medium heat and **lightly grease**." There is no butter, oil or cooking fat anywhere in the
     ingredient list. This is the same shape as the confirmed "sauté in oil with no fat" bug.
  2. **No leavening.** A blended oat-banana-egg batter with 40 g of milk and 50 g of yogurt is quite loose
     and has nothing to lift it — it will cook flat and dense, closer to a crepe than to the three stacked
     pancakes the name and serving size promise. Baking powder is the missing component. It is effectively
     zero-macro, so per this app's convention it can live in `RECIPE_SPICE_OVERRIDES` rather than the
     registry (same treatment as vinegars and fresh chilies).
  3. All nine ingredients are referenced by a step. Nothing unused.
- **Proposed fix:**
  - *Ingredients:* add `{name:"Butter", grams:5}` (already in the registry, and butter is the idiomatic
    pancake-pan fat) and reword step 3 to "Heat a non-stick pan over medium heat and **melt the butter to
    grease it**."
  - *Spices:* add `{name:"Baking Powder", grams:4}` to `RECIPE_SPICE_OVERRIDES` — this recipe currently has
    none — and reword step 2 to "...add eggs, mashed banana, greek yogurt, **baking powder**, and a splash
    of whole milk to the blender and mix until smooth." Optionally add `{name:"Cinnamon", grams:1}` too.
  - *Note:* `Baking Powder` is **not** an existing name in `RECIPE_SPICE_OVERRIDES` (the 31 existing names
    are all seasonings). It would be new, but it is a zero-macro pantry item and needs only a grocery
    category, so it fits the documented convention.
- **New ingredients required:** `Baking Powder` — **not currently in registry.md and not among the 31
  existing spice-override names.** Add as a spice-override entry (`isSpice:true`), not a registry entry.
  `Butter` and `Cinnamon` already exist.
- **Ingredients no longer used:** `none`
- **Macro impact:** small — butter 5 g adds ~36 cal / 4 g fat. Baking powder is zero.
- **Confidence:** high on the phantom fat; medium on the leavening (some oat-banana pancake recipes do skip
  it and accept a dense pancake).

---

### Smoothie Bowl
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — the smoothie bowl is a Brazilian-açaí-derived form popularized in the US
  and Australia; "American" is the reasonable catch-all here and I would not change it.
- **Findings:**
  1. **Raw rolled oats blended into a cold base.** 30 g of dry rolled oats go into the blender in step 2
     with frozen banana and yogurt. Raw oats do not hydrate in a cold, thick blend — they stay gritty, and
     the bowl turns pasty and thickens further as it sits, working directly against the "serve immediately"
     instruction in step 5. Overnight-soaking the oats, or moving them to the topping alongside the
     granola, both solve it. This is again a carb-macro artifact.
  2. **Three sweet finishers stacked.** Honey 10 g + Maple Syrup 10 g + Granola 40 g, all in the same
     topping step, on top of banana, mango and strawberries. Redundant rather than wrong; the two liquid
     sweeteners duplicate each other exactly as in Classic Oatmeal.
  3. All ten ingredients are referenced by a step. No phantoms, nothing unused. Note there is **no fat and
     no cooking**, so this recipe is free of the phantom-fat class by construction.
- **Proposed fix:**
  - *Steps (cheapest fix, no ingredient change):* move the oats out of the blend. Step 2 becomes "Blend
    frozen banana, blueberries, greek yogurt, and a splash of whole milk until thick and creamy." Step 4
    becomes "Top with granola, **rolled oats**, mango, strawberries, and a drizzle of honey and maple syrup."
    Macro-neutral.
  - *Alternative:* keep the oats in the blend but add a step 1b — "Soak the rolled oats in the whole milk
    for 10 minutes before blending" — and raise `prepTime` accordingly.
  - *Optional (cosmetic):* consolidate Honey + Maple Syrup into a single 20 g `Honey`, as in Classic Oatmeal.
- **New ingredients required:** `none`
- **Ingredients no longer used:** `none` (or `Maple Syrup`, only if the optional consolidation is taken).
- **Macro impact:** none — both fixes are step-level.
- **Confidence:** high on the raw-oat texture problem; the sweetener stacking is a style call (medium).

---

### French Toast
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — despite the name, *pain perdu* / French toast as served with maple syrup
  and berries is an American breakfast institution. The label is defensible and I would not move it to
  `French`; the app's two `French` recipes should stay for actual French dishes.
- **Findings:**
  1. **Rolled oats in the custard is not French toast.** Step 1: "Whisk together eggs, milk, and a pinch of
     cinnamon in a shallow dish. **Mix in crushed rolled oats.**" This is the clearest coherence break in
     the six breakfasts. French toast is defined by bread absorbing a *liquid* egg-and-milk custard; 20 g of
     crushed dry oats turns 110 g of custard into a slurry that (a) will not penetrate the bread and (b)
     coats the outside and scorches in the butter before the interior sets. The 10-second-per-side soak in
     step 2 is already short, and the oats make it worse. Transparently a carb-macro artifact.
  2. **No vanilla.** Cinnamon is present but vanilla is the other half of the standard French-toast custard.
     Zero-macro, fits the spice-override convention.
  3. All ten ingredients are referenced by a step; no phantoms; butter *is* present for the pan (correct,
     unlike Protein Pancakes).
- **Proposed fix:**
  - *Steps (macro-neutral, preferred):* remove the oats from the custard and put them in the topping.
    Step 1 becomes "Whisk together eggs, milk, and a pinch of cinnamon in a shallow dish." Step 5 becomes
    "Serve topped with sliced strawberries, blueberries, sliced banana, granola **and rolled oats**.
    Drizzle with maple syrup." Same grams, same macros, coherent dish.
  - *Spices:* add `{name:"Vanilla Extract", grams:2}` to `RECIPE_SPICE_OVERRIDES` (currently only Cinnamon)
    and name it in step 1. Optionally add `{name:"Salt", grams:0.5}`.
  - *Optional:* raise the soak in step 2 from 10 seconds to 20–30 seconds per side — with the oats gone the
    custard is thin enough to actually absorb.
- **New ingredients required:** `Vanilla Extract` — **not in registry.md and not among the existing
  spice-override names.** Zero-macro, spice-override entry, needs a grocery category only.
- **Ingredients no longer used:** `none` (oats stay, they just move to the topping).
- **Macro impact:** none.
- **Confidence:** high
- **Sources:** no contested fact — the egg-and-milk custard definition of *pain perdu* / French toast is
  uncontroversial. Regional note: brioche or challah is the usual bread, but whole wheat is a legitimate
  everyday choice and is not a finding.

---

### Pork Club Wrap
- **Verdict:** `mislabeled` — **the dish name, not the cuisine.**
- **Cuisine label:** `correct` — a wrap is American enough.
- **Findings:**
  1. **"Club" denotes a specific composition and this is not it.** A club / clubhouse sandwich is a
     three-layer sandwich of toasted bread, **sliced poultry, crisp bacon, lettuce, tomato and mayonnaise**.
     The wrap format is a legitimate variation — every diner and chain sells a "turkey club wrap" — but the
     wrap versions still keep poultry + bacon + lettuce + tomato + mayo. This recipe delivers **pork loin,
     tortilla, avocado, spinach**: wrong protein, no bacon, no tomato, no mayo. Four of the five things
     that make a club a club are absent. The name promises something the ingredients do not deliver.
  2. **Phantom fat — confirmed instance of the flagged bug class.** Step 1: "Slice pork loin thinly and
     **sear in a hot pan**" with no fat anywhere in the ingredient list. Pork loin is ~5% fat raw and
     renders essentially nothing, so this is the worst case of the three phantom-fat instances in this
     slice: the meat sticks and dries rather than searing.
  3. **No spread or sauce of any kind.** With no mayo, no dressing and no cheese, this is pork, tortilla,
     raw spinach and avocado. The 50 g of avocado is the only thing carrying moisture across 270 g of wrap.
  4. All four ingredients are referenced by a step; nothing unused.
- **Proposed fix:** two coherent routes — **I recommend (A)**.
  - **(A) Rename to match the contents (no new ingredients, no macro change).** Name it
    **`"Pork & Avocado Wrap"`**. Then it is an honest, coherent, genuinely low-fat high-protein wrap.
    - *Ingredients:* add `{name:"Olive Oil", grams:5}` to fix the phantom sear.
    - *Ingredients:* add `{name:"Tomato", grams:50}` — cheap, in-registry, and it fixes the dryness.
    - *Steps:* step 1 → "Slice pork loin thinly, then sear in a hot pan **with the olive oil** for 2–3
      minutes per side." Add tomato to the layering step.
    - *Spices:* optionally add `{name:"Smoked Paprika", grams:1}` (existing name) to the pork.
  - **(B) Make it an actual club.** Requires swapping `Pork Loin` → `Turkey Breast` (in registry), adding
    `Tomato` 50 g and `Mayonnaise` 15 g (both in registry), and adding **Bacon** — which is **not in the
    registry**. Note this collides with the app's "aim ≥5 recipes/ingredient" convention: bacon would land
    in one recipe. And it stops being the pork recipe it currently is, which may matter for recipe variety.
- **New ingredients required:** route (A): `none` (Olive Oil, Tomato both in registry). Route (B): **`Bacon`
  — not in registry.md**; would also need adding to the `MEAT_INGREDIENTS` Set per the app's convention.
- **Ingredients no longer used:** route (A): `none`. Route (B): `Pork Loin` (from this recipe).
- **Macro impact:** route (A) small — olive oil +45 cal / +5 g fat, tomato ~+9 cal; the recipe stays
  high-protein/low-fat. Route (B) would push fat up materially (bacon) and is the bigger change.
- **Confidence:** high
- **Sources:** [Club sandwich — Wikipedia](https://en.wikipedia.org/wiki/Club_sandwich);
  [Food Network, Classic Club Sandwich](https://www.foodnetwork.com/recipes/food-network-kitchen/classic-club-sandwich-recipe-2117730)

---

### Chicken Caesar Salad
- **Verdict:** `mislabeled` — **the dish name, not the cuisine.**
- **Cuisine label:** `correct`, with a caveat worth knowing: the Caesar was invented in **Tijuana, Mexico**
  (Cesare Cardini, Hotel Caesar, 1924) by an Italian immigrant. It is nonetheless universally read as an
  American restaurant salad and belongs under `American` in this app. Do not move it to `Mexican`.
- **Findings:**
  1. **The dressing is not a Caesar dressing — and the dressing IS the dish.** Step 4 says "Toss lettuce
     with olive oil and a squeeze of lemon as dressing." That is a plain lemon vinaigrette. The original
     Cardini formula is seven things: romaine, **raw egg yolk**, olive oil, grated Parmesan,
     **Worcestershire sauce**, lime (now usually lemon) juice, and a toasted garlic-rubbed bread crouton —
     whisked into an **emulsion**. This recipe has the romaine, the oil, the Parmesan, the lemon and the
     croutons, but is missing both defining components: the emulsifier (egg yolk) and the savory backbone
     (Worcestershire). Strip those two and you have grilled chicken on dressed romaine, which is what this
     currently is.
  2. **Anchovy is a non-issue — do not add it.** Cardini was explicitly opposed to anchovies in the salad;
     the anchovy note in the original comes from the Worcestershire. Modern versions add them, but they are
     optional, so this saves a new registry entry.
  3. **Croutons are toasted dry.** Step 5 cubes the bread and toasts it with no fat and no garlic. Real
     croutons are tossed in fat (and classically rubbed or tossed with garlic) before toasting. All 10 g of
     olive oil is currently allocated to the dressing.
  4. `Garlic Powder` sits in the spice overrides but step 1 only rubs it on the chicken — the garlic never
     reaches the dressing or the croutons, where a Caesar actually wants it.
  5. No phantom ingredients; all six ingredients are referenced by a step.
- **Proposed fix:** the registry has no egg-yolk entry and its `Egg` is whole-egg macros, so the cleanest
  emulsifier here is **mayonnaise** — which is itself emulsified yolk, oil and acid, and is the base of the
  large majority of modern restaurant Caesar dressings.
  - *Ingredients:* add `{name:"Mayonnaise", grams:15}` (in registry) and **reduce `Olive Oil` 10 g → 8 g**,
    splitting it 3 g to the dressing / 5 g to the croutons.
  - *Spices:* add `{name:"Worcestershire Sauce", grams:5}` to `RECIPE_SPICE_OVERRIDES`. This is the single
    most important change and it is nearly free macro-wise (~4 cal at 5 g).
  - *Steps:* rewrite step 4 → "Whisk the mayonnaise with the lemon juice, Worcestershire sauce, garlic
    powder, olive oil and half the parmesan into a smooth dressing, then toss with the romaine."
    Rewrite step 5 → "Cube the whole wheat bread, toss with the remaining olive oil, and toast until crisp
    to make croutons."
  - *Alternative if mayonnaise is unwanted:* `{name:"Egg", grams:20}` plus a step saying to whisk the yolk
    with lemon and Worcestershire before streaming in the oil. Accurate to the original, but the registry's
    whole-egg macros understate a yolk's calories by roughly 30 cal, so it slightly lies to the solver.
- **New ingredients required:** `Worcestershire Sauce` — **not in registry.md and not among the existing
  spice-override names.** Near-zero macros; fits the spice-override convention, needs a grocery category.
  `Mayonnaise` is already in the registry.
- **Ingredients no longer used:** `none`
- **Macro impact:** moderate. Mayonnaise 15 g ≈ +100 cal / +11 g fat, partly offset by −2 g olive oil
  (−18 cal). Net roughly **+85 cal, +9 g fat, protein unchanged**. The `low-carb` tag still holds; the
  salad goes from ~380 to ~465 cal.
- **Confidence:** high
- **Sources:** [Caesar salad — Wikipedia](https://en.wikipedia.org/wiki/Caesar_salad);
  [UCHealth — the origin of Caesar salad, plus original recipe](https://www.uchealth.org/today/the-origin-of-caesar-salad-plus-original-recipe/);
  [Lola's Cocina — Original Tijuana Caesar Salad](https://lolascocina.com/original-caesar-salad/)

---

### Meatball Sub
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`, and worth defending explicitly so nobody "fixes" it later: the meatball sub
  is an **Italian-American invention that does not exist in Italy**. Italian immigrants in the US Northeast
  enlarged the meatball to suit cheap American ground beef and put it on a local Italian roll. It belongs
  under `American`, not `Italian`.
- **Findings:**
  1. **Phantom ingredient — "the sub roll".** Step 4: "**Split the sub roll** and toast lightly." Step 5:
     "Fill **the roll** with meatballs and sauce." There is no sub roll in the ingredient list; the bread is
     `Whole Wheat Bread` 75 g, and the registry has no roll entry. Two steps name a component the recipe
     does not contain. This is a real instance of the flagged bug class, and it is the same bug as in
     Pulled Pork Sandwich — worth fixing both together.
  2. **The dry-pan browning here is FINE.** Step 2 browns the meatballs with no added fat, but this uses
     `Ground Beef (80% lean)`, which renders plenty. Unlike Pork Club Wrap and Protein Pancakes, this is not
     a phantom — flagging it would be a false positive.
  3. **Under-seasoned for the dish.** The spice overrides are only Salt, Black Pepper, Garlic Powder. An
     Italian-American meatball mix wants oregano and/or basil, and grated Parmesan in the mix. Both
     `Oregano` and `Dried Basil` are already in use as spice-override names elsewhere in the app, and
     `Parmesan Cheese` is in the registry.
  4. **Binder egg is 2–3× the normal ratio.** 50 g of egg (one large egg) to 150 g of beef; the standard is
     about one egg per 450–500 g of meat. At this ratio the mix is loose and the meatballs are soft. Clearly
     a protein-macro artifact. Note `adjustDayMeals` already caps binder eggs at their original grams, so
     the solver will not make it worse — but 50 g is the baseline it starts from.
  5. Nothing unused; all six ingredients are referenced.
- **Proposed fix:**
  - *Steps:* replace "the sub roll" / "the roll" with the bread that is actually there. Step 4 → "Split the
    whole wheat bread lengthwise into a roll shape and toast lightly." Step 5 → "Fill the toasted bread with
    meatballs and sauce." (Purely wording; no ingredient change.)
  - *Spices:* add `{name:"Oregano", grams:1}` and `{name:"Dried Basil", grams:1}` — both are existing
    spice-override names, so nothing new is needed. Name them in step 1 ("Mix ground beef with breadcrumbs,
    salt, pepper, garlic powder, oregano, dried basil, and a beaten egg").
  - *Optional ingredient:* add `{name:"Parmesan Cheese", grams:10}` to the meatball mix and name it in step 1
    — the classic Italian-American mix is beef + breadcrumb + egg + Parmesan.
  - *Optional:* if the solver has room, drop `Egg` 50 g → 25 g. Not required for coherence.
- **New ingredients required:** `none`
- **Ingredients no longer used:** `none`
- **Macro impact:** negligible. Herbs are zero. Optional Parmesan 10 g ≈ +42 cal / +3.8 g protein.
- **Confidence:** high
- **Sources:** [Tasting Table — Who invented the meatball sandwich?](https://www.tastingtable.com/1818926/who-invented-meatball-sandwich/);
  [Spaghetti and meatballs — Wikipedia](https://en.wikipedia.org/wiki/Spaghetti_and_meatballs) (on the
  Italian-American, not Italian, provenance of the American meatball)

---

### Cobb Salad
- **Verdict:** `mislabeled` — **the dish name, not the cuisine.** This is the worst name-vs-contents gap in
  the slice.
- **Cuisine label:** `correct` — the Cobb is Hollywood, 1930s, Brown Derby. Unambiguously American.
- **Findings:** the Cobb has a documented canonical composition, and it is a *composed* salad — the whole
  point is the named rows. The Brown Derby original is: mixed greens (romaine + watercress + chicory),
  **tomato**, poached/roasted **chicken breast**, **very crisp bacon**, **avocado**, **hard-boiled egg**,
  **chives**, and **crumbled Roquefort or other blue cheese**, dressed with a **red-wine vinaigrette**.
  Against that, this recipe has 4 of the 9 components and substitutes on a 5th:
  1. **Cheddar instead of blue cheese.** This is the biggest single miss. The blue cheese is the Cobb's
     signature flavor; cheddar makes it a generic chef-style salad. No source treats cheddar as a Cobb
     variant.
  2. **No bacon.** The other hallmark component, and the one people order the salad for.
  3. **No tomato.** Present in every canonical version; also the only real color and acidity in the bowl.
  4. **No chives.**
  5. **Dressing is bare olive oil.** Step 6 "drizzle with olive oil and season with salt and pepper" — the
     canonical dressing is a red-wine vinaigrette (vinegar, lemon, mustard, Worcestershire, garlic, oil).
     Undressed oil on romaine will not cling and tastes flat.
  6. On the good side: **the composed-rows technique is correct** (step 5 arranges rows rather than tossing),
     which is the part most home versions get wrong. Credit where due.
  7. No phantoms; all six ingredients are referenced by a step. The chicken is grilled with no added fat
     (all 10 g of olive oil goes to the dressing) — a soft nit, not a phantom, since dry-grilling a breast
     is normal.
- **Proposed fix:** in two tiers, so the free tier can land without touching the registry.
  - **Tier 1 — no new ingredients, do this regardless:**
    - *Ingredients:* add `{name:"Tomato", grams:60}` and `{name:"Green Onion", grams:10}` (a legitimate
      stand-in for chives — same allium family, already in the registry).
    - *Spices:* add `{name:"Red Wine Vinegar", grams:8}` — **already an existing spice-override name in the
      app**, zero-macro. This alone turns the bare oil into an actual vinaigrette.
    - *Steps:* step 5 → "Arrange rows of chicken, egg, avocado, tomato, and crumbled cheese on the lettuce."
      Step 6 → "Whisk the olive oil with the red wine vinegar, salt and pepper into a vinaigrette, drizzle
      over the salad, and scatter with sliced green onion."
  - **Tier 2 — requires new registry entries:**
    - Swap `Cheddar Cheese` 20 g → **`Blue Cheese`** 20 g. This is the change that actually makes it a Cobb.
    - Add **`Bacon`** ~20 g (cooked crisp) and a step to crisp and crumble it.
    - Caveat to weigh: both would be **single-recipe ingredients**, against the app's stated "aim ≥5
      recipes/ingredient" convention, and `Bacon` also needs adding to `MEAT_INGREDIENTS`. Blue cheese has
      the better ratio of authenticity-gained to registry-cost, so if only one is added, make it blue cheese.
  - *If neither tier 2 add is wanted:* rename the recipe (e.g. `"Chicken, Egg & Avocado Salad"`). A Cobb
    without bacon or blue cheese should not carry the name.
- **New ingredients required:** tier 1: `none`. Tier 2: **`Blue Cheese`** and **`Bacon`** — neither is in
  registry.md.
- **Ingredients no longer used:** tier 2 only: `Cheddar Cheese` (from this recipe; it is used elsewhere in
  the app, e.g. Scrambled Eggs & Toast, so it stays in the registry).
- **Macro impact:** tier 1 is nearly free (tomato +11 cal, green onion +3 cal, vinegar 0). Tier 2:
  blue cheese for cheddar is a wash (−10 cal, −0.7 g protein at 20 g); 20 g crisp bacon adds roughly
  +90 cal / +6 g protein / +7 g fat, which is the only change that meaningfully moves the day.
- **Confidence:** high
- **Sources:** [Cobb salad — Wikipedia](https://en.wikipedia.org/wiki/Cobb_salad);
  [PBS SoCal — The Brown Derby's Cobb Salad Recipe](https://www.pbssocal.org/food-discovery/food/the-brown-derbys-cobb-salad-recipe);
  [Food Network — The Original Cobb Salad (Hollywood Brown Derby)](https://www.foodnetwork.com/recipes/the-original-cobb-salad-1927592.amp)

---

### Pulled Pork Sandwich
- **Verdict:** `incoherent` — genuine internal contradiction between the ingredient and the technique.
- **Cuisine label:** `correct` — barbecue pulled pork is as American as the app gets.
- **Findings:**
  1. **You cannot pull pork loin. This is the finding.** Steps 3–4 slow-cook for 3 hours and then shred with
     two forks — a technique that depends entirely on **collagen melting into gelatin**, which is why pulled
     pork is made from shoulder / Boston butt (~10–15% fat, heavily worked muscle, dense connective tissue).
     `Pork Loin` is a lean, low-collagen cut at ~5% fat; 3 hours of low-and-slow does not tenderize it, it
     dries it out. It will come apart into dry strings rather than shredding. The ingredient and the method
     contradict each other, which is why this gets `incoherent` rather than a name-level verdict.
  2. **Phantom ingredient — "the sub rolls".** Step 5: "Toast **the sub rolls**." Step 6: "Pile pulled pork
     on **the rolls**." The ingredient list has `Whole Wheat Bread` 75 g and no roll. Same bug as Meatball Sub.
  3. **Unspecified cooking liquid.** Step 2: "Place in a slow cooker or Dutch oven with **a splash of
     liquid**." No liquid is in the ingredient list, and the step will not even name what it is. `Water` is
     in the registry at zero macros, so this is free to fix.
  4. **"Coleslaw mix" is not coleslaw.** Step 6 tops the sandwich with `Coleslaw Mix` straight from the bag —
     that is undressed shredded cabbage and carrot. Coleslaw is by definition dressed. Dry raw cabbage on a
     barbecue sandwich is a texture with no flavor, and it is the second-most-noticeable problem here.
  5. All four ingredients are referenced by a step; nothing unused.
- **Proposed fix:** the cut question is a real trade-off, so here are both honest routes.
  - **(A) Fix the dish — recommended if the name matters.** Swap `Pork Loin` 150 g → **`Pork Shoulder`**
    150 g. Keep everything else. This makes every step true.
    - Caveat: `Pork Shoulder` is **not in the registry**, would be a single-recipe ingredient against the
      "≥5 recipes/ingredient" convention, and needs adding to `MEAT_INGREDIENTS`.
    - Caveat: **large macro shift** — see below.
  - **(B) Fix the name — recommended if the lean macro profile matters.** Keep `Pork Loin`, rename to
    **`"BBQ Pork Sandwich"`**, and change the method to what loin actually wants: rub, roast or sear to
    ~63 °C, rest, **slice thin** (not shred), toss with BBQ sauce. Drop `cookTime` from 3 hrs to ~25 mins.
    Zero new ingredients, zero macro change, and it becomes a coherent recipe.
  - **Apply to both routes:**
    - *Ingredients:* add `{name:"Water", grams:120}` and name it in step 2 ("...with the water, cover
      tightly") — route (A) only; route (B) does not braise.
    - *Steps:* replace "the sub rolls" / "the rolls" with "the whole wheat bread".
    - *Spices:* add `{name:"Red Wine Vinegar", grams:10}` — an existing spice-override name — and reword
      step 6 to "Toss the coleslaw mix with the red wine vinegar, a pinch of salt and pepper, then pile the
      pork on the bread and top with the slaw." A vinegar slaw is zero-macro **and** is the idiomatic
      eastern-North-Carolina pairing for a pulled pork sandwich, so this fix is free in both senses.
      (A mayo slaw — `Mayonnaise` 15 g, in registry — is the alternative, at ~+100 cal / +11 g fat.)
- **New ingredients required:** route (A): **`Pork Shoulder` — not in registry.md** (also needs
  `MEAT_INGREDIENTS`). Route (B): `none`. `Water` and `Red Wine Vinegar` already exist.
- **Ingredients no longer used:** route (A): `Pork Loin` (from this recipe; it is still used by Pork Club
  Wrap, so it stays in the registry). Route (B): `none`.
- **Macro impact:** route (A) is **large** — raw pork shoulder is roughly 270 cal / 17 g protein / 21 g fat
  per 100 g vs pork loin's ~143 cal / 21 g protein / 6 g fat. At 150 g that is about **+190 cal, −6 g
  protein, +23 g fat**, turning a lean sandwich into a genuinely fatty one and materially changing what the
  solver can do with the day. Route (B) is macro-neutral. This trade-off is the whole decision.
- **Confidence:** high
- **Sources:** [The Kitchen Community — Pork Loin vs Pork Shoulder](https://thekitchencommunity.org/pork-loin-vs-pork-shoulder-the-differences/);
  [Foods Guy — Pork Loin vs Pork Shoulder](https://foodsguy.com/pork-loin-vs-pork-shoulder/)

---

### Turkey Lettuce Wraps
- **Verdict:** `mislabeled` — **the cuisine label this time**, plus some real internal incoherence.
- **Cuisine label:** should be **`Chinese`** (a label that already exists in `data.js`, currently with only
  2 recipes). Lettuce cups filled with cooked minced/diced meat and soy seasoning is **san choy bow**, a
  Cantonese dish from Guangdong that reached the US and Australia through the Chinese diaspora, and which
  became a American-restaurant fixture via P.F. Chang's. The soy sauce is the tell: nothing about
  soy-glazed meat in lettuce cups reads `American` except the venue it is usually eaten in. `American` is
  weakly defensible as "Chinese-American health adaptation", but it is the loosest label in this slice.
- **Findings:**
  1. **Romaine does not make a cup.** Step 5: "Separate romaine lettuce leaves to use as cups." Romaine
     leaves are long, flat and stiffly ribbed; the dish is made with **iceberg, butter or Bibb** for exactly
     this reason (iceberg is the sturdier choice under a hot filling, butter lettuce wilts fast). The
     registry has only `Romaine Lettuce`, so this is a constraint, not carelessness — but the step as
     written promises something romaine will not do.
  2. **Raw sliced onion served on the side is incoherent.** Step 6: "...and serve with **sliced onion**."
     40 g of raw sliced onion is a harsh, sharp mouthful next to a mild turkey filling, and in san choy bow
     the onion is an **aromatic cooked into the meat**, never a raw garnish. The onion is technically
     "used", so it does not trip the unused-ingredient check, but its role is wrong.
  3. **No fat and an ultra-lean protein.** Step 2 cooks 180 g of turkey breast (~1% fat) in a bare non-stick
     pan. Specifying non-stick makes this defensible rather than a hard phantom, but the result is dry, and
     `Sesame Oil` — already in the registry and canonical for this dish — fixes flavor and function at once.
  4. **The defining aromatics are absent.** No garlic, no ginger, no hoisin, no green onion — the flavor
     spine of san choy bow. **All four are already in the registry** (`Garlic`, `Ginger`, `Hoisin Sauce`,
     `Green Onion`), so this is close to free. Worth noting `Hoisin Sauce` is on the project's own
     below-5-recipes backlog, so using it here also chips at that item.
  5. **Lime is the odd one out.** Lime with soy in lettuce cups leans Thai/Vietnamese rather than Cantonese.
     Harmless and arguably a nice modern touch — low stakes either way.
  6. No phantom ingredients; all six are referenced.
- **Proposed fix:** lean into what the dish actually is.
  - *Label:* change `cuisine` from `"American"` to `"Chinese"`. (Bonus: `Chinese` has only 2 recipes and the
    generator caps cuisines at 2/week, so it is under-served.)
  - *Ingredients:* add `{name:"Sesame Oil", grams:5}`, `{name:"Garlic", grams:6}`, `{name:"Ginger", grams:6}`,
    `{name:"Hoisin Sauce", grams:15}`, `{name:"Green Onion", grams:15}` — **all already in the registry.**
  - *Ingredients:* keep `Onion` 40 g but dice it and cook it; keep or drop `Lime` 15 g (either is fine).
  - *Steps:* rewrite the middle of the method —
    "Dice the turkey breast small. / Heat the **sesame oil** in a pan over medium-high heat and cook the
    **diced onion, garlic and ginger** for 1 minute until fragrant. / Add the turkey and cook 4–5 minutes
    until golden. / Add the **soy sauce and hoisin sauce** and toss to glaze in the last minute. / Grate or
    julienne the carrot. / Separate the **inner romaine leaves** to use as cups. / Fill with the turkey and
    carrot, scatter with **sliced green onion**, and squeeze lime over the top."
    Note "inner romaine leaves" — the short inner leaves of a romaine heart do cup acceptably, which makes
    the step honest without a new ingredient.
  - *Optional new ingredient:* `Butter Lettuce` or `Iceberg Lettuce` would be the correct vessel, but it is
    another single-recipe registry entry; the inner-romaine wording is the cheaper fix.
  - *Spices:* optionally add `{name:"White Pepper", grams:0.5}` (existing name) — standard in Cantonese
    minced-meat fillings.
- **New ingredients required:** `none` for the recommended fix. Optional only: `Butter Lettuce` /
  `Iceberg Lettuce` — **not in registry.md**.
- **Ingredients no longer used:** `none` (`Lime` only if it is dropped, which is optional).
- **Macro impact:** moderate but manageable — sesame oil +45 cal / +5 g fat, hoisin 15 g ≈ +33 cal / +7 g
  carbs, aromatics ~+15 cal. Roughly **+95 cal, +9 g carbs, +5 g fat**, protein unchanged. The `low-carb`
  tag is worth re-checking after adding hoisin; if it must hold, drop the hoisin and keep the rest.
- **Confidence:** high on the cuisine call and the aromatics; medium on how hard to push the romaine issue,
  since it is a registry constraint rather than a recipe error.
- **Sources:** [San Choy Bow — Wikipedia](https://en.wikipedia.org/wiki/San_Choy_Bow);
  [RecipeTin Eats — Chinese Lettuce Wraps (San Choy Bow)](https://www.recipetineats.com/san-choy-bow-chinese-lettuce-wraps/);
  [P.F. Chang's — Chang's Chicken Lettuce Wraps](https://www.pfchangs.com/menu/appetizers/chang's-lettuce-wraps)

---

## Summary

### Counts by verdict
| Verdict | Count | Recipes |
|---|---|---|
| `coherent` | 1 | Scrambled Eggs & Toast |
| `minor-drift` | 6 | Classic Oatmeal with Berries, Avocado Toast with Egg, Protein Pancakes, Smoothie Bowl, French Toast, Meatball Sub |
| `incoherent` | 1 | Pulled Pork Sandwich |
| `mislabeled` | 4 | Cobb Salad, Chicken Caesar Salad, Pork Club Wrap (all three: dish **name**), Turkey Lettuce Wraps (**cuisine** label) |

No recipe in this slice needed a nut or an olive to be made correct, so the hard constraints never bound.

### The 3 worst offenders
1. **Pulled Pork Sandwich** — made from `Pork Loin`, a lean low-collagen cut that physically cannot be
   pulled; the 3-hour slow-cook-and-shred method contradicts the ingredient. Also invents "sub rolls" it
   does not have, braises in an unnamed liquid, and tops the sandwich with undressed bagged cabbage.
2. **Cobb Salad** — a Cobb with no bacon, no blue cheese (cheddar instead), no tomato, no chives and no
   vinaigrette. It keeps only 4 of the 9 canonical components; the composed-rows technique is the one part
   it gets right.
3. **Chicken Caesar Salad** — the dressing is olive oil and a squeeze of lemon. Both defining components of
   Caesar dressing (emulsifying egg yolk, Worcestershire) are missing, so the dish is grilled chicken on
   dressed romaine wearing a Caesar's name.

*Runner-up:* **Pork Club Wrap** — a "club" with no bacon, tomato, mayo or poultry, seared in a hot pan with
no fat in the recipe.

### Bug-class sweep (the three classes flagged in the brief)
- **Phantom ingredients (5 confirmed):**
  - `Meatball Sub` — steps 4 & 5 name a "sub roll" / "the roll"; the recipe has `Whole Wheat Bread`.
  - `Pulled Pork Sandwich` — steps 5 & 6 name "the sub rolls" / "the rolls"; same missing component.
  - `Pork Club Wrap` — step 1 "sear in a hot pan" with **no fat in the recipe** (worst case: pork loin
    renders nothing).
  - `Protein Pancakes` — step 3 "lightly grease" with no fat in the recipe.
  - `Avocado Toast with Egg` — step 2 "**Fry** or poach" with no fat; the "or poach" branch partly rescues it.
  - *Deliberately NOT flagged:* `Meatball Sub` browning meatballs dry (80% lean beef renders its own fat)
    and `Cobb Salad` / `Chicken Caesar Salad` dry-grilling chicken breast (normal technique). These are
    false positives.
- **Unused ingredients: none found.** All 12 recipes reference every ingredient in at least one step.
  (`Onion` in Turkey Lettuce Wraps is referenced but in the wrong role — raw garnish rather than cooked
  aromatic — which is a coherence finding, not an unused-ingredient one.)
- **Wrong cooking liquid (2):**
  - `Classic Oatmeal with Berries` — 80 g of dry rolled oats simmered in only 120 g of milk (~1.5:1 by
    weight, needs ~3:1). The pan goes dry before the oats hydrate.
  - `Pulled Pork Sandwich` — braises in "a splash of liquid" that is named nowhere and is not an ingredient.
  - No hard-coded imperial volumes ("2 cups water") appear anywhere in this slice.

### Consolidated NEW ingredients required across the slice
**Required for the recommended fixes (2, both zero/near-zero macro spice-override entries, not registry
entries):**
- `Worcestershire Sauce` — Chicken Caesar Salad. Not in registry.md, not among the 31 existing
  spice-override names. Needs a grocery category only.
- `Baking Powder` — Protein Pancakes. Same treatment.
- `Vanilla Extract` — French Toast. Same treatment. *(3 if French Toast's optional vanilla is taken.)*

**Required only if the optional/alternative routes are taken (all would be single-recipe registry entries,
against the app's "aim ≥5 recipes/ingredient" convention):**
- `Blue Cheese` — Cobb Salad tier 2. **Highest value of these**: it is the Cobb's signature and the swap is
  macro-neutral.
- `Bacon` — Cobb Salad tier 2, and Pork Club Wrap route (B). Would also need adding to `MEAT_INGREDIENTS`.
  Used by two recipes, which softens the ≥5 objection slightly.
- `Pork Shoulder` — Pulled Pork Sandwich route (A). Also needs `MEAT_INGREDIENTS`. Big macro shift.
- `Butter Lettuce` / `Iceberg Lettuce` — Turkey Lettuce Wraps, optional; the "inner romaine leaves" rewording
  avoids it.

**Already in the registry, just newly used by these recipes:** Water, Lemon, Olive Oil, Butter, Tomato,
Green Onion, Mayonnaise, Sesame Oil, Garlic, Ginger, Hoisin Sauce, Parmesan Cheese. **Already existing
spice-override names, newly used:** Red Wine Vinegar, Oregano, Dried Basil, Cinnamon, White Pepper.

### Consolidated ingredients the slice would STOP using
- `Cheddar Cheese` — only if Cobb Salad tier 2 is taken (swapped for Blue Cheese). Still used elsewhere in
  the app (Scrambled Eggs & Toast), so it stays in the registry.
- `Pork Loin` — only if Pulled Pork Sandwich route (A) is taken. Still used by Pork Club Wrap, so it stays
  in the registry.
- `Maple Syrup` — optional only, in Classic Oatmeal and/or Smoothie Bowl, if the redundant double-sweetener
  is consolidated into Honey. Heavily used elsewhere; stays in the registry.
- `Lime` — optional only, in Turkey Lettuce Wraps. Heavily used elsewhere; stays in the registry.

**Net: no ingredient would be orphaned from the registry by any fix proposed here.**
