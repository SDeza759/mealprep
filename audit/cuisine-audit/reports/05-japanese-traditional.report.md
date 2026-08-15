# Authenticity audit — Japanese (traditional cooked dishes)

Mode: **traditional** (the specifics ARE the dish). 8 recipes.

Constraint check: no nuts and no olives appear in any proposal below. None of these eight dishes is
traditionally nut-based or olive-bearing, so the hard constraints never collided with authenticity in
this slice. `Nagaimo` (proposed for Okonomiyaki) is a yam, not a nut.

Orphan check run against `data.js` before proposing removals — **no fix below orphans any registry
entry.** Reference counts (registry line + recipes): Rice Noodles 1+5, Asparagus 1+4,
Panko Breadcrumbs 1+4, Miso Paste 1+5, Sesame Oil 1+18, Honey 1+6, Spinach 1+19, Avocado 1+17,
Edamame 1+5.

---

### Japanese Tamagoyaki
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`
- **Findings:**
  1. **Sugar is a phantom ingredient.** Step 2 says "whisk eggs with soy sauce and a pinch of sugar,"
     but sugar is in neither the ingredient list nor the spice overrides — and `Sugar` is not in the
     registry at all. The step names something the dish does not contain.
  2. **No dashi, no mirin.** The canonical seasoning for tamagoyaki is dashi + sugar + mirin + a
     little soy + salt (Just One Cookbook's dashimaki tamago: 3 Tbsp dashi, 2 tsp sugar, 1 tsp soy,
     1 tsp mirin, 2 pinches salt for 4 eggs). Note this is a real fork, not a clean error: the
     dashi-forward version is *dashimaki tamago*, while the sweeter bento-style tamagoyaki can omit
     dashi. But **every** recognized version has sugar and/or mirin. A version with 8g soy sauce and
     no sweetener at all is not one of them.
  3. **Soy sauce is ~3× the traditional ratio.** 8g soy to 150g egg, plus 1g salt. Traditional is
     roughly 1 tsp (≈6g) soy to 4 eggs (≈200g). At this level the omelette goes brown and salty
     rather than pale yellow and delicate — tamagoyaki shops use light *usukuchi* soy specifically to
     protect the colour.
  4. **The miso soup is miso paste in water.** Step 6 serves "miso soup made from miso paste." Miso
     soup is defined by dashi; miso whisked into plain hot water is not miso soup. 15g miso per bowl
     is otherwise in range (typical 12–18g).
  5. Minor: `Salt` 1g is never named in any step (convention says name specific spices).
- **Proposed fix:**
  - *Ingredients:* `Soy Sauce` 8g → **4g**. Add **`Sugar` 6g** and **`Mirin` 6g**.
  - *Spices:* add **`Dashi`** (zero-macro override) — it serves both the egg mixture and the soup.
  - *Steps:* step 2 → "Whisk eggs with dashi, sugar, mirin, soy sauce and salt until just combined,
    without beating in air." Step 6 → "…serve with rice, miso soup made by dissolving miso paste into
    hot dashi off the boil, and sliced green onion." Optionally add "roll the finished omelette in a
    bamboo mat while hot to set its shape."
- **New ingredients required:** `Sugar` (**NOT in registry**), `Mirin` (**NOT in registry**),
  `Dashi` (spice-override entry, zero-macro — no registry change needed).
- **Ingredients no longer used:** none.
- **Macro impact:** negligible. +6g sugar (~24 cal) and +6g mirin (~15 cal), −4g soy sauce. Protein
  unchanged.
- **Confidence:** high
- **Sources:** Just One Cookbook (Dashimaki Tamago / Tamagoyaki); Saveur, "Japanese Rolled Omelet
  (Dashi-Maki Tamago)"; Just One Cookbook (Homemade Miso Soup); Sudachi Recipes (Traditional Miso Soup)

---

### Miso Ramen
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` in intent — miso ramen is unambiguously Japanese (Sapporo). But **as
  written the bowl is a generic pan-Asian miso noodle soup**, not ramen. The label is right; the
  dish has drifted out from under it.
- **Findings:**
  1. **Rice noodles.** This is the single largest finding in the slice. Ramen is *defined* by
     alkaline wheat noodles made with **kansui** — that is what gives them their yellow colour,
     springy bite and characteristic aroma, and what distinguishes ramen from every other Asian
     noodle soup. Rice noodles are a Southeast Asian ingredient (pho, pad thai). A substituted
     staple, exactly the class of error this mode is meant to catch. Miso specifically calls for the
     thicker, wavier noodle, because it has to carry a heavy paste-based broth.
  2. **There is no broth.** Step 3: "Dissolve miso paste in 3 cups of hot broth or water." Ramen is
     built from five components: a long-simmered stock, a concentrated **tare**, an aromatic oil,
     kansui noodles, and toppings. Miso ramen stock is pork/chicken (Sapporo's is *kotteri* — rich
     and fatty), usually cut with dashi; the miso is the tare, not the soup. Miso in plain water is
     thin and flat. "Broth" is also a phantom — it appears in a step but in no ingredient list.
  3. **The pork is seared, not chashu.** Ramen pork belly is chashu: rolled and braised low in soy,
     mirin, sake and sugar. A quick sear in a hot pan is a Western shortcut and gives a completely
     different texture.
  4. **The egg is plain soft-boiled, not ajitama.** The marinade (soy/mirin, several hours) is the
     whole point of a ramen egg.
  5. **Spinach is not the miso-ramen green.** The Sapporo signature is bean sprouts (*moyashi*),
     sweetcorn and a knob of butter, often over stir-fried onion/cabbage and ground pork. Spinach
     turns up in some shoyu bowls, so this is drift rather than an outright error — but it is not
     what makes a miso bowl taste like a miso bowl.
  6. **No aromatics.** Miso tare is bloomed with grated garlic and ginger in sesame oil. All three
     are already in the registry and cost nothing to add.
- **Proposed fix:**
  - *Ingredients:* **`Rice Noodles` 39g → `Ramen Noodles` ~60g dry** (new). Add `Corn` 30g, `Butter`
    5g, `Garlic` 5g, `Ginger` 4g, `Sesame Oil` 4g — **all already in the registry**. Optionally add
    `Bean Sprouts` 50g (new) and drop `Spinach` 40g, or keep spinach as a secondary green.
  - *Fallback if a new noodle is refused:* `Pasta` is at least wheat, but it has no kansui and the
    wrong shape/bite. It is a downgrade, not a fix — I would rather the dish keep rice noodles and be
    renamed than pretend spaghetti is ramen.
  - *Spices:* keep `Salt` + `White Pepper`; add **`Dashi`**.
  - *Steps:* braise the pork belly in soy/mirin/sake for chashu; marinate the halved egg in the same
    liquid; "bloom grated garlic and ginger in sesame oil, stir in the miso paste to make the tare,
    then loosen with hot stock and dashi"; finish with corn, bean sprouts, butter and scallion.
- **New ingredients required:** **`Ramen Noodles`** (**NOT in registry** — critical),
  `Bean Sprouts` (**NOT in registry** — optional), `Mirin` (**NOT in registry** — for the chashu and
  ajitama), `Dashi` and `Sake` (spice-override entries, zero-macro).
- **Ingredients no longer used:** `Rice Noodles` (from this recipe only — 4 other recipes still use
  it, no orphan). `Spinach` if replaced (19 other uses, no orphan).
- **Macro impact:** modest increase. Wheat ramen noodles carry roughly 3× the protein of rice noodles
  gram-for-gram (~12g/100g dry vs ~3.5g), so **protein goes up** — the solver should like this.
  Corn + butter add ~50 cal. Net calories up ~80–120.
- **Confidence:** high
- **Sources:** Just One Cookbook, "Japanese Ramen Guide: Broths, Noodles & Toppings";
  Wikipedia, "Ramen"; No Recipes, "Best Miso Ramen Recipe (味噌ラーメン)"; MasterClass, "Sapporo-Style
  Ramen Recipe"; Roti n Rice, "Sapporo Style Miso Ramen"

---

### Pork Tonkatsu
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`
- **Findings:**
  1. **Breading is right.** Flour → beaten egg → **panko**, not fine breadcrumbs. Panko's large
     jagged crumbs are what make tonkatsu lighter and crunchier than a European schnitzel. Pork loin,
     pounded even, is the correct cut. No finding here — this part is well done.
  2. **No tonkatsu sauce.** This is the real finding. Tonkatsu sauce — a thick, fruit-based
     Worcestershire relative, sweet and tart — is the defining condiment. Without it the dish is
     just a fried pork cutlet. Step 6 mentions no sauce of any kind.
  3. **Pan-fried, not deep-fried.** Tonkatsu is deep-fried in 160–180°C oil; the immersion is what
     puffs and sets the panko. Pan-frying is a known home shortcut but it is a technique drift under
     this bar. Related: **the frying oil is a phantom** — step 5 says "pan-fry in oil" but no oil is
     in the ingredient list. (If one is added it should be a neutral oil or lard, *not* Olive Oil.)
  4. **Asparagus is not a tonkatsu accompaniment.** The teishoku set is finely shredded raw cabbage,
     steamed rice, miso soup and pickles, with a lemon wedge and *karashi* (Japanese hot mustard).
     Steamed asparagus is a Western plate-filler.
  5. 60g cabbage is a thin pile for a dish where the cabbage mound is half the visual identity.
- **Proposed fix:**
  - *Ingredients:* add **`Tonkatsu Sauce` 20g** (new). Drop `Asparagus` 60g; raise `Cabbage` 60g →
    **100g**; add `Lemon` 15g (registry ✓) as the wedge. (If a green vegetable is wanted for macro
    reasons, keep the asparagus but present it explicitly as a side, not as part of the dish.)
  - *Spices:* keep `Salt` + `Black Pepper`; add **`Karashi`** (zero-macro override) 2g.
  - *Steps:* step 5 → "Deep-fry at 170°C for 5–6 minutes, turning once, until deep golden; drain on a
    rack." Step 6 → "Rest 2 minutes, slice crosswise into 1.5cm strips, and serve with rice, a mound
    of very finely shredded raw cabbage, a lemon wedge, a dab of karashi, and tonkatsu sauce."
- **New ingredients required:** `Tonkatsu Sauce` (**NOT in registry**), `Karashi` (spice-override
  entry, zero-macro).
- **Ingredients no longer used:** `Asparagus` (from this recipe only — 3 other recipes still use it,
  no orphan).
- **Macro impact:** near-neutral. −60g asparagus (~−13 cal) +40g cabbage (~+10 cal) +20g tonkatsu
  sauce (~+25 cal, mostly sugar). Protein unchanged. Genuinely deep-frying would raise absorbed fat
  in reality, but the registry doesn't model frying oil either way.
- **Confidence:** high
- **Sources:** Just One Cookbook, "Crispy Tonkatsu (とんかつ)"; RecipeTin Japan, "Tonkatsu";
  Sudachi Recipes, "Authentic Tonkatsu with Homemade Sauce"; No Recipes, "Tonkatsu"

---

### Katsu Curry
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — katsu curry is unambiguously Japanese (*yōshoku*). But the sauce as
  written reads as a generic thin curry, which is precisely the confusion to avoid.
- **Findings:**
  1. **This is not Japanese curry.** Step 3 — "sauté onion and carrot in oil, add curry powder and
     water, simmer for 15 minutes" — produces a thin, watery spiced broth. Japanese curry is a
     *yōshoku* dish that came to Japan via the British Navy, and it is built on a **roux**: butter
     and flour cooked together 15–25 minutes to a golden brown, then bloomed with curry powder. The
     result is a thick, glossy gravy closer to a European sauce than to anything Indian. Japanese
     curry "bears negligible resemblance to Indian curries." Simmering curry powder in water is the
     Indian-adjacent construction the roux exists to replace.
  2. **No potato.** Onion, carrot **and potato** are the standard trio. `Potato` is in the registry.
  3. **No stock** — water only. Japanese curry uses chicken or beef stock.
  4. **No sweet/umami balancers.** Grated apple or honey, soy sauce, and ketchup or Worcestershire
     are what give Japanese curry its characteristic rounded sweetness. `Honey`, `Soy Sauce` and
     `Tomato Sauce` are all already in the registry.
  5. **The flour is fully consumed by the breading.** 10g flour goes to the katsu coating, so there
     is literally nothing left to thicken with even if the roux step were added.
  6. **No butter.** `Butter` is in the registry.
  7. `Curry Powder` 3g is low for a full plate of curry. Japanese curry powder (S&B) is a distinct,
     milder, more umami-forward blend than standard curry powder, but `Curry Powder` is the closest
     available entry — acceptable, just raise the quantity.
  8. The katsu itself is fine: chicken katsu curry is standard, breading order is correct. Same
     pan-fry-vs-deep-fry note and same phantom frying oil as Tonkatsu.
- **Proposed fix — note this one is entirely buildable from the existing registry:**
  - *Ingredients:* raise `Flour` 10g → **22g** (10g breading + 12g roux). Add `Butter` 12g,
    `Potato` 80g, `Honey` 6g, `Soy Sauce` 6g, `Garlic` 5g, `Ginger` 4g. Optionally `Tomato Sauce`
    10g for the ketchup note. **All already in the registry.**
  - *Spices:* `Curry Powder` 3g → **6g**. Keep `Salt`, `White Pepper`.
  - *Steps:* replace step 3 with two steps — (a) "Melt butter, stir in flour and cook, stirring, for
    15–20 minutes until it turns golden brown; take off the heat and stir in the curry powder to make
    a roux." (b) "Sauté grated garlic and ginger with diced onion, carrot and potato, cover with
    stock and simmer 15 minutes until the potato is tender; whisk in the roux and add honey and soy
    sauce, then simmer until the sauce thickens enough to coat the back of a spoon."
  - *Steps:* also correct the katsu to deep-frying and name the oil, as with Tonkatsu.
- **New ingredients required:** **none** — this is the cheapest high-value fix in the slice.
- **Ingredients no longer used:** none.
- **Macro impact:** **materially up, flag this.** +12g butter (~86 cal fat), +12g flour (~44 cal),
  +80g potato (~62 cal), +honey/soy (~25 cal) ≈ **+215 cal**, mostly carbs with a fat bump. Protein
  roughly unchanged. The solver will feel this; the recipe's serving grams may want rebalancing.
- **Confidence:** high
- **Sources:** Wikipedia, "Japanese curry"; Just One Cookbook, "How to Make Curry Roux
  (カレールーの作り方)" and "Katsu Curry (カツカレー)"; MasterClass, "Curry Roux Recipe";
  Chopstick Chronicles, "Japanese Curry Rice"; No Recipes, "Katsu Curry"

---

### Okonomiyaki
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` (Osaka / Kansai-style okonomiyaki)
- **Findings:**
  1. **Panko is being used as the batter.** Step 2: "Mix panko breadcrumbs with water to form a
     batter." This is wrong at the level the traditional bar cares about. Okonomiyaki batter is
     **wheat flour + dashi + grated nagaimo + egg**. Panko is dried bread crumb; hydrated it makes a
     wet paste, not a batter, and it will not set into a pancake the way a flour batter does.
     Likely origin of the substitution: confusion with **tenkasu** (tempura scraps), which *is* an
     Osaka-standard batter add-in — but tenkasu and panko are different products with different
     behaviour.
  2. **No flour.** `Flour` is already in the registry.
  3. **No dashi.** Dashi in the batter is the umami backbone of the dish.
  4. **No nagaimo/yamaimo.** The grated mountain yam releases a sticky binder that produces
     okonomiyaki's fluffy, almost custardy interior — in Osaka it is considered essential, second
     only to the cabbage. This is the one genuinely hard-to-source item; without it the pancake is
     denser but still recognisable, so I'd call it canonical-but-optional.
  5. **Okonomiyaki sauce and mayonnaise are both phantoms.** Step 6 serves with both; neither is in
     the ingredient list. `Mayonnaise` is already in the registry (Kewpie, ideally). Okonomiyaki
     sauce is not — `Tonkatsu Sauce` is its close relative (okonomiyaki sauce is thicker and
     sweeter, same Worcestershire-fruit family).
  6. **No katsuobushi or aonori.** The dancing bonito flakes and green laver are the dish's visual
     signature.
  7. Correct as-is: thin-sliced pork belly on top (*buta-tama*) and 150g finely shredded cabbage are
     both right. The step order (pork down first, batter poured over) is a legitimate variant.
- **Proposed fix:**
  - *Ingredients:* **remove `Panko Breadcrumbs` 30g**; add **`Flour` 50g** (registry ✓). Add
    `Mayonnaise` 15g (registry ✓) and **`Tonkatsu Sauce` 20g** (new) as the okonomiyaki-sauce
    stand-in. Optionally add **`Nagaimo` 40g** (new, hard to source).
  - *Spices:* add **`Dashi`** (this supplies the batter liquid, ~60g), plus **`Aonori`** and
    **`Bonito Flakes`** as zero-macro topping entries.
  - *Steps:* step 2 → "Whisk flour with dashi and grated nagaimo into a loose batter and rest it in
    the fridge for at least an hour." Step 3 unchanged in spirit ("fold in shredded cabbage, green
    onion and beaten egg — fold, don't overmix"). Step 6 → "Brush with okonomiyaki sauce, pipe
    mayonnaise over in a lattice, and finish with a shower of aonori and bonito flakes."
- **New ingredients required:** `Tonkatsu Sauce` (**NOT in registry**, shared with Pork Tonkatsu),
  `Nagaimo` (**NOT in registry**, optional), `Dashi` / `Aonori` / `Bonito Flakes` (spice-override
  entries, effectively zero-macro at 2–3g).
- **Ingredients no longer used:** `Panko Breadcrumbs` (from this recipe only — Tonkatsu and Katsu
  Curry still use it, no orphan).
- **Macro impact:** **materially up, flag this.** 30g panko (~117 cal, ~4g protein) → 50g flour
  (~182 cal, ~5g protein), plus 15g mayonnaise (~100 cal, nearly all fat) and 20g sauce (~25 cal).
  Net **≈ +200 cal**, skewed carb and fat. Protein roughly flat.
- **Confidence:** high
- **Sources:** Just One Cookbook, "Authentic Okonomiyaki (お好み焼き)"; JustHungry, "Okonomiyaki,
  Osaka style"; No Recipes, "Osaka Okonomiyaki (Kansai-Style)"; Sudachi Recipes, "Authentic Osaka
  Style Okonomiyaki"

---

### Sushi Bowl (Chirashi)
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`
- **Findings:**
  1. **The sushi rice seasoning is incomplete — this is the main finding.** Step 1: "season with a
     splash of rice vinegar while warm." *Sushi-zu* is rice vinegar **+ sugar + salt**, and the
     three-part balance is the point: the vinegar gives the tang, the sugar rounds it, the salt
     lifts it. Vinegar alone gives sour, flat rice. Sushi rice is what makes sushi *sushi* — the
     word itself refers to the vinegared rice, not the fish.
  2. **Rice vinegar is a phantom** — named in step 1, present in neither the ingredient list nor the
     spice overrides. It's zero-macro, so it belongs in `RECIPE_SPICE_OVERRIDES` (precedent:
     `Red Wine Vinegar` already lives there).
  3. **Rice type is unstated.** Chirashi requires short-grain Japanese rice; long-grain won't take
     the seasoning or hold together. The registry has only `White Rice` and can't express this, so
     the step should say it explicitly.
  4. **Avocado and edamame are not traditional chirashi toppings.** Avocado in sushi is a 1970s Los
     Angeles invention (the California roll); edamame is Japanese but is an *otsumami* — a drinking
     snack — not a chirashi component. That said, **chirashi is the most freely composed sushi form**
     ("scattered sushi"), its toppings are seasonal by design, and avocado does now appear in
     Japanese home versions. So I'd flag these rather than call them wrong — this is the weakest
     finding in the block.
  5. **Missing the defining garnishes:** shredded nori (*kizami nori*) and *kinshi tamago* (shredded
     thin egg crepe), which is arguably the single most characteristic chirashi topping. Also absent:
     wasabi, pickled ginger, shiso, ikura.
  6. Minor: `cookTime: 15 mins` for a dish whose only cooking is the rice and edamame; and step 2
     says "slice the fish and ahi tuna" where the ingredient is specifically `Salmon Fillet`. Neither
     step states sashimi-grade.
- **Proposed fix:**
  - *Ingredients:* add **`Nori` 3g** (new) and `Egg` 40g (registry ✓) for kinshi tamago — the egg
     also lifts protein, which the solver should welcome.
  - *Purist option (owner's call):* drop `Avocado` 40g as the Western import. I would **keep**
     `Edamame`, or swap it for snow peas. I do not recommend forcing this — see finding 4.
  - *Spices:* add **`Rice Vinegar` 12g**, **`Sugar` 6g** and **`Wasabi` 3g** as zero-macro overrides
    (sugar at 6g is 24 cal — defensible as an override, or make it a real registry entry since three
    recipes in this slice want it). Reframe the existing `Salt` 1g as part of the sushi-zu.
  - *Steps:* step 1 → "Cook short-grain Japanese rice. While it is still warm, fold through a
    sushi-zu of rice vinegar, sugar and salt, cutting it in with a paddle rather than stirring, and
    fan it to cool so the grains stay glossy and separate." Add a kinshi tamago step. Step 5 → scatter
    shredded nori over the rice before the toppings. Step 6 → "Serve with soy sauce and wasabi."
    Name the fish as sashimi-grade salmon.
- **New ingredients required:** `Nori` (**NOT in registry**), `Sugar` (**NOT in registry**),
  `Rice Vinegar` and `Wasabi` (spice-override entries, zero-macro).
- **Ingredients no longer used:** none — unless the purist option is taken, in which case `Avocado`
  (17 other recipes use it, no orphan).
- **Macro impact:** small increase. +40g egg ≈ +57 cal and **+5g protein**; nori and sushi-zu
  negligible.
- **Confidence:** high on the rice seasoning and nori/tamago; **medium** on avocado/edamame, which
  are legitimate modern variation rather than error.
- **Sources:** Just One Cookbook, "Quick & Easy Chirashi Sushi (ちらし寿司)"; No Recipes, "Japanese
  Chirashi Sushi (ちらし寿司)"; Wikipedia, "Sushi"; Japambience, "What Is Chirashizushi?"

---

### Tuna Tataki Bowl
- **Verdict:** `significantly-off` — though the fix is unusually cheap: one extra step and a sauce swap.
- **Cuisine label:** `correct`
- **Findings:**
  1. **It isn't actually tataki — the chill step is missing.** *Tataki* is a specific technique from
     Kochi Prefecture: sear the surface hard on every face, then **plunge immediately into ice water**,
     pat dry, and chill 15 minutes before slicing. The shock is what stops the cooking dead and
     tightens the texture, producing the signature ~2mm caramelised crust against a cool, ruby, almost
     raw centre. Steps 2→3 sear and slice straight away, so residual heat keeps cooking inward and you
     get warm seared tuna with a grey band — a different dish. The recipe's *name* is a technique name,
     and the technique is half-executed.
  2. **The dressing is wrong.** Tataki is dressed with **ponzu** — soy sauce, citrus (yuzu or sudachi;
     lemon at home), mirin, a little vinegar, often with dashi. A miso-and-soy dressing is not a tataki
     dressing in any regional version; miso here reads as a generic "make it taste Japanese" gesture.
     **Ponzu is fully buildable from the existing registry** (Soy Sauce + Lemon).
  3. **Missing the defining garnishes:** grated ginger or garlic, thinly sliced onion or scallion, and
     grated daikon. `Ginger`, `Green Onion` and `Red Onion` are all already in the registry.
  4. **Cucumber is never prepared.** It's in the ingredient list and appears in step 6's assembly, but
     no step slices it.
  5. Correct as-is: plain steamed rice (unlike chirashi, a tataki-don takes unseasoned rice) and a very
     hot pan as the home substitute for the traditional straw flame. Neither is a finding.
  6. Naming note: tataki is normally its own plate rather than a rice bowl; "bowl" is a modern format.
     Acceptable — it's effectively a *tataki-don*.
- **Proposed fix:**
  - *Ingredients:* **remove `Miso Paste` 8g**. Add `Lemon` 15g, `Ginger` 5g and `Green Onion` 10g —
    **all already in the registry**. Optionally `Red Onion` 20g sliced paper-thin. Optionally
    `Mirin` 5g for a rounder ponzu, and `Daikon` for *oroshi*.
  - *Spices:* keep `Salt`; the acidity now comes from the lemon.
  - *Steps:* step 2 → "…sear in a smoking-hot pan for 20–30 seconds per face, browning all sides."
    New step 3 → "Plunge the seared block into ice water for 10 seconds, pat completely dry, and chill
    15 minutes before slicing." Then "Slice across the grain into 6–8mm slices." Step 5 → "Whisk soy
    sauce with lemon juice (and mirin) to make a ponzu." Add a cucumber-slicing step. Step 6 → finish
    with grated ginger and sliced scallion over the tuna.
- **New ingredients required:** `Mirin` (**NOT in registry**, optional) and `Daikon` (**NOT in
  registry**, optional). The core fix needs **no new ingredients**.
- **Ingredients no longer used:** `Miso Paste` (from this recipe only — Tamagoyaki and Miso Ramen
  still use it, no orphan).
- **Macro impact:** essentially neutral. −8g miso (~−15 cal), +lemon/ginger/scallion (~+10 cal).
- **Confidence:** high
- **Sources:** RecipeTin Japan, "Tuna Tataki (Seared Tuna) with Ponzu"; Chopstick Chronicles, "Katsuo
  Tataki"; Umamicart, "How to Make Tataki: Japanese Seared and Chilled Technique Guide"

---

### Chicken Yakitori Bowl
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`
- **Findings:**
  1. **The glaze is not tare.** Yakitori *tare* is soy sauce + **mirin** + **sake** + sugar, simmered
     and reduced until it coats a spoon (in a yakitori-ya, built up in a dipping pot over years).
     Honey is a Western stand-in for mirin/sugar; it tastes distinctly floral, and it burns faster
     over direct heat than a reduced tare does.
  2. **Sesame oil in the glaze is a Chinese/Korean move, not a Japanese one.** Tare contains no sesame
     oil. Soy + honey + sesame oil is the signature of a generic pan-Asian "teriyaki" glaze — exactly
     the substitution to flag. (Sesame oil is genuinely Japanese elsewhere — miso ramen aroma oil,
     *goma-ae* — just not in tare.)
  3. **Green onion is demoted to a raw garnish.** In *negima* — far and away the most common yakitori
     — the negi is cut into batons and **skewered between** the chicken pieces, so it chars and
     softens and becomes part of the skewer. Sliced raw over the top loses that entirely.
  4. **Skewering and charcoal are presented as optional.** Step 4 says "thread onto skewers **or** cook
     in a hot pan." Yakitori means *grilled bird on a skewer*; charcoal (ideally binchotan) smoke is a
     defining element. A pan is a fair home substitute, but it should be the fallback, not the
     co-equal option.
  5. Correct as-is: **chicken thigh (*momo*) is the right cut** — the standard yakitori cut, and a
     genuinely good call. And the glazing timing is right: the steps glaze during cooking, matching the
     real method of grilling plain first and brushing tare on in the second half.
  6. Minor: `Salt` 1g is never named in any step.
  7. Naming note: yakitori served over rice is properly *yakitori-don*. Fine for the app.
- **Proposed fix:**
  - *Ingredients:* **remove `Sesame Oil` 3g** from the glaze. Replace **`Honey` 8g** with
    **`Mirin` 12g + `Sugar` 5g**. Raise `Green Onion` 15g → 25g and change its role to negima.
  - *Fallback if new ingredients are refused:* keeping `Honey` is the least-bad option and should be
    stated as a deliberate substitution — but mirin is the authentic answer and is a cheap, shelf-stable
    pantry item, so I'd push for it.
  - *Spices:* optionally add **`Sake` 8g** as a zero-macro override (the alcohol cooks off).
  - *Steps:* step 3 → "Simmer soy sauce, mirin, sake and sugar together until reduced by about a third
    into a glossy tare." Step 4 → "Cut the green onion into 3cm batons and thread onto skewers
    alternating with the chicken." Step 5 → "Grill over charcoal, or under a very hot broiler, turning
    often; brush with tare only during the second half of cooking so it caramelises without burning."
- **New ingredients required:** `Mirin` (**NOT in registry**), `Sugar` (**NOT in registry**),
  `Sake` (spice-override entry, zero-macro, optional).
- **Ingredients no longer used:** `Sesame Oil` and `Honey` from this recipe only — 18 and 6 other
  recipes use them respectively, no orphans.
- **Macro impact:** near-neutral. Honey 8g (~24 cal) → mirin 12g (~26 cal) + sugar 5g (~20 cal);
  −3g sesame oil (~−27 cal fat). Protein unchanged.
- **Confidence:** high
- **Sources:** Just One Cookbook, "Yakitori (焼き鳥)"; RecipeTin Japan, "Yakitori (Japanese Skewered
  Chicken)"; Curious Cuisiniere, "Negima Yakitori"; Sylvia Wakana, "Negima Yakitori 2 Ways"

---

## Summary

### Counts by verdict
| Verdict | Count | Recipes |
|---|---|---|
| `authentic` | **0** | — |
| `minor-drift` | **4** | Japanese Tamagoyaki, Pork Tonkatsu, Sushi Bowl (Chirashi), Chicken Yakitori Bowl |
| `significantly-off` | **4** | Miso Ramen, Katsu Curry, Okonomiyaki, Tuna Tataki Bowl |
| `mislabeled` | **0** | — |
| `not-a-real-dish` | **0** | — |

**All 8 cuisine labels are correct.** Every dish here is genuinely Japanese in intent; nothing is a
pan-Asian or Chinese-American dish filed under the wrong flag. The failures are all *within* the
tradition — substituted staples, missing techniques, and Western condiment shortcuts — not
misattribution. Two recurring systemic gaps run across the slice: **dashi is absent everywhere it is
required** (tamagoyaki, miso soup, ramen broth, okonomiyaki batter), and **mirin/sake/sugar are
missing from every sweet-savoury sauce** (tare, ponzu, chashu, sushi-zu), with honey standing in.

### The 3 worst offenders
1. **Miso Ramen** — built on **rice noodles**, a Southeast Asian staple, where ramen is *defined* by
   alkaline (kansui) wheat noodles; and the "broth" is miso paste dissolved in water rather than a
   pork/chicken stock + dashi carrying a miso tare.
2. **Okonomiyaki** — **panko is used as the batter**, where the dish requires wheat flour + dashi
   (+ grated nagaimo); likely a confusion with tenkasu. Its two finishing sauces are phantoms.
3. **Katsu Curry** — **curry powder simmered in water is not Japanese curry**, which is a
   butter-and-flour roux gravy with potato, stock and a honey/soy round-off. Notably, this one is
   fixable *entirely from the existing registry* — the cheapest big win in the slice.

### Consolidated new ingredients required

**Registry entries (carry real macros):**
| Ingredient | Needed by | Priority |
|---|---|---|
| `Ramen Noodles` (alkaline wheat) | Miso Ramen | **Critical** — the slice's single biggest fix |
| `Mirin` | Yakitori, Tataki ponzu, Tamagoyaki, Ramen chashu/ajitama | **High** — 4 recipes, fixes the systemic sauce gap |
| `Sugar` | Tamagoyaki, Chirashi sushi-zu, Yakitori tare | **High** — 3 recipes, plus broad future use |
| `Tonkatsu Sauce` | Pork Tonkatsu, Okonomiyaki | Medium — 2 recipes, below the ≥5-recipes guideline; would also serve katsu curry, korokke, menchi-katsu |
| `Nori` | Chirashi | Low — 1 recipe as it stands |
| `Bean Sprouts` | Miso Ramen | Low / optional |
| `Nagaimo` (Japanese mountain yam) | Okonomiyaki | Low / optional — canonical but hard to source |
| `Daikon` | Tataki | Low / optional |

**Spice-override entries (zero-macro, no registry change needed):**
`Dashi` (Tamagoyaki, Miso Ramen, Okonomiyaki — **the highest-value single addition after Ramen
Noodles**), `Rice Vinegar` (Chirashi), `Sake` (Yakitori, Ramen), `Wasabi` (Chirashi),
`Karashi` (Tonkatsu), `Aonori` + `Bonito Flakes` (Okonomiyaki).

**Already in the registry and merely unused — free fixes:** `Butter`, `Potato`, `Flour`, `Honey`,
`Soy Sauce`, `Garlic`, `Ginger`, `Tomato Sauce` (Katsu Curry); `Corn`, `Butter`, `Garlic`, `Ginger`,
`Sesame Oil` (Miso Ramen); `Lemon`, `Ginger`, `Green Onion` (Tataki); `Lemon` (Tonkatsu);
`Mayonnaise`, `Flour` (Okonomiyaki); `Egg` (Chirashi).

### Consolidated ingredients this slice would stop using
**No fix below orphans any registry entry** — every one of these remains referenced by other recipes
(counts verified against `data.js`).

| Ingredient | Dropped from | Recipes still using it |
|---|---|---|
| `Rice Noodles` | Miso Ramen | 4 |
| `Panko Breadcrumbs` | Okonomiyaki | 3 (Tonkatsu, Katsu Curry, +1) |
| `Miso Paste` | Tuna Tataki Bowl | 4 |
| `Asparagus` | Pork Tonkatsu | 3 |
| `Sesame Oil` | Chicken Yakitori Bowl | 18 |
| `Honey` | Chicken Yakitori Bowl | 5 |
| `Spinach` | Miso Ramen *(optional — only if replaced by bean sprouts)* | 18 |
| `Avocado` | Sushi Bowl (Chirashi) *(optional — purist path only, not recommended)* | 17 |
