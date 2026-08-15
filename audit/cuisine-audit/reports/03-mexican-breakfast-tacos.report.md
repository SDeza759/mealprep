# Authenticity audit — Mexican: breakfast and tacos (8 recipes)

Mode: **traditional** — the specifics ARE the dish.

## Slice-level observations (read first)

Three patterns run across the whole slice and explain most of the individual findings:

1. **There is no chile anywhere in these 8 recipes.** Not one guajillo, chile de árbol, serrano,
   jalapeño, or chipotle. The closest thing is `Chili Powder` (in 2 recipes), which is the *American
   compound blend* — chile plus cumin, garlic and oregano — not a Mexican chile. For a Mexican slice
   this is the headline finding. Chilaquiles, huevos rancheros and tacos de camarón are each defined
   by a chile-based salsa; all three currently have none.

2. **Cumin is the only seasoning in 7 of the 8 recipes.** Be fair here: cumin (comino) *is* Mexican —
   Diana Kennedy uses it as "a light accent," Maricruz Avalos's chilaquiles rojos includes ¼ tsp
   cumin seeds, and northern-Mexican picadillo relies on it. The finding is not "cumin is
   un-Mexican." It is that cumin is carrying the entire seasoning load in place of the chiles, which
   is precisely the Tex-Mex signature (yellow cheese + beef + cumin-forward spicing).

3. **`Coleslaw Mix` appears in 3 of 8** (Carnitas, Shrimp, Duck) and is wrong or redundant in all
   three. Mexican street tacos take finely chopped white onion, cilantro, salsa and lime — no slaw.
   The one dish where cabbage genuinely belongs (Baja shrimp tacos) already has `Cabbage` listed
   separately, so there it is literally cabbage on cabbage. If nothing outside this slice uses
   `Coleslaw Mix`, removing it here orphans the registry entry — worth a data-hygiene sweep.

Also: `Feta Cheese` stands in for queso fresco in two recipes while **`Queso Fresco` is already in the
registry**. That is the cheapest high-value fix in the slice — two one-line swaps, no new ingredients.

---

### Breakfast Burrito
- **Verdict:** `mislabeled`
- **Cuisine label:** should be **`American`** (specifically New Mexican / Southwestern). The
  breakfast burrito is a documented Santa Fe, New Mexico invention from c. 1975–76 — Tia Sophia's
  (smothered) and Dee's (hand-held) are the competing claims. TasteAtlas files it under Santa Fe,
  USA. In southern Mexico it is reported as a curiosity served to tourists. It is not a Mexican dish.
- **Findings:**
  - The dish itself is coherent and well built — nothing is internally broken. The problem is purely
    the `Mexican` label.
  - `Cheddar Cheese` is the Tex-Mex/American "yellow cheese" marker. In a northern-Mexican egg
    burrito the cheese would be queso fresco, asadero or Chihuahua.
  - `Whole Wheat Tortilla` is an American health-food product. **A flour tortilla is *not* a finding**
    — burritos are northern Mexican (Chihuahua/Sonora) flour-tortilla food and corn would be wrong
    here. Only the *whole wheat* part is an American convention.
  - No salsa. Every version of this dish in either country carries one.
  - Steps match the ingredient list exactly; no phantoms, nothing unused.
- **Proposed fix:** Primary and simplest — **change `cuisine` from `Mexican` to `American`** and
  change nothing else. The recipe is a good breakfast burrito; it is just not Mexican.
  Alternative, if the owner wants to keep a Mexican breakfast in a tortilla: rename to
  `Burrito de Huevo con Frijol`, swap `Cheddar Cheese` 25g → `Queso Fresco` 30g, add `Tomato` 40g
  and a spice-override `Serrano Chile` 4g for a salsa, and add a step "fry the tomato, onion and
  serrano into a salsa and spoon it inside before rolling." Ideally the tortilla becomes a plain
  `Flour Tortilla` (not in registry).
- **New ingredients required:** `none` for the relabel. For the alternative: `Queso Fresco` (in
  registry), `Tomato` (in registry), `Serrano Chile` (**not in registry** — zero-macro spice
  override), `Flour Tortilla` (**not in registry**).
- **Ingredients no longer used:** `none` for the relabel. `Cheddar Cheese` and `Whole Wheat Tortilla`
  under the alternative.
- **Macro impact:** none for the relabel. Under the alternative, cheddar → queso fresco lowers
  calories and fat modestly (cheddar ~403cal/33g fat per 100g vs queso fresco ~299cal/24g fat) with
  slightly less protein per gram.
- **Confidence:** high
- **Sources:** Tasting Table "New Mexico Is The Home Of The Original Breakfast Burrito"; Santa Fe New
  Mexican, "Just who invented the hand-held breakfast burrito?"; TasteAtlas breakfast burrito entry;
  Wikipedia "Breakfast burrito"; Origins (Ohio State), "Mexican Food in the United States."

---

### Chilaquiles
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct`
- **Findings:**
  - **The salsa is not a chilaquiles salsa.** `Tomato Sauce` 100g simmered with a pinch of cumin is
    the whole sauce. Salsa roja for chilaquiles rojos is built on *dried chiles* — guajillo for the
    deep red colour and earthy body, chile de árbol for heat — blended with fresh tomato, white onion
    and garlic, and then **fried** in hot oil before the chips go in. Sources are consistent that
    pouring un-fried blended salsa over chips gives a muddy, harsh result; the frying step is not
    optional. Trace cumin in the salsa is legitimate (Maricruz Avalos uses ¼ tsp cumin seeds), so
    cumin is not the problem — the total absence of chile is.
  - **`Feta Cheese` should be `Queso Fresco`.** Feta is Greek, brine-cured, sharply salty and tangy;
    queso fresco is mild, milky and crumbles differently. `Queso Fresco` is already in the registry.
    Cotija is the other correct answer.
  - **No crema.** Mexican crema is close to universal on chilaquiles and is the counterweight to the
    chile. There is no crema in the registry; `Greek Yogurt` thinned with a little water is the
    achievable stand-in, or add a `Mexican Crema` entry.
  - Step 3 ("add tortilla chips to the sauce and toss to coat") then plate: the direction is right
    but the timing is the whole game. Chips go in seconds before serving so they keep their bite.
  - Step 1 "fry **or bake** until crispy" — baking is a modern light adaptation; traditional is fried,
    ideally from day-old tortillas. Given the app's health lean I would leave the option but name
    frying first.
  - Onion should be specified as *white* onion, in thin rings or slivers, added raw at the end. The
    current step says "diced onion," which is fine but underspecified.
  - Eggs on top are correct — chilaquiles con huevo is standard (listed as an optional serving in
    Mexican sources, i.e. common but not mandatory).
- **Proposed fix:**
  - *Ingredients:* `Feta Cheese` 25g → `Queso Fresco` 30g. Optionally `Tomato Sauce` 100g →
    `Tomato` 100g (fresh, charred and blended) for a closer salsa; the minimum viable fix keeps
    `Tomato Sauce` and just adds the chiles.
  - *Spices:* add `Guajillo Chile` 4g and `Chile de Árbol` 1g (dried chiles, zero-macro spice
    overrides); add `Garlic Powder` 1g. Keep `Cumin` at 1g — it is now an accent, not the headline.
  - *Steps:* rewrite step 2 → "Toast the guajillo and árbol chiles in a dry pan, soak them in hot
    water, then blend with the tomato, onion and garlic. Fry the blended salsa in hot oil until it
    darkens and thickens." Rewrite step 3 → "Fold the chips into the sauce just before serving so
    they stay crisp." Step 5 → "…top with fried eggs, thin slivers of raw white onion, sliced
    avocado, and crumbled queso fresco."
- **New ingredients required:** `Queso Fresco` — **already in registry**. `Guajillo Chile`,
  `Chile de Árbol` — **not in registry**; both are zero-macro dried seasonings and belong in
  `RECIPE_SPICE_OVERRIDES`, needing only a grocery category. Optional `Mexican Crema` — **not in
  registry**.
- **Ingredients no longer used:** `Feta Cheese` (in this recipe).
- **Macro impact:** small. Feta → queso fresco trims a few calories and fat and a lot of sodium at
  similar protein. Dried chiles are negligible. If `Tomato Sauce` → `Tomato`, slightly fewer calories
  and carbs.
- **Confidence:** high
- **Sources:** maricruzavalos.com/chilaquiles-rojos (Mexican author, fetched — guajillo + árbol +
  fresh tomato, queso fresco, crema, white onion, optional fried eggs); isabeleats.com red
  chilaquiles; acedarspoon.com chilaquiles rojos.

---

### Huevos Rancheros
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct`
- **Findings:**
  - **There is no chile in a dish named for its chile salsa.** "Rancheros" *is* the salsa ranchera:
    roasted/charred tomato, white onion, garlic and serrano (or jalapeño), blended then fried and
    simmered until it darkens. The recipe has `Tomato Sauce` 80g "warmed in a skillet" with a pinch of
    cumin. That is not salsa ranchera. Notably, the Mexican sources' salsa ranchera contains **no
    cumin at all**.
  - **The tortillas are dry-warmed; they must be lightly fried.** Sources are emphatic: ~20–45 seconds
    per side in oil until golden with slightly crisp edges. This is not a flourish — it is what keeps
    the tortilla from going to mush under the salsa, and it adds flavour. "Warm in a dry pan until
    pliable" produces a soggy base.
  - **`Feta Cheese` should be `Queso Fresco`** (or cotija). Same finding as chilaquiles; `Queso
    Fresco` is already in the registry.
  - **No onion or garlic anywhere in the ingredient list**, which makes a correct salsa ranchera
    impossible to build from what is there.
  - Beans should be *refried* (frijoles refritos), not warmed whole. Whether they sit alongside or are
    spread on the tortilla is legitimate regional variation — the Mexican Food Journal version puts
    them on the side, plenty of Mexican versions spread them under the egg. Not a finding either way,
    but "heat black beans with a splash of water" should become "mash into refried beans."
  - Avocado: one strict source omits it, but avocado on huevos rancheros is widespread across Mexico.
    **Not a finding** — honest variation.
- **Proposed fix:**
  - *Ingredients:* `Feta Cheese` 20g → `Queso Fresco` 25g. Add `Onion` 25g (the salsa needs it).
  - *Spices:* add `Serrano Chile` 5g and `Garlic Powder` 1g (both zero-macro overrides). Drop `Cumin`
    1g → 0, since salsa ranchera is tomato/chile/onion/garlic and nothing else.
  - *Steps:* step 1 → "Lightly fry the corn tortillas in a little oil, about 20 seconds per side,
    until golden with slightly crisp edges." Step 2 → "Mash the black beans into refried beans with a
    splash of their liquid." Step 3 → "Fry the tomato sauce with chopped onion, garlic and minced
    serrano until it darkens into a salsa ranchera, about 10 minutes." Step 6 → "…and crumbled queso
    fresco."
- **New ingredients required:** `Queso Fresco` and `Onion` — **both already in registry**.
  `Serrano Chile` — **not in registry**; zero-macro spice override.
- **Ingredients no longer used:** `Feta Cheese` (in this recipe).
- **Macro impact:** minimal. `Onion` 25g adds ~10 cal. Feta → queso fresco slightly lower fat and
  calories. Frying the tortillas adds real oil in practice, but the recipe already has no cooking-oil
  line so the macros are unchanged as modelled.
- **Confidence:** high
- **Sources:** mexicanfoodjournal.com/huevos-rancheros (fetched — fried tortillas essential; salsa =
  roma tomato + serrano/jalapeño + white onion + garlic, no cumin; cotija or queso fresco; refried
  beans); muybuenoblog.com/huevos-rancheros; holajalapeno.com/huevos-rancheros.

---

### Carnitas Tacos
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` (Michoacán)
- **Findings:**
  - **`Pork Loin` is the wrong cut, and this one is disqualifying.** Carnitas is defined by fatty pork
    — shoulder / Boston butt (maciza) at roughly 20% fat, frequently mixed with belly, ribs and skin —
    confited in lard until it is tender enough to shred and then crisped at the edges. Loin is the
    leanest cut on the animal. Held at temperature for three hours it goes dry and stringy, and it
    cannot produce the caramelised crisp edges that are the entire point of the dish. This is the
    same class of finding as ceviche made with mango: the cut is not an implementation detail, it *is*
    carnitas.
  - **It is a braise, not a confit, and it never gets crisped.** The steps use a slow cooker with "a
    splash of water," then shred and serve. Traditional carnitas cooks submerged in lard (a *cazo*, a
    copper pot), and the final move — spreading the shredded pork over high heat or under a broiler
    until the edges caramelise — is missing entirely. Without it this is pulled pork in a tortilla.
  - **Phantom ingredient:** step 2 calls for orange juice, but there is no orange anywhere in the
    ingredient list. Orange (juice and peel, often with piloncillo) *is* traditional Michoacán
    carnitas, so the fix is to add it, not to delete the mention.
  - **`Coleslaw Mix` does not belong on carnitas tacos.** Carnitas are served with warm corn
    tortillas, salsa, lime, finely chopped white onion, cilantro and chiles en vinagre. Cabbage slaw
    is a Baja seafood-taco and US-taco convention. It is also redundant — `Onion` and `Cilantro` are
    already in the recipe.
  - **No salsa and no chile.** Same slice-wide gap.
  - `Cumin` 2g is defensible but not core — Mexican sources list it as an optional addition, while the
    fixed base is salt, garlic, bay leaves and orange. `Oregano` should be **Mexican** oregano, which
    is a different plant from Mediterranean oregano and tastes it (more citrus and grass, less anise).
- **Proposed fix:**
  - *Ingredients:* `Pork Loin` 150g → **`Pork Shoulder` 150g** (new registry entry, USDA "Pork,
    fresh, shoulder, blade, Boston (butt), raw"). If the owner will not add a registry entry, the
    least-bad in-registry approximation is `Pork Loin` 110g + `Pork Belly` 40g, which lands near
    shoulder's fat ratio — say so explicitly rather than pretending loin works.
    Remove `Coleslaw Mix` 40g. Add `Orange` ~30g (new registry entry) to retire the phantom.
  - *Spices:* add `Bay Leaves` 1g (already a valid name) and `Garlic Powder` 1g; change `Oregano` →
    `Mexican Oregano`; reduce `Cumin` 2g → 1g.
  - *Steps:* rewrite as confit-then-crisp. "Season the pork with salt and pepper. Cook it gently
    submerged in its own rendered fat with garlic, bay leaves and orange juice and peel, at a bare
    simmer, about 3 hours until fork-tender. Shred with two forks. Spread the shredded pork in a hot
    dry pan (or under a broiler) until the edges caramelise and crisp — this is what makes it
    carnitas. Warm the corn tortillas. Fill with the crisped pork, finely chopped white onion and
    cilantro, and squeeze lime over."
- **New ingredients required:** `Pork Shoulder` — **NOT in registry, flag**. `Orange` — **NOT in
  registry, flag** (small sugar contribution; could alternatively live as a spice-override if the
  gram amount is trivial). `Mexican Oregano` — spice-override rename, **not in registry**.
- **Ingredients no longer used:** `Coleslaw Mix`, `Pork Loin` (in this recipe; check other recipes
  before touching the registry entry).
- **Macro impact:** **material — the largest in this slice.** Pork loin raw is ~143 cal / 21g protein
  / 4g fat per 100g; pork shoulder (butt) raw is ~209 cal / 17g protein / 15g fat per 100g. At 150g
  that is roughly **+100 cal, +16g fat, −6g protein**. This recipe currently reads as a lean
  high-protein option and will stop being one. Dropping `Coleslaw Mix` removes ~10 cal. Run the
  validator after this change.
- **Confidence:** high
- **Sources:** maricruzavalos.com/authentic-carnitas-recipe (Mexican author, fetched — shoulder plus
  belly/ribs/skin, lard, garlic + bay + orange + optional piloncillo, cumin explicitly optional;
  served with tortillas, salsa, lime, cilantro, onion, chiles en vinagre); Saveur "Carnitas Tacos
  (Michoacán-Style Braised Pork Tacos)"; carnediem.blog Michoacán-style carnitas (20% fat ratio,
  cazo).

---

### Shrimp Tacos
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — tacos de camarón are genuinely Mexican (Baja California, Sinaloa,
  Nayarit).
- **Findings:**
  - **`Cabbage` 60g and `Coleslaw Mix` 40g are the same component listed twice.** Coleslaw mix is
    shredded cabbage and carrot. Step 4 says "shred cabbage thinly" and step 5 fills the tortilla with
    "cabbage, coleslaw" — the recipe is putting cabbage on cabbage. This is an internal-coherence bug
    independent of authenticity.
  - **No sauce.** A taco de camarón without a creamy chipotle sauce is missing its defining condiment.
    The standard is Mexican crema (or mayonnaise) blended with chipotles in adobo, garlic and lime.
    `Mayonnaise` is in the registry, so a documented version is buildable; `Greek Yogurt` is the leaner
    stand-in if preferred.
  - **No chile.** Cumin is again the only non-salt seasoning, and it is not the Baja profile — the
    seasoning there runs garlic powder and paprika (in the batter), with the heat coming from chipotle
    in the sauce and jalapeño in the slaw.
  - **Do not flag the sear.** The traditional Baja preparation is beer-battered and deep-fried, but
    tacos de camarón a la plancha and al chipotle are genuinely Mexican and genuinely seared. This is
    honest regional variation and the light version is a legitimate choice.
  - **Do flag the sear time.** "2-3 minutes per side" overcooks shrimp badly; 1–2 minutes per side is
    right.
  - The cabbage should be a dressed slaw, not bare shreds — cabbage with onion, cilantro, lime juice,
    Mexican oregano and salt.
  - Avocado on a taco de camarón is common and fine. Not a finding.
- **Proposed fix:**
  - *Ingredients:* remove `Coleslaw Mix` 40g; raise `Cabbage` 60g → 80g. Add `Mayonnaise` 12g for the
    chipotle crema (or `Greek Yogurt` 30g for the lean route). Add `Red Onion` 15g and `Cilantro` 5g
    so the slaw is a real slaw.
  - *Spices:* add `Chipotle in Adobo` ~6g, `Garlic Powder` 1g, `Paprika` 1g and `Mexican Oregano` 1g.
    Drop `Cumin` 2g → 0.
  - *Steps:* step 1 → "Season the shrimp with salt, pepper, garlic powder and paprika." Step 2 →
    "Sear in a hot oiled pan 1–2 minutes per side, until just pink and opaque — shrimp overcook fast."
    New step → "Whisk the mayonnaise with minced chipotle in adobo and a squeeze of lime into a
    chipotle crema." Step 4 → "Toss the shredded cabbage with red onion, cilantro, lime juice, Mexican
    oregano and salt." Step 5 → "Lay the shrimp on the tortilla first, spoon the chipotle crema over,
    then top with the slaw — sauce directly on a corn tortilla tears it."
- **New ingredients required:** `Mayonnaise`, `Red Onion`, `Cilantro`, `Cabbage` — **all already in
  registry**. `Chipotle in Adobo` and `Mexican Oregano` — **not in registry**; both work as spice
  overrides (chipotle in adobo carries trivial macros at 6g).
- **Ingredients no longer used:** `Coleslaw Mix` (in this recipe).
- **Macro impact:** `Mayonnaise` 12g adds roughly +85 cal and +9g fat — the only non-trivial change.
  The `Greek Yogurt` route adds ~+18 cal and a little protein instead. Dropping coleslaw mix removes
  ~10 cal; the extra 20g cabbage adds ~5.
- **Confidence:** high
- **Sources:** maricruzavalos.com/tacos-de-camaron (Mexican author, fetched — battered fried shrimp,
  chunky cabbage slaw with carrot/onion/cilantro/jalapeño dressed in lime and oregano, chipotle crema,
  double corn tortillas, no cumin); La Costeña "Tacos de camarón estilo Baja California";
  cheforopeza.com.mx tacos de camarón al chipotle.

---

### Beef Tacos
- **Verdict:** `significantly-off` — as written the cuisine label is also wrong; it is an
  American/Tex-Mex taco.
- **Cuisine label:** `Mexican` is only defensible **after** the fix. As it stands this should be
  `American`. I recommend fixing rather than relabelling, because the app already has a second
  ground-beef taco (see the duplicate finding below) and rebuilding this one as picadillo makes the
  pair into two genuinely different dishes.
- **Findings:**
  - **`BBQ Sauce` 15g is the single most out-of-place ingredient in the slice.** No Mexican taco has
    barbecue sauce — it is a US condiment of tomato, vinegar, brown sugar and smoke. And step 5
    ("Drizzle BBQ sauce over the beef") makes it an explicit finishing sauce, not a background note.
  - **`Corn` 40g as a taco filling is an American "southwest" convention** (corn salsa, fast-casual
    burrito bowls). In Mexico corn appears as the tortilla itself, or as esquites/elote — which are
    their own antojito, eaten alongside, never spooned into a taco.
  - **The spice set is a taco-packet profile.** Cumin 2g + Chili Powder 2g + Paprika 1g on 150g of
    beef. US chili powder is itself a compound blend containing cumin, garlic and oregano, so pairing
    it with more cumin doubles up. Mexican ground beef is *picadillo* / *carne molida*: browned with
    onion and garlic, then simmered with tomato and usually potato (and sometimes carrot), seasoned
    with a light hand — comino yes, but as an accent alongside Mexican oregano.
  - **Near-duplicate of `Lean Beef Tacos`.** Same protein, same 90g of corn tortillas, same onion and
    cilantro; the entries differ mainly by beef fat percentage. Rebuilding this one as picadillo
    resolves the duplication without deleting a recipe.
  - Steps are internally consistent — no phantoms, nothing unused. The problem is what is in the list.
- **Proposed fix (rebuild as picadillo):**
  - *Ingredients:* remove `BBQ Sauce` 15g and `Corn` 40g. Add `Tomato` 80g and `Potato` 60g. Keep
    `Ground Beef (80% lean)` 150g, `Corn Tortillas` 90g, `Onion` 40g, `Cilantro` 5g, `Avocado` 40g.
  - *Name:* rename to `Tacos de Picadillo`. Keeping "Beef Tacos" leaves two near-identically-named
    beef taco entries.
  - *Spices:* drop `Chili Powder` 2g and `Paprika` 1g; reduce `Cumin` 2g → 1g; add `Garlic Powder` 1g,
    `Mexican Oregano` 1g and `Chile de Árbol` 1g for heat.
  - *Steps:* "Brown the ground beef in a skillet with diced onion and garlic, breaking it apart. Add
    diced potato and chopped tomato with a splash of water. Simmer 12–15 minutes until the potato is
    tender and the sauce has reduced and thickened. Season lightly with cumin, Mexican oregano, chile
    de árbol, salt and pepper. Warm the corn tortillas in a dry pan. Fill with the picadillo and top
    with cilantro and sliced avocado."
- **New ingredients required:** `Tomato` and `Potato` — **both already in registry**.
  `Mexican Oregano` and `Chile de Árbol` — **not in registry**; zero-macro spice overrides.
- **Ingredients no longer used:** `BBQ Sauce` and `Corn` (in this recipe — check whether any recipe
  outside this slice still uses them before touching the registry).
- **Macro impact:** roughly calorie-neutral, with the carbs moving from sweet corn and sugary sauce to
  potato. Removing BBQ sauce cuts ~25 cal and its added sugar; removing corn cuts ~35 cal; adding
  tomato adds ~15 cal and potato 60g adds ~46 cal / ~10g carbs. Protein unchanged.
- **Confidence:** high
- **Sources:** muybuenoblog.com "Mexican Picadillo (Carne Molida con Papas)"; maricruzavalos.com
  picadillo tacos; mexicoinmykitchen.com easy Mexican ground beef; Origins (Ohio State), "Mexican Food
  in the United States" (Tex-Mex defined by yellow cheese, beef and cumin); MasterClass "11 Types of
  Authentic Mexican Tacos" (garnish standard: white onion, cilantro, lime — no lettuce, tomato or
  cheese).

---

### Lean Beef Tacos
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`
- **Findings:**
  - **The construction is right and should be left alone.** Corn tortillas, finely chopped onion,
    cilantro, lime — that is exactly the Mexican street-taco garnish set ("con todo": cebolla,
    cilantro, limón). This is the most authentic recipe in the slice.
  - **No salsa and no chile.** Every Mexican taco is dressed with a salsa at the table; there is no
    chile of any kind in the ingredients or the spices. `Chili Powder` is the US compound blend, not a
    Mexican chile.
  - **The technique is the American dry-rub method.** "Season the ground beef… then brown it" produces
    a dry seasoned crumble. Mexican carne molida browns the beef *with* onion and garlic and builds a
    light tomato sauce around it. This is a softer finding than the others — a fast dry-fried taco de
    carne molida does exist — so treat the tomato addition as optional.
  - `Ground Beef (lean)` at 150g is a health-driven choice, not an authenticity issue. Not a finding.
  - Near-duplicate of `Beef Tacos` (see above). Once that one becomes picadillo, this stands cleanly
    as the plain taco de carne molida.
  - Steps match the ingredients exactly; no phantoms.
- **Proposed fix (light touch):**
  - *Ingredients:* optionally add `Tomato` 60g to build a light sauce rather than a dry crumble. If
    the owner wants to keep this as the fast weeknight entry, leave the ingredient list untouched —
    the spice fix below is the one that matters.
  - *Spices:* replace `Chili Powder` 2g with `Chile de Árbol` 1g (or `Guajillo Chile` 3g for a milder,
    earthier heat); reduce `Cumin` 2g → 1g; add `Garlic Powder` 1g and `Mexican Oregano` 1g.
  - *Steps:* step 1–2 → "Brown the beef in a skillet with the diced onion and garlic, breaking it
    apart, 6–8 minutes. Season with cumin, Mexican oregano, chile de árbol, salt and pepper." Add a
    closing line: "Serve with a salsa alongside — the tacos are dressed at the table."
- **New ingredients required:** `Tomato` — **already in registry** (only if the optional change is
  taken). `Chile de Árbol` and `Mexican Oregano` — **not in registry**; zero-macro spice overrides.
- **Ingredients no longer used:** `Chili Powder` (in this recipe).
- **Macro impact:** negligible. The optional 60g of tomato adds ~11 cal.
- **Confidence:** high
- **Sources:** MasterClass "11 Types of Authentic Mexican Tacos"; unocasa.com "What Are Street Tacos";
  mexicoinmykitchen.com Mexican ground beef; Origins (Ohio State) on the Tex-Mex spice signature.

---

### Duck Confit Tacos
- **Verdict:** `significantly-off`
- **Cuisine label:** defensible as `Mexican` **after** the fix, but the recipe as written is a
  French–Mexican fusion, not a Mexican dish. Worth knowing that the real dish exists: **tacos de pato
  / carnitas de pato** are genuine Mexican cooking (Rick Bayless's duck carnitas; Saveur's tacos de
  carnitas de pato; El Auténtico Pato Manila, an all-duck taquería). And confit is not itself the
  problem — carnitas *is* a confit technique, which is exactly why duck carnitas works. So this is a
  near-miss of a real dish rather than an invention.
- **Findings:**
  - **The name uses the French term.** "Duck Confit" signals *confit de canard*. The Mexican dish is
    `Carnitas de Pato` or `Tacos de Pato`. Renaming does most of the work here.
  - **`Smoked Paprika` is Spanish pimentón, not a Mexican seasoning.** The two documented directions
    are Bayless's (salt, Mexican oregano, garlic, lime juice, then confited in lard) and Saveur's
    braise (Mexican cinnamon and orange). Smoked paprika is neither. Pick one direction and commit;
    don't blend them.
  - **No chile and no salsa.** Tacos de pato are served with a tomatillo-avocado salsa or a green
    chile salsa. There is nothing here.
  - **The skin is thrown away.** Step 3 shreds the meat and discards bones, and the skin is never
    mentioned. The defining texture of duck carnitas is the skin crisped separately until it snaps
    like chicharrón, then crumbled over the meat. Without it — and without crisping the shredded meat
    — the steps produce shredded braised duck, not carnitas.
  - **`Coleslaw Mix` again.** Should be finely chopped white onion plus cilantro; the cilantro is
    already there, the onion is missing.
  - `Duck Leg` is the correct cut and the 90°C / 2–3 hour confit is a correct technique. Those parts
    are right — keep them.
  - `Cumin` 2g appears in neither documented version.
- **Proposed fix:**
  - *Name:* rename to `Tacos de Pato` (or `Carnitas de Pato`).
  - *Ingredients:* remove `Coleslaw Mix` 40g. Add `Onion` 30g (finely chopped white onion) and
    `Avocado` 40g for the salsa. Keep `Duck Leg` 120g, `Corn Tortillas` 90g, `Lime` 15g, `Cilantro`
    5g. Tomatillo would be the ideal addition and is not in the registry — the achievable version of
    the salsa is avocado, lime and serrano.
  - *Spices:* remove `Smoked Paprika` 1g and `Cumin` 2g. Add `Mexican Oregano` 2g, `Garlic Powder` 1g
    and `Serrano Chile` 4g.
  - *Steps:* step 1 → "Rub the duck leg with salt, Mexican oregano, garlic and lime juice; rest 30
    minutes." Keep step 2 (the confit) as is. Step 3 → "Shred the meat with two forks, discarding
    bones. Crisp the skin separately in a hot dry pan until it snaps like chicharrón, then crumble it
    over the meat. Spread the shredded duck in the pan and let the edges caramelise." Step 5 → "Fill
    each tortilla with the duck, finely chopped white onion and cilantro. Spoon over a salsa of mashed
    avocado, minced serrano and lime, and squeeze more lime on top."
- **New ingredients required:** `Onion` and `Avocado` — **both already in registry**.
  `Mexican Oregano` and `Serrano Chile` — **not in registry**; zero-macro spice overrides.
  `Tomatillo` — optional, **not in registry, flag**.
- **Ingredients no longer used:** `Coleslaw Mix`; `Smoked Paprika` (in this recipe).
- **Macro impact:** modest increase. `Avocado` 40g adds ~64 cal and ~6g fat; `Onion` 30g adds ~12 cal;
  removing coleslaw mix cuts ~10 cal. Net roughly **+65 cal**, protein unchanged.
- **Confidence:** high on the name, the smoked paprika, the discarded skin and the coleslaw. Medium on
  which seasoning direction to take — Bayless's oregano/lime and Saveur's canela/orange are both
  legitimate, and I have recommended the Bayless route because it stays closer to carnitas.
- **Sources:** rickbayless.com/recipe/duck-carnitas (fetched — salt, Mexican oregano, lime juice,
  garlic, confited in lard, served with warm tortillas and tomatillo-avocado salsa, skin crumbled
  over; no cumin, no smoked paprika); Saveur "Braised Duck Tacos (Tacos de Carnitas de Pato)";
  MexConnect "Duck Tacos: Tacos de Pato"; Travesías "El Auténtico Pato Manila"; Wikipedia "Duck
  confit."

---

## Summary

**Counts by verdict**
- `authentic`: 0
- `minor-drift`: 2 — Shrimp Tacos, Lean Beef Tacos
- `significantly-off`: 5 — Chilaquiles, Huevos Rancheros, Carnitas Tacos, Beef Tacos, Duck Confit Tacos
- `mislabeled`: 1 — Breakfast Burrito
- `not-a-real-dish`: 0

**The 3 worst offenders**
1. **Carnitas Tacos** — made from pork loin, the leanest cut on the pig, where carnitas is defined by
   fatty shoulder confited in lard and crisped; it is braised in water and never crisped, garnished
   with American coleslaw, and calls for orange juice that appears nowhere in its ingredient list.
2. **Beef Tacos** — BBQ sauce drizzled over the beef plus sweet corn kernels as a filling and a
   taco-packet spice blend; this is an American taco wearing a Mexican label.
3. **Chilaquiles** — the salsa, which is the dish, is plain tomato sauce with a pinch of cumin and no
   chile at all, and the crumbling cheese is Greek feta where queso fresco is already in the registry.

**Consolidated NEW ingredients required across the slice**

*Already in the registry (free swaps, no data work):*
`Queso Fresco`, `Onion`, `Red Onion`, `Tomato`, `Potato`, `Avocado`, `Mayonnaise`, `Cilantro`,
`Cabbage`, `Bay Leaves`, `Garlic Powder`, `Paprika`

*New zero-macro spice-override names — not in the registry, but per the conventions these can live in
`RECIPE_SPICE_OVERRIDES` and only need a grocery category:*
- `Guajillo Chile`
- `Chile de Árbol`
- `Serrano Chile`
- `Chipotle in Adobo` (trivial macros at the 6g amount proposed)
- `Mexican Oregano` (distinct plant from the existing `Oregano`; a rename inside the Mexican recipes)

*New true registry entries — flag, these need USDA lookups and will move macros:*
- **`Pork Shoulder`** (Boston butt, raw) — required for Carnitas. The single most consequential change
  in the slice: ~+100 cal, +16g fat, −6g protein versus the current 150g of loin. If the owner will
  not add it, the fallback is `Pork Loin` 110g + `Pork Belly` 40g from existing entries.
- **`Orange`** — Carnitas; currently a phantom ingredient in the steps.
- **`Tomatillo`** — optional, for the tacos de pato salsa.
- **`Flour Tortilla`** — optional, only if the Breakfast Burrito is rebuilt as a northern-Mexican
  burrito rather than relabelled American.
- **`Mexican Crema`** — optional, for Chilaquiles; `Greek Yogurt` is the in-registry stand-in.

**Consolidated ingredients this slice would STOP using**
- `Coleslaw Mix` — dropped from Carnitas Tacos, Shrimp Tacos and Duck Confit Tacos, i.e. every recipe
  in this slice that used it. **Likely becomes a registry orphan** — sweep the rest of the book before
  deleting the entry.
- `Feta Cheese` — dropped from Chilaquiles and Huevos Rancheros in favour of `Queso Fresco`. Still
  legitimately used by Greek/Mediterranean recipes elsewhere; do not delete the registry entry.
- `BBQ Sauce` — dropped from Beef Tacos. Check the rest of the book; if nothing else uses it, this is
  a second orphan candidate.
- `Corn` — dropped from Beef Tacos only.
- `Chili Powder` — dropped from Beef Tacos and Lean Beef Tacos (replaced by actual Mexican chiles).
- `Smoked Paprika` — dropped from Duck Confit Tacos only; used elsewhere, keep the entry.
- `Pork Loin` — dropped from Carnitas Tacos only (assuming `Pork Shoulder` is added); check other uses.
- `Cheddar Cheese` / `Whole Wheat Tortilla` — only if the Breakfast Burrito is rebuilt rather than
  relabelled. The recommended fix is the relabel, which drops nothing.

**Note on the hard constraints:** nothing in this report proposes nuts or olives in any form. Two
dishes in this slice have traditional versions that could involve them — none of the proposed fixes do,
and the omission is deliberate and not flagged as a defect anywhere above. `Olive Oil` is untouched.
