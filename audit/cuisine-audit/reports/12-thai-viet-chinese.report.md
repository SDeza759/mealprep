# Authenticity audit — Thai + Vietnamese + Chinese (9 recipes)

Mode: **traditional**. Auditor notes on constraints applied throughout:

- **Nut constraint honoured.** Three dishes in this slice are traditionally finished with crushed
  peanuts (larb-adjacent salads, bún vermicelli bowls, and pad thai-family dishes). Peanuts are banned
  app-wide and are never proposed below. The correct nut-free Thai/Vietnamese substitute for that
  crunchy-savoury top note is **crispy fried shallots** (hành phi), which is itself traditional and
  appears on bún bowls alongside peanuts, not instead of them. That is what I propose.
- **No olives proposed anywhere.** `Olive Oil` is untouched and not flagged.
- **A recurring cross-cutting finding:** six of the nine recipes use **Sesame Oil as the wok/frying
  oil**. This is wrong in all three cuisines. Toasted sesame oil is a *finishing* oil in Chinese
  cooking (added off-heat, drops not spoonfuls); it has a low smoke point and burns at wok temperature.
  Thai cooking does not use it at all — Thai stir-fries use a neutral oil (soybean, rice bran, palm).
  Vietnamese likewise. The registry currently offers only `Olive Oil` and `Sesame Oil`, neither of
  which is right, so **`Vegetable Oil` is the single highest-value new registry entry in this slice** —
  it fixes six recipes at once.
- **A second recurring finding:** `Soy Sauce` is doing the work of **`Fish Sauce`** in every Thai and
  Vietnamese recipe here. Fish sauce (น้ำปลา / nước mắm) is *the* defining salt of both cuisines. Soy
  sauce has a role in Thai cooking (dark soy for colour, thin soy alongside fish sauce) but it is never
  the sole seasoning, and in Vietnamese pho and bún it is simply not used. `Fish Sauce` is the second
  highest-value new registry entry.

---

### Shrimp Fried Rice
- **Verdict:** `significantly-off`
- **Cuisine label:** **Incorrect as written.** As currently specified — sesame oil, green peas, soy
  sauce, no fish sauce, no garlic, no tomato — this is textbook **Chinese-American** takeout fried
  rice, not Thai *khao pad*. Two routes: (a) relabel `Chinese` and leave it, or (b) keep the `Thai`
  label and fix it into a real *khao phad goong*. I recommend (b), since the slice is already short on
  genuinely Thai dishes and the fix is small.
- **Findings:**
  1. **No fish sauce.** Thai fried rice is seasoned with fish sauce first, with soy (usually a little
     dark soy for colour) secondary and a pinch of sugar. Soy-only is the Chinese-American profile.
  2. **No garlic.** Every Thai fried rice starts with garlic in hot oil. Its absence is conspicuous.
  3. **Green peas are not Thai.** Peas-and-carrots is the Chinese-American frozen-veg signature. Thai
     khao pad uses **tomato**, onion/shallot, and green onion.
  4. **Sesame oil is the frying medium.** Not used in Thai cooking; see the cross-cutting note above.
  5. **No lime or cucumber.** These are not optional garnishes — khao pad is served with a lime wedge
     and raw cucumber, and the lime squeezed over at the table is part of the dish's balance.
  6. Chili flakes are a reasonable stand-in for the *prik nam pla* condiment but are not the real
     thing; fresh Thai chili is the traditional heat.
  7. Steps say "cook shrimp 2 minutes per side" — shrimp in a wok are tossed, not flipped like a
     steak. Minor technique wording.
- **Proposed fix:**
  - **Ingredients — remove:** `Green Peas` 40g, `Sesame Oil` 5g.
  - **Ingredients — add:** `Vegetable Oil` 8g, `Garlic` 8g, `Tomato` 50g, `Green Onion` 15g,
    `Fish Sauce` 10g, `Cucumber` 40g (served raw alongside), `Lime` 15g.
  - **Ingredients — keep and reduce:** `Soy Sauce` 12g → 5g (it becomes the dark-soy colour note, not
    the seasoning). `White Rice` 60g stays — jasmine is the correct rice and the registry entry is
    generic; worth a comment that jasmine is intended.
  - **Spices:** replace `Chili Flakes` with fresh **`Thai Chili` 2g** (zero-macro, belongs in
    `RECIPE_SPICE_OVERRIDES` like `Aji Limo` already does). Keep `White Pepper` 1g and `Salt` 1g. Add
    **`Sugar` 3g** — the fish-sauce/sugar/lime balance is the point of the dish.
  - **Steps rewrite:** day-old rice → hot wok with vegetable oil → garlic until fragrant → shrimp,
    tossed until just pink → push aside, scramble egg → rice, breaking clumps → tomato and green onion
    → fish sauce, a little dark soy, pinch of sugar, white pepper → plate with cucumber slices and a
    lime wedge to squeeze at the table. Drop "2 minutes per side".
- **New ingredients required:** `Vegetable Oil` (**not in registry**), `Fish Sauce` (**not in
  registry**), `Thai Chili` (spice override, **not currently used**), `Sugar` (spice override or
  registry, **not in registry**). `Garlic`, `Tomato`, `Green Onion`, `Cucumber`, `Lime` are all already
  in the registry.
- **Ingredients no longer used:** `Green Peas`, `Sesame Oil` (from this recipe only — both are used
  elsewhere in the app, so neither becomes a registry orphan).
- **Macro impact:** Small. Dropping 40g peas removes ~32 cal and ~2g protein; adding tomato and
  cucumber adds ~12 cal. Oil swap is calorie-neutral at equal grams (both ~884 cal/100g); I raised oil
  5g→8g, so +27 cal. Fish sauce is negligible. **Net roughly flat, maybe +10 cal, protein -2g.**
- **Confidence:** high
- **Sources:** Simply Suwanee, *Authentic Thai Shrimp Fried Rice (Khao Phad Goong)*; Hot Thai Kitchen;
  Khin's Kitchen *Khao Pad*; Thai Food Guide.

---

### Thai Basil Chicken
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — *pad krapow gai* is unambiguously Thai. The label is fine; the recipe
  is not.
- **Findings:**
  1. **The dish contains no basil at all.** This is the single worst finding in the slice. A recipe
     named "Thai Basil Chicken" whose ingredient list has zero basil does not deliver what its name
     promises. `Basil` is already in the registry, so this is a pure omission, not a sourcing problem.
     (Strictly the dish wants **holy basil**, *bai krapow* — peppery and clove-like, distinct from the
     anise-y Thai sweet basil and from Italian basil. The registry's generic `Basil` is the best
     available match; worth a comment on the line noting holy basil is intended.)
  2. **Bell pepper is not in pad krapow.** It is the Chinese-American stir-fry vegetable. Traditional
     pad krapow is essentially meat + garlic + chili + basil, with long beans or nothing else. This
     substitution is exactly the "wrong staple" pattern.
  3. **No fish sauce and no oyster sauce.** The sauce is fish sauce + oyster sauce + a little dark soy
     + a pinch of sugar. Soy-sauce-only is not the flavour of this dish.
  4. **No fresh chili.** Pad krapow is defined by garlic and Thai chilies pounded together in a
     mortar. `Chili Flakes` 1g is a weak, wrong-form substitute.
  5. **No fried egg (*kai dao*).** The crisp-edged runny-yolk fried egg on top is near-universal in
     the street-food version and is what most people picture. Its absence is a missing defining
     component rather than a wrong one.
  6. **Chicken should be coarsely minced/hand-chopped**, not "diced into small pieces" — the texture
     is part of the dish. Minor.
  7. Sesame oil as frying oil — see cross-cutting note.
  8. **Basil timing matters:** it goes in at the very end, off-heat or on low, and wilts from residual
     heat. If a step is added it must say this, not "stir-fry the basil".
- **Proposed fix:**
  - **Ingredients — remove:** `Bell Pepper` 60g, `Sesame Oil` 5g.
  - **Ingredients — add:** `Basil` 20g (holy basil intended), `Vegetable Oil` 8g, `Fish Sauce` 10g,
    `Egg` 50g (fried, on top).
  - **Ingredients — keep:** `Chicken Thigh` 170g (correct — thigh, not breast), `White Rice` 55g
    (jasmine), `Garlic` 10g (correct and important), `Soy Sauce` 12g → 6g (dark soy for colour only).
  - **Spices:** replace `Chili Flakes` with **`Thai Chili` 3g** (zero-macro override). Add
    **`Oyster Sauce` 10g** and **`Sugar` 2g`**. Keep `White Pepper` 1g, `Salt` 1g. *(Oyster sauce has
    real macros — ~51 cal/100g — so if 10g matters it belongs in the registry rather than the
    zero-macro spice table. At 10g it is ~5 cal, so the spice table is defensible; flagging the
    choice.)*
  - **Steps rewrite:** cook jasmine rice → pound garlic and Thai chilies in a mortar (or mince
    together) → hand-chop the chicken thigh coarsely → hot wok, vegetable oil, garlic-chili paste until
    fragrant, ~20 seconds → chicken, stir-fry hard until browned and slightly crisp at the edges →
    fish sauce, oyster sauce, dark soy, pinch of sugar, toss → **kill the heat, fold in the holy basil
    and let residual heat wilt it** → separately fry an egg in hot oil until the white is crisp and
    the yolk runny → serve over rice with the egg on top.
- **New ingredients required:** `Vegetable Oil` (**not in registry**), `Fish Sauce` (**not in
  registry**), `Thai Chili` (spice override, **new**), `Oyster Sauce` (**not in registry**),
  `Sugar` (**not in registry**). `Basil` and `Egg` are already in the registry.
- **Ingredients no longer used:** `Bell Pepper`, `Sesame Oil` (this recipe only; both used elsewhere).
- **Macro impact:** **Meaningful increase.** Adding a fried egg is +~78 cal and +6g protein; the extra
  frying oil for it another +~25 cal. Removing 60g bell pepper only sheds ~12 cal. Net **+90 to +110
  cal, +6g protein, +8g fat.** The solver will notice. If that is unwelcome, the egg is the one
  component that can be dropped while leaving the dish recognisable — but the basil, chili and fish
  sauce are not negotiable.
- **Confidence:** high
- **Sources:** Hot Thai Kitchen, *Pad Kra Pao (Holy Basil Stir-Fry)*; Susie Cooks Thai, *Authentic Pad
  Krapow Gai*; Curious Cuisiniere.

---

### Chicken Lettuce Wraps with Rice
- **Verdict:** `not-a-real-dish`
- **Cuisine label:** **Incorrect.** "Chicken lettuce wraps" is a **Chinese-American restaurant
  invention** — popularised by P.F. Chang's, descended loosely from Cantonese *sang choi bao*. It is
  not Thai in any form. Filing it under `Thai` is the clearest mislabel in the slice. Compounding
  this, `Coleslaw Mix` is a Western supermarket bagged product that has no place in any of the three
  cuisines here.
- **Findings:**
  1. The dish does not exist in Thai cuisine under this or any name.
  2. `Coleslaw Mix` (shredded cabbage + carrot, a packaged American product) is a supermarket
     convenience item, not an ingredient of a tradition.
  3. Seasoning is soy sauce and nothing else — no fish sauce, no lime in the meat, no chili, no herbs.
     Even judged as a generic Asian-ish wrap it is under-seasoned.
  4. The `Carrot` is both in the ingredient list *and* inside `Coleslaw Mix` — redundant.
  5. Steps say "Heat oil in a wok" but **no oil is in the ingredient list**. This is a phantom
     ingredient, a real data bug independent of authenticity.
- **Proposed fix:** **Rebuild as *Larb Gai* (ลาบไก่)**, the Isan (northeastern Thai) minced chicken
  salad. This is the genuine Thai dish in this space: it is a minced-chicken preparation, it is
  legitimately eaten scooped into lettuce or cabbage leaves, and it is served with rice — so it
  preserves everything the current recipe was structurally trying to be, including the wrap format and
  the rice side, while becoming a real dish. Rename the recipe **`Larb Gai`**.
  - **Ingredients — remove:** `Coleslaw Mix` 40g, `Carrot` 50g, `Soy Sauce` 12g.
  - **Ingredients — keep:** `Chicken Breast` 180g (minced; thigh would be more traditional but breast
    is acceptable and better for the macro targets), `Romaine Lettuce` 80g (the leaf cups),
    `Lime` 15g (now central, not a garnish), `White Rice` 55g — **and this is the elegant part: 8g of
    that rice is dry-toasted in a pan until golden-brown and ground coarsely to make *khao khua*,
    toasted rice powder.** Khao khua is the component that separates real larb from an approximation,
    and it requires **no new ingredient at all** — just a step.
  - **Ingredients — add:** `Fish Sauce` 12g, `Red Onion` 25g (standing in for shallot — see note),
    `Green Onion` 15g, `Cilantro` 8g, `Mint` 10g.
  - **Spices:** `Chili Flakes` 2g (correct here — Isan larb genuinely uses *toasted dried* chili
    flakes, not fresh chili, so the existing entry is right for once), `Sugar` 2g, keep `Salt` 1g,
    drop `White Pepper` (not a larb seasoning).
  - **Steps rewrite:** dry-toast 8g raw rice in a pan over medium heat until deep golden and nutty,
    grind coarse — this is khao khua → cook the rest of the rice normally → mince the chicken breast
    → cook it in a splash of water over high heat (larb meat is cooked in a little water or stock, not
    fried in oil — which conveniently removes the phantom-oil bug) → while still warm, toss with lime
    juice, fish sauce, sugar, toasted chili flakes → fold in sliced red onion, green onion, cilantro,
    mint and the khao khua → spoon into romaine cups, serve with rice on the side.
  - **Nut note:** larb is not a peanut dish, so the nut ban costs this recipe nothing. Its crunch
    comes from khao khua, which is rice.
- **New ingredients required:** `Fish Sauce` (**not in registry**), `Mint` (**not in registry** —
  recommend registry rather than spice override, since 10g of fresh mint is a real component here and
  `Basil` is already precedented as a registry herb), `Sugar` (**not in registry**). Ideally also
  **`Shallot`** — larb wants shallot, not red onion, and the project's own data backlog already lists
  `Shallots` as a wanted addition for Pan-Seared Duck, so this is a second recipe justifying it. Red
  onion is the acceptable fallback until then.
- **Ingredients no longer used:** `Coleslaw Mix`, `Carrot` (this recipe only), `Soy Sauce` (this
  recipe only). **Check `Coleslaw Mix` for orphan status** — if no other recipe references it, removing
  it here strands the registry entry, which the project's data-hygiene convention says to sweep for.
- **Macro impact:** **Modest decrease.** Removing coleslaw mix and carrot sheds ~40 cal of
  carbohydrate; the herbs and onion add back ~15. Chicken, rice and lettuce are unchanged, so protein
  is essentially identical. **Net -20 to -30 cal, protein flat.** Fat drops slightly since the phantom
  frying oil is replaced by water-cooking.
- **Confidence:** high
- **Sources:** Hot Thai Kitchen, *Authentic Thai Laab*; Susie Cooks Thai, *Authentic Chicken Larb*;
  Thai-Foodie; Sticky Rice Thai Kitchen, *Laab Gai*.

---

### Shrimp & Veggie Stir Fry
- **Verdict:** `significantly-off`
- **Cuisine label:** **Not defensible as written.** Nothing in this recipe is Thai: the seasoning is
  soy sauce alone, the oil is sesame, the rice is brown, and there is no garlic, fish sauce, oyster
  sauce or chili. It is a generic pan-Asian stir-fry with a `Thai` label attached. The good news is
  that a real Thai dish sits almost exactly on top of it — **pad pak ruam mit** ("stir-fried mixed
  vegetables", literally "everything mixed together"), which is genuinely flexible about which
  vegetables go in and is commonly made with shrimp. Fix the sauce and the rice and the label earns
  itself. Rename **`Pad Pak Ruam Mit Goong`**.
- **Findings:**
  1. **No garlic.** Pad pak ruam mit begins with garlic in hot oil, ~20 seconds until golden. Every
     Thai stir-fry does. Its absence is the clearest tell.
  2. **No oyster sauce and no fish sauce.** The sauce is oyster sauce + fish sauce (or thin soy) +
     sugar + white pepper. Soy-sauce-only is not this dish's flavour.
  3. **No sugar.** The savoury-sweet balance is not optional in Thai stir-fry seasoning.
  4. **Brown rice is not Thai.** Thai food is eaten with jasmine rice. This is a Western
     health-food substitution and, under traditional mode, a substituted staple.
  5. **Zucchini is not a Thai stir-fry vegetable.** Bell pepper and carrot are both fine and appear in
     real versions; zucchini is a Mediterranean vegetable. Thai choices would be baby corn, snow peas,
     napa cabbage, mushrooms, Chinese broccoli (gai lan), or long beans.
  6. **Sesame oil as the frying medium.** Worth a nuance here: unlike pad krapow, pad pak ruam mit
     *sauces* sometimes do carry a few drops of sesame oil, reflecting the dish's Thai-Chinese
     heritage. So sesame oil is not banned from this recipe — but it belongs in the sauce, off-heat,
     not as the 5g of fat you heat the wok with.
  7. The dish has no name of its own — "Shrimp & Veggie Stir Fry" is an English description, not a
     dish. Under traditional mode, that alone makes the cuisine claim hard to assess.
- **Proposed fix:**
  - **Ingredients — remove:** `Zucchini` 60g, `Brown Rice` 60g.
  - **Ingredients — add:** `White Rice` 60g (jasmine), `Garlic` 8g, `Vegetable Oil` 8g,
    `Fish Sauce` 8g, `Cabbage` 60g (standing in for napa; see note), `Green Onion` 10g.
  - **Ingredients — keep:** `Shrimp` 160g, `Bell Pepper` 70g, `Carrot` 50g, `Soy Sauce` 12g → 6g,
    `Sesame Oil` 5g → 2g **and moved to the sauce, added off-heat at the end**.
  - **Spices:** add **`Oyster Sauce` 12g** and **`Sugar` 3g**. Keep `White Pepper` 1g (correct and
    important here) and `Salt` 1g. Replace `Chili Flakes` with **`Thai Chili` 2g** or drop heat
    entirely — pad pak ruam mit is often mild, so this one is genuinely optional.
  - **Steps rewrite:** cook jasmine rice → mix the sauce (oyster sauce, fish sauce, soy, sugar, white
    pepper, sesame oil) in a bowl first, as Thai cooks do, so it goes in as one splash → peel and
    devein shrimp; slice bell pepper, carrot, cabbage → very hot wok, vegetable oil, garlic ~20
    seconds until golden → shrimp, tossed until just pink, remove → harder vegetables (carrot,
    cabbage) first, then bell pepper, 2-3 minutes, keeping them crisp → return shrimp, pour in the
    sauce, toss to coat → green onion, off heat → serve over jasmine rice.
  - Note the "2-3 minutes per side" for shrimp should go, same as in Shrimp Fried Rice — wok shrimp
    are tossed continuously, not flipped.
- **New ingredients required:** `Vegetable Oil` (**not in registry**), `Fish Sauce` (**not in
  registry**), `Oyster Sauce` (**not in registry**), `Sugar` (**not in registry**), `Thai Chili`
  (spice override, **new**, optional here). Ideally **`Napa Cabbage`** and/or **`Baby Corn`** for a
  properly Thai vegetable mix, but `Cabbage` is already in the registry and is an honest stand-in, so
  I am not requiring them.
- **Ingredients no longer used:** `Zucchini` (this recipe only), `Brown Rice` (this recipe only —
  **check for orphan status**; brown rice may well be referenced by other recipes in the app, but if
  this is its only use, removing it strands the registry entry).
- **Macro impact:** **Near neutral, slight fibre/carb shift.** Brown rice → white rice at equal grams
  is roughly calorie-equivalent (both ~360 cal/100g dry) but loses fibre. Zucchini out (-10 cal),
  cabbage in (+15 cal). Oil goes 5g → 10g total (8g vegetable + 2g sesame), so **+45 cal fat**.
  Oyster sauce and sugar add ~18 cal. **Net +60 to +70 cal, protein flat.**
- **Confidence:** high
- **Sources:** Rachel Cooks Thai, *Stir-fried Mixed Vegetables (Pad Pak Ruam Mit)*; ImportFood,
  *Thai Stir-Fried Vegetables, Pad Phak Ruam Mitr*; Simply Suwanee; Hungry in Thailand.

---

### Beef Pho
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — phở bò is Vietnamese. The label is right; the broth is not pho.
- **Findings:** Pho is a broth dish. Everything else — the noodles, the beef, the garnish — is
  assembly. So a pho recipe stands or falls on its broth, and this broth has five separate problems.
  1. **The spice sachet is one cinnamon stick.** Real pho bo is defined by a *toasted* spice blend:
     **star anise** (the single most identifiable pho aroma), cassia/cinnamon, **clove**, **coriander
     seed**, **black cardamom**, and usually **fennel seed**. Cinnamon alone gets you maybe a fifth of
     the way. This is the biggest single finding in the recipe.
  2. **The aromatics are not charred.** Onion and ginger are charred black over a flame or under a
     broiler before they go in the pot. This is not a refinement — it is the step that removes their
     raw pungency and gives pho its smoky backbone. The recipe adds them raw and sliced.
  3. **Garlic does not belong in pho broth.** Charred onion and ginger are the aromatics; garlic is
     not among them. (Garlic appears in pho only as a *condiment* — the jar of garlic-steeped vinegar
     on northern tables — never simmered into the broth.) This is a straightforward wrong-ingredient
     finding.
  4. **Soy sauce is not used in pho.** The broth is seasoned with **fish sauce**, rock sugar and salt.
     Soy sauce is a Chinese seasoning and reads immediately wrong in a pho bowl.
  5. **No bones, and a 20-minute cook time.** Pho broth is beef bones — marrow and knuckle —
     parboiled, rinsed, then simmered gently and *uncovered* for **4 to 10 hours**. Twenty minutes of
     boiling water with an onion in it is a different dish. I recognise a meal-prep app cannot simmer
     overnight; see the fix for how to be honest about this rather than mislabel it.
  6. **Spinach is not a pho garnish.** The garnish plate is **bean sprouts, Thai basil, culantro
     (ngò gai), cilantro, scallion, lime wedges and sliced chili**, served on the side for the eater
     to add. Spinach appears in no version of pho and wilting it into the bowl is a Western
     add-a-green substitution.
  7. Minor: 30g dry rice noodles is a very small portion for a bowl of pho (a restaurant bowl is
     closer to 70-100g dry). Flagging as a name-vs-dish observation, not an authenticity finding —
     the macro solver presumably drove this.
  8. The raw-beef-cooked-by-ladled-broth technique (phở tái) is **correct and well executed**. Credit
     where due — that step is right, and thin slicing against the grain is right too.
- **Proposed fix:** Keep it a quick weeknight pho, but stop pretending water and an onion make pho
  broth. Every fix below except the long simmer is free.
  - **Ingredients — remove:** `Garlic` 5g (wrong aromatic), `Soy Sauce` 10g (wrong seasoning),
    `Spinach` 40g (wrong garnish).
  - **Ingredients — add:** `Fish Sauce` 12g, `Bean Sprouts` 50g, `Basil` 10g (Thai basil intended),
    `Cilantro` 5g, `Green Onion` 15g.
  - **Ingredients — keep:** `Beef Sirloin` 150g, `Rice Noodles` 30g (bánh phở — flat rice noodles;
    worth a comment, since the same registry entry also serves the round vermicelli in Bun Tom),
    `Onion` 30g (now charred), `Lime` 15g, `Ginger` 5g → 10g (now charred, and worth more of it).
  - **Spices:** this is where the real repair happens. Replace `[Cinnamon, Salt, Black Pepper]` with
    **`Star Anise` 1g, `Cinnamon` 1g, `Clove` 0.5g, `Coriander Seed` 1g, `Black Cardamom` 1g,
    `Fennel Seed` 0.5g, `Salt` 1g, `Sugar` 3g** (rock sugar intended). All are zero-macro whole spices
    and fit `RECIPE_SPICE_OVERRIDES` cleanly. **Drop `Black Pepper`** — it is not a pho spice.
  - **Steps rewrite:** char the onion and ginger directly over a flame or under the broiler until
    blackened in patches, then scrape off the worst of the char → dry-toast the star anise, cinnamon,
    clove, coriander seed, black cardamom and fennel in a pan until fragrant, ~2 minutes, and tie them
    in a spice bag → simmer beef broth (store-bought is the honest weeknight shortcut; from scratch
    means beef bones parboiled, rinsed and simmered 6+ hours) with the charred aromatics and the spice
    bag for at least 30-40 minutes → season with fish sauce, sugar and salt, tasting → cook the rice
    noodles separately, drain → slice the sirloin paper-thin against the grain → noodles in the bowl,
    raw beef fanned over the top → pour the boiling broth over the beef to cook it → serve with bean
    sprouts, Thai basil, cilantro, green onion, lime and chili on a plate alongside, for the eater to
    add. **Say explicitly in step one that this is a shortcut broth**, so the recipe is not claiming to
    be something it isn't.
- **New ingredients required:** `Fish Sauce` (**not in registry**), `Bean Sprouts` (**not in
  registry**), `Sugar` (**not in registry**), and the spice-override additions `Star Anise`, `Clove`,
  `Coriander Seed`, `Black Cardamom`, `Fennel Seed` (**all new**; `Coriander Powder` exists but seed
  is what you toast — powder in a broth turns it cloudy and muddy). `Basil`, `Cilantro`, `Green Onion`
  are already in the registry.
- **Ingredients no longer used:** `Garlic` (this recipe only), `Soy Sauce` (this recipe only),
  `Spinach` (this recipe only). All three are heavily used elsewhere — no orphan risk.
- **Macro impact:** **Essentially neutral, slightly down.** Removing 40g spinach (-9 cal) and adding
  50g bean sprouts (+15 cal) plus herbs (+5 cal) nets to nothing. Fish sauce replacing soy sauce is a
  wash. No oil, no bones rendered into the counted macros. **Net within ±15 cal, protein unchanged.**
  This is the cheapest big authenticity win in the slice.
- **Confidence:** high
- **Sources:** Delightful Plate, *Authentic Vietnamese Beef Pho Noodle Soup (Phở Bò)*; Manila Spoon,
  *How to Make Authentic Pho Bo*; Cooking Therapy, *Traditional Vietnamese Pho*; Honest Cooking,
  *Classic: Pho Bo*.

---

### Chicken Pho
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — phở gà is Vietnamese.
- **Findings:** Most of the Beef Pho findings apply, plus one that is specific and worse here.
  1. **No ginger at all.** This is the standout finding. Ginger is arguably *more* essential to phở gà
     than to phở bò — the Hanoi-style version strips the spicing right back to charred ginger and
     toasted coriander seed, and ginger is the aromatic doing the heavy lifting. A chicken pho with
     onion and cinnamon and no ginger is not recognisable as phở gà. Note that Beef Pho, sitting right
     next to it in the data, *does* have ginger — so this looks like an omission rather than a
     decision.
  2. **The spice blend is again just cinnamon.** Phở gà is spiced more lightly than phở bò —
     **coriander seed, star anise, and often clove and cinnamon**, with a genuine regional split: the
     Hanoi style (phở gà Hà Nội) uses **no star anise and no cinnamon at all**, relying on charred
     ginger and toasted coriander seed alone. Both are legitimate. What is not legitimate is cinnamon
     as the *only* spice — that belongs to neither tradition.
  3. **Aromatics not charred.** Same finding as Beef Pho, same fix.
  4. **Garlic is not a pho aromatic.** Same finding as Beef Pho.
  5. **Spinach is not a pho garnish.** Same finding — bean sprouts, herbs, lime, chili on the side.
  6. **No fish sauce.** Phở gà is seasoned with fish sauce and a little sugar. This recipe has no
     seasoning at all beyond salt and pepper — it is unseasoned chicken soup.
  7. **Chicken breast, sliced into strips and simmered 8-10 minutes.** Phở gà is made by poaching a
     whole chicken (or bone-in thighs) — the bird makes the broth *and* provides the meat, which is
     then hand-shredded, not sliced into strips. Thigh meat is the preferred serving meat. Simmering
     bare breast strips in water gives neither good broth nor good texture. This is a technique
     finding, and the reason the broth has nothing in it.
  8. Same minor note on 30g dry noodles being a small bowl.
- **Proposed fix:**
  - **Ingredients — remove:** `Garlic` 5g, `Spinach` 40g.
  - **Ingredients — add:** `Ginger` 10g (**charred — the key fix**), `Fish Sauce` 12g,
    `Bean Sprouts` 50g, `Cilantro` 8g, `Green Onion` 15g, `Basil` 8g (Thai basil).
  - **Ingredients — keep:** `Chicken Breast` 170g (thigh is more traditional and shredding it is
    better still, but breast serves the macro targets and is a defensible compromise — the fix that
    matters is **shredding rather than slicing into strips**), `Rice Noodles` 30g, `Onion` 30g (now
    charred), `Lime` 15g.
  - **Spices:** replace `[Cinnamon, Salt, Black Pepper]` with **`Coriander Seed` 1.5g,
    `Star Anise` 0.5g, `Cinnamon` 0.5g, `Clove` 0.25g, `Salt` 1g, `Sugar` 2g**. Keep the spicing
    deliberately lighter than Beef Pho — that contrast is real and correct. **Drop `Black Pepper`.**
    *(If you prefer the Hanoi style, drop star anise and cinnamon entirely and lean on charred ginger
    plus toasted coriander seed. Both are authentic; pick one and say which in the steps.)*
  - **Steps rewrite:** char the onion and ginger over a flame or under the broiler until blackened →
    dry-toast the coriander seed, star anise, cinnamon and clove until fragrant, tie in a spice bag →
    simmer chicken broth with the charred aromatics and spice bag, poaching the chicken in it for
    12-15 minutes until just cooked → lift the chicken out, **hand-shred it**, and let the broth carry
    on for another 15-20 minutes → season with fish sauce, sugar and salt → cook rice noodles
    separately → noodles in the bowl, shredded chicken over → ladle broth through a strainer → serve
    with bean sprouts, cilantro, green onion, Thai basil, lime and chili on a plate alongside.
- **New ingredients required:** `Fish Sauce` (**not in registry**), `Bean Sprouts` (**not in
  registry**), `Sugar` (**not in registry**), spice-override additions `Coriander Seed`, `Star Anise`,
  `Clove` (**all new**). `Ginger`, `Cilantro`, `Green Onion`, `Basil` are already in the registry —
  note that **`Ginger` being absent from this recipe while present in the registry and in Beef Pho
  makes it a free fix.**
- **Ingredients no longer used:** `Garlic` (this recipe only), `Spinach` (this recipe only). Both used
  heavily elsewhere — no orphan risk.
- **Macro impact:** **Essentially neutral.** Spinach out (-9 cal), bean sprouts and herbs in (+22
  cal), fish sauce negligible. **Net +10 to +15 cal, protein unchanged.** Switching breast → thigh
  would raise fat and calories noticeably, which is why I left breast in place.
- **Confidence:** high
- **Sources:** Delightful Plate, *Authentic Pho Ga*; Hungry Huy, *Chicken Phở Recipe*; My Viet
  Kitchen, *Authentic Hanoi-Style Chicken Pho*; Chef Tu David Phu, *Phở Gà*; RecipeTin Eats.

---

### Bun Tom
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — bún tôm nướng is Vietnamese.
- **Findings:**
  1. **There is no nước chấm.** This is the defining omission and the reason for the verdict. A bún
     bowl *is* cold vermicelli plus grilled protein plus herbs **plus the dressing poured over it**.
     Nước chấm — fish sauce, lime juice, sugar, water, garlic, chili, whisked to balance — is not a
     condiment on the side, it is the component that turns a pile of noodles into the dish. Without
     it, what is described here is undressed cold noodles with shrimp. Nothing else in this recipe
     matters as much.
  2. **No lemongrass.** Bún tôm *nướng* means grilled shrimp, and the shrimp are marinated in
     lemongrass, garlic, fish sauce and sugar before grilling. The recipe seasons them with salt and
     pepper — a Western seasoning that gives none of the dish's character.
  3. **No fresh herbs.** Mint, cilantro and perilla are structural in a bún bowl, tossed through the
     noodles rather than sprinkled on top. Romaine lettuce alone does not cover this.
  4. **No đồ chua (pickled carrot and daikon).** The recipe has raw julienned carrot, which is the
     right vegetable prepared the wrong way. Đồ chua is quick-pickled in vinegar and sugar, and its
     sharpness is part of the balance.
  5. **No bean sprouts.** Standard in the bowl.
  6. **The name is incomplete.** "Bún tôm" on its own denotes a shrimp noodle **soup** in Vietnamese
     usage; the cold grilled-shrimp vermicelli bowl this recipe actually describes is **bún tôm
     nướng**. Recommend renaming to `Bun Tom Nuong` so the name matches the dish.
  7. Romaine is an acceptable but unusual choice — bún bowls use soft leaf lettuce, shredded. Minor,
     and romaine is already in the registry, so I would leave it and just shred it.
  8. **Nut constraint:** bún bowls are traditionally finished with crushed roasted peanuts. Peanuts
     are banned app-wide and I am not proposing them. The correct nut-free substitute is **crispy
     fried shallots (hành phi)**, which is itself a traditional bún topping served *alongside*
     peanuts, so this loses nothing in authenticity — it is a real component, not a workaround.
- **Proposed fix:**
  - **Ingredients — keep:** `Shrimp` 180g, `Rice Noodles` 24g (bún — round vermicelli; note that the
    same registry entry serves the flat bánh phở in the pho recipes), `Cucumber` 60g, `Carrot` 40g
    (**now quick-pickled as đồ chua**), `Lime` 15g, `Romaine Lettuce` 60g (**shredded**).
  - **Ingredients — add:** `Fish Sauce` 15g (for the nước chấm and the shrimp marinade),
    `Mint` 10g, `Cilantro` 8g, `Bean Sprouts` 40g, `Green Onion` 10g (for scallion oil, mỡ hành),
    `Vegetable Oil` 5g, `Shallot` 15g (fried crisp — the nut-free crunch), `Garlic` 5g (in the nước
    chấm — unlike pho, garlic *is* correct here).
  - **Spices:** add **`Lemongrass` 8g** (zero-macro aromatic, fits `RECIPE_SPICE_OVERRIDES`),
    **`Sugar` 8g** (needed in both the nước chấm and the đồ chua — this one is a real quantity and
    should carry macros), **`Rice Vinegar` 10g** (zero-macro, for the đồ chua), **`Thai Chili` 2g**.
    Keep `Salt` 1g. **Drop `Black Pepper`** — it is not a bún seasoning.
  - **Steps rewrite:** quick-pickle the julienned carrot in rice vinegar, sugar and a pinch of salt,
    30 minutes → whisk the nước chấm: fish sauce, lime juice, sugar, warm water, minced garlic and
    chili, tasting until it is balanced sour-salty-sweet → marinate the shrimp in minced lemongrass,
    garlic, fish sauce and sugar for 15 minutes → cook the vermicelli, drain, rinse cold, drain well →
    grill or sear the shrimp over high heat until charred at the edges → fry the sliced shallot in
    vegetable oil until golden and crisp, drain; use a little of the oil with the green onion to make
    scallion oil → build the bowl: shredded lettuce and bean sprouts at the bottom, cold noodles over,
    then cucumber, pickled carrot, mint and cilantro, grilled shrimp on top, scallion oil and crispy
    fried shallots to finish → **pour the nước chấm over at the table and toss.**
- **New ingredients required:** `Fish Sauce` (**not in registry**), `Mint` (**not in registry**),
  `Bean Sprouts` (**not in registry**), `Shallot` (**not in registry** — already on the project's own
  data backlog for Pan-Seared Duck, so this is a third recipe justifying it), `Vegetable Oil` (**not
  in registry**), `Sugar` (**not in registry**), plus spice-override additions `Lemongrass`,
  `Rice Vinegar`, `Thai Chili` (**all new**). `Cilantro`, `Green Onion`, `Garlic` already exist.
- **Ingredients no longer used:** `none` — every current ingredient survives the fix, several with a
  changed preparation.
- **Macro impact:** **Moderate increase, mostly carbs and fat.** The nước chấm and đồ chua add ~8-10g
  sugar (+35 cal); fried shallots plus their oil add ~50 cal of fat; bean sprouts and herbs add ~15
  cal. **Net +100 cal, protein unchanged, fat +5g, carbs +10g.** This is the largest macro swing in
  the slice. If that is a problem the fried shallots are the droppable part — but the nước chấm is
  not, and it is where most of the sugar sits.
- **Confidence:** high
- **Sources:** Delightful Plate, *Vietnamese Shrimp Noodle Soup (Bún Tôm)* (for the name distinction);
  EatFoodlicious, *Grilled Shrimp Vermicelli Bowl (Bun Tom Nuong)*; The Culinary Chronicles, *Bún Tôm
  Nướng Sả*; Vicky Pham, *Bún Thịt Nướng*; Rasa Malaysia.

---

### Five-Spice Duck Stir Fry with Rice
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` in intent — stir-fried duck is a real Chinese preparation and the
  five-spice-and-duck pairing is genuinely Chinese. But as executed the dish is **Chinese-American**:
  the vegetables, the missing wine and starch, and the sauce-by-splashing all belong to the takeout
  idiom rather than to Chinese home or restaurant cooking. Keep the label, fix the cooking.
- **Findings:**
  1. **Wrong cut of duck.** `Duck Leg` is a slow-cooking cut — connective tissue and dense muscle
     that wants braising, confit or roasting to become tender. Thinly slicing a raw duck leg and
     stir-frying it for 3-4 minutes gives chewy meat. **Duck breast is the stir-fry cut**, sliced
     against the grain. `Duck Breast` is already in the registry, so this is a one-word fix.
  2. **No Shaoxing wine.** Shaoxing rice wine is close to non-negotiable in Chinese stir-frying —
     splashed down the hot side of the wok so it steams up and off, taking the gamey notes with it.
     For duck specifically, which has a strong flavour, it is doing real work. Its absence is the
     largest single gap.
  3. **No cornstarch, so no velveting and no sauce.** Two consequences. First, Chinese stir-fry meat
     is *velveted* — marinated in cornstarch, Shaoxing wine and white pepper, which forms a barrier
     that keeps it juicy. Second, the sauce is thickened with a cornstarch slurry so it clings.
     Without it, "splash with soy sauce and toss to coat" leaves a watery pan with the seasoning
     sliding off the food.
  4. **Sesame oil is the frying medium.** The sources are unambiguous that toasted sesame oil is a
     finishing oil in Chinese cooking, added off-heat at the end. It burns at wok temperature. A
     balanced Chinese stir-fry sauce runs roughly **2 parts oyster sauce : 1 soy : 1 Shaoxing : ½
     sesame oil**, thickened with cornstarch — note sesame oil is in there, just at the end and in
     small amounts.
  5. **No oyster sauce.** See above — it is the base of the standard sauce, not soy sauce alone.
  6. **Broccoli is the Western vegetable.** The Chinese vegetable is **gai lan (Chinese broccoli)** —
     a different plant with thick stems and flat leaves. Common broccoli in a Chinese stir-fry is the
     Chinese-American signature. Bell pepper is likewise a takeout vegetable. More traditional
     partners for duck are gai lan, scallion (in quantity), leek, bamboo shoots or bok choy.
  7. **Five-spice is used as a dry rub.** In Chinese cooking five-spice appears in braises, roasts
     and wet marinades — combined with soy, wine and sugar — rather than tossed on meat like a
     barbecue rub, which is a Western reading of the spice.
  8. **Redundant and wrong peppers.** Five-spice already contains star anise, cinnamon, clove, fennel
     and Sichuan pepper. Layering `White Pepper` *and* `Black Pepper` on top of it is redundant, and
     black pepper is the wrong one — **Chinese cooking uses white pepper**. Drop black pepper.
  9. Credit where due: the aromatics-first sequence (garlic and ginger 30 seconds until fragrant,
     then protein, then vegetables), high heat, and the green onion garnish are all correct.
- **Proposed fix:**
  - **Ingredients — swap:** `Duck Leg` 150g → **`Duck Breast` 150g**.
  - **Ingredients — remove:** `Broccoli` 80g, `Bell Pepper` 60g.
  - **Ingredients — add:** `Vegetable Oil` 8g, `Cornstarch` 6g, `Cabbage` 80g (bok choy or gai lan
    intended — see note), `Green Onion` 15g → 30g (scallion in quantity is a classic duck partner).
  - **Ingredients — keep:** `White Rice` 50g, `Soy Sauce` 10g, `Garlic` 5g, `Ginger` 5g,
    `Sesame Oil` 3g **moved to the end of the sauce, off-heat**.
  - **Spices:** add **`Shaoxing Wine` 15g** (zero-macro after cooking, fits `RECIPE_SPICE_OVERRIDES`)
    and **`Oyster Sauce` 12g** and **`Sugar` 3g**. Keep `Five-Spice` 2g, `Salt` 1g, `White Pepper` 1g.
    **Drop `Black Pepper`.**
  - **Steps rewrite:** cook the rice → slice the duck breast thinly against the grain and marinate 15
    minutes in cornstarch, Shaoxing wine, a little soy, five-spice and white pepper (this is velveting,
    and it is where the five-spice belongs) → mix the sauce separately: oyster sauce, soy, a splash of
    Shaoxing, sugar, and the remaining cornstarch slaked in water → get the wok smoking hot, add
    vegetable oil → garlic and ginger, 20-30 seconds until fragrant → duck, spread in one layer and
    left to sear before tossing, 2-3 minutes → cabbage/bok choy, 2 minutes, still crisp → pour the
    sauce down the side of the wok, toss until it thickens and glosses the duck → **off the heat**,
    green onion and the 3g of sesame oil, toss once → serve over rice.
- **New ingredients required:** `Vegetable Oil` (**not in registry**), `Cornstarch` (**not in
  registry** — `Flour` exists but is a poor substitute; cornstarch is the Chinese default binder and
  gives the glossy finish flour cannot), `Shaoxing Wine` (spice override, **new**), `Oyster Sauce`
  (**not in registry**), `Sugar` (**not in registry**). Ideally **`Gai Lan`** or **`Bok Choy`** for a
  properly Chinese vegetable; `Cabbage` is the honest registry stand-in and I am not requiring them.
  `Duck Breast`, `Green Onion` already exist.
- **Ingredients no longer used:** `Duck Leg` (**see the orphan warning in the summary — this is the
  only other recipe using it besides Peking-Style Duck Wraps, which I also propose switching to
  `Duck Breast`; between them they would strand the `Duck Leg` registry entry entirely**),
  `Broccoli` and `Bell Pepper` (this recipe only, both used elsewhere).
- **Macro impact:** **Meaningful.** Duck leg → duck breast is the big one: skin-on duck breast is
  fattier than leg meat, but if the app's registry entry is skinless the two are comparable — check
  the actual registry values before assuming. Oil rises 3g → 11g total (+70 cal). Cornstarch adds ~22
  cal of carbohydrate, oyster sauce and sugar ~18 cal. Removing 140g of broccoli and bell pepper sheds
  ~40 cal but also bulk. **Net +70 to +90 cal, fat +8g, protein roughly flat** (duck grams unchanged).
- **Confidence:** high on technique and sauce composition; **medium** on the duck-cut macro
  consequence, since that depends on registry values I have not read.
- **Sources:** The Woks of Life, *How to Velvet Beef / Chicken for Stir-fry*; Michelin Guide,
  *Technique Thursday: Velveting in Chinese Cooking*; Omnivore's Cookbook, *Chinese Duck Stir Fry*;
  The Woks of Life / Red House Spice on gai lan.

---

### Peking-Style Duck Wraps
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — Peking duck is Chinese (Beijing), and the name's "-Style" hedge
  honestly signals an adaptation rather than a claim to the real thing.
- **Findings:** This is **the most salvageable recipe in the slice**, and I want to be clear about why
  it scores better than the others: the dish's identity — duck, sweet dark sauce, cucumber batons,
  scallion, thin wrap, assembled by the eater — is entirely correct, and its sauce choice is
  legitimate rather than a compromise. Two of the three fixes are one-line data changes.
  1. **Garlic and ginger do not belong here.** This is the sharpest error. Peking duck's accompaniments
     are precisely four things — pancakes, sweet bean sauce or hoisin, julienned cucumber, scallion.
     Garlic and ginger appear nowhere in the dish, and searing the duck *with* them puts a Cantonese
     stir-fry aromatic base into a Beijing roast. Removing them is free and makes the dish more
     authentic, not less.
  2. **Wrong cut of duck, and therefore the wrong technique.** Peking duck is fundamentally about
     lacquered, shatteringly crisp *skin*, and secondarily about the breast meat under it. `Duck Leg`
     cannot deliver that: leg skin needs long rendering, and the step "sear until skin is crispy...
     about 5-6 minutes" will not happen with a sliced leg. The right home approximation is a
     **duck breast, skin scored in a crosshatch, started skin-side-down in a cold dry pan** and left
     to render slowly for 6-8 minutes until the fat runs out and the skin is glassy, then flipped
     briefly and sliced. `Duck Breast` is already in the registry.
  3. **Whole wheat tortilla for Mandarin pancakes.** Real *chun bing* are thin, soft, unleavened
     wheat-flour pancakes, steamed, and noticeably thinner and more delicate than any tortilla. A
     whole wheat tortilla is a substituted staple and the whole-wheat part in particular reads wrong.
     Of the three findings this is the one I would accept a compromise on, since making Mandarin
     pancakes is real work — but a **plain flour tortilla is meaningfully closer than a whole wheat
     one**, and the registry does contain `Flour` if the from-scratch route is ever wanted.
  4. **Hoisin sauce is fine — not a finding.** Beijing tradition is sweet bean sauce (*tian mian
     jiang*), but hoisin is a widely accepted alternative both in Western restaurants and
     increasingly in China, and multiple sources list them as interchangeable for this dish. 25g is a
     sensible amount. Leave it, ideally with a comment noting tianmianjiang is the stricter choice.
  5. Cucumber and green onion are correct in both identity and quantity. The assembly step —
     smear sauce, add duck, cucumber, scallion, roll — is correct.
  6. Minor: green onion should be cut into long fine julienne strips, matching the cucumber batons,
     not just "sliced lengthwise". The step is nearly right already.
- **Proposed fix:**
  - **Ingredients — swap:** `Duck Leg` 150g → **`Duck Breast` 150g**. `Whole Wheat Tortilla` 70g →
    a plain flour tortilla if one is ever added; **otherwise leave as-is and accept the drift**, since
    no better registry option exists today.
  - **Ingredients — remove:** `Garlic` 5g, `Ginger` 5g.
  - **Ingredients — keep unchanged:** `Cucumber` 60g, `Green Onion` 20g, `Hoisin Sauce` 25g.
  - **Spices:** keep `Salt` 1g. **Drop `Black Pepper`** — not part of this dish, and Chinese cooking
    reaches for white pepper regardless.
  - **Steps rewrite:** score the duck breast skin in a crosshatch without cutting into the meat, salt
    it → place skin-side-down in a **cold, dry pan** and bring to medium heat, rendering 6-8 minutes
    until the fat has run and the skin is deep golden and crisp → flip for 2 minutes, rest 5 minutes,
    then slice thinly → julienne the cucumber and cut the green onion into long fine strips → warm the
    tortilla in a dry pan 30 seconds a side → smear with hoisin, lay on the duck, cucumber and
    scallion, roll and serve. **Remove all mention of garlic and ginger.**
- **New ingredients required:** `none` required. Optional: a plain **`Flour Tortilla`** registry entry
  would improve this and cost nothing elsewhere.
- **Ingredients no longer used:** `Duck Leg` (**orphan warning — see summary**), `Garlic` and `Ginger`
  (this recipe only; both used widely elsewhere). `Whole Wheat Tortilla` only if the tortilla is
  swapped.
- **Macro impact:** **Small but real, and direction depends on the registry.** Removing garlic and
  ginger is negligible (~5 cal). Duck leg → duck breast at the same 150g is the only meaningful
  change; skin-on duck breast is fattier, skinless leaner. Note the render step pours real fat *out*
  of the pan, which the macro model will not capture either way. **Net within ±60 cal depending on
  registry values, protein roughly flat.**
- **Confidence:** high on the accompaniments and the garlic/ginger finding; **medium** on the macro
  direction, for the same registry-values reason as above.
- **Sources:** The Woks of Life, *Easy Peking Duck with Mandarin Pancakes*; Red House Spice, *Peking
  Duck (北京烤鸭)*; Beijing Food Menu, *Peking Duck Pancake Guide*.

---

## Summary

### Counts by verdict
| Verdict | Count | Recipes |
|---|---|---|
| `authentic` | **0** | — |
| `minor-drift` | **1** | Peking-Style Duck Wraps |
| `significantly-off` | **7** | Shrimp Fried Rice, Thai Basil Chicken, Shrimp & Veggie Stir Fry, Beef Pho, Chicken Pho, Bun Tom, Five-Spice Duck Stir Fry |
| `not-a-real-dish` | **1** | Chicken Lettuce Wraps with Rice |
| `mislabeled` (as a contributing finding) | **3** | Shrimp Fried Rice, Chicken Lettuce Wraps, Shrimp & Veggie Stir Fry |

**On the near-uniform verdict.** An audit that flags everything is as suspect as one that flags
nothing, so this deserves a direct explanation rather than being left to stand. These nine recipes did
not fail independently — they share **one systemic defect**: every Thai and Vietnamese dish here is
seasoned with **soy sauce and sesame oil**, which is the Western shorthand for "Asian food" and is
wrong for both cuisines. Fix that single pattern — `Fish Sauce` in place of soy, `Vegetable Oil` in
place of sesame for frying — and six of the eight failures move most of the way to correct. The
underlying recipes are structurally sound: right proteins, right cooking sequences, sensible
portions, and in several cases genuinely correct technique (the raw-beef-cooked-by-broth step in Beef
Pho, the aromatics-first sequence in the duck stir fry, the whole assembly of the Peking wraps). Nearly
every fix below is **additive** — adding the seasoning that was missing — rather than a rebuild. Only
one recipe needs replacing outright.

### The 3 worst offenders
1. **Chicken Lettuce Wraps with Rice** — not a Thai dish in any form; it is a Chinese-American
   restaurant invention (P.F. Chang's lineage, loosely from Cantonese *sang choi bao*), built on a
   bagged American supermarket product (`Coleslaw Mix`), and its steps call for frying oil that is not
   in the ingredient list. Recommend replacing it with **Larb Gai**, which keeps the minced-chicken,
   lettuce-cup and rice-side structure while becoming a real Isan Thai dish — and whose signature
   crunch, toasted rice powder (*khao khua*), needs **no new ingredient**, just a toasting step.
2. **Thai Basil Chicken** — a dish named for basil that **contains no basil**. `Basil` is already in
   the registry, so this is a pure omission and a free fix. It also lacks fish sauce, oyster sauce and
   fresh chili, and substitutes bell pepper (Chinese-American) for what should be essentially just
   meat, garlic, chili and holy basil.
3. **Beef Pho and Chicken Pho (tied)** — pho is a broth dish, so the broth is the dish, and here it is
   water simmered 20 minutes with raw onion, garlic, soy sauce and a cinnamon stick. Missing the
   entire toasted spice sachet (star anise above all, plus clove, coriander seed, black cardamom,
   fennel), the charring of onion and ginger, and fish sauce; garnished with spinach, which appears in
   no version of pho. Chicken Pho is marginally worse for having **no ginger at all**, which Beef Pho
   sitting beside it in the same file does have.

### Consolidated NEW INGREDIENTS required across the slice

**Registry additions** (`INGREDIENT_REGISTRY`, USDA raw/100g), ordered by how many recipes they fix:

| Ingredient | Recipes fixed | In registry? | Note |
|---|---|---|---|
| **`Fish Sauce`** | **7** | **No** | The defining salt of Thai and Vietnamese cooking. Highest-value addition in the slice. |
| **`Sugar`** | **7** | **No** | Needed in real quantity for nước chấm and đồ chua; elsewhere a pinch. Must carry macros, so registry rather than the zero-macro spice table. |
| **`Vegetable Oil`** | **6** | **No** | Neutral high-smoke-point frying oil. Registry has only `Olive Oil` and `Sesame Oil`, neither correct for a wok. |
| **`Oyster Sauce`** | **3** | **No** | Base of the standard Chinese and Thai stir-fry sauce. |
| **`Bean Sprouts`** | **3** | **No** | Standard pho and bún garnish. |
| **`Mint`** | **2** | **No** | Structural in larb and bún, not a garnish. `Basil` sets the precedent for a registry herb. |
| **`Shallot`** | **2** | **No** | **Already on the project's own data backlog** for Pan-Seared Duck — this slice adds two more justifying recipes, and crispy fried shallot is the nut-free crunch for bún. |
| **`Cornstarch`** | **1** | **No** | The Chinese default binder, for velveting and sauce slurry. `Flour` is not an adequate substitute. |

**Spice-override additions** (`RECIPE_SPICE_OVERRIDES`, zero-macro, need only a grocery category):
`Thai Chili` (4 recipes) · `Star Anise` (2) · `Clove` (2) · `Coriander Seed` (2, distinct from the
existing `Coriander Powder` — powder clouds a broth) · `Black Cardamom` (1) · `Fennel Seed` (1) ·
`Lemongrass` (1) · `Rice Vinegar` (1) · `Shaoxing Wine` (1).

**Optional / nice-to-have, not required** (registry stand-ins named in each entry above are honest):
`Napa Cabbage`, `Baby Corn`, `Gai Lan` or `Bok Choy`, `Daikon`, a plain `Flour Tortilla`.

### Consolidated INGREDIENTS THIS SLICE WOULD STOP USING

| Ingredient | Dropped from | Orphan risk |
|---|---|---|
| `Duck Leg` | **Both** Chinese recipes (→ `Duck Breast`) | **HIGH — likely full orphan.** The project's backlog already lists Duck Leg as a below-5-recipe ingredient. If these are its only two uses, both fixes together strand the registry entry. **Decide deliberately:** either accept the orphan and remove it, or keep one recipe on leg (Five-Spice is the better candidate — a braised five-spice duck leg is a real dish, just not a stir-fry). |
| `Coleslaw Mix` | Chicken Lettuce Wraps | **HIGH.** Likely its only use. Sweep before removing. |
| `Brown Rice` | Shrimp & Veggie Stir Fry | **Medium.** Check whether other recipes reference it. |
| `Green Peas` | Shrimp Fried Rice | Low — used elsewhere. |
| `Zucchini` | Shrimp & Veggie Stir Fry | Low — used elsewhere. |
| `Bell Pepper` | Thai Basil Chicken, Five-Spice Duck | Low — widely used. |
| `Broccoli` | Five-Spice Duck | Low — widely used. |
| `Spinach` | Both Pho recipes | Low — widely used. |
| `Garlic` | Both Pho recipes, Peking Wraps | None — heavily used. |
| `Soy Sauce` | Beef Pho, Chicken Lettuce Wraps; **reduced** in 3 others | None — heavily used. |
| `Sesame Oil` | Removed as *frying* oil from 4 recipes; **demoted to a finishing oil** in 2 | None — used elsewhere. |
| `Carrot` | Chicken Lettuce Wraps (kept, pickled, in Bun Tom) | None. |
| `Whole Wheat Tortilla` | Peking Wraps, **only if** a plain flour tortilla is added | None. |

### Implementation notes for whoever applies this
- **Do the two cross-cutting registry additions first** (`Fish Sauce`, `Vegetable Oil`). They account
  for most of the authenticity gain across six recipes and require no recipe restructuring.
- **Three recipes should be renamed** so the name matches the dish: `Chicken Lettuce Wraps with Rice`
  → **`Larb Gai`**; `Shrimp & Veggie Stir Fry` → **`Pad Pak Ruam Mit Goong`**; `Bun Tom` →
  **`Bun Tom Nuong`** (bún tôm alone denotes a shrimp noodle *soup*).
- **Macro direction overall is upward**, driven by added cooking oil, sugar in the Vietnamese
  dressings, and the fried egg on pad krapow. Rough per-recipe estimates are in each block; the
  largest single swing is **Bun Tom at roughly +100 cal**. Per the project's own workflow, run
  `node tests/run.js validator` then `simulator` after any of these data changes land.
- **Two recipes gain an `Egg`** (`Thai Basil Chicken`) and one gains a real sugar quantity
  (`Bun Tom`) — both are the components to drop first if the solver struggles, and both are noted as
  such in their blocks. The seasoning changes are not negotiable; these two are.
- **Sweep for orphans afterwards**, per the project's data-hygiene convention — `Duck Leg` and
  `Coleslaw Mix` are the two live risks, and `Duck Leg` is a genuine judgement call rather than a
  cleanup.
