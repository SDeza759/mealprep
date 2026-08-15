# Audit report — American: bowls, plates, stir-fries (12 recipes)

Mode: **coherence** (`American` is a catch-all label, so the questions are name-match, internal
coherence, and whether the dish is really some other cuisine's).

## Cross-cutting notes (read first)

**1. The `Chinese` label already exists.** `data.js` has 16 cuisine labels; `Chinese` currently holds
exactly 2 recipes (`Five-Spice Duck Stir Fry with Rice`, `Peking-Style Duck Wraps`). There is no
`Chinese-American` label. So relabels below are actionable with no new label, but see note 4.

**2. Sesame oil is used as the wok cooking oil in 4 recipes** (Beef Stir Fry, Egg Fried Rice, Chicken
Fried Rice, Beef & Broccoli), always as "Heat sesame oil in a wok over high heat". Toasted sesame oil
is a *finishing* oil — smoke point roughly 350-400°F, and it turns bitter and acrid above medium heat.
No Chinese cook stir-fries in it. This is the single most repeated technique error in the slice. It is
also a quantity problem: 5 g of any oil is not enough to stir-fry 300-460 g of solids.

The blocker on fixing it is that the registry has **no neutral high-heat oil** — only `Olive Oil`,
`Butter`, `Sesame Oil`. Two options, in order of preference:
  - **(a)** Add one new registry ingredient, `Canola Oil` (or `Avocado Oil` / `Vegetable Oil`), USDA
    ~884 cal/100 g, 100 g fat, 0 C, 0 P — identical macros to olive oil, so the solver sees no change.
    Then each affected recipe uses ~8 g of it for the wok and keeps `Sesame Oil` at 4-5 g as a
    finishing drizzle, with the steps reworded to match.
  - **(b)** No new ingredient: use the existing `Olive Oil` for the wok. Macro-neutral and immediately
    available, but light olive oil in a wok is its own small incoherence.
I recommend (a). Below I write the fix as (a) and note (b) as the fallback each time.

**3. Wrong cooking liquid — clean.** None of the 12 recipes lists `Water` as an ingredient and none
hard-codes a volume; every starch says "according to package directions". No findings in this class.

**4. Watch the generation side effect of relabels.** Cuisine is capped at 2/week during generation.
Moving 3 recipes out of `American` (24) into `Chinese` (2) takes Chinese to 5 and American to 21. That
is a better-balanced book, but it does change which recipes compete with each other. Worth running
`node tests/run.js validator` after, not because it should break, but because rotation shifts.

**5. `Pesto Sauce` is not a nut finding.** It appears in Grilled Salmon & Asparagus. Per the project's
standing rule it is a nut-free-brand-only packaged ingredient, already documented on its registry line.
Not flagged, no change proposed.

---

### Grilled Chicken & Rice Bowl
- **Verdict:** `coherent`
- **Cuisine label:** `correct`. A grilled-protein/grain/vegetable bowl is a genuinely American
  contemporary form — it has no other national home.
- **Findings:** No substantive finding. Two cosmetic notes, neither worth a change on its own: the
  name says "Grilled" while the step offers "Grill or pan-sear" (fine — the step is the permissive
  one), and the protein is thigh rather than the breast most people picture in a "grilled chicken
  bowl" (thigh is a legitimate choice, and the recipe is honest about it in the ingredient list).
  Every ingredient is referenced by a step; both spices are named; no phantoms.
- **Proposed fix:** none needed.
- **New ingredients required:** none.
- **Ingredients no longer used:** none.
- **Macro impact:** none.
- **Confidence:** high
- **Sources:** none required — no contested factual claim.

---

### Beef Stir Fry
- **Verdict:** `minor-drift`
- **Cuisine label:** **defensible but weak.** "Beef stir fry" as a generic weeknight category really
  has become American home cooking, so unlike Beef & Broccoli this is not a clear mislabel. But the
  execution as written (wok, soy sauce, sesame oil, sear-then-remove-then-return) is Chinese technique
  wearing a generic name. My recommendation is to **keep `American`** and lean into what it actually
  is — a generic weeknight stir-fry — rather than relabel. If you would rather it be a Chinese dish,
  it needs aromatics and a sauce, at which point it stops being distinguishable from Beef & Broccoli.
- **Findings:**
  1. **Sesame oil as the high-heat wok oil** (cross-cutting note 2), and only 5 g of it for 460 g of
     solids.
  2. **All three spices are unreferenced by the steps.** `Salt`, `Black Pepper` and `Garlic Powder`
     are in the overrides; no step names any of them. Step 6 only says "add soy sauce". This violates
     the project convention that steps name specific spices.
  3. **Four vegetables on one timer.** Bell pepper, broccoli, cauliflower and asparagus all go in
     together for 3-4 minutes. Broccoli and cauliflower florets need longer than that; asparagus and
     bell pepper need less. As written you get raw cauliflower and limp asparagus in the same bite.
  4. **Cauliflower is the odd one out.** Broccoli/bell pepper/asparagus is a coherent stir-fry set;
     cauliflower reads as macro filler and does not take a thin soy-based sauce well.
  5. No thickener, so the soy sauce stays watery and pools at the bottom rather than coating.
- **Proposed fix:**
  - *Ingredients:* add `Canola Oil` 8 g for the wok; drop `Sesame Oil` 5 g → 4 g and move it to a
    finishing drizzle. Drop `Cauliflower` 60 g and raise `Broccoli` 100 → 130 g and `Bell Pepper`
    80 → 90 g to hold the vegetable mass roughly constant. Add `Garlic` 5 g and `Ginger` 4 g (both in
    registry) as real aromatics.
  - *Spices:* drop `Garlic Powder` (redundant once fresh garlic is in). Keep Salt + Black Pepper.
  - *Steps:* rewrite the cook order to "Heat canola oil in a wok over high heat, sear the beef 2
    minutes, set aside. / Stir-fry the broccoli 2 minutes, then add bell pepper and asparagus for a
    further 2 minutes. / Add minced garlic and ginger for 30 seconds until fragrant. / Return the
    beef, add soy sauce, season with salt and black pepper, toss. / Finish off the heat with the
    sesame oil and serve over rice." That names every spice and fixes the vegetable timing.
  - *Fallback if no new ingredient:* use `Olive Oil` 8 g in place of `Canola Oil`.
- **New ingredients required:** `Canola Oil` — **NOT in registry**, must be added (or use `Olive Oil`).
  `Garlic` and `Ginger` are both already in the registry.
- **Ingredients no longer used:** `Cauliflower` (from this recipe only — it is used elsewhere).
- **Macro impact:** small. +8 g oil is ≈ +70 cal / +8 g fat; dropping 60 g cauliflower removes only
  ~15 cal. Net ≈ +60-70 cal, all fat. Protein unchanged.
- **Confidence:** high on the sesame-oil and spice-reference findings; medium on the cauliflower call,
  which is a taste judgement more than an error.
- **Sources:** smoke-point/finishing-oil consensus — vomfassusa.com smoke point chart, reconoil.com
  "Toasted Sesame Oil Uses"; general stir-fry sequencing.

---

### BBQ Chicken Plate
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — and this is the most unambiguously American dish in the slice.
  Barbecue-sauced chicken with a slaw and a roasted starch is a real, specific American plate.
- **Findings:**
  1. **Phantom ingredient.** Step 5 says "Toss coleslaw mix with a light dressing." There is no
     dressing, no mayonnaise, no oil and no vinegar anywhere in the ingredient list. `Coleslaw Mix` is
     just shredded cabbage and carrot, so as written the plate serves undressed raw cabbage. This is
     the confirmed phantom class.
  2. **The plate has zero fat.** Chicken breast, sweet potato, cabbage, BBQ sauce — nothing to roast
     the sweet potato in. Step 1 roasts cubed sweet potato at 200°C dry, which gives leathery cubes.
     (Note the step is at least *honest* — it does not claim oil it lacks, unlike Steak & Sweet Potato
     below.)
  3. **Two spices are never named by any step.** `Garlic Powder` and `Cayenne` are in the overrides;
     step 2 names only salt, pepper and paprika. Cayenne in particular is a flavour decision the cook
     should be told about.
  4. Minor: the rub is applied but the chicken is never rested before slicing, and the BBQ sauce goes
     on only at the end — correct, actually, since sauce applied early burns. No finding there.
- **Proposed fix:**
  - *Ingredients:* add `Mayonnaise` 15 g (in registry) as the slaw dressing; add `Olive Oil` 5 g for
    the sweet potato.
  - *Spices:* no additions needed — add an `Apple Cider Vinegar` entry (zero-macro, lives in
    `RECIPE_SPICE_OVERRIDES` without a registry row, needs only a grocery category) if you want the
    slaw to read as a proper American slaw rather than mayo-only. Optional.
  - *Steps:* step 1 → "Peel and cube sweet potato, toss with olive oil, and roast at 200°C (400°F) for
    25 minutes." Step 2 → "Season the chicken with salt, black pepper, paprika, garlic powder and
    cayenne." Step 5 → "Toss the coleslaw mix with the mayonnaise (and a splash of cider vinegar) to
    dress."
- **New ingredients required:** none — `Mayonnaise` and `Olive Oil` are both in the registry.
  `Apple Cider Vinegar` is optional and would be a spice-override entry, not a registry entry.
- **Ingredients no longer used:** none.
- **Macro impact:** meaningful. +15 g mayonnaise ≈ +100 cal / +11 g fat, +5 g olive oil ≈ +44 cal /
  +5 g fat. Roughly +145 cal, +16 g fat, protein unchanged. This recipe is currently near-fat-free, so
  the fix moves it materially — worth re-running the validator.
- **Confidence:** high
- **Sources:** none required — phantom-ingredient and fat findings are internal to the recipe.

---

### Egg Fried Rice
- **Verdict:** `mislabeled` (and the name does not match the dish)
- **Cuisine label:** **should be `Chinese`.** Egg fried rice / dan chao fan (蛋炒饭) is a Chinese home
  dish, not a restaurant or American one — it is the baseline fried rice of Chinese domestic cooking.
  Unlike Beef & Broccoli there is no American adaptation story here: this one is simply Chinese, and
  the app already has a `Chinese` label to move it to.
- **Findings:**
  1. **The name does not match the dish.** 70 g of pork belly is a co-lead ingredient, not a garnish.
     Dan chao fan is defined by its minimalism — rice, egg, scallion, seasoning, nothing else. With
     pork belly this is pork fried rice, or a Yangzhou-style fried rice. Either rename it or remove
     the pork; it cannot stay as "Egg Fried Rice" with 70 g of belly in it.
  2. **Green onion is missing.** It is the one non-negotiable aromatic of the dish in every Chinese
     source, added near the end. `Green Onion` is already in the registry (used by Peking-Style Duck
     Wraps).
  3. **Step-order bug: the carrot goes in last.** Step 6 adds *diced raw carrot* with the soy sauce
     and tosses "until heated through". Diced carrot needs several minutes of actual cooking; as
     written the dish has raw crunchy carrot in it. Carrot must go in early, with or right after the
     pork.
  4. **Sesame oil as the high-heat wok oil** (cross-cutting note 2). Especially wrong here — 70 g of
     pork belly renders plenty of its own fat, so this dish barely needs added cooking oil at all.
  5. **Neither spice is named by any step.** `Salt` and `White Pepper` are in the overrides and never
     appear. White pepper is the correct and characteristic seasoning for this dish, so it deserves to
     be named.
- **Proposed fix:** rename to **"Pork Fried Rice"** (keeps the pork belly, which is carrying real
  macros, and makes the name honest). Then:
  - *Ingredients:* add `Green Onion` 15 g. Drop `Sesame Oil` 5 g → 3 g as a finishing drizzle; no
    added cooking oil is needed because the pork belly renders. (No `Canola Oil` needed for this one.)
  - *Spices:* keep Salt + White Pepper as-is; they are correct.
  - *Steps:* "Use day-old cooked rice for best results. / Dice the pork belly and render in a hot dry
    wok until browned and the fat has rendered out, 3-4 minutes. / Add the diced carrot and stir-fry
    2-3 minutes until it softens. / Push to one side, scramble the eggs in the rendered fat, break
    into small pieces. / Add the rice and green peas, stir-fry 3-4 minutes, chopping to separate the
    grains. / Season with soy sauce, salt and white pepper and toss. / Off the heat, stir through the
    sliced green onion and the sesame oil. Serve immediately."
  - *Alternative if you want to keep the name:* remove `Pork Belly` entirely and raise `Egg` 100 →
    150 g. That is the real dan chao fan, but it costs ~200 cal and changes the recipe's macro role
    substantially, so I recommend the rename instead.
- **New ingredients required:** none — `Green Onion` is already in the registry.
- **Ingredients no longer used:** none.
- **Macro impact:** negligible under the rename path (−2 g sesame oil, +15 g green onion ≈ −15 cal).
  The alternative "keep the name" path is a large change: roughly −280 cal and −10 g protein.
- **Confidence:** high
- **Sources:** Red House Spice "Egg Fried Rice (蛋炒饭), A Traditional Recipe"; Omnivore's Cookbook
  "Easy Egg Fried Rice (蛋炒饭)".

---

### Grilled Salmon & Asparagus
- **Verdict:** `coherent`
- **Cuisine label:** `correct`. A grilled salmon plate with a starch and a green vegetable is standard
  American. The pesto is a condiment and does not make the dish Italian.
- **Findings:** No substantive finding. Every ingredient is referenced by a step, both spices are
  named, no phantoms. Two cosmetic notes:
  1. Step 4 says "Grill or bake the salmon and asparagus at 200°C (400°F)" — an oven temperature
     attached to a grilling instruction. Harmless, but the name promises grilling and the only
     temperature given is a roasting one.
  2. The 15 g of lemon is spent twice — once as juice seasoning the raw salmon (step 3) and again
     "over everything" at the end (step 6). Not wrong, but the steps read as though there is more
     lemon than there is.
  Pesto plus lemon plus salmon is a slightly loud combination, but it is a legitimate one and a
  matter of taste, not coherence.
- **Proposed fix:** none needed. If you want the polish: reword step 4 to "Grill the salmon and
  asparagus, or roast at 200°C (400°F), for 12-15 minutes", and split the lemon explicitly — "season
  the salmon with salt, pepper and half the lemon juice" / "finish with the remaining lemon".
- **New ingredients required:** none.
- **Ingredients no longer used:** none.
- **Macro impact:** none.
- **Confidence:** high
- **Sources:** none required — no contested factual claim. (`Pesto Sauce` retained per the project's
  nut-free-brand rule; not a finding.)

---

### Steak & Sweet Potato
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`. A steakhouse plate — steak, roasted starch, steamed green vegetable.
  Unambiguously American.
- **Findings:**
  1. **Phantom ingredient.** Step 1: "toss with a little oil and roast at 200°C". There is no oil in
     the recipe. The only fat is `Butter` 10 g, and step 3 spends it searing the steak. This is
     precisely the confirmed "sauté in oil with no fat in the recipe" bug class.
  2. **Butter is used as the searing fat from the start.** "Sear steak in a hot pan with butter for
     3-4 minutes per side" — at the temperature needed to sear a sirloin, butter's milk solids burn
     well before the 3-4 minutes are up, so you get an acrid pan and a grey crust. The standard
     technique is to sear in a fat that tolerates the heat and add butter at the end to baste.
     Combined with finding 1, both fat uses in this recipe are wrong.
  3. Minor: the broccoli is steamed and served entirely unseasoned and unfatted.
- **Proposed fix:**
  - *Ingredients:* add `Olive Oil` 5 g (in registry). Keep `Butter` at 10 g.
  - *Spices:* no change; Salt and Black Pepper are both named by step 2.
  - *Steps:* step 1 → "Peel and cube sweet potato, toss with the olive oil, salt and pepper, and roast
    at 200°C (400°F) for 25 minutes." Step 3 → "Sear the steak in a hot dry pan for 3-4 minutes per
    side for medium, adding the butter for the last minute and spooning it over the steak."
- **New ingredients required:** none — `Olive Oil` is in the registry.
- **Ingredients no longer used:** none.
- **Macro impact:** small. +5 g olive oil ≈ +44 cal / +5 g fat. Protein unchanged.
- **Confidence:** high
- **Sources:** none required — the phantom is internal; the butter-smoke-point point is settled
  cooking practice.

---

### Chicken Fried Rice
- **Verdict:** `mislabeled`
- **Cuisine label:** **should be `Chinese`.** Worth being precise about the distinction the brief asks
  for: fried rice itself is Chinese (chǎofàn, documented back to the Sui dynasty, and originally a
  leftover-rice dish). But *this particular configuration* — diced chicken breast with the
  peas-and-diced-carrot mix, egg, and soy sauce — is the **Chinese-American takeout** version, not
  Chinese home cooking; the frozen peas-and-carrots blend is the signature of the American Chinese
  restaurant, not of a Chinese kitchen. Since the app has no `Chinese-American` label and does have
  `Chinese`, move it to `Chinese`. (Contrast with Egg Fried Rice above, which is genuinely a Chinese
  home dish and belongs under `Chinese` on stronger grounds.) Either way, `American` is wrong.
- **Findings:**
  1. **Sesame oil as the high-heat wok oil** (cross-cutting note 2). Also a quantity problem: 5 g of
     oil must cook 140 g of chicken *and* fry 60 g of rice.
  2. **Green onion is missing** — same omission as Egg Fried Rice. `Green Onion` is in the registry.
  3. **Neither spice is named by any step.** `Salt` and `White Pepper` are in the overrides and no
     step mentions either. White pepper is the characteristic seasoning here and should be named.
  4. No aromatics at all — no garlic, no ginger.
  5. Minor: diced carrot goes in at step 4 for 3-4 minutes, which is borderline but acceptable. Much
     better sequencing than Egg Fried Rice, where the same carrot goes in last.
- **Proposed fix:**
  - *Cuisine:* `American` → `Chinese`.
  - *Ingredients:* add `Canola Oil` 8 g for the wok; drop `Sesame Oil` 5 g → 4 g as a finishing
    drizzle. Add `Green Onion` 12 g. Optionally add `Garlic` 4 g. *Fallback:* `Olive Oil` 8 g instead
    of `Canola Oil`.
  - *Spices:* keep Salt + White Pepper; they are correct, they just need naming.
  - *Steps:* "Use day-old cooked rice for best results. Dice the chicken breast. / Heat the canola oil
    in a wok over high heat, cook the chicken until done, set aside. / Scramble the egg in the wok and
    break it apart. / Add the diced carrot and stir-fry 2 minutes, then the rice and green peas for a
    further 3-4 minutes, chopping to separate the grains. / Return the chicken, add the soy sauce, and
    season with salt and white pepper. / Off the heat, stir through the sliced green onion and the
    sesame oil. Serve immediately."
- **New ingredients required:** `Canola Oil` — **NOT in registry** (shared with Beef Stir Fry and Beef
  & Broccoli; one addition covers all three). `Green Onion` and `Garlic` are already in the registry.
- **Ingredients no longer used:** none.
- **Macro impact:** small. +8 g oil −1 g sesame oil ≈ +62 cal / +7 g fat. Protein unchanged.
- **Confidence:** high on the relabel and the technique findings; medium on Chinese-vs-Chinese-American
  being resolvable inside the app's current label set — it is a real distinction the app cannot express.
- **Sources:** Omnivore's Cookbook "Chinese Chicken Fried Rice (鸡肉炒饭)"; The Woks of Life "Chicken
  Fried Rice"; general fried-rice origin history (chǎofàn, Sui dynasty).

---

### Beef Meatballs & Zoodles
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`, and deliberately so. Meatballs simmered in tomato sauce is
  Italian-**American**, not Italian, and zucchini noodles are a modern American low-carb invention
  with no Italian pedigree at all. Filing this under `Italian` would be the actual mislabel.
  `American` is the right call.
- **Findings:**
  1. **The meatballs have no binder and no panade.** The mix is ground beef plus salt, pepper,
     oregano and dried basil — nothing else. Breadcrumbs (ideally soaked, as a panade) and egg are
     what keep a meatball tender: the panade interrupts the meat proteins so they cannot contract into
     a dense ball, and the egg holds it together. As written, 170 g of 80/20 beef formed into balls
     and simmered 15 minutes in sauce gives dense, springy, slightly rubbery meatballs. This is a
     texture failure, not a pedantic omission.
  2. **No allium anywhere.** No garlic, no onion, in the mix or the sauce. Garlic in particular is
     standard in every version of this dish.
  3. **Parmesan is garnish-only.** Grated parmesan conventionally goes *into* the mix as well, where
     it contributes salt, savour and moisture retention, not just over the top.
  4. **Zoodle water is unmanaged.** Step 5 sautés the zoodles and step 6 pours sauce over them. 200 g
     of zucchini releases a lot of water; without salting-and-draining or draining after the sauté,
     the sauce thins into a puddle at the bottom of the bowl. Small but real, and it is the single
     most common complaint about zoodle dishes.
  5. Cosmetic: step 1 reads "salt, pepper, and oregano and dried basil" — a doubled conjunction.
  6. **Tag tension to be aware of:** the recipe is tagged `low-carb`. Adding breadcrumbs adds carbs
     (see macro impact). 15 g of panko is ~11 g of carbohydrate, which is defensible for a dish whose
     whole starch replacement is zucchini, but it is a judgement call — drop to 10 g if the `low-carb`
     tag should stay strict.
- **Proposed fix:**
  - *Ingredients:* add `Egg` 25 g (binder), `Panko Breadcrumbs` 15 g (or 10 g, see finding 6),
    `Garlic` 5 g, and optionally `Whole Milk` 15 g to soak the panko into a proper panade. Raise
    `Parmesan Cheese` 15 → 20 g and split it: 10 g into the mix, 10 g grated over at the end. All of
    these are already in the registry.
  - *Spices:* no change — this recipe is the one in the slice that already names every spice it
    declares.
  - *Steps:* step 1 → "Soak the panko in the milk for 5 minutes. Mix the ground beef with the soaked
    panko, the egg, minced garlic, half the parmesan, salt, black pepper, oregano and dried basil.
    Form into meatballs." Step 5 → "Sauté the zoodles briefly in a hot pan for 2 minutes, then drain
    off the water they release." Step 6 → "Serve the meatballs and sauce over the zoodles with the
    remaining parmesan grated over."
  - *Implementation note:* the project's egg-scaling rule caps binder eggs at their original grams
    when the solver rescales a recipe. That is exactly the right behaviour here — a 25 g binder egg
    should not scale up with the servings — so this addition works with the existing rule rather than
    against it.
- **New ingredients required:** none — `Egg`, `Panko Breadcrumbs`, `Garlic` and `Whole Milk` are all
  in the registry.
- **Ingredients no longer used:** none.
- **Macro impact:** moderate. +25 g egg ≈ +36 cal / +3 g protein; +15 g panko ≈ +58 cal / +11 g carb;
  +5 g parmesan ≈ +20 cal / +2 g protein; +15 g milk ≈ +9 cal. Net roughly **+120 cal, +5 g protein,
  +12 g carb**. The carb addition is the part to watch against the `low-carb` tag.
- **Confidence:** high
- **Sources:** The Kitchn "Classic Meatballs" (panade mechanism); Food Network Kitchen
  "Italian-American Meatballs"; Jessica Gavin "Best Italian Meatball Recipe".

---

### Beef & Broccoli
- **Verdict:** `mislabeled` — and it is also the biggest name-does-not-deliver gap in the slice.
- **Cuisine label:** **should be `Chinese`.** The precise story, since the brief asks for the
  distinction: the parent dish is Cantonese — *gai lan chao niu rou*, beef stir-fried with gai lan
  (Chinese broccoli). Chinese immigrants in the San Francisco area from the 1920s substituted American
  broccoli for the gai lan they could not get, and by the 1950s the result was a hallmark of American
  Chinese takeout. So "Beef & Broccoli" *specifically* — with Western broccoli — is
  **Chinese-American**, a genuine adaptation dish rather than a transplanted one. `American` is
  nevertheless wrong: nobody would file it there. With the app's current labels, `Chinese` is the
  right destination; a `Chinese-American` label would be more accurate if you ever add one, and Egg
  Fried Rice vs. this one is exactly the pair that would justify it.
- **Findings:**
  1. **The defining sauce is absent.** What makes this dish recognisable is a glossy brown sauce that
     clings to the beef and the florets: soy plus oyster sauce, garlic and ginger, a little sugar,
     thickened with a cornstarch slurry. This recipe has soy sauce and garlic *powder* and no
     thickener at all. As written you get seared beef and broccoli with salty water pooling under the
     rice. A cook ordering "beef and broccoli" would not accept this as the dish.
  2. **No velveting.** Coating the sliced beef in cornstarch before searing is the technique that
     keeps stir-fried sirloin tender. Without it, 170 g of thin-sliced sirloin seared in a wok and
     then returned to the pan goes tough.
  3. **The broccoli will be raw in the stem.** 150 g of florets stir-fried for 3-4 minutes with no
     blanching and no added liquid to steam under a lid does not cook through.
  4. **Sesame oil as the high-heat wok oil** (cross-cutting note 2), 5 g for 370 g of solids.
  5. **All three spices are unreferenced by the steps** — `Salt`, `Black Pepper`, `Garlic Powder`
     appear in the overrides and no step names any of them.
- **Proposed fix:**
  - *Cuisine:* `American` → `Chinese`.
  - *Ingredients:* add `Cornstarch` 8 g (**new**) — this is the single highest-value addition in the
    whole slice, since it enables both the slurry and the velveting, and would serve the app's other
    stir-fries too. Add `Garlic` 6 g and `Ginger` 5 g (both in registry) to replace the garlic powder.
    Add `Canola Oil` 8 g (**new**, shared with Beef Stir Fry and Chicken Fried Rice); drop
    `Sesame Oil` 5 g → 4 g as a finishing drizzle. `Oyster Sauce` (**new**) 12 g is the authentic
    sauce base and I would add it if you are willing — but it is the most droppable of these, and the
    dish is recognisable without it once the slurry is there. Do **not** substitute the registry's
    `Hoisin Sauce`: it is sweeter and five-spice-scented and would make this a different dish.
  - *Spices:* drop `Garlic Powder` (redundant once fresh garlic is in); keep Salt + Black Pepper.
  - *Steps:* "Cook the white rice according to package directions. / Slice the beef thinly against the
    grain and toss with half the cornstarch. / Cut the broccoli into small florets and blanch for 2
    minutes, then drain. / Stir the remaining cornstarch into the soy sauce (and oyster sauce) with a
    splash of water to make a slurry. / Heat the canola oil in a wok over high heat and sear the beef
    for 2 minutes; set aside. / Stir-fry the minced garlic and ginger for 30 seconds until fragrant,
    add the blanched broccoli for 1-2 minutes. / Return the beef, pour in the slurry, and toss for
    30-60 seconds until the sauce thickens and glosses. Season with salt and black pepper. / Finish
    off the heat with the sesame oil and serve over rice."
  - *Fallback if you refuse new ingredients:* the registry's `Flour` can thicken, but it gives a
    cloudy gravy rather than a glossy sauce and cannot velvet the beef. This is a real downgrade —
    `Cornstarch` is worth adding.
- **New ingredients required:** `Cornstarch` (**NOT in registry**, strongly recommended), `Canola Oil`
  (**NOT in registry**, shared), `Oyster Sauce` (**NOT in registry**, optional). `Garlic` and `Ginger`
  are already in the registry.
- **Ingredients no longer used:** none. (`Garlic Powder` leaves this recipe's spice overrides only.)
- **Macro impact:** small-to-moderate. +8 g cornstarch ≈ +30 cal / +7 g carb; +8 g canola oil ≈ +70
  cal / +8 g fat; +12 g oyster sauce ≈ +6 cal if used. Net ≈ **+105 cal**, mostly fat, protein
  unchanged.
- **Confidence:** high
- **Sources:** Wikipedia "Beef and broccoli"; Tasting Table "The Supposed History Of Beef And Broccoli
  Dates Back To The 1920s"; Red House Spice "Beef and Chinese broccoli stir-fry (芥蓝牛肉)"; The Woks
  of Life "Beef and Broccoli: Authentic Restaurant Recipe"; America's Test Kitchen "Stir-Fried Beef
  and Broccoli with Oyster Sauce".

---

### Shrimp Spinach & Rice Salad
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`. A composed grain-and-greens salad bowl is contemporary American.
- **Findings:**
  1. **The dressing has no acid.** The only dressing element is olive oil, applied twice (step 3 and
     step 6). A grain salad with oil, salt and pepper and nothing sour is flat — and both avocado and
     cooled brown rice specifically need acid to stop reading as heavy. Every composed salad of this
     type has lemon, lime or vinegar. `Lemon` is already in the registry.
  2. **The sear has no allocated fat.** Step 2 says "Sear in a hot pan for 2-3 minutes per side" while
     steps 3 and 6 spend the entire 10 g of olive oil on dressing. A milder instance of the same
     phantom class as Steak & Sweet Potato — the pan is implicitly oiled from a budget already fully
     committed elsewhere.
  3. **Hot shrimp into raw spinach.** Step 1 explicitly cools the rice, but the shrimp goes straight
     from the pan into step 5's toss with raw spinach, which wilts the leaves and makes the "salad"
     soggy. Either cool the shrimp or serve it warm on top deliberately.
  4. Minor: 2-3 minutes per side is long for shrimp; 1-2 minutes per side is enough and 140 g of
     shrimp turns rubbery quickly.
- **Proposed fix:**
  - *Ingredients:* add `Lemon` 15 g (in registry). Optionally raise `Olive Oil` 10 → 12 g so the sear
    has its own allocation.
  - *Spices:* none needed. Salt and Black Pepper are both named in step 6.
  - *Steps:* step 2 → "Peel and devein the shrimp. Sear in a little of the olive oil over high heat
    for 1-2 minutes per side until pink, then set aside to cool slightly." Step 6 → "Whisk the
    remaining olive oil with the lemon juice, dress the salad, and season with salt and black pepper."
- **New ingredients required:** none — `Lemon` is in the registry.
- **Ingredients no longer used:** none.
- **Macro impact:** negligible. Lemon is ~4 cal; the optional +2 g olive oil is ~18 cal.
- **Confidence:** high
- **Sources:** none required — the missing-acid and sequencing findings are internal to the recipe.

---

### Turkey & Broccoli Bowl
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`, if weakly. Soy sauce and garlic over rice gives it a faint Asian
  inflection, but a lean-protein/brown-rice/steamed-broccoli bowl with a splash of soy is a generic
  American meal-prep bowl and belongs to no specific tradition. Not a mislabel — unlike Beef &
  Broccoli, there is no identifiable dish it is a version of.
- **Findings:**
  1. **Unused ingredient.** `Garlic` 5 g is minced in step 2 and then never appears again. It never
     enters the pan, the turkey, the broccoli or the bowl. This is the confirmed unused-ingredient
     class — the mince is prepped and discarded.
  2. **The turkey is badly overcooked by the instruction.** Step 3 says to cook turkey *strips* for
     "4-5 minutes per side" — 8-10 minutes total. Turkey breast strips are done in 2-3 minutes total,
     and turkey breast is the leanest, least forgiving protein in the book; at 8-10 minutes 160 g of
     it is chalk. This is the most consequential single error in this recipe.
  3. **No fat at all.** Step 3's "Heat a non-stick pan" is at least honest — it claims no oil it does
     not have, so this is not a phantom — but the whole bowl has zero added fat, which hurts both
     palatability and the plan's fat macro.
  4. **Neither spice is named by any step.** `Salt` and `Black Pepper` are declared and never
     mentioned.
- **Proposed fix:**
  - *Ingredients:* add `Olive Oil` 5 g (in registry). Keep the garlic — but actually use it.
  - *Spices:* no change to the list; they just need naming in the steps.
  - *Steps:* step 3 → "Heat the olive oil in a pan, season the turkey with salt and black pepper, and
    cook the strips for 2-3 minutes, turning once, until just golden and cooked through." Step 5 →
    "Add the minced garlic and a splash of soy sauce to the pan in the last 30 seconds and toss to
    coat the turkey." That consumes the garlic, names both spices, and fixes the timing.
- **New ingredients required:** none — `Olive Oil` is in the registry.
- **Ingredients no longer used:** none — the fix *starts* using the garlic that is currently wasted.
- **Macro impact:** small. +5 g olive oil ≈ +44 cal / +5 g fat. Protein unchanged.
- **Confidence:** high
- **Sources:** none required — findings are internal to the recipe.

---

### Chicken & Sweet Potato Bowl
- **Verdict:** `minor-drift` (the onion handling is close to incoherent, but it is one bad step, not a
  bad dish)
- **Cuisine label:** `correct`. Roast-starch/lean-protein/greens bowl — contemporary American.
- **Findings:**
  1. **A step refers to cooking that never happens.** Step 4 says "Dice onion and wilt spinach briefly
     in a hot pan" — the onion is diced and then the sentence moves on to the spinach. The onion never
     enters a pan. Step 6 then says "Serve with sauteed onion", referring to a sauté that appears
     nowhere in the recipe. So `Onion` 30 g is effectively an unused ingredient, and "sauteed onion"
     is a phantom preparation.
  2. **3 g of olive oil is not enough for what the steps ask of it.** It is committed to the sweet
     potato in step 1 (3 g for 120 g of cubed sweet potato is already almost nothing — it will not
     coat), which leaves step 3's pan-sear of a 170 g chicken breast and step 4's "hot pan" for the
     spinach with no fat at all. Same phantom class as Steak & Sweet Potato, spread across two steps.
  3. **The garlic is vague.** Step 2 says "Season chicken breast with garlic, salt, and pepper" — 5 g
     of whole garlic is not a seasoning until it is minced or crushed, and the step never says to do
     either. Compare step 2 of Turkey & Broccoli Bowl, which does say "Mince garlic".
- **Proposed fix:**
  - *Ingredients:* raise `Olive Oil` 3 → 10 g. No other ingredient changes — the fix here is almost
    entirely in the steps.
  - *Spices:* no change; Salt and Black Pepper are both named.
  - *Steps:* step 1 → "Peel and cube the sweet potato. Toss with 4 g of the olive oil and roast at
    200°C (400°F) for 20 minutes." Step 2 → "Mince the garlic and rub the chicken breast with it,
    plus salt and black pepper." Step 3 → "Pan-sear the chicken in 3 g of the olive oil for 6-7
    minutes per side until cooked through. Slice." Step 4 → "Dice the onion and sauté in the
    remaining olive oil until softened and golden, 5-6 minutes, then add the spinach and wilt
    briefly." Step 5 → "Arrange the roasted sweet potato, sliced chicken, and the onion and spinach in
    a bowl." (Step 6 is then redundant and should be deleted, since the onion is now plated in step
    5.)
- **New ingredients required:** none.
- **Ingredients no longer used:** none — the fix starts actually using the `Onion` that is currently
  prepped and abandoned.
- **Macro impact:** small. +7 g olive oil ≈ +62 cal / +7 g fat. Protein unchanged.
- **Confidence:** high
- **Sources:** none required — findings are internal to the recipe.

---

## Summary

### Counts by verdict
| Verdict | Count | Recipes |
|---|---|---|
| `coherent` | 2 | Grilled Chicken & Rice Bowl; Grilled Salmon & Asparagus |
| `minor-drift` | 7 | Beef Stir Fry; BBQ Chicken Plate; Steak & Sweet Potato; Beef Meatballs & Zoodles; Shrimp Spinach & Rice Salad; Turkey & Broccoli Bowl; Chicken & Sweet Potato Bowl |
| `mislabeled` | 3 | Egg Fried Rice; Chicken Fried Rice; Beef & Broccoli |
| `incoherent` | 0 | — |

### The 3 worst offenders
1. **Beef & Broccoli** — mislabeled `American` when it is the Chinese-American takeout adaptation of
   Cantonese *gai lan chao niu rou*, **and** it does not deliver the dish its name promises: no
   cornstarch slurry, no oyster sauce, no fresh garlic or ginger, so there is no glossy clinging
   sauce — just seared beef and undercooked broccoli in salty water.
2. **Egg Fried Rice** — mislabeled `American` when *dan chao fan* is a Chinese home dish, and the name
   is contradicted by its own ingredient list: 70 g of pork belly makes it pork fried rice. Also adds
   raw diced carrot in the final step and merely heats it through, and omits green onion entirely.
3. **BBQ Chicken Plate** — a phantom "light dressing" for the slaw that exists nowhere in the
   ingredient list (so the plate serves undressed raw cabbage), on a plate that contains zero fat of
   any kind, with two declared spices (`Garlic Powder`, `Cayenne`) that no step ever names.

*Runners-up worth knowing about:* **Steak & Sweet Potato** and **Chicken & Sweet Potato Bowl** both
hit the confirmed phantom-oil class — a step tosses or sautés in oil the recipe does not have.
**Turkey & Broccoli Bowl** minces garlic it then never uses, and instructs 8-10 minutes of cooking on
turkey breast strips that need 2-3.

### Pattern findings (worth fixing as a batch, not recipe by recipe)
- **Sesame oil used as the high-heat wok oil in 4 recipes.** Toasted sesame oil is a finishing oil; it
  turns bitter above medium heat and no Chinese cook stir-fries in it. Blocked on the registry having
  no neutral high-heat oil. One `Canola Oil` addition fixes all four.
- **Declared spices that no step names, in 6 of 12 recipes** (Beef Stir Fry, BBQ Chicken Plate, Egg
  Fried Rice, Chicken Fried Rice, Beef & Broccoli, Turkey & Broccoli Bowl). This breaks the project's
  own convention that steps name specific spices. It is a cheap, mechanical sweep and probably worth
  checking across the whole book, not just this slice.
- **Phantom or unallocated fat, in 4 recipes** (Steak & Sweet Potato and Chicken & Sweet Potato Bowl
  are outright phantoms; BBQ Chicken Plate and Shrimp Spinach & Rice Salad ask a pan to do work with
  no fat budgeted).
- **Wrong cooking liquid: no findings.** No recipe in this slice lists `Water` or hard-codes a volume;
  every starch defers to package directions.

### Consolidated new ingredients required
Only **three** registry additions across the whole slice, and one is optional:

| Ingredient | In registry? | Needed by | Priority |
|---|---|---|---|
| `Canola Oil` (or `Avocado Oil` / `Vegetable Oil`) | **No — must be added** | Beef Stir Fry, Chicken Fried Rice, Beef & Broccoli | High. Macros ≈ 884 cal / 100 g fat per 100 g, identical to olive oil, so the solver sees no change. `Olive Oil` is the no-new-ingredient fallback. |
| `Cornstarch` | **No — must be added** | Beef & Broccoli | High. Enables both the slurry and velveting; would serve the app's other stir-fries too. `Flour` is an inferior fallback. |
| `Oyster Sauce` | **No — must be added** | Beef & Broccoli | Optional. Authentic, but the dish is recognisable without it once the slurry exists. Do **not** substitute the registry's `Hoisin Sauce`. |
| `Apple Cider Vinegar` | n/a — zero-macro, would live in `RECIPE_SPICE_OVERRIDES` only | BBQ Chicken Plate | Optional. Needs only a grocery category, no registry row. |

Everything else the fixes call for is **already in the registry**: `Garlic`, `Ginger`, `Green Onion`,
`Mayonnaise`, `Olive Oil`, `Lemon`, `Egg`, `Panko Breadcrumbs`, `Whole Milk`, `Parmesan Cheese`.

### Consolidated ingredients this slice would stop using
- `Cauliflower` — removed from **Beef Stir Fry** only. Verified it appears in 7 recipes across
  `data.js`, so this does **not** orphan the registry entry.
- `Garlic Powder` — removed from the `RECIPE_SPICE_OVERRIDES` of **Beef Stir Fry** and **Beef &
  Broccoli**, superseded by fresh `Garlic` in both. It is a spice-override name, not a registry row,
  and remains in use elsewhere.
- `Pork Belly` — only under the rejected alternative for Egg Fried Rice. **Under my recommended fix
  (rename to "Pork Fried Rice") it is kept.**

**Nothing in this slice becomes a registry orphan.** No nuts and no olives are proposed anywhere;
`Olive Oil` is used as an existing registry ingredient only, and `Pesto Sauce` is left untouched under
the project's nut-free-brand rule.

### Suggested order of work
1. The mechanical sweeps first, since they are low-risk and touch the most recipes: name the missing
   spices in the 6 affected step lists, and fix the 4 phantom/unallocated-fat cases.
2. Then the 3 relabels (`American` → `Chinese`), and re-run `node tests/run.js validator` — not
   because it should break, but because cuisine is capped at 2/week during generation and moving 3
   recipes shifts American 24 → 21 and Chinese 2 → 5, which changes rotation.
3. Then the two registry additions (`Canola Oil`, `Cornstarch`) and the recipes that depend on them.
4. Then the per-recipe content fixes (meatball panade, the beef & broccoli sauce, the fried-rice
   step order).
