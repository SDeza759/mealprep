# Authenticity audit — Japanese: rice bowls and pan-Asian (8 recipes)

Mode: **traditional**. Hard constraints observed: no nuts, no olives, no files edited.
Where a dish is traditionally nut-based (poke's *inamona*), that is stated in one line and a nut-free
version is proposed instead — no restoration is suggested.

**Headline:** only 2 of the 8 are genuinely Japanese dishes. The other 6 are either from another
cuisine entirely (poke is Hawaiian), a Japanese-American sushi-bar invention (spicy tuna), a
California fusion item (tortilla "sushi"), or generic pan-Asian stir-fry/noodle-soup filed under
"Japanese" because they contain soy sauce. The `Japanese` label is being used as a pan-Asian catch-all
in this slice.

---

### Teriyaki Salmon Bowl
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`. *Sake no teriyaki* over rice is a real Japanese dish (teriyaki-don);
  nothing here belongs to another cuisine.
- **Findings:**
  1. **The glaze is not teriyaki.** Teriyaki *tare* is soy sauce : sake : mirin : sugar (Just One
     Cookbook gives 2:2:2:1; their teriyaki salmon uses 1 Tbsp sake, 1 Tbsp mirin, 2 Tbsp soy, 1 Tbsp
     sugar). This recipe uses soy sauce + honey. Honey appears in no traditional version. Mirin is
     what produces the *teri* — the gloss the dish is literally named for ("shine-grill"); a
     honey-soy reduction is the Western substitute, not the dish. This is the same class of error as
     turmeric-for-aji-amarillo: a substituted defining staple.
  2. **Technique detail:** the authentic method dredges the fillet lightly in flour before searing
     (it locks in moisture and makes the tare cling and thicken), then reduces the tare in the pan
     rather than brushing it on. `Flour` is already in the registry.
  3. **White Pepper** is a Chinese-leaning seasoning; Japanese teriyaki salmon is salted only.
     Small, but under a traditional bar it is drift.
  4. Edamame as a *donburi* topping is a Western bowl-shop habit — in Japan edamame is a snack /
     *otsumami*, not a rice-bowl component. Not worth a change on its own; noted for completeness.
- **Proposed fix:**
  - Ingredients: **remove** `Honey` 10g. **Add** `Mirin` 20g and `Sake` 15g (both NEW registry
    entries). Keep `Soy Sauce` 15g. Optionally **add** `Flour` 5g for the dredge.
  - Spices: **remove** `White Pepper`; keep `Salt` 1g.
  - Steps: replace steps 2–4 with — "Pat salmon dry, season with salt and dust lightly with flour." /
    "Pan-sear skin-side down in a hot oiled pan 4 minutes, flip and cook 3 minutes." / "Whisk soy
    sauce, mirin and sake, pour into the pan and spoon over the salmon until it reduces to a glossy
    glaze." Drop the honey mention.
- **New ingredients required:** `Mirin` (**NOT in registry**), `Sake` (**NOT in registry**). `Flour`
  already in registry.
- **Ingredients no longer used:** `Honey` (this recipe only; still used by 6 other recipes).
- **Macro impact:** near-neutral. Mirin 20g ≈ +45 kcal / ~10g carb vs honey 10g ≈ −30 kcal; sake
  ≈ +15 kcal; flour ≈ +18 kcal. Net roughly +40 kcal, protein unchanged.
- **Confidence:** high
- **Sources:** Just One Cookbook — *Teriyaki Sauce* and *Teriyaki Salmon*
  (justonecookbook.com/teriyaki-sauce/, justonecookbook.com/teriyaki-salmon-recipe/);
  Chopstick Chronicles — *Basic Teriyaki Sauce*.

---

### Poke Bowl
- **Verdict:** `mislabeled` (and, as built, `significantly-off` even for a modern poke bowl)
- **Cuisine label:** **Wrong — poke is Hawaiian, not Japanese.** It is an indigenous Hawaiian
  preparation (Hawaiian *poke* = "to cut crosswise into pieces"), descended from Polynesian raw-fish
  dishes. Japanese immigration to Hawaii contributed shoyu and sesame oil to the *shoyu poke* style,
  which is why it reads Japanese to outsiders — but the dish is Hawaiian. Change to `Hawaiian`
  (a **new cuisine value**; the app currently has 16 and none is Hawaiian). If the owner would rather
  not add a one-recipe cuisine, `American` is the honest catch-all — `Japanese` is not defensible.
- **Findings:**
  1. **Mislabeled** (above).
  2. **Mango.** An in-Hawaii source explicitly lists mango among *mainland* poke-bowl toppings, not
     classic poke ("In Hawaii, it is traditionally fish on rice, none of these 'extras'"). This is a
     direct analogue of the mango-in-ceviche finding from the Peruvian audit.
  3. **Avocado, cucumber, edamame** — same category: mainland poke-shop toppings, absent from all
     three classic styles.
  4. **Miso paste in the marinade.** No classic poke style uses miso. The three are: Hawaiian-style
     (Hawaiian salt + limu + inamona), shoyu (soy sauce, sesame oil, sweet Maui onion, green onion),
     spicy (mayo + sriracha). Miso is a Japanese import into a Hawaiian dish — it is the ingredient
     doing most of the mislabeling work.
  5. **Two fish.** Classic poke is single-fish, and specifically ahi. Salmon poke is a modern
     mainland poke-shop item (and raw salmon is not a Hawaiian tradition). Consolidate to ahi.
  6. **Missing defining components:** *limu* (ogo seaweed), sweet/Maui onion, green onion, Hawaiian
     sea salt. The dish currently has none of the things that make it poke.
  7. *Nut note:* traditional Hawaiian-style poke is seasoned with **inamona** (roasted kukui nut).
     That is a nut and is out of scope here — omit it permanently. The **shoyu poke** style is
     nut-free by construction, so the proposed fix loses nothing.
- **Proposed fix** (rebuild as shoyu ahi poke):
  - Ingredients: `Ahi Tuna` 150 → **200g**; keep `White Rice` 50g, `Soy Sauce` 10g, `Sesame Oil` 5g;
    **add** `Green Onion` 10g and `Onion` 25g (sweet Maui onion stand-in — the registry `Onion` is
    the right shape; `Red Onion` also acceptable). **Remove** `Salmon Fillet` 80g, `Mango` 50g,
    `Avocado` 50g, `Edamame` 50g, `Cucumber` 60g, `Miso Paste` 10g. Optionally **add**
    `Ogo Seaweed` 10g (limu) if the owner is willing to add the ingredient.
  - Spices: keep `Salt` 1g (read as Hawaiian sea salt). Optionally `Chili Flakes` 1g for a spicy
    version — but then it is spicy poke, and the mayo-based version is the real one.
  - Steps: "Cook white rice and let it cool slightly." / "Cut ahi tuna into 2cm cubes." / "Slice
    sweet onion thinly and chop green onion." / "Toss tuna with soy sauce, sesame oil, sea salt,
    sweet onion and green onion (and ogo, if using). Rest 10 minutes." / "Serve the poke over rice."
  - Rename to **`Shoyu Ahi Poke`** or keep `Poke Bowl` — either is fine once the build is right.
- **New ingredients required:** `Ogo Seaweed` (**NOT in registry**, optional). Everything else
  already exists.
- **Ingredients no longer used (in this recipe):** `Salmon Fillet`, `Mango`, `Avocado`, `Edamame`,
  `Cucumber`, `Miso Paste`. **Hygiene warning:** `Mango` is referenced by only 3 recipes today and
  `Miso Paste` by 6 — this fix (plus the bento fix below) drops them to 2 and 4, under the
  ≥5-recipes-per-ingredient guideline in CLAUDE.md.
- **Macro impact:** calories down meaningfully (avocado ~80 kcal / 7g fat and mango ~30 kcal leave;
  edamame's ~6g protein leaves). Tuna 150→200g restores and slightly raises protein. Net: roughly
  −100 kcal, notably lower fat, protein up ~5g. The `low-fat` tag becomes more accurate, not less.
- **Confidence:** high
- **Sources:** Onolicious Hawaiʻi — *Hawaii-Style Poke*; Britannica — *Poke (Hawaiian dish)*;
  Wikipedia — *Poke (dish)*.

---

### Spicy Tuna Bowl
- **Verdict:** `mislabeled` (name/dish mismatch as well)
- **Cuisine label:** **Not Japanese.** "Spicy tuna" is a Japanese-**American** sushi-bar invention
  from the 1980s US West Coast (attributed to Jean Nakayama, using tuna scraps mixed with chili sauce
  and mayonnaise, which also tamed the raw-fish aroma). It is not part of the Japanese repertoire.
  Two honest routes: relabel `American` and build it as the real Japanese-American dish, **or** keep
  `Japanese` and rebuild it as `Maguro Zuke Don`, which is a genuine Japanese dish. Recommendation
  below is the first (smaller change, name survives).
- **Findings:**
  1. **The name does not describe the dish.** Spicy tuna is defined by tuna + chili + Japanese
     mayonnaise. There is no mayonnaise and no chili sauce here — soy sauce + sesame oil + chili
     flakes over plain rice with avocado and cucumber is a **spicy shoyu poke bowl**, not spicy tuna.
  2. **`Chili Flakes`** is Italian-style crushed red pepper. The Japanese-American idiom is sriracha
     or shichimi togarashi.
  3. **Unseasoned rice.** Anything descended from the sushi bar sits on *shari* — rice seasoned with
     sushi-zu (rice vinegar : sugar : salt, roughly 3:2:1 or 4:2:1). Plain steamed rice belongs to
     *zuke-don*, not to a spicy tuna preparation.
  4. **Near-duplicate risk:** once Poke Bowl is de-mainlandized, this recipe and the old poke are the
     same idea (tuna + rice + avocado + cucumber + soy + sesame oil). Fixing both as proposed
     separates them cleanly; leaving both as-is leaves two near-identical entries.
- **Proposed fix** (keep the name, correct the dish, relabel `American`):
  - Ingredients: **add** `Mayonnaise` 15g (already in registry). Keep tuna 160g, rice 50g, avocado
    50g, cucumber 50g, soy sauce 10g, sesame oil 5g.
  - Spices: **replace** `Chili Flakes` with `Shichimi Togarashi` 1g (NEW spice-override entry;
    zero-macro, so no registry row needed). Add `Rice Vinegar` 5g as a spice override for the rice.
    Keep `Salt`.
  - Steps: step 1 → "Cook white rice, then fold in rice vinegar with a pinch of sugar and salt while
    warm and let it cool to room temperature." step 3 → "Mix the tuna with mayonnaise, soy sauce,
    sesame oil and shichimi togarashi."
  - *Alternative (keeps `Japanese`):* rename **`Maguro Zuke Don`** — marinate the tuna in soy sauce +
    mirin + sake, serve over plain hot rice with green onion and nori, drop avocado, cucumber, sesame
    oil and chili. Fully authentic, but a bigger rewrite and needs `Mirin`/`Sake`/`Nori`.
- **New ingredients required:** none for the recommended route (`Shichimi Togarashi` and
  `Rice Vinegar` are zero-macro spice-override entries, not registry rows). The alternative route
  needs `Mirin`, `Sake`, `Nori` — all **NOT in registry**.
- **Ingredients no longer used:** none.
- **Macro impact:** mayonnaise 15g ≈ +100 kcal and +11g fat. Materially fattier; the `low-fat`-style
  positioning of this bowl goes away, the `high-protein` tag is unaffected.
- **Confidence:** high on the diagnosis, medium on which route the owner wants.
- **Sources:** Wikipedia — *Spicy tuna roll*; Tasting Table — *The True Origin of Spicy Tuna Nigiri*;
  RecipeTin Japan / Sudachi — *Maguro no Zuke-don*; Kaz Sushi Bistro & Suzumo Kikou on sushi-zu
  ratios.

---

### Salmon Teriyaki Bento
- **Verdict:** `minor-drift` (with a genuine name↔dish mismatch)
- **Cuisine label:** `correct` — bento and glazed salmon are both squarely Japanese.
- **Findings:**
  1. **Miso in the glaze makes this misoyaki, not teriyaki.** Miso-glazed salmon is its own real
     Japanese preparation (*misoyaki* / *saikyo yaki* when made with sweet Kyoto white miso, marinated
     with mirin, sake and sugar). Teriyaki is soy + sake + mirin + sugar with **no miso**. The recipe
     names one dish and cooks another.
  2. **Same missing staples as the bowl:** no mirin, no sake; honey substituted for sugar.
  3. **Bento composition is missing its pickle.** The conventional bento ratio is 4:3:2:1 —
     rice : protein : vegetable : *tsukemono* (pickle). This box has rice, protein and two vegetables
     and no pickle at all. The rice:protein ratio is also inverted (47g dry rice ≈ 120g cooked vs
     150g salmon), but that is the app's macro solver at work and I would leave it.
  4. **Broccoli is fine — do not "fix" it.** It is not historically Japanese, but it is a genuine
     staple of contemporary Japanese home bento (colour, holds up cold). Same for edamame. No finding.
- **Proposed fix** — pick one, both authentic:
  - **(a) Keep the name "Teriyaki":** **remove** `Miso Paste` 10g and `Honey` 10g; **add** `Mirin` 15g
    and `Sake` 10g; keep `Soy Sauce` 10g. Step 3 → "Whisk soy sauce, mirin and sake for the teriyaki
    tare. Pan-sear the salmon 4 minutes per side, then pour in the tare and reduce it to a glaze."
  - **(b) Keep the miso:** rename to **`Salmon Misoyaki Bento`**, keep `Miso Paste` 10g, **remove**
    `Honey`, **add** `Mirin` 15g and `Sake` 10g (miso + mirin + sake + a little sugar is the real
    marinade), and marinate the fillet rather than brushing it. This is arguably the better dish and
    keeps `Miso Paste`'s recipe count healthy.
  - Either way, **add** `Cucumber` 40g as a quick *sunomono*/asazuke for the tsukemono slot, dressed
    with `Rice Vinegar` (spice override) and salt. New step: "Slice cucumber thinly, salt it, squeeze
    out the water and dress with rice vinegar; pack as the pickle."
  - Spices: `White Pepper` is not used in either preparation — drop it, keep `Salt`.
- **New ingredients required:** `Mirin`, `Sake` (**both NOT in registry**). `Rice Vinegar` as a
  zero-macro spice override. `Cucumber` already in registry.
- **Ingredients no longer used:** `Honey` (this recipe); `Miso Paste` under route (a) only.
- **Macro impact:** essentially neutral. −20 kcal (miso, route a) / −30 kcal (honey), +35 kcal
  (mirin) + ~15 kcal (sake), cucumber negligible. Protein unchanged.
- **Confidence:** high
- **Sources:** RecipeTin Japan — *Miso Marinated Salmon (Salmon Misozuke)*; Wikipedia — *Saikyoyaki*;
  Just One Cookbook — *Teriyaki Sauce*; JustBento — *Bento Basics*; Bokksu — bento composition.

---

### Veggie Sushi Wrap
- **Verdict:** `mislabeled` — closer to `not-a-real-dish` under a Japanese label
- **Cuisine label:** **Not Japanese.** *Maki* is defined by nori wrapped around vinegared rice
  ("norimaki" is literally "nori roll"). Swapping a **whole-wheat tortilla** for nori removes the
  defining component and lands the dish in California fusion — this is a *sushi burrito*
  (a 2010s San Francisco invention), not sushi. Label should be `American` if the tortilla stays.
- **Findings:**
  1. **Tortilla instead of nori.** Not a regional variation; there is no Japanese tradition of
     wrapping sushi rice in wheat flatbread.
  2. **Phantom ingredient:** step 1 seasons the rice with **rice vinegar**, which appears nowhere in
     the ingredient list. This one is easy and should be fixed regardless of route — the seasoning is
     what makes rice *shari* (sushi-zu = rice vinegar + sugar + salt, ~3:2:1 or 4:2:1). Rice vinegar
     is zero-macro and can live in `RECIPE_SPICE_OVERRIDES` without a registry row.
  3. **Serving size contradicts the steps:** `servingSize` says "8 pieces" but the final step says
     "Roll tightly into a wrap. Slice in half" — i.e. 2 pieces. One of the two is wrong.
  4. **Fillings:** avocado is Californian, not Japanese. Traditional vegetarian maki fillings are
     *kappa* (cucumber), *kanpyo* (simmered gourd), *takuan* / *shinko* (pickled daikon), shiitake,
     and *tamago*. Cucumber and carrot are fine; avocado is the fusion tell.
- **Proposed fix** — two routes:
  - **(a) Make it real sushi (recommended if the owner wants a Japanese entry):** **remove**
    `Whole Wheat Tortilla` 35g and `Avocado` 50g; **add** `Nori` 3g (NEW registry entry, ~2 sheets)
    and `Egg` 50g (rolled thin as *tamago* — keeps the `vegetarian` tag valid for lacto-ovo and
    rescues the protein). Keep `White Rice` 60g, `Cucumber` 60g, `Carrot` 40g, `Soy Sauce` 10g.
    Rename **`Vegetable Maki`** or `Kappa & Tamago Maki`. Add `Rice Vinegar` as a spice override.
    Steps: season the rice with rice vinegar, sugar and salt while warm; cook a thin egg sheet and
    slice into strips; lay nori on a mat, spread rice, line up cucumber, carrot and egg; roll and cut
    into 8 pieces (which then matches the stated serving size).
  - **(b) Keep the tortilla, tell the truth:** rename **`Veggie Sushi Burrito`**, cuisine →
    `American`, add `Rice Vinegar` to the spices, and fix `servingSize` to "1 wrap".
- **New ingredients required:** `Nori` (**NOT in registry**) for route (a). `Rice Vinegar` as a
  spice override for both routes.
- **Ingredients no longer used:** route (a) — `Whole Wheat Tortilla` (still used by 10 other
  recipes, so no orphan) and `Avocado`. Route (b) — none.
- **Macro impact:** route (a) drops the tortilla (~100 kcal, ~4g protein) and avocado (~80 kcal, 8g
  fat) and adds egg (~70 kcal, 6g protein): net roughly −110 kcal with a large fat drop. This already
  low-calorie vegetarian entry gets lighter still, which may make it harder for the solver to place —
  worth watching in the validator run. Route (b) is macro-neutral.
- **Confidence:** high
- **Sources:** All About Sushi Guide and Smart Sushi Chef on traditional vegetarian maki fillings;
  Food in Japan — *Kappa Maki*; alldayieat — *Makizushi Guide*; Kaz Sushi Bistro / Suzumo Kikou on
  sushi-zu.

---

### Chicken Stir Fry
- **Verdict:** `mislabeled`
- **Cuisine label:** **Not Japanese as built.** Stir-frying is Chinese in origin; Japan adopted it as
  *yasai itame*, which is a real Japanese home dish — but yasai itame is cabbage, onion, bean sprouts
  and carrot with a little pork or seafood, seasoned with salt, pepper and a splash of soy. Broccoli +
  green beans + edamame + brown rice + sesame oil is the American-Chinese takeout / health-bowl
  vegetable set, not the Japanese one. Label should be `Chinese` as written — or keep `Japanese` and
  rebuild it as yasai itame (fix (b) below). The generic name "Chicken Stir Fry" is itself a tell:
  it names a technique, not a dish.
- **Findings:**
  1. **Mislabeled** (above).
  2. **Vegetable set belongs to no Japanese dish.** Broccoli, green beans and edamame together in a
     wok is a Western composition.
  3. **Brown rice** is not served with either Japanese or Chinese stir-fries; it is a Western
     health-food substitution. (Keep it if the owner values the fibre — but then the label really is
     `American`.)
  4. **Technique:** stir-frying *in* sesame oil. Toasted sesame oil is a finishing oil in both
     Chinese and Japanese cooking — you cook in a neutral oil and add sesame oil off the heat.
     (Caveat: light, untoasted sesame oil *is* a frying medium in Tokyo-style tempura, so this is not
     absurd — but for a wok stir-fry it is backwards.) Same issue in Turkey Stir Fry below.
  5. Steps and ingredients agree — no phantom or unused ingredients.
- **Proposed fix** — pick one:
  - **(a) Honest relabel (cheapest):** cuisine `Japanese` → `Chinese`, optionally rename
    "Chicken and Vegetable Stir Fry". Change the oil handling: cook in a neutral oil (the registry's
    `Olive Oil` is the only neutral-ish option and is fine here) and finish with the 5g sesame oil off
    the heat. Add `Garlic` 5g and `Ginger` 5g (registry) — a stir-fry without aromatics is the other
    thing marking this as generic.
  - **(b) Make it Japanese:** rebuild as *toriniku yasai itame* — **remove** `Broccoli` 100g,
    `Green Beans` 50g, `Edamame` 40g; **add** `Cabbage` 120g (registry), `Onion` 50g (registry),
    keep `Carrot` 50g, and swap `Brown Rice` → `White Rice`. Season with salt, white pepper and soy
    at the end. Bean sprouts (NEW ingredient) would complete it but are optional.
  - Spices under either route: keep `Salt`; `White Pepper` is correct for both Chinese and yasai
    itame, so it stays.
- **New ingredients required:** none for (a). `Bean Sprouts` optional for (b) (**NOT in registry**).
- **Ingredients no longer used:** none for (a). Route (b) drops `Broccoli`, `Green Beans`, `Edamame`
  and `Brown Rice` from this recipe (all heavily used elsewhere — no orphans).
- **Macro impact:** (a) negligible (aromatics only, plus the cooking oil already implied by the
  steps). (b) fibre down and calories down slightly (cabbage/onion are lighter than broccoli + green
  beans + edamame), protein down ~4g with the edamame gone.
- **Confidence:** high on the label, medium on the technique sub-finding (sesame oil).
- **Sources:** Japanese Cooking 101 — *Yasai Itame*; Sudachi — *Niku Yasai Itame*; marcwiner.com —
  *Yasai Itame* (on the Chinese origin of the technique and its Japanese adoption).

---

### Asian Noodle Soup
- **Verdict:** `mislabeled` (and borderline `not-a-real-dish` — it corresponds to no tradition as
  written)
- **Cuisine label:** **Wrong, and the name gives it away: "Asian" is not a cuisine.** The build is a
  hybrid that exists nowhere: rice noodles in a soy-seasoned chicken broth with a soft-boiled egg.
  The soft egg + soy broth + green onion is the **ramen** idiom, but ramen is a wheat-and-kansui
  noodle, never rice. Rice noodles in chicken broth is the **Vietnamese pho ga** idiom, but pho has
  no egg and no soy sauce, and its identity is charred onion and ginger with star anise, cinnamon and
  coriander seed. Japan's noodle soups are ramen (wheat), udon (wheat), soba (buckwheat) and somen
  (wheat) — none of them is this.
- **Findings:**
  1. **Mislabeled / non-dish** (above).
  2. **Phantom ingredient in the steps:** "Add 3 cups water or **dashi broth**" — dashi is in no
     ingredient list, and dashi (kombu/katsuobushi) is not in the registry. Either add it or drop the
     mention.
  3. **The broth has no aromatics at all** — water + soy sauce is not a broth in any of the three
     candidate traditions.
  4. **Soy sauce with rice noodles** is the seasoning mismatch at the heart of the confusion:
     rice-noodle soups across SE Asia are seasoned with fish sauce and salt, not soy.
- **Proposed fix** — the cheap fix is also the authentic one, because the noodle is already right:
  - **Rebuild as Vietnamese `Pho Ga`.** Cuisine → `Vietnamese` (label already exists in the app).
    Keep `Rice Noodles` 45g, `Chicken Breast` (raise 100 → 140g), `Green Onion` 10g. **Remove**
    `Egg` 50g and `Soy Sauce` 15g. **Add** `Onion` 40g and `Ginger` 10g (both registry — charred),
    `Cilantro` 8g and `Lime` 15g (both registry, served at the table). Keep `Spinach` or drop it (pho
    uses bean sprouts and herbs; spinach is a reasonable registry-bound stand-in — say so in the
    step rather than pretending it's traditional).
    Spices: **add** `Star Anise`, `Cinnamon` (already a known spice name), `Coriander Powder`
    (already used elsewhere) and `Fish Sauce` — all as zero/near-zero-macro spice overrides. Keep
    `Salt`; drop `White Pepper`.
    Steps: char the onion and ginger, simmer with the whole spices to build the broth, poach and
    slice the chicken, soften the noodles, ladle over, finish with green onion, cilantro and lime.
  - *Alternative (keeps `Japanese`):* build a real shoyu chicken ramen — but that needs a wheat ramen
    or udon noodle in the registry plus dashi, and the current `Rice Noodles` would have to go. More
    work for the same outcome.
- **New ingredients required:** none in the registry for the pho route. `Fish Sauce` and `Star Anise`
  as spice-override entries (**neither currently in the spice list**). The ramen alternative would
  need `Ramen Noodles`/`Udon` and `Dashi` — both **NOT in registry**.
- **Ingredients no longer used:** `Egg` and `Soy Sauce` in this recipe (both used widely elsewhere).
- **Macro impact:** losing the egg costs ~70 kcal and ~6g protein; raising chicken 100→140g more than
  restores the protein and adds ~50 kcal. Net roughly neutral, slightly leaner.
- **Confidence:** high that it is mislabeled; medium on which rebuild the owner prefers.
- **Sources:** Institute of Culinary Education — *Types of Japanese Noodles*; Wikipedia — *Ramen*;
  byFood — *Japanese Noodles Guide*; The Kitchn — *Soba, Udon, and Rice Noodles*.

---

### Turkey Stir Fry with Rice
- **Verdict:** `mislabeled`
- **Cuisine label:** **Not Japanese.** Turkey is essentially absent from Japanese cooking (and from
  Chinese) — it is a North American and European meat. Combined with a technique that is Chinese in
  origin and a garlic-ginger-soy-sesame seasoning that reads as generic American-Chinese, the honest
  label is `American`. If the owner would rather keep an Asian label, the protein has to change.
- **Findings:**
  1. **Mislabeled** (above), and the protein is the reason — this is not fixable by adjusting
     seasonings.
  2. **Generic name.** "Turkey Stir Fry with Rice" names a technique and a side, not a dish.
  3. **Technique:** same as Chicken Stir Fry — the wok is heated with sesame oil, which is a
     finishing oil, not a frying oil, in the traditions this borrows from. (Medium confidence; see
     the tempura caveat above.) The aromatics here *are* handled correctly — garlic and ginger 30
     seconds first — which is a point in its favour.
  4. **Bell pepper + broccoli** is again the Western stir-fry vegetable set rather than a Chinese or
     Japanese one.
  5. Steps and ingredients agree — no phantom or unused ingredients.
- **Proposed fix** — pick one:
  - **(a) Relabel, keep everything (recommended):** cuisine `Japanese` → `American`, rename
    "Turkey and Vegetable Stir Fry". Change the oil handling only: sear in a neutral oil over high
    heat, add the 3g sesame oil off the heat at the end. No ingredient changes. This keeps
    `Turkey Breast`'s recipe count at 5 (it is referenced by exactly 5 recipes today — swapping the
    protein out would drop it to 4, under the CLAUDE.md guideline).
  - **(b) Keep an Asian label:** swap `Turkey Breast` 170g → `Chicken Thigh` 170g or `Pork Loin`
    170g, swap `Broccoli` → `Cabbage` 120g, label `Chinese` (or rebuild as yasai itame and keep
    `Japanese`). Not recommended — it makes this a duplicate of the Chicken Stir Fry fix and costs a
    Turkey Breast reference.
- **New ingredients required:** none.
- **Ingredients no longer used:** none under (a).
- **Macro impact:** none under (a). Under (b), chicken thigh or pork loin raises fat by ~5–8g.
- **Confidence:** high on the label, medium on the sesame-oil technique note.
- **Sources:** Japanese Cooking 101 / Sudachi on *yasai itame* composition; marcwiner.com on the
  Chinese origin of stir-frying and its Japanese adoption.

---

## Summary

**Counts by verdict**
- `mislabeled` — **6** (Poke Bowl, Spicy Tuna Bowl, Veggie Sushi Wrap, Chicken Stir Fry,
  Asian Noodle Soup, Turkey Stir Fry with Rice)
- `minor-drift` — 2 (Teriyaki Salmon Bowl, Salmon Teriyaki Bento)
- `authentic` — 0
- `significantly-off` — 0 as a primary verdict (Poke Bowl also qualifies on construction)
- `not-a-real-dish` — 0 as a primary verdict (Asian Noodle Soup is borderline)

Only **2 of 8** carry a defensible `Japanese` label, and both of those have the same fixable flaw:
no mirin, no sake, sweetened with honey. Six are filed under `Japanese` because they contain soy
sauce.

**The 3 worst offenders**
1. **Poke Bowl** — Hawaiian dish labelled Japanese, then built almost entirely from mainland
   poke-shop toppings: mango, avocado, edamame, cucumber, a second fish, and a miso marinade that no
   poke style uses. The mango here is the exact analogue of the mango-in-ceviche finding.
2. **Asian Noodle Soup** — "Asian" is not a cuisine, and the dish matches none: rice noodles say
   Vietnamese, the soft egg and soy broth say ramen, and ramen is never made with rice noodles. The
   steps also invoke a dashi that exists in no ingredient list.
3. **Veggie Sushi Wrap** — calls itself sushi while replacing nori, sushi's defining wrapper, with a
   whole-wheat tortilla; seasons the rice with a rice vinegar that is in no ingredient list; and
   claims 8 pieces from a wrap the steps cut in half.

**Consolidated new ingredients required**
*Registry rows (not currently in registry.md):*
- `Mirin` — required by both teriyaki fixes. The single most valuable addition in this slice.
- `Sake` — same two recipes (and the zuke-don alternative). Recommended, not strictly required.
- `Nori` — required only for the authentic Veggie Sushi Wrap route (a).
- `Ogo Seaweed` (limu) — optional, poke only.
- `Bean Sprouts` — optional, yasai itame route only.
- *(Ramen/Udon noodles and Dashi would be needed only for the ramen alternative to Asian Noodle Soup,
  which is not the recommended route.)*

*Spice-override entries only (zero/near-zero macro, no registry row needed):*
- `Rice Vinegar` — needed by Veggie Sushi Wrap (fixes a phantom ingredient), Spicy Tuna Bowl, and the
  bento's sunomono.
- `Shichimi Togarashi` — Spicy Tuna Bowl.
- `Fish Sauce`, `Star Anise` — pho route for Asian Noodle Soup.

*Structural gap worth noting:* the registry has no plain **sugar** — only `Honey` and `Maple Syrup`.
Teriyaki tare and sushi-zu both call for sugar. Mirin covers it for teriyaki; the ~2g in sushi-zu is
small enough to ride along in the spice overrides.

**Consolidated ingredients this slice would stop using**
(Per recipe — none of these become app-wide orphans; current app-wide recipe counts in brackets.)
- `Honey` — Teriyaki Salmon Bowl, Salmon Teriyaki Bento [7 → 5]
- `Miso Paste` — Poke Bowl always, Salmon Teriyaki Bento under route (a) [6 → 4 or 5]
- `Mango` — Poke Bowl [3 → 2] ⚠ falls well under the ≥5-recipes guideline
- `Avocado` — Poke Bowl, Veggie Sushi Wrap route (a)
- `Edamame` — Poke Bowl [6 → 5], plus Chicken Stir Fry under the yasai itame route
- `Cucumber` — Poke Bowl (but re-added to Salmon Teriyaki Bento as sunomono, so net neutral)
- `Salmon Fillet` — Poke Bowl
- `Whole Wheat Tortilla` — Veggie Sushi Wrap route (a) [11 → 10]
- `Egg`, `Soy Sauce` — Asian Noodle Soup under the pho route
- `Broccoli`, `Green Beans`, `Brown Rice` — Chicken Stir Fry under the yasai itame route (b) only

⚠ **Data-hygiene flag:** `Mango` (3 references) and `Miso Paste` (6) are the two ingredients these
fixes push under the ≥5-recipes-per-ingredient guideline in CLAUDE.md. Choosing route (b) for the
bento (rename to *Salmon Misoyaki Bento*, keep the miso) protects `Miso Paste`. `Mango` would need a
new recipe elsewhere, or acceptance of a 2-recipe ingredient.

**Cross-cutting note for the owner:** relabelling 6 recipes moves them out of `Japanese` and into
`Hawaiian` (new), `American`, `Chinese` and `Vietnamese`. Because generation caps each cuisine at
2/week, this genuinely changes plan diversity — it shrinks the Japanese pool from 16 to 10 while
growing the currently-thin `Chinese` (2) and `Vietnamese` (3) pools. That is a real improvement to
weekly variety, but it is a generation-behaviour change, not just a cosmetic one, and it should be
followed by `node tests/run.js validator` and `simulator`.
