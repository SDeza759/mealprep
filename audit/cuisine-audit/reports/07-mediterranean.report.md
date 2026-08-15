# Cuisine audit — Mediterranean (14 recipes)

Mode: **coherence**. "Mediterranean" spans many national cuisines, so the question is not authenticity
against one tradition. For each dish I ask: (a) is this actually a *specific* national dish that is being
hidden behind a catch-all label, (b) does the name match the contents, (c) is it internally coherent, and
(d) do the steps match the ingredient list (phantoms / unused / wrong liquid volumes).

**Olive note (stated once, not repeated per recipe):** several of these dishes traditionally carry olives
(horiatiki, niçoise, gyro garnish). `Black Olives` is banned app-wide and I am not proposing it anywhere.
`Olive Oil` is a different ingredient and is used freely below. Nuts are likewise never proposed.

---

### Greek Yogurt Parfait
- **Verdict:** `mislabeled`
- **Cuisine label:** should be **American** (or a generic "Breakfast"/"Modern" label if one exists). Nothing
  here is Mediterranean except the word "Greek" attached to a yogurt *style*. Strained yogurt is Greek;
  a layered parfait of yogurt + granola + berries is a North American health-food breakfast format, and
  blueberries are a North American berry with no place in Greek cooking. Greeks eat yogurt with honey
  (yiaourti me meli) — that dish is yogurt and honey, full stop, sometimes with fruit spoon-sweet.
- **Findings:**
  1. Mislabel (above). This is the single clearest "not Mediterranean" recipe in the slice.
  2. **Internal coherence:** 40 g of *raw dry* `Rolled Oats` layered alongside 25 g `Granola` is a macro
     filler, not a parfait component. Granola *is* toasted oats; adding uncooked loose oats on top gives
     you two oat layers, one of which is chalky and raw. Step 3 dutifully layers them because the step
     text was written to cover the ingredient list, not because a cook would do it.
  3. No phantom ingredients; every ingredient is referenced by a step. Steps are internally consistent
     (half/remaining accounting works for yogurt, granola, strawberries).
- **Proposed fix:** two options, user's call.
  - *Minimal (keep macros):* reword step 3 so the oats are soaked — "Stir the rolled oats into the yogurt
    and let sit 5 minutes so they soften (overnight-oats style), then layer." Nothing else changes.
  - *Cleaner dish:* drop `Rolled Oats` entirely and raise `Granola` 25 g → 45 g. Same idea, one texture.
  - Either way, change `cuisine` to `American`. Optionally rename to "Yogurt & Berry Parfait" since the
    "Greek" is doing cuisine-signalling work it hasn't earned.
- **New ingredients required:** none.
- **Ingredients no longer used:** `Rolled Oats` (only under the "cleaner dish" option; it is used by other
  recipes so nothing is orphaned).
- **Macro impact:** minimal-fix = zero. Cleaner-dish option = roughly carb-neutral, slight fat/calorie
  increase from granola replacing oats (~+15 cal, +2 g fat, −1 g protein). Not material.
- **Confidence:** high
- **Sources:** general knowledge of Greek breakfast (yiaourti me meli); no contested factual claim here.

---

### Greek Chicken Salad
- **Verdict:** `mislabeled` (and `minor-drift` on composition)
- **Cuisine label:** should be **Greek**. This is not a generic Mediterranean composition — the name says
  Greek, and Greek salad (*horiatiki*) is a defined dish. Filing it under the catch-all hides that.
- **Findings:**
  1. **No tomato.** Horiatiki is built on ripe tomato — every source describes it as tomato, cucumber,
     green pepper, red onion, feta, olives, olive oil, oregano. A "Greek salad" with cucumber but no
     tomato is missing its primary ingredient. `Tomato` is already in the registry.
  2. **No green/bell pepper.** The second missing canonical vegetable. `Bell Pepper` is in the registry.
  3. **Romaine lettuce is not in horiatiki.** Sources are unanimous: no lettuce. (Greece does have a
     lettuce salad — *maroulosalata* — but that is romaine + dill + spring onion and does *not* carry
     feta and cucumber, so this isn't that dish either.) The lettuce here is the American-diner
     "Greek chicken salad" convention. It is defensible as a deliberate lighter/volume choice, but then
     the dish should not be presented as the Greek one.
  4. Feta is traditionally served as a slab on top rather than crumbled — cosmetic, not worth changing.
  5. Steps and ingredients match cleanly: no phantoms, nothing unused. Grilled chicken on top is a
     legitimate modern addition and not a finding.
- **Proposed fix:** ingredient changes —
  - ADD `Tomato` 100 g, ADD `Bell Pepper` 50 g.
  - REDUCE `Romaine Lettuce` 60 g → 40 g (keep some for bulk; dropping it entirely is the purist call and
    also fine if the user wants the real horiatiki).
  - Spices: no change needed — `Oregano` is already there and is the correct herb.
  - Steps: amend step 3 to "Dice cucumber, tomato, bell pepper, and red onion" and step 5 to toss those
    with the lettuce. No other rewording needed.
  - Set `cuisine` to `Greek`.
- **New ingredients required:** none (`Tomato`, `Bell Pepper` both already in registry).
- **Ingredients no longer used:** none.
- **Macro impact:** negligible — +150 g of watery vegetables adds roughly 30 cal and 6 g carbs. It will
  slightly dilute the low-carb tag but not break it.
- **Confidence:** high
- **Sources:** My Greek Dish (mygreekdish.com, Greek recipe site) — traditional horiatiki; Mia Kouppa
  (miakouppa.com, Greek-Canadian family recipes); Olive & Mango; FoodieCrush. All agree: tomato + green
  pepper required, no lettuce.

---

### Lamb & Lentil Soup
- **Verdict:** `minor-drift` (coherent dish, two real bugs in the steps)
- **Cuisine label:** **acceptable as-is**, but if the user wants precision this is **Turkish/Levantine**,
  not Greek. Red lentils + lamb + cumin + tomato is the Turkish/Arab register (cf. *ezogelin*, Levantine
  *shorbat adas* with meat). The Greek lentil soup, *fakes*, is brown lentils, no meat, with vinegar and
  bay — a different soup. "Mediterranean" is a fair catch-all here; I would not force a change.
- **Findings:**
  1. **WRONG COOKING LIQUID — the clearest instance of this bug class in the slice.** Step 4 says
     *"add … and 3 cups water or broth"*. There are 33 g of dry red lentils here (about 2½ tablespoons).
     Three cups is ~710 ml. Total solids in the pot are ~380 g. You would be simmering a serving of soup
     in three times its own volume of water and the result is lentil-flavoured water, not soup — and the
     stated serving size is *2 cups*, which the recipe cannot produce from 3 cups of liquid without a
     30-minute reduction that the 25-minute simmer does not describe. This is the classic "hard-coded
     volume written for a family-size recipe, grams scaled down for macros" mismatch.
  2. **`Cumin` is never named in a step.** The spice override carries Cumin 2 g but step 6 only says
     "season with salt and pepper". App convention requires steps to name specific spices.
  3. **Minor phantom: "or broth".** Broth is not an ingredient and is not in the registry. `Water` is a
     registry ingredient but is not in this recipe's list either, so step 4 introduces its cooking liquid
     out of nowhere. Low severity (water is conventionally implicit) but worth normalising.
  4. Everything else checks out: lamb, lentils, carrot, onion, tomato sauce, olive oil, garlic and potato
     are each referenced by a step. No unused ingredients.
- **Proposed fix:** steps only, no ingredient change.
  - Step 4 → "Add red lentils, diced potato, tomato sauce, and 1½ cups (350 ml) water. Stir to combine."
    (350 ml against ~380 g solids, minus evaporation over 25 minutes, lands near the 2-cup serving.)
  - Step 3 → "Add onion, garlic, and carrot. Cook 2 minutes, then stir in the cumin and toast 30 seconds."
    (Blooming the cumin in the fat is also the correct technique, so this fixes the omission and improves
    the dish in one edit.)
  - Optionally add `Water` 350 g to the ingredient list if the app prefers cooking liquid to be explicit —
    check how other soups in the book handle it before doing this, since `Water` is a registry entry.
- **New ingredients required:** none.
- **Ingredients no longer used:** none.
- **Macro impact:** none. Water is macro-free; this is a text fix.
- **Confidence:** high
- **Sources:** standard lentil-soup ratios (dry lentils simmer at roughly 3:1 liquid *by volume*, i.e.
  ~120 ml per 33 g here, with extra for a brothy soup); Greek *fakes* vs Turkish red-lentil soup is
  well-established and uncontested.

---

### Brown Rice Power Bowl
- **Verdict:** `mislabeled`
- **Cuisine label:** should be **American**. "Power bowl" is a Californian/American health-food genre; the
  format (grain base + roasted vegetable + grilled protein + raw greens, assembled in a bowl) is a 2010s
  US fast-casual invention. Brown rice is not a Mediterranean staple, sweet potato is a New World crop
  that never entered the Mediterranean repertoire, and the only Mediterranean thing in the bowl is the
  olive oil. There is no dish here being hidden — it is genuinely generic, just generic *American*.
- **Findings:**
  1. Mislabel (above).
  2. **Phantom / over-allocated fat.** Step 2 tosses the sweet potato with "olive oil" and step 5 says
     *"Drizzle with remaining olive oil"* — but there is only 8 g of olive oil total and step 2 consumed
     it. There is no remaining oil. Step 3 then grills the chicken with no fat named at all. So the 8 g is
     asked to do three jobs and one of them is explicitly a leftover that doesn't exist.
  3. **No acid, no herb, nothing but salt and pepper** across five ingredients. Even judged as a generic
     bowl this is under-seasoned; every comparable bowl has a dressing. This is a coherence finding, not
     an authenticity one.
  4. No unused ingredients.
- **Proposed fix:**
  - Steps: split the oil explicitly. Step 2 → "toss with half the olive oil and roast…"; step 5 →
    "Drizzle with the remaining olive oil and a squeeze of lemon." That makes step 5 true.
  - If the label stays `Mediterranean` instead of moving to `American`, the honest way to earn it is to
    ADD `Lemon` 15 g and add `Oregano` 1 g to the spice override, and reword step 5 accordingly. Cheap,
    and it turns an unseasoned bowl into a dressed one. Otherwise just relabel and add the lemon anyway.
  - Optionally raise `Olive Oil` 8 g → 12 g so there is genuinely enough for both roasting and finishing.
- **New ingredients required:** none (`Lemon` already in registry; `Oregano` already an existing spice).
- **Ingredients no longer used:** none.
- **Macro impact:** negligible. Lemon is ~2 cal. The optional +4 g olive oil is ~+35 cal, all fat.
- **Confidence:** high

---

### Tuna Nicoise Salad
- **Verdict:** `mislabeled` — and `significantly-off` against the dish it names
- **Cuisine label:** should be **French**. *Salade niçoise* is from Nice and is one of the most fiercely
  defended regional dishes in France; filing it under "Mediterranean" is exactly the mislabel this audit
  is looking for. (Nice is on the Mediterranean, which is presumably how it got here, but by that logic
  so is every dish in the slice.)
- **Findings:**
  1. **No tomato.** This is the one thing every camp of the niçoise argument agrees on. Jacques Médecin's
     *Cuisine Niçoise* — the purist reference — describes a salad made *predominantly* of tomatoes, salted
     and moistened with olive oil. The Escoffier-descended international version also always has tomato.
     A niçoise with no tomato is not a niçoise in any version. `Tomato` is in the registry.
  2. **The tuna is never cooked, and the step treats it as canned.** Step 4 says "drained tuna", but the
     ingredient is `Ahi Tuna` — the registry's raw fresh tuna entry. No step cooks it. So the recipe as
     written serves 120 g of raw ahi that it describes as being drained from a tin. This is a genuine
     step/ingredient contradiction, not a stylistic quibble. (Canned tuna *is* the traditional choice, but
     the app has no canned-tuna registry entry, so the step must match what's actually there.)
  3. **No dressing acid.** Olive oil alone, no lemon and no vinegar. Médecin's purist version deliberately
     has no vinaigrette — so this is defensible *if* the tomato is present to be salted and oiled, which
     it isn't. As composed there is simply nothing dressing the salad.
  4. Potato and green beans are **legitimate variation, not a finding.** Médecin says never boiled potato;
     the Escoffier lineage and most restaurant versions include both. I am not flagging them — the recipe
     has picked one recognised camp. Worth noting in a comment so nobody "fixes" it later.
  5. Olives (specifically small Niçoise olives) are canonical here and are banned. Noted, not proposed.
     Anchovies are the other canonical element and are not in the registry either.
  6. No unused ingredients.
- **Proposed fix:**
  - ADD `Tomato` 120 g. Step 4 → "Arrange potato, egg, green beans, and tomato wedges on a plate."
  - Fix the tuna. Two options: (a) treat it as the fresh steak it is — insert a step "Season the ahi tuna
    with salt and pepper and sear 1–2 minutes per side, then slice", and change step 4's "drained tuna"
    to "sliced seared tuna"; or (b) leave it raw and say so ("thinly slice the raw ahi and arrange"),
    which makes it a modern seared/raw-tuna niçoise. Either is coherent; the current text is not.
    Recommend (a) — it matches the dish's expectations better.
  - ADD `Red Wine Vinegar` to the spice override (zero-macro seasoning, already an existing spice name)
    and amend step 5 → "Drizzle with olive oil and red wine vinegar, season with salt and pepper."
  - Set `cuisine` to `French`.
- **New ingredients required:** none. `Tomato` is in the registry; `Red Wine Vinegar` is an existing
  spice-override name. (Anchovy would be a new registry entry — **not proposing it**, it is a bigger
  change than this fix warrants.)
- **Ingredients no longer used:** none.
- **Macro impact:** +120 g tomato ≈ +22 cal, +5 g carbs. Immaterial.
- **Confidence:** high
- **Sources:** Jacques Médecin, *Cuisine Niçoise* (via davidlebovitz.com and pardonyourfrench.com, both
  quoting his "never, ever … include boiled potato" line); Cuisine Nissarde / Well Mamma on the current
  no-potato-no-green-bean standard; America's Test Kitchen on the Escoffier lineage.

---

### Lamb & Hummus Wrap
- **Verdict:** `coherent` (with `minor-drift`)
- **Cuisine label:** **acceptable**. This is a genuinely generic composition, not a specific dish wearing
  a disguise. Its centre of gravity is Levantine (spiced ground lamb + hummus + flatbread is the shawarma
  /kofta-wrap idiom), but it is not claiming to be any named dish and the name describes it accurately.
  If the app wants more precision, `Middle Eastern` would be defensible — but "Mediterranean" is a fair
  call and I would leave it.
- **Findings:**
  1. **Carrot sticks are the odd ingredient.** Every part of this wrap reads Levantine except the raw
     carrot batons, which are a lunchbox/deli-wrap convention. Tomato and red onion are what actually go
     in this wrap. Not wrong, just the one thing that gives away that the ingredient list was assembled
     for fibre and colour rather than by cuisine.
  2. **No acid anywhere** — no lemon, no vinegar, no tahini drizzle. Spiced lamb + hummus + tortilla is a
     heavy, flat combination without one.
  3. `Whole Wheat Tortilla` rather than pita/lavash is an American substitution, but it's the registry's
     available flatbread of that size and I would not call it a finding.
  4. Steps and ingredients match exactly — no phantoms, nothing unused. Cooking the lamb with no added
     fat is correct (ground lamb renders plenty).
- **Proposed fix:** small, optional.
  - SWAP `Carrot` 50 g → `Tomato` 50 g, and ADD `Red Onion` 25 g. Step 4 → "Dice tomato and thinly slice
    red onion." Step 5 → "Layer cooked lamb, spinach, tomato, and red onion on top."
  - ADD `Lemon` 10 g, squeezed over the lamb at the end of step 1.
  - If the user wants to keep the carrot for fibre, the wrap survives it; the lemon is the change that
    actually matters.
- **New ingredients required:** none.
- **Ingredients no longer used:** `Carrot` (only in this recipe, and only if the swap is taken; it is used
  widely elsewhere so nothing is orphaned).
- **Macro impact:** essentially zero — tomato and carrot are comparable, lemon is nothing.
- **Confidence:** medium-high (this is a judgement call on a generic dish, not a factual claim)

---

### Mediterranean Stuffed Peppers
- **Verdict:** `minor-drift`
- **Cuisine label:** **correct / defensible.** The name is honestly generic — it says "Mediterranean" and
  delivers a generic Mediterranean-style stuffed pepper rather than pretending to be Greek *gemista* or
  Turkish *biber dolma*. It sits between them (feta and oregano pull Greek, cumin pulls Turkish/Levantine)
  and that mash-up is fine for a dish that doesn't claim a nationality. No mislabel finding.
- **Findings:**
  1. **No onion, no garlic.** Every stuffed-pepper tradition in the region builds the filling on sautéed
     onion (and usually garlic) — it is the first thing in the pan in gemista, in dolma, in the Italian
     versions. A filling of just meat + rice + tomato sauce is noticeably flat, and this is the one place
     where the recipe is short of something structural rather than merely decorative. Both are in the
     registry.
  2. **No fresh herb.** Gemista is defined as much by its parsley and mint as by the rice. `Dried Parsley`
     is already an established spice name in the app and would cost nothing.
  3. **Too little liquid, and none in the baking dish.** 30 g of tomato sauce against 156 g of cooked rice
     plus beef gives a dry, crumbly filling, and the peppers go into the oven with nothing in the pan.
     Traditionally these bake in tomato sauce or a little water, covered, which is also what actually
     cooks the pepper through.
  4. **25 minutes is short for raw halved peppers.** With a pre-cooked filling the bake is only there to
     soften the pepper; gemista bakes 50–60 minutes. At 25 minutes at 190 °C the peppers will still be
     crunchy. Coherence flag on technique.
  5. **Serving-size wording:** `servingSize` is "2 peppers" but step 5 halves them and 200 g is roughly
     1½ medium peppers. Cosmetic, but the plate description and the steps disagree.
  6. Steps reference every ingredient; no phantoms, nothing unused.
- **Proposed fix:**
  - ADD `Onion` 50 g and `Garlic` 5 g. Step 3 → "Dice the onion and mince the garlic. Brown the ground
    beef in a skillet, then add onion and garlic and cook 3 minutes until soft. Stir in cumin and oregano."
  - ADD `Dried Parsley` 1 g to the spice override; name it in step 4 ("Mix cooked brown rice, beef,
    tomato sauce, parsley, and half the feta").
  - RAISE `Tomato Sauce` 30 g → 60 g, and change step 6 → "Stuff peppers with the mixture, top with the
    remaining feta, add a splash of water to the dish, cover with foil and bake 30 minutes, then uncover
    for 10 minutes to brown." That fixes the dry filling and the undercooked pepper together.
  - Change `servingSize` to "2 stuffed halves" (or raise `Bell Pepper` to 260 g) so it matches the steps.
- **New ingredients required:** none. `Onion`, `Garlic`, `Tomato Sauce` are registry entries;
  `Dried Parsley` is an existing spice-override name.
- **Ingredients no longer used:** none.
- **Macro impact:** small increase — +50 g onion (~20 cal) and +30 g tomato sauce (~8 cal). Under 30 cal
  total, no meaningful protein change.
- **Confidence:** high
- **Sources:** Dimitra's Dishes and foodbymaria (both Greek-authored) on gemista's onion/garlic/parsley/
  mint filling and its tomato-sauce bake; The Mediterranean Dish gemista.

---

### Shrimp & Feta Salad
- **Verdict:** `minor-drift`
- **Cuisine label:** **acceptable** as generic Mediterranean. Worth knowing that shrimp + feta is a
  specific Greek dish — *garides saganaki*, shrimp baked in tomato sauce under melted feta, a 1950s
  taverna invention. This recipe is *not* that dish (it's cold, rice-based, no tomato), so there is no
  mislabel to report; but the pairing it is borrowing from has tomato at its centre, which is the gap.
- **Findings:**
  1. **80 g of feta against 120 g of shrimp is a macro-driven amount, not a culinary one.** That is
     ~210 cal of cheese and a very large amount of salt — feta runs ~1100 mg sodium/100 g, so this is
     ~900 mg from the cheese alone before the added salt. The feta will dominate the shrimp completely.
     This reads clearly as the solver's fat/protein filler rather than a cook's choice.
  2. **No tomato.** Every version of the shrimp-and-feta idea is tomato-based. Without it this is rice,
     cucumber and cheese with shrimp on top.
  3. **The shrimp is seared with no fat.** Step 3 says "Sear shrimp 2–3 minutes per side until pink" but
     all 10 g of the olive oil is spent in the dressing at step 5. Not a phantom ingredient in the strict
     sense (no non-existent food is named) but it is the same class of bug: a step describing a technique
     the ingredient list can't perform as written.
  4. **"Salad" is a stretch** — there is no leaf and no acid-forward dressing beyond lemon; it is a cold
     grain bowl. Minor naming drift, not worth renaming on its own.
  5. Brown rice is not a Mediterranean grain (orzo, white rice or bulgur would be), but that's an
     app-wide staple choice and I am not treating it as a finding.
  6. No unused ingredients, no phantoms.
- **Proposed fix:**
  - REDUCE `Feta Cheese` 80 g → 50 g. ADD `Tomato` 100 g. This is the change that matters — it rebalances
    the salt and restores the pairing the dish is built on.
  - RAISE `Olive Oil` 10 g → 14 g and reword step 3 → "Sear shrimp in a little of the olive oil, 2 minutes
    per side, until pink", with step 5 using the rest.
  - Step 4 → "Dice cucumber and tomato."
  - Optionally ADD `Red Onion` 20 g — standard in this dish and in the registry.
- **New ingredients required:** none.
- **Ingredients no longer used:** none.
- **Macro impact:** meaningful. Dropping 30 g feta removes ~80 cal, ~6 g fat, ~4 g protein; adding 100 g
  tomato adds ~18 cal. Net ~−60 cal and ~−4 g protein, partly offset by the extra olive oil (+35 cal fat).
  The solver may need to re-scale this recipe — flag it as the one fix in this slice with real macro
  consequences.
- **Confidence:** high
- **Sources:** Diane Kochilas (dianekochilas.com — Greek cookbook author) and My Greek Dish on garides
  saganaki; Saveur on its Thessaloniki origin. USDA feta sodium.

---

### Chicken Souvlaki Plate
- **Verdict:** `mislabeled` (and a real component error)
- **Cuisine label:** should be **Greek**. Souvlaki is a specific Greek dish — the word is the diminutive
  of *souvla*, "skewer" — and a "souvlaki plate" (*merida*) is a defined restaurant format: skewered
  grilled meat with pita, tzatziki, tomato, onion and usually fries. This is not a generic composition.
- **Findings:**
  1. **The tzatziki has no cucumber.** Step 5 says *"Mix greek yogurt with a pinch of garlic and salt for
     tzatziki"* — that is garlic yogurt, not tzatziki. Tzatziki is by definition strained yogurt +
     grated, well-drained cucumber + garlic + olive oil, usually with dill or mint and a little vinegar
     or lemon. The recipe *has* 60 g of cucumber, but step 4 dices it and serves it as a side vegetable
     instead. So the dish names a component it does not actually make — the phantom here is inside a
     preparation rather than an ingredient line, but it is the same failure.
  2. **No tomato on the plate.** Tomato and onion are the standard souvlaki accompaniment; the recipe has
     the onion but not the tomato.
  3. **No herb in the tzatziki.** Dill (or mint) is the characteristic note. There is no dill or mint in
     the app's spice list — this would be a new spice-override name, which is cheap (zero-macro
     seasonings live in `RECIPE_SPICE_OVERRIDES` without a registry entry).
  4. The marinade itself is right: olive oil + lemon + oregano + salt + pepper on cubed chicken, skewered
     and grilled, is exactly correct. Paprika is a mild non-traditional addition, harmless.
  5. Every ingredient is referenced by a step; no unused ingredients.
- **Proposed fix:**
  - Steps: step 4 → "Grate the cucumber and squeeze out the liquid. Thinly slice the red onion."
    Step 5 → "Mix the greek yogurt with the grated cucumber, minced garlic, a squeeze of lemon, dill,
    and salt to make tzatziki." Step 6 → "Serve chicken with warm pita, tzatziki, sliced red onion, and
    tomato wedges."
  - RAISE `Cucumber` 60 g → 80 g so the tzatziki gets a real amount and there is still some on the plate,
    or leave at 60 g and put all of it in the sauce.
  - ADD `Tomato` 80 g.
  - ADD `Dill` 1 g to the spice override — **new spice name**, not currently used anywhere in the app.
    If the user would rather not introduce one, `Dried Parsley` (already in use) is an acceptable stand-in
    and I'd take that over no herb at all.
  - Set `cuisine` to `Greek`.
- **New ingredients required:** `Dill` — **not in the registry and not in the existing spice list.** It
  needs no registry entry (zero-macro seasoning) but does need a grocery category. `Tomato` is already in
  the registry.
- **Ingredients no longer used:** none.
- **Macro impact:** negligible (+80 g tomato ≈ +14 cal; +20 g cucumber ≈ +3 cal).
- **Confidence:** high
- **Sources:** My Greek Dish (chicken souvlaki with pita and tzatziki); The Mediterranean Dish on pork
  souvlaki; Wikipedia/Souvlaki on the *souvla* etymology and merida format; The Mediterranean Dish and
  Downshiftology on tzatziki's grated-and-drained cucumber being non-optional.

---

### Mediterranean Tuna Salad
- **Verdict:** `minor-drift` (three concrete bugs, but the dish itself is sound)
- **Cuisine label:** **acceptable.** The name is honestly generic and doesn't claim a nationality. Worth
  flagging that tuna + white beans + red onion + olive oil *is* a specific Italian dish — Tuscan
  *tonno e fagioli* — and if the bean quantity is fixed (see below) this becomes that dish and could
  reasonably be relabelled `Italian`. As currently composed the beans are too incidental to justify it.
- **Findings:**
  1. **"Drain canned tuna" — the ingredient is `Ahi Tuna`, the registry's raw fresh tuna.** Same bug as
     Tuna Nicoise Salad: the step describes a tinned product the recipe does not contain, and no step ever
     cooks the fish. This is now a **pattern across two recipes** and worth fixing as a pair. Canned
     oil-packed tuna is genuinely the right product for both dishes, so the cleanest resolution is a new
     registry entry rather than rewriting both step sets — see "New ingredients required".
  2. **`White Beans` 19 g is a token amount.** That is roughly a tablespoon and a half of dry beans. In
     the dish this is imitating, the beans are the co-star with the tuna at near-equal volume. 19 g is
     visible in the macro table and invisible on the plate — a solver residue, not a portion.
  3. **The `low-carb` tag is wrong.** The recipe contains 60 g of `Whole Wheat Bread`, roughly 30 g of
     carbohydrate before the beans are counted. Whatever threshold the app uses for that tag, a slice and
     a half of bread does not clear it. This is a data bug independent of cuisine.
  4. **No acid.** Olive oil and oregano only — no lemon, no vinegar. Every version of this salad is
     lemon- or vinegar-dressed; without it the dish is oily beans and fish.
  5. **No parsley.** The characteristic herb of tonno e fagioli. `Dried Parsley` is an existing spice name.
  6. All ingredients are referenced by a step; no unused ingredients.
- **Proposed fix:**
  - RAISE `White Beans` 19 g → 60 g. This is the change that turns the ingredient list into a dish.
  - ADD `Lemon` 15 g; step 4 → "Season with lemon juice, salt, pepper, oregano, and parsley."
  - ADD `Dried Parsley` 1 g to the spice override.
  - Remove `low-carb` from `tags`.
  - Fix step 1 to match the ingredient (see the shared tuna fix below).
  - Optional: relabel `cuisine` to `Italian` and rename to "Tuna & White Bean Salad" once the beans are a
    real portion.
- **New ingredients required:** none strictly. **But recommended:** a `Canned Tuna` registry entry
  (oil- or water-packed, USDA has both), which would resolve the "drained tuna" wording in *both* this
  recipe and Tuna Nicoise Salad without pretending seared ahi is a tinned product. If the user doesn't
  want a new entry, fix step 1 here to "Sear the ahi tuna briefly, cool, and flake" instead.
  `Lemon` and `Dried Parsley` already exist.
- **Ingredients no longer used:** none.
- **Macro impact:** meaningful on carbs/fibre — +41 g of dry white beans is roughly +140 cal, +25 g carbs,
  +10 g protein. That's a real change; the solver will re-scale. Removing the (incorrect) `low-carb` tag
  is what makes this acceptable.
- **Confidence:** high
- **Sources:** Memorie di Angelina (Italian-American food writer) and Tasting Table on fagioli e tonno's
  composition and its bean-forward ratio; The Mediterranean Dish tuna white bean salad.

---

### Lamb Gyro
- **Verdict:** `mislabeled` — **worst recipe in the slice**
- **Cuisine label:** should be **Greek**. Gyros is a specific Greek street food, not a generic category.
- **Findings:**
  1. **A "Lamb Gyro" that contains 60 g of `Chicken Breast` alongside 60 g of `Ground Lamb`.** The name
     promises one meat and the ingredient list delivers two, in equal parts — the chicken is *half* the
     protein. No gyro anywhere is a lamb-and-chicken mix: in Greece gyros is overwhelmingly pork (lamb
     historically), in the US it's a lamb-and-beef blend, and chicken gyro is its own separate item. This
     is a straightforward name/contents contradiction and the clearest single defect in the slice.
  2. **The technique is wrong for the name.** Gyro meat is a seasoned loaf stacked on a vertical
     rotisserie and shaved into thin slices; step 2 says *"cook lamb as crumbles in a hot skillet"*.
     Crumbled ground lamb in a pita is a kofta or taco filling. A home cook cannot run a rotisserie, but
     the recognised home approximation is to press the seasoned ground meat into a loaf, bake it, and
     slice it thin — which is both closer to the dish and no harder than what's written.
  3. **The tzatziki has no cucumber again.** Step 6: "Mix greek yogurt with a pinch of garlic and lemon
     juice for tzatziki" — the 40 g of cucumber is diced separately in step 5 and used as a filling
     vegetable. Same defect as Chicken Souvlaki Plate; fix both together.
  4. **No tomato.** Tomato and onion are the standard gyro filling; the onion is here, the tomato isn't.
  5. Olives are a garnish in some versions — banned, noted, not proposed.
  6. All ingredients are referenced by a step; no phantoms, nothing unused. The defects are compositional,
     not bookkeeping.
- **Proposed fix:** the important one is picking a single meat.
  - REMOVE `Chicken Breast` 60 g and RAISE `Ground Lamb` 60 g → 120 g. Delete step 3 entirely. This keeps
    the protein roughly level and makes the name true.
    *(Alternative if the user likes the chicken: rename to "Chicken Gyro", drop the lamb, and raise
    `Chicken Breast` to 130 g. Either is fine — what isn't fine is both meats in one pita.)*
  - Step 2 → "Press the seasoned lamb into a thin loaf and cook in a hot skillet 3–4 minutes per side,
    then slice thinly into strips." (Approximates the shaved rotisserie texture.)
  - Step 5 → "Grate the cucumber and squeeze dry. Thinly slice the red onion."
    Step 6 → "Mix greek yogurt with the grated cucumber, minced garlic, and lemon juice for tzatziki."
  - ADD `Tomato` 60 g; include it in the fill step.
  - Set `cuisine` to `Greek`.
- **New ingredients required:** none (`Tomato` in registry).
- **Ingredients no longer used:** `Chicken Breast` leaves this recipe (used in many others — no orphan).
- **Macro impact:** roughly neutral on calories but shifts the mix — swapping 60 g chicken breast for
  60 g ground lamb trades ~12 g of lean protein for ~10 g of fat, so calories rise ~60 and protein falls
  ~4 g. Tomato is negligible. Expect the solver to re-scale slightly.
- **Confidence:** high
- **Sources:** The Greek Foodie and foodbymaria on Greek gyros (pork/lamb, vertical rotisserie, shaved);
  Souvlaki Authentique on gyro vs souvlaki and on the US lamb-beef blend; The Mediterranean Dish and
  Downshiftology on tzatziki requiring grated drained cucumber.

---

### Greek Lemon Chicken
- **Verdict:** `mislabeled` (and `minor-drift` on the starch)
- **Cuisine label:** should be **Greek**. "Greek Lemon Chicken" is the English name of *kotopoulo
  lemonato*, a defined Sunday-roast dish, not a generic composition.
- **Findings:**
  1. **Kotopoulo lemonato is chicken roasted *with potatoes*,** the two cooking together in a lemon,
     olive oil, garlic and oregano bath — Greek sources are consistent that the potatoes are part of the
     dish, not a swappable side. This version serves pan-seared chicken over **brown rice**, which is the
     one starch that belongs to neither the traditional dish nor Greek cooking generally. If a grain base
     is wanted for macro reasons, Greek *rizi lemonato* (lemon rice) uses white rice; `White Rice` and
     `Potato` are both in the registry.
  2. **There is no lemon sauce.** The dish is named for it. Here lemon is used only as a raw seasoning on
     the chicken (step 2) and a wedge at the end (step 6). No pan sauce is ever built, so the defining
     element of the dish is missing as a *technique* even though the ingredient is present.
  3. **5 g of olive oil is too little** to sear 160 g of chicken and still be the "olive oil, lemon,
     oregano" backbone the dish is built on. This is a macro-driven number.
  4. **Raw sliced red onion served alongside hot roast chicken** is an odd plate — it belongs to a salad,
     not to lemonato. Step 5 slices it and step 6 serves it raw. Low severity but it is the one
     ingredient with no role in the dish it's named after.
  5. Wilted spinach is a fine modern addition (Greek cooking has plenty of wilted greens) — not a finding.
  6. All ingredients are referenced by a step; no phantoms, nothing unused.
- **Proposed fix:**
  - SWAP `Brown Rice` 45 g → `Potato` 180 g (the traditional call), **or** → `White Rice` 60 g if a grain
    is preferred. Recommend the potato — it makes the dish what its name says.
    Step 1 → "Cut potatoes into wedges, toss with olive oil, lemon juice, garlic, oregano, salt and
    pepper, and roast at 200 °C for 35 minutes until golden."
  - RAISE `Olive Oil` 5 g → 10 g and build the sauce: step 3 → "Heat olive oil in a skillet. Sear chicken
    6–7 minutes per side until cooked through, then add the remaining lemon juice, garlic and a splash of
    water and let it bubble into a pan sauce."
  - REMOVE `Red Onion` 20 g, or cook it — step 3 could soften it with the chicken. Either resolves it.
  - Set `cuisine` to `Greek`.
- **New ingredients required:** none.
- **Ingredients no longer used:** `Brown Rice` and `Red Onion` leave this recipe if both changes are
  taken; both are used widely elsewhere, so no registry orphans.
- **Macro impact:** if brown rice → potato at the grams above, roughly carb-neutral (45 g dry brown rice
  ≈ 160 cal / 33 g carb; 180 g potato ≈ 140 cal / 32 g carb). The extra 5 g olive oil adds ~45 cal of fat.
  Small net change.
- **Confidence:** high
- **Sources:** My Greek Dish and Kopiaste (both Greek-authored) on kotopoulo lemonato with potatoes;
  Mia Kouppa; Olive Tomato (Elena Paravantes, Greek dietitian) one-pot version. All pair chicken with
  potatoes and name lemon + olive oil + oregano + garlic as the backbone.

---

### Seared Tuna Steak
- **Verdict:** `coherent`
- **Cuisine label:** **correct.** I went in expecting to call this a modern Hawaiian/Japanese preparation,
  and it isn't — seared-rare tuna with olive oil, lemon and garlic is genuinely Sicilian. Sicilian
  fishermen's *tonno* is a thick steak seared very briefly to a ruby centre and dressed with local olive
  oil, sea salt and lemon; the classic sauce, *salmoriglio*, is exactly olive oil + lemon + garlic +
  oregano. The recipe has independently landed on a real Mediterranean dish. Label stands.
- **Findings:**
  1. **The "lemon-garlic dressing" contains no oil.** Step 6 refers to a dressing, but the whole 5 g of
     olive oil was spent heating the skillet in step 2. So the dressing is raw minced garlic and lemon
     juice on raw spinach — harsh, and not the salmoriglio the step is gesturing at. Same fat
     over-allocation pattern as Brown Rice Power Bowl and Shrimp & Feta Salad.
  2. **No oregano.** Salt and pepper only. Oregano is the herb that makes this the Sicilian dish rather
     than a plain seared fillet, and `Oregano` is already an app spice.
  3. Every ingredient is referenced by a step; no phantoms, nothing unused. Name matches contents exactly.
     The 1–2 min/side sear for rare is correct.
- **Proposed fix:** small and cheap.
  - RAISE `Olive Oil` 5 g → 12 g so there is oil for the sear *and* the dressing. Step 2 → "Heat a little
    of the olive oil in a skillet over very high heat."
  - ADD `Oregano` 1 g to the spice override. Step 4 → "Whisk the remaining olive oil with minced garlic,
    lemon juice, oregano, and a pinch of salt to make a salmoriglio dressing."
- **New ingredients required:** none.
- **Ingredients no longer used:** none.
- **Macro impact:** +7 g olive oil ≈ +60 cal, all fat. Small but not nothing — the recipe is currently
  very lean (170 g ahi and almost no fat), so this may actually help the solver.
- **Confidence:** high
- **Sources:** Philosokitchen (salmoriglio tuna steak, Sicilian fisherman); Sip and Feast and The Daring
  Gourmet on Sicilian-style seared tuna; multiple sources agree on the seared-rare centre with olive oil,
  lemon, garlic and oregano.

---

### Baked Cod with Lemon & Herbs
- **Verdict:** `coherent` — the cleanest recipe in the slice
- **Cuisine label:** **correct.** White fish baked with olive oil, lemon, garlic, oregano and parsley is
  pan-Mediterranean and not the property of any one country. It is *not* claiming to be Greek *psari
  plaki* (which is fish baked in a tomato-and-onion sauce), and the honest generic name keeps it clear of
  that. Broccoli is sometimes read as un-Mediterranean but it is in fact an Italian brassica (Calabrese),
  so it is not out of place.
- **Findings:**
  - **No finding.** Every ingredient is referenced by a step. No phantom ingredients. No unused
    ingredients. No hard-coded liquid volume (the rice defers to package directions, which is the right
    call). Both spices — oregano and parsley — are named explicitly in step 3, which is exactly what the
    "Herbs" in the title promises. Technique, temperature and time (200 °C, 12–15 min for 200 g of cod)
    are all correct. Name matches contents.
  - The only thing I would even mention: 5 g of olive oil across a 200 g fillet plus broccoli is a thin
    film. That is a macro-budget choice, not an error, and unlike the three recipes above no step here
    claims there is oil left over. Leaving it alone.
- **Proposed fix:** none needed.
- **New ingredients required:** none.
- **Ingredients no longer used:** none.
- **Macro impact:** n/a.
- **Confidence:** high
- **Sources:** Dimitra's Dishes and The Mediterranean Dish on psari plaki (checked to confirm this recipe
  is *not* claiming that dish); general Mediterranean baked-white-fish practice.

---

## Summary

### Counts by verdict
| Verdict | Count | Recipes |
|---|---|---|
| `coherent` | 3 | Lamb & Hummus Wrap, Seared Tuna Steak, Baked Cod with Lemon & Herbs |
| `minor-drift` | 4 | Lamb & Lentil Soup, Mediterranean Stuffed Peppers, Shrimp & Feta Salad, Mediterranean Tuna Salad |
| `mislabeled` | 7 | Greek Yogurt Parfait, Greek Chicken Salad, Brown Rice Power Bowl, Tuna Nicoise Salad, Chicken Souvlaki Plate, Lamb Gyro, Greek Lemon Chicken |
| `incoherent` | 0 | — |

**Half the slice is mislabeled.** That is the headline. Five of the seven are specific *Greek* dishes
(horiatiki, souvlaki, gyro, kotopoulo lemonato — plus the Greek-yogurt parfait, which is the opposite
case: it is *not* Greek and not Mediterranean at all). One is French (salade niçoise) and one is American
(power bowl). "Mediterranean" is doing a lot of hiding here.

### The 3 worst offenders
1. **Lamb Gyro** — a dish named for lamb whose protein is 50% chicken breast; the lamb is cooked as taco
   crumbles rather than sliced from a loaf; and its "tzatziki" is garlic yogurt with the cucumber served
   on the side instead.
2. **Tuna Nicoise Salad** — no tomato, which no version of niçoise omits; and the ingredient is fresh raw
   `Ahi Tuna` that the steps call "drained" and never cook, so the recipe as written plates raw fish it
   describes as tinned.
3. **Greek Chicken Salad** — a Greek salad with neither tomato nor green pepper, built instead on romaine
   lettuce, which horiatiki explicitly does not contain.

Runner-up worth its own mention: **Lamb & Lentil Soup**, which calls for **3 cups of water against 33 g of
dry lentils** — the wrong-cooking-liquid bug in its purest form, and impossible to reconcile with the
stated 2-cup serving size.

### Cross-cutting patterns (fix once, benefit twice)
- **Cucumber-less "tzatziki"** in *Chicken Souvlaki Plate* and *Lamb Gyro*. Both dice the cucumber as a
  side vegetable and then call plain garlic yogurt tzatziki. One step-rewrite pattern fixes both.
- **`Ahi Tuna` treated as canned** in *Tuna Nicoise Salad* ("drained tuna") and *Mediterranean Tuna Salad*
  ("Drain canned tuna"). Either add a `Canned Tuna` registry entry or rewrite both step sets to sear the
  fresh steak. Do not fix only one.
- **Missing tomato** in six recipes where the dish is built on it: Greek Chicken Salad, Tuna Nicoise
  Salad, Shrimp & Feta Salad, Chicken Souvlaki Plate, Lamb Gyro, Lamb & Hummus Wrap. `Tomato` is already
  in the registry and is by far the highest-value single addition across this slice.
- **Fat over-allocation** — a step referring to oil that an earlier step already spent: *Brown Rice Power
  Bowl* ("drizzle with remaining olive oil"), *Shrimp & Feta Salad* (sears shrimp with no fat available),
  *Seared Tuna Steak* ("lemon-garlic dressing" with no oil left). All three are fixed by raising the oil
  a few grams and splitting it explicitly across the steps.

### Consolidated: ALL new ingredients required
Only two things in this entire slice are not already available. Everything else I proposed (`Tomato`,
`Bell Pepper`, `Onion`, `Garlic`, `Lemon`, `Red Onion`, `Potato`, `White Rice`, `Tomato Sauce`,
`Olive Oil`) is already in `INGREDIENT_REGISTRY`, and every spice I proposed (`Oregano`, `Dried Parsley`,
`Red Wine Vinegar`) is already an established `RECIPE_SPICE_OVERRIDES` name.

| Name | Kind | Needed by | Status |
|---|---|---|---|
| `Dill` | spice / zero-macro seasoning | Chicken Souvlaki Plate (and optionally Lamb Gyro) tzatziki | **NOT in registry, NOT in the existing spice list.** Needs no registry entry — zero-macro seasonings live in `RECIPE_SPICE_OVERRIDES` and get zero macros automatically — but does need an `INGREDIENT_CATEGORIES` grocery entry. Substitute `Dried Parsley` (already in use) if the user prefers not to add one. |
| `Canned Tuna` | registry ingredient | Tuna Nicoise Salad, Mediterranean Tuna Salad | **NOT in registry.** *Recommended, not required.* It is the culinarily correct product for both dishes and resolves the "drained tuna" contradiction cleanly. The no-new-ingredient alternative is to rewrite both recipes to sear the fresh `Ahi Tuna`, which also works. USDA has entries for both oil-packed and water-packed. |

### Consolidated: ALL ingredients this slice would stop using
Per-recipe removals only — **none of these becomes a registry orphan**, since every one is used by other
recipes elsewhere in the book. No `INGREDIENT_REGISTRY` deletions come out of this audit.

| Ingredient | Leaves | Required or optional |
|---|---|---|
| `Chicken Breast` | Lamb Gyro | **Required** — it is the reason the dish contradicts its own name. |
| `Brown Rice` | Greek Lemon Chicken | Recommended (swap to `Potato`, or `White Rice`). |
| `Red Onion` | Greek Lemon Chicken | Optional (remove, or cook it instead of serving it raw). |
| `Rolled Oats` | Greek Yogurt Parfait | Optional — only under the "drop the double oat layer" variant. |
| `Carrot` | Lamb & Hummus Wrap | Optional — only if swapped for `Tomato`. |

### Note on the constraints
Three dishes here (horiatiki, salade niçoise, gyro) carry olives in their canonical form, and salade
niçoise canonically carries anchovies. I have not proposed olives anywhere, in any form, and no fix above
depends on them; `Olive Oil` is used freely throughout and is a separate ingredient. No nuts are proposed
anywhere. Where a ban removes a traditional element I noted it once and moved on, per the standing rule
that preferences outrank authenticity.
