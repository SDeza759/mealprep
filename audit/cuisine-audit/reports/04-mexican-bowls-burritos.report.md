# Authenticity audit — Mexican: bowls, burritos, enchiladas

Mode: **traditional** (the specifics ARE the dish)
Recipes audited: 8

---

## Read this first — the slice-level finding

Four of these eight recipes have nothing wrong with them *as recipes*. They are competent, internally
coherent dishes. The problem is the label: **burrito bowls and fajitas are American inventions**, and
filing them under `Mexican` is the error, not their construction. For those, the fix is a one-word data
change, not a recipe rewrite.

The other four are genuinely Mexican dishes (quesadilla, enchiladas, burrito, and a vegetarian bowl that
wants to be one) executed in a Tex-Mex / American-supermarket idiom.

Five structural patterns run across the whole slice and are worth fixing once rather than eight times:

1. **Not one of the eight recipes contains a chile.** `Bell Pepper` appears in four of them. Bell pepper
   is the non-pungent cultivar — it is a vegetable, not a chile, and in Mexican cooking it is a marginal
   ingredient. A Mexican repertoire with zero chiles is the single biggest thing wrong here.
2. **`Chili Powder` is in four of eight, and it is an American product.** Commercial chili powder is a
   *blend* — ground chile plus cumin, garlic powder and oregano — invented in late-1800s Texas as a
   pre-measured seasoning for chili con carne. Mexican recipes call for `chile en polvo`, pure ground
   single-variety chile. Pairing chili powder *with* cumin (as five of these do) double-doses the cumin
   and is a reliable Tex-Mex tell.
3. **`Cheddar Cheese` is in three of eight; `Queso Fresco` is in zero** — despite `Queso Fresco` already
   being in the registry (3 uses elsewhere in the app). Yellow cheddar melted for gooeyness is *the*
   Tex-Mex marker. Also note `Mozzarella Cheese` is already in the registry and is a genuinely close
   stand-in for queso Oaxaca — both are pasta filata stretched-curd cheeses; Oaxaca is routinely
   described as mozzarella-like. That swap is free.
4. **`Tomato` appears in zero of the eight**, though it is in the registry and used elsewhere. Fresh
   tomato with onion and chile is the foundational Mexican trio ("a la mexicana"). Its total absence,
   alongside the absence of any salsa — no pico de gallo, no salsa verde, no salsa roja — is why several
   of these read as beige.
5. **`Brown Rice` is in five of eight.** Mexican rice (arroz rojo / arroz a la mexicana) is white rice
   toasted in oil then simmered with tomato, onion and garlic. Brown rice is a health substitution. This
   is minor and may be a deliberate macro decision — I flag it once here and do not repeat it per recipe.

One more cross-cutting note: **`Oregano` in the registry is Mediterranean oregano** (*Origanum vulgare*).
Mexican oregano is *Lippia graveolens*, an unrelated plant in the verbena family — citrusy and resinous
rather than sweet and piney. It is a distinct ingredient in Mexican cooking, not a regional name for the
same herb. Several fixes below call for `Mexican Oregano` as a new zero-macro spice-override entry.

**Label mechanics.** The app has no `Tex-Mex` cuisine label — the existing set is American (24), Mexican
(16), Japanese (16), Mediterranean (14), Indian (13), Middle Eastern (11), Italian (11), Korean (7),
Peruvian (6), Thai (4), Caribbean (4), Vietnamese (3), Spanish (3), Brazilian (3), French (2), Chinese
(2). So each relabel below is either "move to `American`" or "introduce `Tex-Mex`". Note the planner
consequence: moving four recipes would take Mexican 16 → 12 and American 24 → 28, which interacts with
the 2-per-week cuisine cap during generation. Introducing `Tex-Mex` as its own label avoids further
inflating the already-largest bucket and is the more honest description of these four.

---

### Chicken Burrito Bowl

- **Verdict:** `mislabeled`
- **Cuisine label:** Should be `Tex-Mex` (or `American`). The burrito bowl is a deconstructed
  Mission-style burrito — the oversized rice-and-beans burrito that appeared in San Francisco's Mission
  District in the 1960s (El Faro claims 1961, La Cumbre 1969) — commercialised as a bowl by Chipotle
  Mexican Grill, founded in Denver in 1993, whose founder explicitly took the Mission burrito as his
  model. There is no Mexican dish called a burrito bowl. Mexican burritos are from Ciudad Juárez,
  Chihuahua, and notably contain **no rice**; the rice is the Californian addition, and the bowl is the
  American one on top of that.
- **Findings:**
  1. The cuisine label, as above. This is the whole finding — the recipe is a faithful, well-built
     example of the fast-casual bowl genre and should not be "fixed" into something else.
  2. Two smaller drifts *within* the genre: there is no acid anywhere (no lime), and `Cilantro` is used
     only as a garnish when the genre's signature is cilantro-lime rice. `Bell Pepper` at 60g is a
     fajita element that the Mission/Chipotle bowl does not carry; the bowl's vegetable is pico de gallo
     or fajita veg as an *option*, and tomato is the more characteristic one.
  3. `Chili Powder` — see the slice-level note.
- **Proposed fix:** Primary: change `cuisine` to `Tex-Mex` (or `American`). No recipe change required.
  Optional tightening within the genre (all registry ingredients):
  - **Ingredients:** add `Lime` 15g; add `Tomato` 60g and `Red Onion` 20g as pico de gallo; consider
    dropping `Bell Pepper` 60g (or keep it, labelled as fajita veg).
  - **Spices:** replace `Chili Powder` 2g with `Chipotle Powder` 2g — this is the actual seasoning of
    the genre it belongs to, and unlike chili powder it is a single ingredient.
  - **Steps:** fold the lime and cilantro into the rice step ("toss the cooked rice with chopped
    cilantro and lime juice"); add a pico step if tomato/onion are added.
- **New ingredients required:** `Chipotle Powder` (RECIPE_SPICE_OVERRIDES entry, zero-macro — **not** in
  registry.md and does not need to be). `Lime`, `Tomato`, `Red Onion` are already in the registry.
- **Ingredients no longer used:** `Bell Pepper` (only if the optional tightening is taken).
- **Macro impact:** Negligible. Pico adds ~20 cal. Nothing here moves the dish's macro shape.
- **Confidence:** high
- **Sources:** Wikipedia "Mission burrito"; KQED, "What Is a Mission-Style Burrito? Maybe … a Myth";
  Food Republic history of Mission-style burritos; TasteAtlas "Burrito" (Ciudad Juárez); Chipotle
  corporate history via EBSCO Research Starters and Quartr.

---

### Chicken Quesadilla

- **Verdict:** `significantly-off`
- **Cuisine label:** `Mexican` is defensible *for a quesadilla* — it is a genuinely Mexican dish with
  real regional variants. But this particular build is an American chain-restaurant BBQ chicken
  quesadilla. Fix the recipe and the label is correct; leave the recipe and the label is not.
- **Findings:**
  1. **`BBQ Sauce` 15g.** This is the clearest single error in the slice. BBQ sauce is not an ingredient
     in any regional Mexican cooking. A BBQ-chicken quesadilla is an American casual-dining item. It is
     also drizzled *inside the fold*, which is a chain-menu construction.
  2. **`Cheddar Cheese` 40g.** Mexican quesadillas use one of two cheeses depending on region: queso
     Oaxaca (a pasta filata string cheese) in central and southern Mexico, or Chihuahua / menonita /
     asadero in the north. Yellow cheddar is the Tex-Mex substitution. `Mozzarella Cheese` is already in
     the registry and is the closest available analogue to Oaxaca — same stretched-curd family.
  3. **The filling is fajita veg.** Sautéed bell pepper and onion is a fajita filling, not a quesadilla
     one. The Mexican quesadilla canon is cheese alone, or cheese with *rajas* (charred poblano strips),
     mushrooms, huitlacoche, squash blossoms, chicharrón, or tinga. Bell pepper strips sautéed soft are
     none of those.
  4. **No chile, no salsa.** A quesadilla is served with salsa; this one is served with nothing.
  5. **`Whole Wheat Tortilla`.** The flour tortilla itself is legitimate — it is the northern Mexican
     form. *Whole wheat* is a health substitution; northern quesadillas use a plain white flour tortilla,
     and central/southern ones use fresh corn masa. The registry offers only `Whole Wheat Tortilla` and
     `Corn Tortillas`, so this is a constraint of the data, not a fixable error — unless the recipe is
     moved to `Corn Tortillas` for a central-Mexican quesadilla, which is the more traditional form.
- **Proposed fix:**
  - **Ingredients:** remove `BBQ Sauce` 15g. Swap `Cheddar Cheese` 40g → `Mozzarella Cheese` 40g
    (Oaxaca stand-in). Keep `Bell Pepper` 50g and `Onion` 30g but recast them as *rajas con cebolla* —
    charred and cut into strips rather than sautéed soft. Add `Lime` 10g to serve. Optionally swap
    `Whole Wheat Tortilla` 70g → `Corn Tortillas` 70g for the central-Mexican form (see macro note).
  - **Spices:** keep Salt, Black Pepper, Garlic Powder; add `Mexican Oregano` 1g and `Jalapeno` 5g (or
    `Chipotle Powder` 1g) so there is an actual chile in it.
  - **Steps:** rewrite step 3 to drop the BBQ sauce entirely and name the mozzarella as the melting
    cheese. Rewrite step 2 so the peppers are blistered over high heat and cut into strips, with the
    onion, rather than "sautéed until softened". Add a closing step: serve with lime and salsa.
- **New ingredients required:** `Mexican Oregano`, `Jalapeno` (both RECIPE_SPICE_OVERRIDES entries,
  zero-macro — **not** in registry.md, and do not need to be). `Mozzarella Cheese`, `Lime`,
  `Corn Tortillas` are already in the registry.
- **Ingredients no longer used:** `BBQ Sauce` (this recipe only — `BBQ Sauce` has 7 references in
  data.js, so removing it here will **not** orphan it), `Cheddar Cheese` (this recipe only; still used
  elsewhere).
- **Macro impact:** Small. Dropping 15g BBQ sauce removes ~20 cal and ~10g sugar. Cheddar → mozzarella
  is roughly neutral, slightly leaner and slightly higher protein if part-skim. The optional flour →
  corn tortilla swap is the only material change: corn tortillas are lower calorie and lower fat per
  gram, so the solver will scale other components up.
- **Confidence:** high
- **Sources:** Wikipedia "Quesadilla" (regional corn-masa vs. northern flour/Chihuahua split); Pati
  Jinich, "Oaxaca-Style Mushroom and Cheese Quesadillas"; TasteAtlas quesadilla-with-epazote-and-Oaxaca
  recipe; The Cheese Professor, "How to Make an Authentic Mexican Quesadilla".

---

### Chicken Enchiladas

- **Verdict:** `significantly-off` — the worst offender in the slice
- **Cuisine label:** As written this is a **Tex-Mex / American baked casserole**, not a Mexican dish. It
  is fully fixable back to `Mexican`; if it is not fixed, the label should be `Tex-Mex`.
- **Findings:**
  1. **`Tomato Sauce` 100g as the enchilada sauce is the core error, and it is a definitional one.**
     *Enchilar* means to season with chile. An enchilada is a tortilla passed through a **chile** sauce.
     Enchiladas rojas are built on dried chiles — guajillo, usually with ancho — toasted, rehydrated,
     and blended with garlic, oregano and their soaking liquid or broth. Tomato appears in some regional
     versions as a *supporting* element (Rick Bayless publishes a guajillo-**tomato** enchilada
     specifically), never as the base. Tomato sauce plus 1g of chili powder is marinara with chili
     powder; the defining component of the dish is simply absent.
  2. **`Cheddar Cheese` 40g + `Mozzarella Cheese` 30g melted on top and baked.** Mexican enchiladas are
     finished *cold and unmelted*: crumbled queso fresco or cotija (queso fresco does not melt — that is
     the point), a pour of crema, and rings of raw white onion. Melted yellow cheese for a gooey baked
     top is the Tex-Mex form. Doubling cheddar with mozzarella for meltiness compounds it.
  3. **Baking for 20 minutes.** Mexican enchiladas are assembled and served immediately — they are a
     fast dish, not a casserole. The baked tray is the American adaptation.
  4. **The defining technique is missing.** "Warm corn tortillas briefly to make them pliable" skips the
     step that makes an enchilada work: each tortilla is passed through hot oil (roughly 350–365°F, 5–15
     seconds per side) to soften and seal it *without* crisping, then dipped fully in the chile sauce.
     Skipping the oil is why home enchiladas disintegrate; skipping the sauce dip and pouring sauce over
     the top instead is the casserole shortcut.
  5. **Onion in the filling instead of on top.** Raw onion belongs on the finished plate, sliced thin.
     Mixed into the filling it does a different job.
  6. **`Chili Powder`** — redundant and wrong once there is a real chile sauce (see slice-level note).
  7. **`Brown Rice` on the side** — arroz rojo is white rice. Minor; see slice-level note.
- **Proposed fix:** This one needs a real rewrite, but every component is available.
  - **Ingredients:** cut `Tomato Sauce` 100g → 50g (it becomes a supporting element in a guajillo-tomato
    sauce, not the base). Add `Garlic` 5g (the sauce requires it). Remove `Cheddar Cheese` 40g and
    `Mozzarella Cheese` 30g; add `Queso Fresco` 45g (crumbled on top) and `Greek Yogurt` 30g as the
    crema stand-in. Keep `Onion` 40g but move it to the topping, sliced thin and raw. Optionally swap
    `Brown Rice` 45g → `White Rice` 45g cooked as arroz rojo.
  - **Spices:** remove `Chili Powder` 1g. Add `Guajillo Chili` 8g, `Ancho Chili` 4g, `Mexican Oregano`
    1g. Keep Cumin 2g (reduce to 1g — cumin is a background note in enchiladas rojas, not a lead),
    Salt, Black Pepper.
  - **Steps:** replace almost entirely. (a) Stem and seed the guajillo and ancho chiles, toast them
    briefly in a dry pan until aromatic — do not let them scorch — then soak in hot water 20 minutes.
    (b) Blend the soaked chiles with garlic, Mexican oregano, cumin, salt, the tomato sauce and a little
    soaking liquid until smooth; fry the blended sauce in oil until it darkens and thickens. (c) Poach
    and shred the chicken thigh; season lightly. (d) Pass each corn tortilla through hot oil for about
    10 seconds a side to soften without crisping, then dip it fully in the chile sauce. (e) Fill with
    shredded chicken, roll, and place on the plate. (f) Spoon over remaining sauce, then top with
    crumbled queso fresco, a drizzle of crema, and thin rings of raw onion. Serve immediately. (g) Serve
    with the rice. **Delete the oven-preheat step and the 20-minute bake entirely.**
  - **Consider renaming** to `Enchiladas Rojas de Pollo` so the name carries the sauce.
- **New ingredients required:** `Guajillo Chili`, `Ancho Chili`, `Mexican Oregano` — all as
  RECIPE_SPICE_OVERRIDES entries (**not** in registry.md; they need only a grocery category). One
  judgement call for the owner: 8g of dried guajillo is genuinely ~25 cal, so it is not strictly
  zero-macro. The app already has precedent both ways — `Aji Amarillo Paste` sits in the registry with
  macros, `Aji Limo` sits in spice overrides at zero. Spice-override is simpler and the error is under
  30 cal on a ~600 cal dish. `Queso Fresco`, `Greek Yogurt`, `Garlic`, `White Rice` are already in the
  registry.
- **Ingredients no longer used:** `Cheddar Cheese`, `Mozzarella Cheese` (both this recipe only; both
  still used elsewhere in the app), `Chili Powder` (this recipe), `Brown Rice` (if the rice swap is
  taken).
- **Macro impact:** **Material — flag this one.** Removing 70g of melted cheese takes out roughly
  250–280 cal and ~18g of fat. Adding 45g queso fresco returns roughly 140 cal and ~10g protein, and 30g
  Greek yogurt about 20 cal. Net: the dish loses on the order of 120–150 cal and a lot of fat, and drops
  a few grams of protein. It is tagged `comfort-food` and is currently one of the higher-calorie Mexican
  entries, so the solver's behaviour on days that pick it will shift. If the owner wants to hold the
  calories, raising `Queso Fresco` to 60–70g is the traditional-correct way to do it (more crumbled
  cheese on top is normal) rather than putting the cheddar back.
- **Confidence:** high
- **Sources:** Rick Bayless, "Red Chile Sauce (enchilada sauce)" — 8 dried guajillos, toasted and
  rehydrated; Rick Bayless, "Guajillo-Tomato Enchiladas"; Pati Jinich, "Enchiladas Mineras" and
  "Guajillo Chile Salsa"; *Texas Monthly*, "Tex-Mexplainer: Enchiladas"; Wikipedia "Enchilada"
  (tortillas dipped first in hot oil, then in chile sauce).

---

### Black Bean Bowl

- **Verdict:** `not-a-real-dish`
- **Cuisine label:** Should be `American` as written. Black beans + corn + avocado + lime over rice is
  the US "southwest bowl" template. The black-bean-and-corn pairing in particular is an American
  convention — it is a salad-bar combination, not a Mexican one.
- **Findings:**
  1. There is no Mexican dish here to be authentic or inauthentic to. Nothing in it identifies a region:
     no chile, no onion, no garlic, no tomato, no cheese, no herb beyond nothing at all. The entire
     seasoning is cumin, salt and pepper.
  2. It is the only vegetarian entry among the eight "Mexican" recipes, and Mexico has a deep vegetarian
     canon — enfrijoladas, molletes, rajas con crema, calabacitas, quesadillas de flor de calabaza,
     esquites. None of it is represented.
  3. Minor: the steps say "if using fresh corn" — conditional phrasing that leaves it ambiguous what the
     60g of `Corn` actually is.
- **Proposed fix:** The strong option is to rebuild it as a real dish. **Enfrijoladas** are ideal here:
  genuinely Mexican, genuinely simple, genuinely vegetarian, and buildable almost entirely from
  ingredients already in the registry. Corn tortillas are dipped in a puréed black bean sauce, filled
  and topped with crumbled queso fresco, and finished with raw onion.
  - **Ingredients (proposed rebuild):** `Black Beans` 50g → 120g; remove `Brown Rice` 56g; remove `Corn`
    60g; add `Corn Tortillas` 90g; add `Queso Fresco` 50g; add `Onion` 30g; add `Garlic` 5g; keep
    `Avocado` 50g → 40g (a standard garnish); keep `Lime` 15g → 10g.
  - **Spices:** keep Cumin 1g, Salt, Black Pepper; add `Chipotle Powder` 1g (the smoky note that
    defines the bean sauce in most versions) and `Mexican Oregano` 1g. `Epazote` 1g is the traditional
    herb cooked with black beans and is a nice optional addition.
  - **Steps:** (a) Blend the black beans with their liquid, garlic, half the onion, chipotle, oregano
    and cumin until completely smooth. (b) Fry the bean purée in oil for about 5 minutes until hot and
    thickened. (c) Warm the corn tortillas in a little oil, about 15 seconds a side, until pliable.
    (d) Dip each tortilla in the bean sauce to coat both sides, fold or roll, and plate. (e) Top with
    crumbled queso fresco, thin rings of the remaining raw onion, sliced avocado and a squeeze of lime.
  - **Rename** to `Enfrijoladas`.
  - *Lighter-touch alternative* if the owner would rather keep a bowl: keep the format, relabel the
    cuisine `American`, and at minimum give it a real seasoning base — add `Onion` 30g, `Garlic` 5g,
    `Tomato` 60g and `Queso Fresco` 30g, plus `Mexican Oregano`. That makes it a coherent southwest
    bowl rather than a Mexican dish, which is an honest outcome too.
- **New ingredients required:** `Chipotle Powder`, `Mexican Oregano`, optionally `Epazote` — all
  RECIPE_SPICE_OVERRIDES entries (**not** in registry.md, and do not need to be). `Corn Tortillas`,
  `Queso Fresco`, `Onion`, `Garlic` are already in the registry.
- **Ingredients no longer used:** `Brown Rice`, `Corn` (this recipe; both heavily used elsewhere).
- **Macro impact:** **Material.** The rebuild roughly doubles the protein (queso fresco ~9g plus more
  beans) and shifts the dish from carb-dominant toward balanced. Calories land close to where they were
  — corn tortillas and queso fresco replacing rice and corn — but the macro *shape* changes enough that
  it will be selected for different days than it is now. Worth running the validator on.
- **Confidence:** high on the finding; medium on which fix the owner wants, since the rebuild changes
  the recipe's role in the plan.
- **Sources:** Isabel Eats, "Enfrijoladas"; La Piña en la Cocina, "Enfrijoladas — Corn Tortillas in a
  Spicy Bean Sauce"; Masienda, "Easy Enfrijoladas"; Mexican Food Memories, "Enfrijoladas".

---

### Chipotle Chicken Bowl

- **Verdict:** `not-a-real-dish` — and the name promises an ingredient the recipe does not contain
- **Cuisine label:** Should be `Tex-Mex` or `American`. Same fast-casual bowl as the Chicken Burrito
  Bowl; the name additionally reads as the restaurant chain.
- **Findings:**
  1. **There is no chipotle in the Chipotle Chicken Bowl.** This is the headline. Chipotle is a specific
     ingredient — a ripe red jalapeño that has been smoke-dried, normally sold canned in adobo. The
     recipe's seasoning is cumin, paprika, chili powder and garlic powder. Paprika is ground sweet
     pepper of Hungarian/Spanish origin; it is not a smoke-dried jalapeño. Even the registry's
     `Smoked Paprika` would be Spanish pimentón — smoked, yes, but a different chile with a different
     flavour. This is exactly the class of error the Peruvian audit caught with turmeric standing in for
     aji amarillo: a named, defining chile replaced by a generic red powder.
  2. The dish itself is an American fast-casual bowl, not a Mexican dish — see Chicken Burrito Bowl.
  3. It is the third of three near-identical bowls in this slice (see Turkey Burrito Bowl). Chicken
     Burrito Bowl and Chipotle Chicken Bowl differ by 10g of chicken, a cut (thigh vs. breast), the
     presence of bell pepper, and two spices. They are effectively the same recipe twice.
- **Proposed fix:** Two paths.
  - **Minimum fix (makes the name honest, keeps the bowl):** add `Chipotle Powder` 2g to the spice
    overrides and remove `Paprika` 2g and `Chili Powder` 1g. Relabel cuisine to `Tex-Mex`/`American`.
    Reword step 2 to name chipotle. That is the smallest change that stops the name lying.
  - **Strong fix (makes it a real Mexican dish):** rebuild as **Tinga de Pollo**, a Puebla dish that
    *is* chicken in chipotle — shredded chicken braised in a chipotle-tomato sauce with onion and
    garlic, served on tortillas with onion, cilantro and lime. Nearly every ingredient is already in the
    registry.
    - **Ingredients:** keep `Chicken Breast` 160g (`Chicken Thigh` is more traditional — tinga is a
      shredded, braised preparation and thigh holds up better); add `Tomato` 120g; add `Onion` 50g; add
      `Garlic` 5g; add `Corn Tortillas` 60g; keep `Cilantro` 5g; add `Lime` 15g; remove `Brown Rice`
      52g, `Black Beans` 27g, `Corn` 50g, `Avocado` 40g (or keep the beans as a side if the macro shape
      matters).
    - **Spices:** add `Chipotle Powder` 2g and `Mexican Oregano` 1g; remove `Paprika` 2g and
      `Chili Powder` 1g; keep Cumin 1g, Garlic Powder (optional — real garlic is now in the list), Salt,
      Black Pepper.
    - **Steps:** (a) Poach the chicken, then shred it. (b) Blend tomato, garlic, chipotle, oregano and
      cumin until smooth. (c) Fry sliced onion in oil until softened, pour in the blended sauce and
      cook until it thickens and darkens. (d) Return the shredded chicken to the sauce and simmer to
      absorb. (e) Serve on warmed corn tortillas with chopped onion, cilantro and lime.
    - **Rename** to `Tinga de Pollo`.
- **New ingredients required:** `Chipotle Powder`, `Mexican Oregano` (RECIPE_SPICE_OVERRIDES entries,
  zero-macro — **not** in registry.md, and do not need to be). `Tomato`, `Onion`, `Garlic`,
  `Corn Tortillas`, `Lime` are already in the registry.
- **Ingredients no longer used:** minimum fix: none. Strong fix: `Brown Rice`, `Black Beans`, `Corn`,
  `Avocado` from this recipe (all used heavily elsewhere).
- **Macro impact:** Minimum fix: none — it is a spice swap. Strong fix: **material** — trading rice,
  beans, corn and avocado for tomato drops roughly 250–300 cal and most of the fat while holding protein
  roughly constant, turning a ~600 cal bowl into a lean ~350 cal protein dish. That may be useful or may
  leave a gap in the plan's calorie range; worth checking against the solver before committing.
- **Confidence:** high
- **Sources:** MasterClass, "How to Make Tinga de Pollo"; La Piña en la Cocina, "Tinga de Pollo (Chicken
  in a Chipotle Tomato Sauce)"; Muy Bueno, "Chicken Tinga"; Chipotle corporate history via EBSCO /
  Quartr; Wikipedia "Chili powder" (blend composition).

---

### Veggie Burrito

- **Verdict:** `mislabeled` (and `significantly-off` for a Mexican burrito specifically)
- **Cuisine label:** Should be `American` / Cal-Mex as written. A flour tortilla filled with rice,
  beans, cheese and avocado is the **Mission burrito** — San Francisco, 1960s — not a Mexican one.
  If rebuilt northern-style (see fix), `Mexican` becomes correct.
- **Findings:**
  1. **Rice inside the burrito is the Mission-style marker.** Burritos are a traditional food of Ciudad
     Juárez, Chihuahua, where they are long, slender, and built on a guisado — chile relleno, chile
     colorado, birria — or simply refried beans and cheese. No rice, no heavy fillers. The rice is the
     Californian addition that made the burrito big enough to need foil.
  2. **`Cheddar Cheese`.** Northern Mexican burritos use asadero, menonita or Chihuahua cheese.
     Cheddar is the Tex-Mex substitution. `Mozzarella Cheese` in the registry is the nearer analogue.
  3. **No chile at all.** A Juárez bean burrito nearly always carries chile — green chile rajas, or the
     chile in the guisado itself. `Bell Pepper` is not a chile.
  4. **`Avocado` 50g inside the burrito** is a Mission/Cal-Mex convention (guacamole as a burrito
     filling). It is not northern Mexican practice.
  5. `Whole Wheat Tortilla` — the flour tortilla is correct and genuinely northern; whole wheat is the
     health substitution. Registry constraint, not a fixable error.
  6. The name is generic. "Veggie Burrito" is a menu category, not a dish.
- **Proposed fix (northern-Mexican rebuild, stays vegetarian):**
  - **Ingredients:** remove `Brown Rice` 40g. Raise `Black Beans` 39g → 90g and refry/mash them. Swap
    `Cheddar Cheese` 20g → `Mozzarella Cheese` 30g (asadero stand-in). Add `Onion` 30g. Keep
    `Bell Pepper` 50g but cook it as *rajas* — blistered over high heat, cut into strips — with the
    onion. Reduce `Avocado` 50g → 0g inside (serve alongside if wanted, or drop; see macro note). Keep
    `Whole Wheat Tortilla` 70g.
  - **Spices:** remove `Chili Powder` 1g; add `Mexican Oregano` 1g and `Jalapeno` 5g (or
    `Chile de Arbol` 1g) so there is a real chile.
  - **Steps:** drop the rice step. Refry the beans with cumin until thick and spreadable. Blister the
    bell pepper and onion over high heat and cut into strips. Warm the tortilla, spread the beans,
    add the rajas and mozzarella, roll tightly tucking in the sides, and return to the dry pan seam-side
    down to seal and melt the cheese.
  - **Rename** to `Bean and Cheese Burrito` or `Burrito de Frijol con Queso`.
- **New ingredients required:** `Mexican Oregano`, `Jalapeno` (RECIPE_SPICE_OVERRIDES entries,
  zero-macro — **not** in registry.md). `Mozzarella Cheese`, `Onion` already in the registry.
- **Ingredients no longer used:** `Brown Rice`, `Avocado`, `Cheddar Cheese` (this recipe; all used
  elsewhere).
- **Macro impact:** Moderate. Dropping 40g rice and 50g avocado removes roughly 190 cal and ~7g fat;
  adding 51g of beans and 10g more cheese returns roughly 90 cal with more protein and fibre. Net a
  leaner, higher-fibre, slightly lower-calorie burrito. If the calorie loss matters, raise the beans
  further rather than putting the rice back — more beans is the traditional-correct lever.
- **Confidence:** high
- **Sources:** TasteAtlas "Burrito" (Ciudad Juárez, Chihuahua); Fooditor, "Guide to the Norteño Burritos
  at Burritos Juarez"; Wikipedia "Burrito" and "Mission burrito"; KQED on Mission-style burritos.

---

### Shrimp Fajitas

- **Verdict:** `mislabeled`
- **Cuisine label:** Should be `Tex-Mex` (or `American`). Fajitas come from the ranches of South Texas,
  where vaqueros in the 1930s–40s were paid in the tougher cuts including skirt steak and grilled it
  over open fire. The word is from Spanish *faja*, "strip" or "belt" — it names **the cut of meat**, the
  skirt steak itself. The dish reached restaurants in the late 1960s–70s, with Ninfa's in Houston
  popularising the peppers-and-onions-and-tortillas presentation from 1973. So "shrimp fajitas" is an
  extension of a Tex-Mex restaurant dish, twice removed from Mexican cooking: it is not a Mexican dish,
  and strictly it is not even a fajita.
- **Findings:**
  1. The cuisine label, as above. This is the substantive finding.
  2. **The recipe itself is good.** The technique is correct for the genre — high-heat sear, shrimp out
     first so it does not overcook, peppers and onion in the same pan, garlic last for 30 seconds, warm
     tortilla, lime and cilantro to finish. All seven ingredients appear in the steps; there are no
     phantoms and nothing unused. Do not rewrite this on authenticity grounds.
  3. Minor, within the genre: `Paprika` 2g is generic American "fajita seasoning". A Tex-Mex fajita
     marinade is lime, garlic and salt (restaurant versions often add soy or Worcestershire), not a
     paprika rub — and the recipe already has both lime and garlic, currently used only as garnish and
     as a 30-second pan addition.
  4. Cosmetic: 35g of tortilla for 180g of shrimp is one small tortilla for a large plate of filling.
- **Proposed fix:** Two paths; **A is recommended.**
  - **A — relabel, leave the recipe alone.** Change `cuisine` to `Tex-Mex` (or `American`). Optionally:
    remove `Paprika` 2g, add `Mexican Oregano` 1g, and move the lime and garlic into a marinade in step
    1 ("toss the shrimp with lime juice, minced garlic, cumin, salt and pepper and let sit 10 minutes")
    rather than adding them at the end.
  - **B — keep it Mexican by changing the dish** to **Camarones a la Mexicana**, a genuine coastal dish
    that reuses almost everything already here. "A la mexicana" names the flag colours: onion (white),
    tomato (red), chile (green).
    - **Ingredients:** keep `Shrimp` 180g, `Onion` 50g, `Garlic` 5g, `Cilantro` 5g, `Lime` 15g; remove
      `Bell Pepper` 80g; add `Tomato` 120g; swap `Whole Wheat Tortilla` 35g → `Corn Tortillas` 60g.
    - **Spices:** remove `Paprika` 2g; add `Serrano Chili` 5g (or `Jalapeno` 5g) and `Mexican Oregano`
      1g; keep Cumin (reduce to 1g), Salt, Black Pepper.
    - **Steps:** sauté diced onion, then garlic and chile, then diced tomato until it breaks down into a
      sauce; add the shrimp and cook 3–4 minutes just until opaque; finish with cilantro and lime; serve
      with warm corn tortillas.
    - **Rename** to `Camarones a la Mexicana`.
    - (`Camarones al Mojo de Ajo` — shrimp in a lot of garlic with butter, oil and lime — is the other
      genuine option and is also fully covered by the registry, but it would drop both the pepper and
      the onion.)
- **New ingredients required:** Path A: none, or `Mexican Oregano`. Path B: `Serrano Chili` (or
  `Jalapeno`) and `Mexican Oregano` — RECIPE_SPICE_OVERRIDES entries, zero-macro, **not** in
  registry.md. `Tomato` and `Corn Tortillas` are already in the registry.
- **Ingredients no longer used:** Path A: none. Path B: `Bell Pepper`, `Whole Wheat Tortilla` (this
  recipe; both used elsewhere).
- **Macro impact:** Path A: none. Path B: essentially neutral — tomato replaces bell pepper at similar
  density; the flour → corn tortilla swap shifts a few grams of carbs.
- **Confidence:** high
- **Sources:** *Texas Monthly* / Tijuana Flats and Daily Meal histories of the Tex-Mex fajita; The
  Takeout, "Where Were Fajitas Invented?"; Maricruz Avalos, "Authentic Camarones a la Mexicana"; Muy
  Bueno, "Camarones a la Mexicana"; Mexico in My Kitchen, "Shrimp a la Mexicana".

---

### Turkey Burrito Bowl

- **Verdict:** `mislabeled`
- **Cuisine label:** Should be `Tex-Mex` or `American`. Same American fast-casual bowl as the other two.
- **Findings:**
  1. The cuisine label, as above.
  2. **Turkey is the one ingredient here with a genuine Mexican claim, and the recipe doesn't use it
     that way.** The turkey is native to Mexico (*guajolote*) and is central to real dishes — mole
     poblano de guajolote, and in Yucatán pavo en escabeche and relleno negro. Seasoned turkey-breast
     strips over brown rice is a gym-meal construction that borrows none of that. So the label is not
     just wrong, it is wrong in a way that steps over the actual Mexican turkey tradition.
  3. **Redundancy finding:** three of the eight recipes in this slice — Chicken Burrito Bowl, Chipotle
     Chicken Bowl, Turkey Burrito Bowl — are the same American bowl with a different protein. That is
     three of the app's 16 `Mexican` recipes, i.e. nearly 20% of the Mexican pool, spent on one
     non-Mexican template. Since generation caps cuisine at 2/week, this materially skews what "a
     Mexican week" looks like.
  4. Minor: raw diced onion + cilantro + lime is a *taco* garnish set. In a bowl it is fine, but it is
     the only thing distinguishing this from the chicken version.
- **Proposed fix:**
  - **Primary:** change `cuisine` to `Tex-Mex` (or `American`). No recipe change needed — as a bowl it
    is coherent and well built.
  - **Secondary, on redundancy:** consider consolidating. If all three bowls are relabelled, the
    `Mexican` pool drops 16 → 12 or 13, which is a real gap. The most valuable use of this slot is to
    replace one of the three bowls with a genuinely different Mexican dish rather than keep three
    variations of one. Registry-feasible candidates that fill different macro slots: *Tinga de Pollo*
    (see Chipotle Chicken Bowl), *Enfrijoladas* (see Black Bean Bowl), *Camarones a la Mexicana* (see
    Shrimp Fajitas), *Rajas con Crema* (bell pepper + onion + Greek yogurt + queso fresco, vegetarian),
    *Calabacitas* (zucchini + corn + onion + tomato + queso fresco). A turkey-specific one is harder —
    pavo en escabeche needs achiote and sour orange, neither in the registry — so if the owner wants to
    keep turkey Mexican, the practical route is turkey in a tinga or a *pavo a la mexicana* (turkey with
    tomato, onion, chile), reusing the tinga build above with `Turkey Breast` 170g.
- **New ingredients required:** none for the relabel. If a replacement dish is authored, see that
  dish's entry.
- **Ingredients no longer used:** none.
- **Macro impact:** None for the relabel. Turkey Breast is one of the leanest high-protein entries in
  the app, so if this recipe is ever removed rather than relabelled, check that the solver still has
  enough lean-protein density in the pool.
- **Confidence:** high on the label; medium on the best replacement dish, since that is a product
  decision about the recipe pool rather than a factual one.
- **Sources:** As for Chicken Burrito Bowl (Mission burrito / Chipotle history); general Mexican
  culinary reference on guajolote in mole poblano and Yucatecan pavo dishes.

---

## Summary

**Counts by verdict**

| Verdict | Count | Recipes |
|---|---|---|
| `authentic` | 0 | — |
| `minor-drift` | 0 | — |
| `significantly-off` | 2 | Chicken Enchiladas, Chicken Quesadilla |
| `not-a-real-dish` | 2 | Black Bean Bowl, Chipotle Chicken Bowl |
| `mislabeled` | 4 | Chicken Burrito Bowl, Veggie Burrito, Shrimp Fajitas, Turkey Burrito Bowl |

Zero `authentic` looks harsh, so be clear about what it means: **for four of the eight the recipe is
fine and only the cuisine label is wrong.** Chicken Burrito Bowl, Shrimp Fajitas and Turkey Burrito Bowl
in particular are well-built dishes that need a one-word data change and nothing else. Only four recipes
need actual recipe work, and two of those (Enchiladas, Quesadilla) are the ones that matter.

**The 3 worst offenders**

1. **Chicken Enchiladas** — the sauce is plain tomato sauce, and an enchilada is by definition a
   tortilla dipped in *chile* sauce. Add melted cheddar-plus-mozzarella and a 20-minute bake and it is a
   Tex-Mex casserole wearing a Mexican name. The defining technique (tortilla through hot oil, then
   dipped in chile sauce) is missing entirely.
2. **Chipotle Chicken Bowl** — there is no chipotle in it. The seasoning is paprika and chili powder;
   chipotle is a smoke-dried jalapeño. Same class of error as turmeric-for-aji-amarillo in the Peruvian
   audit: a named defining chile replaced by generic red powder.
3. **Chicken Quesadilla** — `BBQ Sauce` inside a quesadilla. Not an ingredient in any regional Mexican
   cooking; this is an American chain-restaurant item. Compounded by yellow cheddar where Oaxaca or
   Chihuahua cheese belongs.

**Consolidated new ingredients required**

Good news: **no `INGREDIENT_REGISTRY` additions are needed for any fix in this slice.** Everything
proposed is either already in the registry or is a zero-macro `RECIPE_SPICE_OVERRIDES` entry, which per
the project's own conventions needs only a grocery category.

New spice-override entries (none are in registry.md, and none need to be):

| Name | Used by | Note |
|---|---|---|
| `Mexican Oregano` | Enchiladas, Quesadilla, Veggie Burrito, Black Bean Bowl, Chipotle Bowl, Fajitas | A different plant from the registry's `Oregano` (*Lippia graveolens* vs. *Origanum vulgare*) — citrusy, not sweet-piney |
| `Chipotle Powder` | Chipotle Chicken Bowl, Black Bean Bowl, optionally Chicken Burrito Bowl, Quesadilla | Smoke-dried jalapeño. `Smoked Paprika` is **not** a substitute — different chile, Spanish |
| `Guajillo Chili` | Chicken Enchiladas | ~8g dried; genuinely ~25 cal, so the owner may prefer a registry entry (precedent: `Aji Amarillo Paste` is in the registry, `Aji Limo` is a spice override) |
| `Ancho Chili` | Chicken Enchiladas | Same macro caveat, smaller amount |
| `Jalapeno` | Quesadilla, Veggie Burrito | Fresh, zero-macro |
| `Serrano Chili` | Shrimp Fajitas (path B only) | Fresh, zero-macro; `Jalapeno` works if you'd rather not add two |
| `Epazote` | Black Bean Bowl (optional) | Traditional herb cooked with black beans |

Registry ingredients newly *used* by these fixes (all already present, no data.js registry change):
`Queso Fresco`, `Tomato`, `Corn Tortillas`, `Garlic`, `Onion`, `Red Onion`, `Lime`, `White Rice`,
`Greek Yogurt`, `Mozzarella Cheese`. Note `Queso Fresco` and `Tomato` are currently used in **zero** of
these eight recipes despite being exactly the right ingredients for several of them.

**Consolidated ingredients this slice would stop using**

| Ingredient | Dropped from | Orphaned app-wide? |
|---|---|---|
| `BBQ Sauce` | Chicken Quesadilla | **No** — 7 references in data.js, so other recipes still use it |
| `Cheddar Cheese` | Enchiladas, Quesadilla, Veggie Burrito | No — used elsewhere |
| `Chili Powder` (spice) | Burrito Bowl, Enchiladas, Veggie Burrito, Chipotle Bowl | Check — it may become unused if no non-Mexican recipe carries it |
| `Paprika` (spice) | Chipotle Bowl, Shrimp Fajitas | Check — likely still used elsewhere |
| `Brown Rice` | Enchiladas, Black Bean Bowl, Veggie Burrito, (Chipotle Bowl if rebuilt) | No — widely used |
| `Bell Pepper` | Shrimp Fajitas (path B), Chicken Burrito Bowl (optional) | No — widely used |
| `Corn` | Black Bean Bowl (if rebuilt), Chipotle Bowl (if rebuilt) | No |
| `Avocado` | Veggie Burrito, Chipotle Bowl (if rebuilt) | No |
| `Mozzarella Cheese` | Enchiladas — but **added** to Quesadilla and Veggie Burrito | No, net still used |
| `Whole Wheat Tortilla` | Shrimp Fajitas (path B only) | No |

Per the project's data-hygiene convention, run the orphan sweep after applying: `Chili Powder` and
`Paprika` are the two plausible candidates for becoming unreferenced, and both live in
`RECIPE_SPICE_OVERRIDES` rather than the registry, so check there before deleting.

**Hard constraints observed:** no nuts and no olives are proposed anywhere in this report, in any form.
`Olive Oil` is referenced in several rewritten cooking steps (frying tortillas, frying the chile sauce,
blistering rajas) and is a separate registry ingredient, untouched by the olive ban.
