# Cuisine authenticity audit — Korean (7 recipes)

Mode: **traditional** (the specifics ARE the dish)
Auditor note: hard constraints respected — no nuts proposed anywhere (pine nuts are a traditional
garnish on several of these dishes and are deliberately omitted), no olives, no file edits made.

## Cross-cutting issues (apply to several recipes — read once)

These recur, so each recipe block references them rather than repeating the reasoning.

**X1 — "a pinch of sugar" is a phantom ingredient.** Japchae, Bulgogi Rice Bowl and Beef Bulgogi Noodle
Bowl all name sugar in their cooking steps, but sugar is in neither the ingredient list nor
`RECIPE_SPICE_OVERRIDES`. This violates the app's own "no phantom ingredients" rule. It also matters for
authenticity: sugar is not optional in a bulgogi marinade or a japchae dressing — Korean Bapsang's
bulgogi uses 4 Tbsp sugar (or 2 Tbsp sugar + 2 Tbsp honey) and its japchae uses 3 Tbsp. Two ways to fix,
pick one and apply consistently: (a) add `Honey` from the registry at 5–8 g per recipe, or (b) add
`Sugar` as a new `RECIPE_SPICE_OVERRIDES` name. Honey is the better choice here — it is already in the
registry, Korean Bapsang explicitly sanctions honey as half the sweetener in bulgogi, and it carries real
macros the solver should see rather than hiding ~25 cal of sugar in a spice row.

**X2 — `Garlic Powder` where Korean cooking uses minced fresh garlic.** Five of the seven recipes carry
`Garlic Powder` in their spice overrides. Fresh minced garlic is close to a defining seasoning in Korean
cooking — every source consulted specifies it by the tablespoon (Korean Bapsang bulgogi: 2 Tbsp minced
garlic; japchae: 2 tsp; doenjang jjigae: 2 tsp; dakgalbi: 1 Tbsp). `Garlic` is already in the registry
and Korean Chicken Wings and Beef Bulgogi Noodle Bowl already use it correctly at 8 g. Recommendation:
in Japchae, Bulgogi Rice Bowl, Dakgalbi and Doenjang Jjigae, drop `Garlic Powder` from spice overrides
and add `{name:"Garlic", grams:6}` to the ingredient list, naming it in the marinade/sauce step.

**X3 — spices listed but never named in the steps.** `Garlic Powder` appears in the overrides of Japchae,
Bulgogi Rice Bowl, Dakgalbi, Doenjang Jjigae and Beef Bulgogi Noodle Bowl but is named in none of their
steps. The project convention says steps must name specific spices. X2 resolves this for four of them.

**X4 — banchan and serving context.** Four of these dishes (bulgogi, dakgalbi, doenjang jjigae, yangnyeom
chicken) are traditionally table dishes eaten with rice plus several banchan and often ssam (lettuce/
perilla wraps), not single composed bowls. This is a structural constraint of the app, not a recipe
defect, and I have not scored it against any recipe. Where the current recipe already puts kimchi "on
the side" it is doing the right thing in miniature. Noted once here per the brief's instruction.

**X5 — sesame seeds.** Toasted sesame seeds finish japchae, bulgogi and dakgalbi in every source
consulted. At 1–2 g the macros are negligible (~6–12 cal). They could be added as a
`RECIPE_SPICE_OVERRIDES` name (`Sesame Seeds`) rather than a registry entry. Low priority, listed as
optional in each block, not counted as a finding.

---

### Kimchi Fried Rice
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — kimchi bokkeumbap is Korean home cooking, and the pork-belly-plus-fried-egg
  form is the canonical one.
- **Findings:**
  1. **Sesame oil used as the frying fat.** The step heats sesame oil in the wok and cooks the pork in it.
     In Korean practice sesame oil is a *finishing* oil, stirred in off the heat — Korean Bapsang's method
     is explicit that you "mix in the sesame oil … at the end", and Maangchi's likewise finishes with it.
     Toasted sesame oil has a low smoke point and goes bitter over a high-heat wok stir-fry, which is the
     technique reason behind the rule. Pork belly renders plenty of its own fat, so this recipe does not
     even need a separate cooking oil.
  2. **No gochujang.** Kimchi alone carries heat but not the fermented sweetness that balances it.
     Korean Bapsang and No Recipes both build the sauce as kimchi + kimchi juice + gochujang (+ a little
     soy). The recipe has gochugaru only, which adds raw chili heat where the dish wants the paste's depth.
  3. **Kimchi juice never mentioned.** The brine is not a garnish, it is the seasoning liquid that colours
     and flavours the rice. This costs nothing to fix — `Kimchi` is already an ingredient, the step just
     has to stop implying you drain it.
  4. Minor: the step says "add cooked rice" without specifying cold day-old rice, which is the whole point
     of the dish (it is a leftovers dish). Wording only.
  5. Not a finding, but noted: gim (toasted seaweed) strips are the usual garnish and are not in the
     registry. Green onion alone is acceptable.
- **Proposed fix:**
  - Ingredients: no change.
  - Spices: add `{name:"Gochujang", grams:5}`. Keep `Gochugaru` at 1 g (both belong — gochugaru in the
    fry, gochujang in the sauce). Keep Salt and Black Pepper.
  - Steps: rewrite 2, 3, 4 and 6 as —
    "Dice the pork belly into small pieces." /
    "Render the pork belly in a dry hot wok until browned and crisp, about 4 minutes — it releases enough
    fat to fry in." /
    "Add the chopped kimchi with its juice, the gochujang and a pinch of gochugaru. Stir-fry 2 minutes
    until the kimchi softens and deepens in colour." /
    "Add cold day-old rice and toss over high heat, breaking up any clumps." /
    (fried egg step unchanged) /
    "Off the heat, stir through the sesame oil. Plate topped with the fried egg and sliced green onion."
- **New ingredients required:** `none` (Gochujang is an existing `RECIPE_SPICE_OVERRIDES` name).
- **Ingredients no longer used:** `none`.
- **Macro impact:** negligible. 5 g gochujang ≈ 10 cal. Sesame oil stays in the recipe, only its moment
  of use changes.
- **Confidence:** high
- **Sources:** Korean Bapsang (koreanbapsang.com/kimchi-fried-rice-kimchi-bokkeum-bap/); Maangchi
  (maangchi.com/recipe/kimchi-bokkeumbap); No Recipes (norecipes.com/kimchi-fried-rice/).

---

### Japchae
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`
- **Findings:** Nothing present is wrong — the noodle is right (dangmyeon = sweet potato starch, correctly
  mapped to `Sweet Potato Noodles`), the beef is right, and critically the *method* is largely right: the
  steps do blanch and season the spinach on its own and cook the beef separately, which is the thing that
  makes japchae japchae. The gaps are omissions.
  1. **No mushroom.** Shiitake (and/or wood ear) is a defining component, not a garnish — Korean Bapsang
     lists 3–4 oz fresh shiitake and cooks them with the beef; My Korean Kitchen and Maangchi both include
     them. The registry has **no mushroom of any kind**, so this needs a new ingredient.
  2. **No onion.** Standard in every version consulted (Korean Bapsang: 1/2 medium onion). `Onion` is in
     the registry.
  3. **No scallion.** Korean Bapsang lists 2. `Green Onion` is in the registry.
  4. **Vegetables are stir-fried as one batch.** Step 5 says "stir-fry vegetables for 2-3 minutes" —
     collectively. The tradition is emphatic that each vegetable is cooked *alone* so each keeps its own
     colour and bite; Korean Bapsang calls this "the traditional method [that] makes this dish so special".
     Step reword, no ingredient cost.
  5. **Noodles are not seasoned before the final toss.** In the standard method the hot drained noodles are
     marinated in the soy/sugar/sesame sauce first so they absorb it; here they meet the sauce only at the
     end and stay bland.
  6. See **X1** (phantom sugar — and japchae genuinely needs the sweetener) and **X2** (garlic powder).
  7. Bell pepper: **not a finding.** It is absent from the oldest versions but is standard in modern
     japchae, including My Korean Kitchen's. Legitimate variation — leave it.
- **Proposed fix:**
  - Ingredients: add `{name:"Shiitake Mushroom", grams:30}`, `{name:"Onion", grams:40}`,
    `{name:"Green Onion", grams:10}`, `{name:"Garlic", grams:5}`, `{name:"Honey", grams:5}`.
  - Spices: drop `Garlic Powder`; keep Salt and Black Pepper. Optionally add `Sesame Seeds` (X5).
  - Steps: after the soak/boil step, add "Toss the hot drained noodles with half the soy sauce, the honey
    and half the sesame oil so they absorb the seasoning while warm." Replace the marinade mention of
    "a pinch of sugar" with "honey". Split step 5 into "Stir-fry the beef with the sliced shiitake for
    2–3 minutes; remove. Then stir-fry the onion, the carrot and the bell pepper *one at a time*, a
    minute each with a pinch of salt, removing each to the bowl before the next." Add minced garlic to
    the beef marinade step, and scatter the sliced green onion into the final toss.
- **New ingredients required:** `Shiitake Mushroom` — **NOT in registry.** (No mushroom exists in the
  registry at all; adding one would serve well beyond this recipe.) All others already in registry.
- **Ingredients no longer used:** `none`.
- **Macro impact:** small. Shiitake 30 g ≈ 10 cal, onion 40 g ≈ 16 cal, green onion 10 g ≈ 3 cal,
  garlic 5 g ≈ 7 cal, honey 5 g ≈ 15 cal. Roughly +50 cal, almost all carb, no meaningful protein change.
- **Confidence:** high
- **Sources:** Korean Bapsang (koreanbapsang.com/japchae-korean-stir-fried-starch/); My Korean Kitchen
  (mykoreankitchen.com/korean-glass-noodle-stir-fry-japchae/); Maangchi (maangchi.com/recipe/japchae).

---

### Bulgogi Rice Bowl
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`
- **Findings:** The beef handling is right (sirloin, sliced thin, marinated, cooked to caramelisation —
  Korean Bapsang names sirloin as a good cut). The marinade is what is incomplete, and the marinade is the
  dish.
  1. **No pear.** This is the headline. Korean/Asian pear grated into the marinade is the single
     most-cited defining element of bulgogi: it supplies the characteristic sweetness *and* the enzymatic
     tenderising that gives bulgogi its texture. Korean Bapsang's list opens with "1/2 Korean/Asian pear,
     blended/grated or bosc pear or apple"; Maangchi treats blending pear and onion as what separates
     traditional bulgogi from her deliberately-labelled *easy* shortcut version. Without it, what remains
     — soy sauce + sesame oil + ginger + sugar — reads as a generic East Asian teriyaki-style marinade.
     Bosc pear or apple are sanctioned substitutes; neither is in the registry either.
  2. **No garlic in the marinade.** Korean Bapsang uses 2 Tbsp minced garlic. `Garlic Powder` sits in the
     spice overrides but is never named in any step (see X2, X3).
  3. **No onion.** Standard, sliced thin and cooked with the meat (Korean Bapsang: 1 small onion). Also the
     second half of Maangchi's blended pear-and-onion base.
  4. **No scallion in the marinade.** `Green Onion` is present at 15 g but the steps use it only as a
     garnish; it belongs in the marinade too.
  5. See **X1** — "a pinch of sugar" is a phantom, and sugar is not optional in bulgogi.
  6. Ginger: **not a finding.** Korean Bapsang omits it but many bulgogi recipes include it. Legitimate.
  7. Sweet potato noodles at 19 g: **not a finding, but odd.** Dangmyeon in bulgogi is real — it belongs
     to Seoul-style bulgogi, where the meat cooks in a broth in the pan and the noodles soak it up. Korean
     Bapsang lists potato starch noodles only in that Seoul-style variation. Here they are dropped into a
     dry rice bowl with no broth and no explanation, so they read as macro filler. If they stay, the step
     should say so ("Seoul-style, with dangmyeon simmered in the pan juices"). Low priority.
  8. Kimchi on the side is correct (X4).
- **Proposed fix:**
  - Ingredients: add `{name:"Asian Pear", grams:40}`, `{name:"Garlic", grams:6}`, `{name:"Onion", grams:40}`,
    `{name:"Honey", grams:6}`.
  - Spices: drop `Garlic Powder`; keep Salt and Black Pepper.
  - Steps: rewrite step 2's marinade as "Slice the beef sirloin thinly and marinate 10 minutes in soy
    sauce, grated Asian pear, minced garlic, grated ginger, honey, sesame oil, black pepper and half the
    sliced green onion." Add the sliced onion to step 4 ("Cook the marinated beef with the sliced onion in
    a hot skillet for 3-4 minutes until caramelised"). Reserve the remaining green onion for the garnish
    in step 5. Optionally add sesame seeds (X5).
- **New ingredients required:** `Asian Pear` — **NOT in registry.** (Also serves Beef Bulgogi Noodle Bowl.)
  Garlic, Onion, Honey are all already in registry.
- **Ingredients no longer used:** `none`.
- **Macro impact:** modest carb increase. Asian pear 40 g ≈ 24 cal, onion 40 g ≈ 16 cal, honey 6 g ≈ 18 cal,
  garlic 6 g ≈ 9 cal. Roughly +65 cal, essentially all carb. Protein unchanged — this stays a
  `high-protein` recipe. The solver may want a small reduction in `White Rice` to compensate.
- **Confidence:** high
- **Sources:** Korean Bapsang (koreanbapsang.com/bulgogi-korean-bbq-beef/); Maangchi
  (maangchi.com/recipe/bulgogi and /easy-bulgogi); Smithsonian Folklife
  (folklife.si.edu/magazine/authentic-korean-bulgogi-recipe).

---

### Korean Chicken Wings
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` as a country label — yangnyeom chicken is genuinely Korean (the modern form
  dates to the 1970s). But the *sauce as written* is American barbecue, so the dish currently sits closer
  to American-Chinese takeout sweet-glazed chicken than to anything Korean.
- **Findings:**
  1. **The name does not match the ingredients.** It is called "Chicken Wings" and contains 200 g of
     `Chicken Breast`. The steps never mention wings. A reader picking this by name gets something else.
     There is no wing entry in the registry.
  2. **`BBQ Sauce` is standing in for gochujang.** This is the core problem. Yangnyeom sauce is gochujang
     + ketchup/tomato + a syrup (rice syrup, corn syrup or honey) + soy + garlic + vinegar + sesame oil.
     Maangchi, Korean Bapsang and Chef Chris Cho all build it that way; the gochujang-plus-tomato pairing
     is precisely what produces the flavour. American BBQ sauce is smoke, molasses and often mustard — a
     different sauce from a different tradition, doing the job under a Korean name.
  3. **Gochujang vs gochugaru in the wrong roles.** The recipe puts gochugaru on the chicken as a dry rub
     and leaves the sauce with no chili at all. In yangnyeom chicken the heat and the fermented depth
     live in the *sauce*, via gochujang. Gochugaru in a rub is not wrong in itself, but it cannot
     substitute for the missing paste.
  4. **Baked, not double-fried.** Yangnyeom chicken is defined by a double-fry that drives moisture out of
     a starch coating so the crust survives being sauced. I am **not scoring this as a defect** — this is
     a macro-managed meal-prep app and oven-roasting is the honest, sane adaptation. But the recipe should
     not pretend otherwise; the step saying "until crispy" is overselling a bare baked breast.
  5. Serving over rice: yangnyeom chicken is anju (food eaten with beer), served with pickled radish
     (chicken-mu), not plated over rice. The rice-bowl form exists in Korean-American restaurants, so this
     is defensible for the app's format (X4). Low severity.
  6. Garlic 8 g and its use in the glaze: correct, well done.
- **Proposed fix:** two parts.
  - **Rename.** Either (a) rename to **"Yangnyeom Chicken Bowl"** and keep chicken breast — this is honest,
    matches the steps, and matches the rice-bowl serving; or (b) keep a wing-adjacent name and swap to
    `Chicken Thigh`, which is far closer to wings in fat and texture. **(a) is recommended** — it keeps the
    protein macros the recipe was clearly built around.
  - Ingredients: **remove `BBQ Sauce` 15 g.** Add `{name:"Tomato Sauce", grams:15}` as the ketchup
    component (in registry). Keep `Honey` 15 g — it is already the correct syrup element. Keep Soy Sauce,
    Garlic, Sesame Oil.
  - Spices: add `{name:"Gochujang", grams:12}`. Reduce `Gochugaru` from 2 g to 1 g (rub only). Add
    `{name:"Red Wine Vinegar", grams:2}` or a rice-vinegar equivalent for the sauce's acid — `Red Wine
    Vinegar` is an existing spice-override name; a `Rice Vinegar` name would be more correct but is new.
    Keep Garlic Powder out (X2) since fresh Garlic is already in the list.
  - Steps: rewrite 2, 4 and 6 —
    "Pat the chicken dry and season with a little gochugaru, salt and pepper." /
    "Make the yangnyeom sauce: simmer the gochujang, tomato sauce, honey, soy sauce, minced garlic,
    vinegar and sesame oil for 2 minutes until glossy." /
    "Toss the baked chicken in the hot sauce and serve over rice." Drop the word "crispy" from step 3.
- **New ingredients required:** `none` from the registry's point of view — `Tomato Sauce` and `Honey` are
  already there, `Gochujang` is an existing spice-override name. Optional new spice name: `Rice Vinegar`.
- **Ingredients no longer used:** `BBQ Sauce` **in this recipe only** — it is referenced by 4 other recipes
  in `data.js`, so it does not become a registry orphan.
- **Macro impact:** slightly lower calories. BBQ Sauce 15 g ≈ 25 cal out, Tomato Sauce 15 g ≈ 5 cal in,
  gochujang 12 g ≈ 25 cal in. Net roughly +5 cal. Protein unchanged. Effectively macro-neutral, which
  makes this the cheapest high-value fix in the set.
- **Confidence:** high
- **Sources:** Maangchi (maangchi.com/recipe/yangnyeom-tongdak); Korean Bapsang
  (koreanbapsang.com/yangnyeom-chicken-korean-fried-chicken/); Chef Chris Cho
  (chefchrischo.com/sweet-and-spicy-korean-fried-chicken/); Wikipedia, "Yangnyeom chicken".

---

### Dakgalbi
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — and specifically Chuncheon, which the recipe gets right in outline.
- **Findings:** The bones are good: chicken thigh (correct — not breast), cabbage, Korean sweet potato,
  gochujang *and* gochugaru together, stir-fried in one pan. Dangmyeon is a legitimate restaurant add-in,
  not a defect. The gaps:
  1. **No tteok (rice cakes).** Wikipedia's definition of the dish names tteok in the same breath as the
     sweet potato and cabbage, and Korean Bapsang lists 8 oz of tteokbokki tteok. The chewy rice cakes
     soaking up the sauce are part of what people order dakgalbi for. Not in the registry.
  2. **No perilla leaves (kkaennip).** Also in the dish's definition and in Korean Bapsang's list (6–8
     leaves), stirred in at the end for freshness. Beyond Kimchee marks them optional, so this is the
     softer of the two omissions. Not in the registry.
  3. **The sauce is only half-built.** Real dakgalbi sauce is gochujang + gochugaru + soy sauce + rice
     wine + sugar/syrup + minced garlic + grated ginger + sesame oil. This recipe has gochujang +
     gochugaru + garlic powder + salt. Missing: soy sauce, the sweetener, and ginger — all of which change
     the flavour materially, since without the sweetener the gochujang reads as flat and harsh.
  4. **No Chuncheon curry powder.** Both Korean Bapsang and FutureDish call out a teaspoon of Korean curry
     powder as the signature that distinguishes Chuncheon-style dakgalbi from a generic gochujang chicken
     stir-fry. Small amount, distinctive effect. `Curry Powder` is already an established spice-override
     name, so this is free.
  5. **No onion or scallion.** Both standard; both in the registry.
  6. **The rice is served the wrong way round.** Dakgalbi is not served *over* rice — the traditional
     finish is that once the chicken is eaten, cooked rice goes into the same pan with the leftover sauce
     and is fried (bokkeumbap) at the table. Korean Bapsang's recipe treats the fried-rice finish as the
     natural end of the meal. This is a step reword only; the `White Rice` 47 g stays.
  7. Kimchi on the side: fine as banchan, though not part of the dish proper (X4).
- **Proposed fix:**
  - Ingredients: add `{name:"Tteok", grams:40}`, `{name:"Onion", grams:40}`, `{name:"Green Onion", grams:15}`,
    `{name:"Garlic", grams:8}`, `{name:"Soy Sauce", grams:10}`, `{name:"Honey", grams:8}`, and optionally
    `{name:"Perilla Leaves", grams:5}`.
  - Spices: add `{name:"Curry Powder", grams:1}` and `{name:"Ginger (ground)", grams:1}`; drop
    `Garlic Powder`; keep Gochugaru 3 g, Gochujang 5 g (consider raising gochujang toward 10 g — Korean
    Bapsang's ratio is 2 Tbsp gochujang to 2 Tbsp gochugaru), keep Salt.
  - Steps: rewrite step 4 as "Mix the gochujang, gochugaru, soy sauce, honey, minced garlic, ground ginger,
    curry powder and sesame oil into a sauce. Toss the chicken in it and stir-fry until nearly cooked."
    Add onion to step 5 with the cabbage, and the tteok with the noodles. Add a step before the last:
    "Stir the perilla leaves and green onion through at the very end." Rewrite the final step as "When the
    chicken is gone, add the cooked rice to the pan and fry it in the remaining sauce. Serve with kimchi."
- **New ingredients required:** `Tteok` (Korean rice cakes) — **NOT in registry**; `Perilla Leaves` —
  **NOT in registry** (optional). Onion, Green Onion, Garlic, Soy Sauce, Honey are all already in registry.
  `Curry Powder` and `Ginger (ground)` are existing spice-override names.
- **Ingredients no longer used:** `none`.
- **Macro impact:** noticeable carb increase. Tteok 40 g ≈ 90 cal (near-pure carb), honey 8 g ≈ 24 cal,
  onion 40 g ≈ 16 cal, soy sauce 10 g ≈ 5 cal. Roughly +140 cal, overwhelmingly carb. Protein essentially
  unchanged. The solver will likely want to trim `Sweet Potato` or `White Rice` in response; if the day
  cannot absorb it, drop the tteok to 25 g rather than dropping it entirely.
- **Confidence:** high
- **Sources:** Korean Bapsang (koreanbapsang.com/dak-galbi/); Beyond Kimchee
  (beyondkimchee.com/dak-galbi/); FutureDish (futuredish.com/dakgalbi/); Wikipedia, "Dak-galbi"; CNN
  Travel, "The story behind dak-galbi".

---

### Doenjang Jjigae
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` as intent — but the recipe as written is a Japanese-Korean hybrid, because
  the paste that names the dish is Japanese.
- **Findings:**
  1. **`Miso Paste` is standing in for doenjang, and the step actively conflates them.** Step 3 reads
     "Dissolve miso paste (doenjang) in 2 cups of water" — the parenthesis asserts they are the same
     thing. They are not. Doenjang is coarser, considerably saltier and distinctly funkier, a byproduct of
     the same fermentation that yields Korean soy sauce; miso is milder, sweeter, smoother and typically
     koji-heavy. Substituting miso here is the exact Japanese-substitution-under-a-Korean-name pattern.
     This dish is *named after* the paste, so this is not a garnish-level swap — it is the dish.
  2. **No tofu.** Medium-firm tofu (dubu) is in every version consulted, at meaningful volume — Korean
     Bapsang uses 9 oz, well over a third of the solids. It is not a garnish; it is the body of the stew
     and its main non-pork protein. Not in the registry, and its absence is arguably a bigger hole than
     the paste, because at least the paste has a stand-in.
  3. **No gochugaru.** Korean Bapsang uses 1 tsp. Doenjang jjigae is not a fiery dish, but it is not a
     flat one either — the gentle chili background is expected. Existing spice-override name, free to add.
  4. **No fresh chili.** Korean Bapsang lists one green or red chili pepper, sliced in near the end. Per
     the project's own convention a zero-macro fresh chili can live in `RECIPE_SPICE_OVERRIDES` without a
     registry entry, so this is cheap.
  5. **No minced garlic, no scallion.** Both standard (see X2). `Garlic` and `Green Onion` are in registry.
  6. **No Korean radish (mu).** Korean Bapsang uses 2 oz. Not in the registry. This one has genuine
     regional variation — potato is a widespread alternative and `Potato` *is* in the registry — so I would
     treat it as optional rather than required.
  7. Pork belly: **correct.** Korean Bapsang specifies fatty pork shoulder or loin and sanctions the fatty
     cut; pork belly is a normal choice.
  8. Serving with rice and kimchi on the side: **correct.** Jjigae is a centre-of-table dish eaten with
     rice and banchan, and this is the one recipe in the set that gets its serving context right (X4).
  9. Minor: step 3 references "2 cups of water or anchovy broth" but `Water` is not in the ingredient list.
     `Water` is a registry ingredient used elsewhere in the app, so adding it at ~480 g would make the
     steps and ingredients agree at zero macro cost.
- **Proposed fix:**
  - Ingredients: **swap `Miso Paste` 25 g → `Doenjang` 25 g.** Add `{name:"Tofu", grams:100}`,
    `{name:"Garlic", grams:6}`, `{name:"Green Onion", grams:10}`, `{name:"Water", grams:480}`. Optionally
    add `{name:"Potato", grams:50}` as the in-registry stand-in for Korean radish.
  - Spices: add `{name:"Gochugaru", grams:1}` and `{name:"Green Chili", grams:10}` (zero-macro, spice
    override only); drop `Garlic Powder`; keep Salt and Black Pepper.
  - Steps: rewrite 3 to "Brown the pork belly in the pot for 3-4 minutes until crisp. Dissolve the doenjang
    in 2 cups of water or anchovy broth and pour it in." — deleting the "(doenjang)" gloss on miso, which
    is the actual error. Add "Stir in the minced garlic and gochugaru" to step 4. Add a step before
    serving: "Add the cubed tofu and sliced green chili and simmer 3 more minutes, then scatter with green
    onion. Serve bubbling hot." Keep the final rice-and-kimchi step as is — it is right.
- **New ingredients required:** `Doenjang` — **NOT in registry**; `Tofu` — **NOT in registry**. (`Green
  Chili` is a new spice-override name but needs no registry entry, only a grocery category.) Garlic,
  Green Onion, Water, Potato are already in registry.
- **Ingredients no longer used:** `Miso Paste` **in this recipe only** — it is referenced by 5 other
  recipes in `data.js` (presumably genuine Japanese ones), so it stays in the registry and does not
  become an orphan.
- **Macro impact:** **material, and in a helpful direction.** 100 g firm tofu ≈ +145 cal and **+17 g
  protein**, which turns a fairly light stew into a real protein contributor and may reduce how often the
  solver bolts a protein shake onto days containing it. Doenjang vs miso is close to macro-neutral per
  gram (doenjang is saltier, similar calories and protein), so the paste swap costs nothing. Optional
  potato adds ~40 cal of carb.
- **Confidence:** high (paste distinction and tofu: high; Korean radish as required vs optional: medium)
- **Sources:** Korean Bapsang (koreanbapsang.com/doenjang-jjigae-korean-soy-bean-paste/); Beyond Kimchee
  (beyondkimchee.com/doenjang-jjigae/); My Korean Kitchen (mykoreankitchen.com/doenjang-jjigae/);
  Wikipedia, "Doenjang-jjigae".

---

### Beef Bulgogi Noodle Bowl
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — bulgogi is unambiguously Korean. But the noodle in it is not, which makes
  the composed dish read as pan-Asian rather than Korean.
- **Findings:**
  1. **`Rice Noodles` are the wrong noodle.** This is the defining component of a dish called a *noodle
     bowl*, and rice vermicelli belongs to Vietnamese, Thai and southern Chinese cooking. The Korean
     noodle canon is defined by its starch: wheat (somyeon, kalguksu), buckwheat (naengmyeon, makguksu),
     and sweet potato starch (dangmyeon). Rice noodles exist in Korea only as a recent commercial
     gluten-free substitute for somyeon, not as a traditional form, and they appear in no bulgogi
     preparation. The fix is free: `Sweet Potato Noodles` is already in the registry and is exactly the
     noodle that belongs with bulgogi (Seoul-style bulgogi is served with dangmyeon soaking up the pan
     juices — Korean Bapsang lists potato starch noodles in precisely that variation).
  2. **"Noodle bowl" that is also a rice bowl.** It contains 35 g white rice *and* 24 g noodles. Bulgogi
     with dangmyeon *is* served with rice alongside, so this is not indefensible — but the dish's own name
     promises a noodle bowl, and the two starches together at these token amounts read as macro filler
     rather than as a composed dish. Recommend dropping the rice so the name means something.
  3. **Near-duplicate of Bulgogi Rice Bowl.** Once the noodle is corrected these two recipes are beef
     sirloin + white rice + carrot + sweet potato noodles + soy + sesame + aromatics — nearly the same
     dish twice in a 139-recipe book. Dropping the rice from this one (point 2) is what makes them
     genuinely distinct. Flagged because the project's data-hygiene convention asks for exactly this
     near-duplicate scan.
  4. **Same marinade gaps as Bulgogi Rice Bowl:** no pear, no onion, and "a pinch of sugar" is a phantom
     (X1). It does at least use real `Garlic` at 8 g — better than its sibling.
  5. **No green onion**, in the marinade or as garnish. Standard in bulgogi; in the registry.
  6. **No kimchi or any banchan**, unlike the other bowls in this set — this is the barest of the seven.
- **Proposed fix:**
  - Ingredients: **swap `Rice Noodles` 24 g → `Sweet Potato Noodles` 24 g.** **Remove `White Rice` 35 g.**
    Add `{name:"Asian Pear", grams:40}`, `{name:"Onion", grams:40}`, `{name:"Green Onion", grams:15}`,
    `{name:"Honey", grams:6}`, and optionally `{name:"Kimchi", grams:40}` to match the rest of the set.
  - Spices: drop `Garlic Powder` (fresh `Garlic` is already in the list — X2/X3); keep Salt and Black
    Pepper.
  - Steps: delete step 1 (the rice) if the rice is removed. Rewrite step 2 as "Soak the sweet potato
    noodles in warm water for 10 minutes, then boil 5-6 minutes, drain and cut with scissors." Rewrite
    step 3 as "Slice the beef thinly and marinate in soy sauce, grated Asian pear, minced garlic, honey,
    sesame oil and black pepper." Add the sliced onion to step 4 with the beef. Rewrite step 6 as
    "Assemble the bowl with the noodles, the bulgogi and its pan juices, and the julienned carrot. Top
    with sliced green onion and serve kimchi on the side." Optionally add sesame seeds (X5).
- **New ingredients required:** `Asian Pear` — **NOT in registry** (shared with Bulgogi Rice Bowl). Sweet
  Potato Noodles, Onion, Green Onion, Honey, Kimchi are all already in registry.
- **Ingredients no longer used:** `Rice Noodles` and `White Rice` **in this recipe only** — `Rice Noodles`
  is referenced by 5 other recipes and `White Rice` by many, so neither becomes a registry orphan.
- **Macro impact:** meaningfully lower calories if the rice is dropped. `White Rice` 35 g dry ≈ −125 cal of
  carb; the noodle swap is near-neutral (both dangmyeon and rice vermicelli run ~350 cal/100 g dry); pear,
  onion and honey add back roughly +60 cal of carb. Net roughly **−65 cal, all carb**, protein untouched
  at 180 g sirloin. This will change how the solver scales the dish, so re-run
  `node tests/run.js validator` after applying. If the carb loss destabilises the solver, keep the rice and
  instead rename the recipe to "Beef Bulgogi Bowl".
- **Confidence:** high on the noodle (high), medium on the recommendation to drop the rice — that is a
  composition judgement, not a point of Korean fact.
- **Sources:** Korean Bapsang (koreanbapsang.com/bulgogi-korean-bbq-beef/); Maangchi
  (maangchi.com/recipe/bulgogi); Seoulmate, "Korean Noodle Types: The Complete Reference Guide"
  (seoulmate.co.uk/k-food/best-korean-noodle-types); Wikipedia, "Milmyeon" and "Mak-guksu".

---

## Summary

**Counts by verdict**
| Verdict | Count | Recipes |
|---|---|---|
| `authentic` | 0 | — |
| `minor-drift` | 4 | Kimchi Fried Rice, Japchae, Bulgogi Rice Bowl, Dakgalbi |
| `significantly-off` | 3 | Korean Chicken Wings, Doenjang Jjigae, Beef Bulgogi Noodle Bowl |
| `mislabeled` | 0 | — every recipe is genuinely Korean in intent; the failures are internal |
| `not-a-real-dish` | 0 | — |

No recipe needed a cuisine relabel. The failure mode across this slice is not mislabelling but **quiet
Western and Japanese substitution inside otherwise-Korean dishes**, plus **omitted defining components**.

**The 3 worst offenders**
1. **Doenjang Jjigae** — the dish is named after doenjang and is made with Japanese miso instead, with the
   cooking step explicitly claiming the two are the same ingredient; and the tofu that forms the body of
   every real version is missing entirely.
2. **Korean Chicken Wings** — American `BBQ Sauce` doing the job of gochujang in what is supposed to be
   yangnyeom sauce, and the dish is called "Wings" while containing 200 g of chicken breast.
3. **Beef Bulgogi Noodle Bowl** — the noodle in the noodle bowl is Southeast Asian rice vermicelli, a
   starch with no place in Korean cooking, in a dish that already has a nearly identical twin elsewhere in
   the book.

**Consolidated new ingredients required (registry additions)**
All six are **NOT currently in `registry.md`**:
| Ingredient | Needed by | Priority |
|---|---|---|
| `Doenjang` | Doenjang Jjigae | **critical** — the dish is named after it |
| `Tofu` | Doenjang Jjigae | **critical** — and adds ~17 g protein, useful app-wide |
| `Asian Pear` | Bulgogi Rice Bowl, Beef Bulgogi Noodle Bowl | **high** — the defining bulgogi tenderizer |
| `Shiitake Mushroom` | Japchae | **high** — registry currently has no mushroom of any kind |
| `Tteok` (Korean rice cakes) | Dakgalbi | medium |
| `Perilla Leaves` | Dakgalbi | low — sources treat it as optional |

Existing registry ingredients newly used by these fixes (no additions needed): Garlic, Onion, Green Onion,
Honey, Soy Sauce, Tomato Sauce, Water, Sweet Potato Noodles, Kimchi, Potato (optional).

New `RECIPE_SPICE_OVERRIDES` names (no registry entry needed, grocery category only): `Green Chili`,
optionally `Sesame Seeds`, `Rice Vinegar`, and `Sugar` if honey is not used for X1. Already-existing
spice names newly applied: `Gochujang`, `Gochugaru`, `Curry Powder`, `Ginger (ground)`.

**Consolidated ingredients this slice would stop using**
| Ingredient | Dropped from | Still used elsewhere? |
|---|---|---|
| `BBQ Sauce` | Korean Chicken Wings | Yes — 4 other recipes. Not orphaned. |
| `Miso Paste` | Doenjang Jjigae | Yes — 5 other recipes. Not orphaned. |
| `Rice Noodles` | Beef Bulgogi Noodle Bowl | Yes — 5 other recipes. Not orphaned. |
| `White Rice` | Beef Bulgogi Noodle Bowl (optional) | Yes — many. Not orphaned. |
| `Garlic Powder` (spice) | Japchae, Bulgogi Rice Bowl, Dakgalbi, Doenjang Jjigae, Beef Bulgogi Noodle Bowl | Yes — widely used. Not orphaned. |

**No registry entry becomes an orphan as a result of this audit** — verified by counting `name:"…"`
references in `data.js`.

**Constraint compliance:** no nuts proposed. Several of these dishes take pine nuts or a nut garnish
traditionally (japchae and bulgogi are sometimes finished with pine nuts); those are deliberately omitted
per the owner's constraint and no fix depends on them. No olives proposed. `Olive Oil` untouched. No
project file was edited.

**Suggested order of work** (cheapest and highest-value first): Korean Chicken Wings (macro-neutral,
registry-only, fixes the worst sauce error) → Kimchi Fried Rice (no new ingredients at all) → Beef
Bulgogi Noodle Bowl noodle swap (one-line, in-registry) → then the four recipes needing new registry
entries. Run `node tests/run.js validator` then `simulator` after any gram changes, per the project
workflow.
