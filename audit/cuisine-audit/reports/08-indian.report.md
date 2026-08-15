# Authenticity audit — Indian (13 recipes)

Mode: **traditional**. Bar: the specifics ARE the dish.

## Notes before the per-recipe blocks

Five problems recur across the whole slice. They are written into each block where they apply, but they
are cheaper to fix as one sweep than thirteen times:

1. **`Ginger` appears in ZERO of the 13 recipes, and it is already in the registry.** Ginger-garlic is the
   foundation of every single one of these dishes — every korma, saag, chana, dal, biryani, tandoori
   marinade and makhani gravy starts with it. This is the largest single finding in the slice and the
   cheapest to fix (6–10 g per recipe, negligible macros).
2. **`Cilantro` appears in ZERO of the 13, and is also already in the registry.** Fresh coriander is the
   standard finish for eleven of these thirteen. Same fix, ~5 g each.
3. **No whole-spice tempering anywhere.** Every recipe dumps ground powders into the pan. Real Indian
   cooking blooms whole seeds in hot fat first (tadka / chhonk / baghar). Even Dal Tadka — the one dish
   *named* after the technique — has no whole cumin seeds, no hing and no dried red chili in its tadka.
4. **No green chili anywhere.** All heat comes from ground `Chili Powder`. Fresh green chili is a distinct
   flavour, not a heat level, and it is zero-macro so it can live in `RECIPE_SPICE_OVERRIDES` for free.
5. **`Tomato Sauce` is doing work that fresh `Tomato` should do.** `Tomato` (fresh) is in the registry and
   unused by this slice. A jarred smooth tomato sauce is right for makhani/tikka masala gravies and wrong
   for chana masala, aloo gobi and dal, where you want a bhuna'd onion-tomato masala.

Two smaller patterns:

- **`Brown Rice` is served under five of these dishes.** Brown rice is not an Indian grain; basmati is.
  Flagged as minor drift per recipe, not repeated at length.
- **Phantom cooking fat in four recipes.** Palak Paneer, Mango Chicken Curry, Saag Chicken and Chicken
  Korma all have steps that say "sauté ... in oil" while carrying **no fat at all** in their ingredient
  lists. That is a `RECIPE_COOKING_DATA` / ingredient mismatch bug, independent of authenticity.

**Nuts:** korma and (in most modern versions) butter chicken are traditionally thickened with cashew or
almond paste. Those are banned and are never proposed below. The nut-free traditional answer is given per
dish — usually **fried-onion (birista) paste plus more yogurt**, which is what Awadhi korma actually uses,
and for makhani gravy simply a longer tomato reduction finished with cream. Neither is a compromise.

**Ghee:** not in the registry. `Butter` is the accepted stand-in throughout and is treated as fine.
**Olive Oil** is explicitly not flagged anywhere in this report.

---

### Egg & Potato Paratha
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — North Indian / Punjabi. Worth naming the tradition in a comment; the
  stuffed aloo paratha is a Punjabi/North Indian breakfast staple.
- **Findings:**
  - **The defining technique of a paratha is absent.** A paratha is a whole-wheat *dough* flatbread: the
    spiced potato is sealed *inside* a dough ball, rolled flat, and griddled with ghee so the filling
    cooks into the bread. This recipe warms a pre-made tortilla and spreads potato *on top* of it, then
    folds it. That is a folded wrap, not a paratha. The name promises the dish's single defining step and
    the steps do not deliver it.
  - Even read charitably as a street-style *anda paratha* (egg cooked into a layered paratha), the base is
    still a tortilla, not a paratha.
  - **Aloo paratha filling is wrong.** The classic filling is potato + green chili + fresh cilantro +
    ginger + amchur (or lemon) + red chili + ajwain, sometimes garam masala. This one is potato + onion +
    cumin + turmeric. Turmeric is not a standard aloo-paratha spice; **amchur is the flavour people
    actually recognise**, and it is missing.
  - Raw onion in the filling is a known cause of the paratha tearing — most cooks omit it or use very
    finely minced onion. Minor.
- **Proposed fix:** Two routes.
  - *Preferred (makes it a real paratha):* replace `Whole Wheat Tortilla` 70 g with `Flour` 70 g + `Water`
    45 g, kneaded into dough. Steps: knead dough and rest 20 min; mash boiled potato with cilantro, green
    chili, ginger, amchur, red chili, ajwain, salt; stuff a dough ball, seal, roll to 6 in; griddle with
    butter until golden-blistered on both sides; fry the egg separately in butter and serve alongside (or
    pour beaten egg between the layers for the street-style anda version). Add `Cilantro` 5 g,
    `Ginger` 5 g.
  - *Fallback (keeps the tortilla):* rename the dish to something honest — e.g. "Masala Egg & Potato
    Wrap" — and stop calling it a paratha. Still add cilantro, ginger, green chili and amchur to the
    filling.
- **New ingredients required:** `Flour` and `Water` are already in registry. `Cilantro`, `Ginger` already
  in registry. Spice overrides to add: **Amchur**, **Ajwain**, **Green Chili**, **Chili Powder**; drop
  `Turmeric`.
- **Ingredients no longer used:** `Whole Wheat Tortilla` (this recipe only, under the preferred route);
  `Onion` optionally reduced, not removed.
- **Macro impact:** Flour 70 g vs tortilla 70 g is roughly a wash on calories (flour is drier so slightly
  denser per gram — expect +30–50 cal, +2 g protein). Negligible under the fallback route.
- **Confidence:** high
- **Sources:** Swasthi's Recipes (aloo paratha; anda paratha), Wikipedia "Aloo paratha", Chef Ajay Chopra
  (aloo paratha with egg)

---

### Chicken Tikka Masala
- **Verdict:** `mislabeled` (and, separately, `significantly-off` on technique)
- **Cuisine label:** should be **British-Indian**, not `Indian`. CTM is a British restaurant invention —
  the most-accepted account credits Ali Ahmed Aslam at the Shish Mahal in Glasgow, c. 1971–72, improvising
  a sauce for a customer who found his chicken tikka dry. Unlike butter chicken it has no Indian
  lineage. Britannica and Wikipedia both treat it as British/Anglo-Indian. If the app has no
  `British-Indian` cuisine value, the honest options are to add one (it would also catch a lot of other
  restaurant-menu dishes) or to relabel to `British`. It should not sit under `Indian` in a book that
  claims to be auditing authenticity.
- **Findings:**
  - **`Cauliflower` 60 g does not belong.** There is no version of chicken tikka masala with cauliflower
    in the gravy. This reads as macro padding.
  - **The "tikka" never happens.** *Tikka* means the marinated chicken is skewered and cooked in a tandoor
    (or grilled/broiled) until charred, and only then folded into the masala. Here it is pan-browned in
    olive oil. Losing the char removes the one thing the name refers to.
  - No ginger, no garlic — in either the marinade or the masala.
  - No dairy finish. Every version of this dish finishes with cream (or coconut cream in dairy-free
    versions). Here the only dairy is yogurt in the marinade, so the sauce is just spiced tomato.
  - No **kasuri methi** (dried fenugreek leaves) — the single most identifiable aroma in the finished
    sauce — and no **Kashmiri chili**, which supplies the colour the dish is known for without heat.
  - The yogurt marinade with cumin/turmeric/garam masala/coriander is correct and good. 10 minutes is far
    too short; 4 h minimum.
- **Proposed fix:**
  - Ingredients: **remove** `Cauliflower` 60 g. **Add** `Ginger` 6 g, `Garlic` 8 g, `Evaporated Milk` 25 g
    (the registry's closest cream stand-in), `Cilantro` 5 g. Keep `Tomato Sauce` 100 g — a smooth tomato
    gravy is right for this dish.
  - Spices: replace `Chili Powder` with **Kashmiri Chili Powder**; add **Kasuri Methi**.
  - Steps: (1) marinate chicken 4 h+ in Greek yogurt with ginger-garlic, Kashmiri chili, garam masala,
    cumin, coriander, turmeric, salt; (2) **broil or grill on high until the edges char**, then set aside;
    (3) sauté onion until deep golden, add ginger-garlic, then tomato sauce, and cook until the oil
    separates; (4) return the charred chicken, simmer 10 min; (5) stir in evaporated milk and crushed
    kasuri methi off the heat; (6) finish with cilantro, serve over basmati rice.
- **New ingredients required:** none for the registry. Spice-override additions: **Kashmiri Chili Powder**,
  **Kasuri Methi** (neither currently in `RECIPE_SPICE_OVERRIDES`).
- **Ingredients no longer used:** `Cauliflower` (in this recipe).
- **Macro impact:** −~15 cal from the cauliflower, +~35 cal / +2 g fat from evaporated milk. Roughly
  neutral, marginally up. Protein unchanged.
- **Confidence:** high
- **Sources:** Britannica "chicken tikka masala"; Wikipedia "Chicken tikka masala"; Bloomberg, "Who
  Created Chicken Tikka Masala"; GlasgowWorld / Shish Mahal origin coverage

---

### Palak Paneer
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — Punjabi / North Indian.
- **Findings:**
  - **Phantom ingredient (a real bug, not just an authenticity note):** step 4 says "Sauté onion and
    garlic **in oil**", but the ingredient list contains no fat at all — no `Olive Oil`, no `Butter`.
  - **No ginger and no green chili.** Both are in the spinach purée in essentially every Punjabi recipe
    (Dassana, Swasthi both blend spinach *with* ginger, garlic and green chili). Their absence is why the
    dish would taste flat.
  - **No tomato.** Homestyle Punjabi palak paneer builds an onion-tomato base before the purée goes in.
    Some restaurant versions omit it — legitimate regional/style variation — but with no tomato *and* no
    ginger *and* no chili there is nothing left but onion.
  - **No cream / malai finish.** Palak paneer nearly always finishes with a spoonful of cream or yogurt;
    this is one of the documented differences between palak paneer and saag paneer.
  - **Blanching for 2 minutes overcooks the spinach and greys the purée.** The standard is ~1 minute in
    boiling water then straight into an ice bath. This is exactly the kind of step-level specific the
    dish depends on for its colour.
  - The paneer is added raw to the sauce. Standard practice is to either lightly pan-sear the cubes or
    soak them in warm salted water so they stay soft. Minor.
  - `Brown Rice` — palak paneer is a roti/naan or jeera-rice dish. Minor.
- **Proposed fix:**
  - Ingredients: **add** `Butter` 10 g (fixes the phantom oil, and ghee is the traditional fat here),
    `Ginger` 6 g, `Tomato` 50 g, `Evaporated Milk` 20 g (cream stand-in), `Cilantro` 4 g. Swap
    `Brown Rice` 52 g → `Basmati Rice` 52 g.
  - Spices: add **Green Chili**, **Kasuri Methi**, **Coriander Powder**; keep the rest.
  - Steps: blanch spinach **1 minute, then ice bath**; blend the spinach **with the ginger, garlic and
    green chili**; bloom cumin seeds in the butter, then onion, then tomato, cook until the oil separates;
    add purée and simmer only 5 min (long simmering dulls the green); add paneer, stir in cream and
    crushed kasuri methi; **garam masala goes in at the very end, off the heat**, not simmered.
- **New ingredients required:** none for the registry. Spice-override additions: **Green Chili**,
  **Kasuri Methi**, **Cumin Seeds** (whole).
- **Ingredients no longer used:** `Brown Rice` (in this recipe).
- **Macro impact:** +~110 cal, mostly fat, from adding butter and evaporated milk. Protein essentially
  unchanged. Meaningful — the solver will re-scale.
- **Confidence:** high
- **Sources:** Dassana's Veg Recipes (palak paneer, homestyle & restaurant style); Swasthi's Recipes
  (palak paneer); Foodess and Cookpad on palak vs saag paneer

---

### Chana Masala
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` in the broad sense — but the dish is specifically **Punjabi** (chole /
  Punjabi chole masala). Worth naming, because Punjabi chole and the Delhi/UP chole are the two versions a
  cook would recognise, and both are tangy-dark rather than the generic curry this describes.
- **Findings:** This is the worst recipe in the slice.
  - **Four ingredients that have nothing to do with chana masala:** `Cauliflower` 60 g, `Eggplant` 60 g,
    `Paneer` 50 g and `Red Lentils` 13 g. Chana masala is chickpeas in a spiced onion-tomato gravy — full
    stop. Adding cauliflower, aubergine, cheese and a second pulse turns it into a generic mixed vegetable
    stew that happens to contain chickpeas. `Paneer` in particular is not a chana masala ingredient in any
    tradition; the chickpeas are the protein.
  - **The souring agent is missing, and that IS the dish.** Punjabi chole gets its identity from **amchur**
    (dried mango powder) and/or **anardana** (dried pomegranate seeds); the chana masala spice blend is
    built around them, alongside ajwain, dried red chilies and black cardamom. Without a souring agent the
    dish is not chana masala, it is chickpea curry. This is the direct analogue of the aji-amarillo finding
    from the Peruvian audit.
  - No ginger, no green chili, no cilantro.
  - **No whole-spice base.** Punjabi chole starts with whole cumin, bay leaf and black cardamom bloomed in
    hot fat before the onion.
  - `Tomato Sauce` where a bhuna'd fresh onion-tomato-ginger masala is required. The traditional dark
    colour comes from cooking chickpeas with dried amla or a tea bag — not reproducible here, but fresh
    tomato cooked down until the oil separates is closer than jarred sauce.
  - Chickpeas at 65 g (dry weight) is a reasonable single portion; not a finding.
- **Proposed fix:**
  - Ingredients: **remove** `Cauliflower` 60 g, `Eggplant` 60 g, `Paneer` 50 g, `Red Lentils` 13 g.
    **Raise** `Chickpeas` 65 g → 85 g. **Add** `Ginger` 8 g, `Tomato` 90 g, `Cilantro` 6 g. Replace
    `Tomato Sauce` 100 g → 0 (fresh tomato takes over), or keep 40 g for body. Swap `Brown Rice` 52 g →
    `Basmati Rice` 52 g (chole is properly eaten with bhature, kulcha or rice).
  - Spices: **add Amchur** (mandatory — 2 g), **Anardana** (optional, 1 g), **Green Chili**,
    **Cumin Seeds** (whole), **Black Cardamom**, **Bay Leaf**, **Ajwain**. Keep cumin, turmeric, coriander,
    garam masala, chili powder, salt, pepper.
  - Steps: bloom whole cumin, bay leaf and black cardamom in oil; fry onion to deep golden; add
    ginger-garlic and green chili; add fresh tomato and the ground spices and cook until the oil separates
    ("bhuna"); add chickpeas and a little water, simmer 20 min, mashing a few chickpeas to thicken; finish
    with **amchur** and cilantro off the heat.
- **New ingredients required:** none for the registry (all four removals, and `Tomato`/`Ginger`/`Cilantro`
  are already there). Spice-override additions: **Amchur**, **Anardana**, **Green Chili**, **Cumin Seeds**,
  **Black Cardamom**, **Ajwain**.
- **Ingredients no longer used:** `Cauliflower`, `Eggplant`, `Paneer`, `Red Lentils`, `Tomato Sauce`,
  `Brown Rice` — all within this recipe only; each is still used elsewhere in the slice or the app.
- **Macro impact:** **Large and negative on protein.** Dropping paneer costs ~−65 cal and ~−9 g protein;
  dropping the lentils another ~−45 cal / −3 g protein. Raising chickpeas 65→85 g returns ~+75 cal and
  ~+4 g protein, so the dish lands roughly flat on calories but clearly lower on protein. Expect the
  solver to lean on this recipe less, or pair it with a protein shake.
- **Confidence:** high
- **Sources:** Dassana's Veg Recipes (authentic Punjabi chole); Swasthi's Recipes (chole); My Ginger Garlic
  Kitchen (Amritsari chole); Chef Ajay Chopra (Amritsari chole)

---

### Butter Chicken
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — and specifically **Delhi / Punjabi**, created by Kundan Lal Gujral at
  Moti Mahal, Delhi, in the 1950s. Unlike tikka masala this one is genuinely Indian; worth noting in a
  comment so the two are not lumped together.
- **Findings:**
  - **There is no marinade and no char.** Murgh makhani exists because Moti Mahal repurposed *leftover
    tandoori chicken* into a tomato-butter gravy. The chicken must first be marinated (yogurt +
    ginger-garlic + Kashmiri chili + garam masala) and cooked hot until charred. Pan-searing raw chicken in
    butter skips the entire origin of the dish.
  - **The Greek yogurt is in the wrong place.** It is stirred into the finished sauce. Yogurt belongs in
    the marinade; the sauce is finished with **cream**. Practically, yogurt added to a hot tomato sauce
    also tends to split.
  - **No kasuri methi.** Crushed dried fenugreek leaves stirred in at the end are the signature aroma of
    makhani gravy. Its absence is as noticeable as a missing spice can be.
  - **No Kashmiri chili.** The colour comes from Kashmiri chili plus tomato and butter, not from turmeric.
  - **Turmeric does not belong** in a makhani gravy — it muddies the red toward yellow-brown.
  - No ginger, no garlic. Makhani gravy is ginger-garlic-forward.
  - **Not a finding:** the absence of onion is *correct*. The original Moti Mahal makhani gravy is tomato,
    butter, cream, ginger, garlic and chili — onion-free. Good call, whether deliberate or not.
  - **Nuts:** many modern restaurant versions thicken this gravy with cashew paste. Cashews are banned and
    are not proposed. They are also not needed — the Moti Mahal original thickens by reducing the tomato
    hard and mounting it with butter and cream, which is both nut-free and *more* traditional.
- **Proposed fix:**
  - Ingredients: **keep** `Chicken Thigh` 170 g, `Butter` 15 g, `Tomato Sauce` 120 g, `Greek Yogurt` 40 g
    (moved to the marinade), `Basmati Rice` 56 g. **Add** `Ginger` 6 g, `Garlic` 6 g, `Evaporated Milk`
    30 g (cream stand-in), `Cilantro` 4 g, `Lemon` 8 g (for the marinade).
  - Spices: **drop `Turmeric`**. Replace `Chili Powder` with **Kashmiri Chili Powder**. **Add Kasuri
    Methi.** Keep cumin, coriander, garam masala, salt, pepper.
  - Steps: (1) marinate chicken 4 h+ in yogurt, lemon, ginger-garlic, Kashmiri chili, garam masala, salt;
    (2) broil/grill until the edges char; (3) simmer tomato sauce with ginger-garlic and the ground spices
    until thick and the fat separates; (4) whisk in the butter, then the evaporated milk; (5) return the
    charred chicken, simmer 5 min; (6) crush kasuri methi between the palms and stir in off the heat,
    finish with cilantro; serve over basmati.
- **New ingredients required:** none for the registry. Spice-override additions: **Kashmiri Chili Powder**,
  **Kasuri Methi**.
- **Ingredients no longer used:** none (yogurt only relocates within the recipe).
- **Macro impact:** +~35 cal / +2 g fat from evaporated milk; the rest is neutral. Protein unchanged.
- **Confidence:** high
- **Sources:** Moti Mahal murgh makhani (published original, via Cooks Without Borders and the circulated
  Moti Mahal recipe sheet); Swasthi's Recipes (butter chicken); Wikipedia "Butter chicken"

---

### Aloo Gobi
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — **Punjabi**, and it is a dry *sabzi*, not a curry. Naming the tradition
  matters here because the Punjabi/dhaba version is dry and the only widely-eaten "wet" versions are
  restaurant adaptations.
- **Findings:**
  - **The dish is supposed to be dry and this method makes it wet.** Punjabi aloo gobi is cooked uncovered
    or briefly covered so the potato and cauliflower brown at the edges and the spices coat them. Here
    30 g of tomato sauce goes in and the pan is **covered for 20 minutes**, which steams everything into a
    soft mash. Every Punjabi source is emphatic on this point.
  - **No cumin-seed tempering.** The dish opens with whole cumin seeds (and usually hing) crackling in hot
    oil. Missing.
  - **No ginger, no green chili, no cilantro finish.** All three are standard; the cilantro at the end is
    part of the dish's identity, not a garnish.
  - **No garam masala.** Aloo gobi finishes with a sprinkle of garam masala off the heat; the current
    spice list has none at all.
  - `Tomato Sauce` where fresh tomato (or nothing) is right — jarred smooth sauce is the wrong texture for
    a dry sabzi.
  - `Brown Rice` — aloo gobi is a roti/phulka dish. Minor.
  - **Not a finding:** the cumin / turmeric / coriander / chili powder core is correct, and onion is normal
    in dhaba-style aloo gobi.
- **Proposed fix:**
  - Ingredients: **remove** `Tomato Sauce` 30 g, **add** `Tomato` 50 g (fresh, diced), `Ginger` 6 g,
    `Cilantro` 5 g. Swap `Brown Rice` 52 g → `Basmati Rice` 52 g, or replace the grain with
    `Whole Wheat Tortilla` 60 g if a roti stand-in is preferred.
  - Spices: **add Cumin Seeds** (whole), **Asafoetida (Hing)**, **Green Chili**, **Garam Masala**,
    **Amchur** (optional but very common). Keep the rest.
  - Steps: crackle whole cumin and a pinch of hing in the oil; add ginger and green chili; add onion and
    fry golden; add the ground spices and fresh tomato and cook 2 min; add potato and cauliflower, toss to
    coat, cover **only 8–10 min** to soften, then **uncover and fry another 5–7 min so the edges brown and
    the dish is dry**; finish with garam masala, amchur and cilantro off the heat.
- **New ingredients required:** none for the registry. Spice-override additions: **Cumin Seeds**,
  **Asafoetida (Hing)**, **Green Chili**, **Amchur**; plus `Garam Masala` (already an established spice
  name elsewhere in the file).
- **Ingredients no longer used:** `Tomato Sauce`, `Brown Rice` (in this recipe).
- **Macro impact:** negligible — a fresh-tomato-for-sauce swap and 5 g of herbs.
- **Confidence:** high
- **Sources:** Tarla Dalal (Punjabi dry aloo gobhi sabzi); Maunika Gowardhan (Punjabi aloo gobi); My Ginger
  Garlic Kitchen (dhaba-style dry aloo gobi)

---

### Mango Chicken Curry
- **Verdict:** `not-a-real-dish` (as a traditional Indian dish)
- **Cuisine label:** not defensible as `Indian` at the traditional bar. Chicken + ripe mango + coconut milk
  is a modern restaurant fusion dish, popularised by Indian restaurants in the UK, Australia and Canada
  rather than eaten in India. Real Indian mango-in-a-savoury-dish traditions exist and are all different
  from this: Kerala's **mambazha pulissery** (ripe mango simmered in yogurt and coconut — vegetarian),
  Goan and Kerala fish/chicken curries built on **raw green mango** as a souring agent, and Hyderabadi
  **kairi ka do pyaza** (green mango with lamb). None is a ripe-mango chicken curry.
- **Findings:**
  - The dish as named and built has no tradition behind it.
  - **The spice set and the sauce base belong to different halves of the country.** Coconut milk is a South
    Indian (Kerala/coastal) base; cumin + turmeric + **garam masala** is a North Indian powder set. Garam
    masala in a coconut-milk curry is the tell that this was assembled rather than derived. A Kerala curry
    uses mustard seeds, curry leaves, fenugreek, shallots, Kashmiri chili and coconut oil.
  - **Phantom ingredient:** step 3 says "Sauté onion **in oil**" and the ingredient list has no fat.
  - Ripe mango simmered 15–20 minutes in the sauce disintegrates into sweetness. In the Kerala tradition
    ripe mango goes in near the *end*, and green mango goes in early because it is there to sour, not
    sweeten.
  - No ginger, no garlic, no green chili, no cilantro.
  - `Brown Rice` — Kerala curries go with white rice (ideally matta/parboiled).
- **Proposed fix:** Do not try to make "Mango Chicken Curry" authentic; it has no authentic form. Convert
  it into a dish that does exist, keeping most of the macro shape:
  - **Rename to "Kerala Chicken Curry with Green Mango"** (or "Chicken Curry with Raw Mango").
  - Ingredients: keep `Chicken Breast` 150 g, `Coconut Milk` 60 g, `Onion` 50 g. **Add** `Ginger` 8 g,
    `Garlic` 6 g, `Olive Oil` 8 g (fixes the phantom fat; coconut oil would be traditional but is not in
    the registry), `Cilantro` 5 g. Keep `Mango` 80 g but **use it unripe/firm and add it in the last
    5 minutes** — the registry entry is a ripe mango, so note in a comment that the intent is raw mango and
    the macros are close enough (green mango is lower in sugar; ~−25 cal if you want to be exact).
    Swap `Brown Rice` 56 g → `White Rice` or `Basmati Rice` 56 g.
  - Spices: **drop `Garam Masala`**. **Add Mustard Seeds, Curry Leaves, Fenugreek Seeds, Kashmiri Chili
    Powder, Coriander Powder, Green Chili.** Keep turmeric and cumin.
  - Steps: pop mustard seeds in the oil with curry leaves and a few fenugreek seeds; add onion, ginger,
    garlic and green chili and fry soft; add the ground spices and a splash of water and fry to a paste;
    add chicken and brown; add coconut milk and simmer 12 min; add the mango for the last 5 min; finish
    with cilantro.
- **New ingredients required:** none for the registry (all substitutions use existing entries). Optional
  registry addition: **`Coconut Oil`** — NOT in registry — if you want the fat to be traditional.
  Spice-override additions: **Mustard Seeds**, **Curry Leaves**, **Fenugreek Seeds**, **Kashmiri Chili
  Powder**, **Green Chili**.
- **Ingredients no longer used:** `Brown Rice` (in this recipe).
- **Macro impact:** +~70 cal from adding a real cooking fat (which the recipe was silently cooking with
  anyway); −~25 cal if the mango is genuinely green. Protein unchanged.
- **Confidence:** medium-high on "not a traditional dish"; high on the North/South spice mismatch and the
  phantom fat.
- **Sources:** Wikipedia "Chicken curry" and "Kairi ka do pyaza"; Seema (South Indian mango curry /
  mambazha pulissery); Ang Sarap and general coverage of mango chicken as a restaurant-diaspora dish

---

### Dal Tadka
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — North Indian, dhaba/Punjabi style.
- **Findings:**
  - **The tadka is not a tadka.** This is the central finding, because the dish is named after it. A tadka
    is *whole* spices bloomed in hot ghee until they crackle: **cumin seeds**, **dried red chili**,
    **asafoetida (hing)** and sliced garlic, poured sizzling over the cooked dal. This recipe sautés onion
    and garlic in butter, then stirs in **ground** cumin, turmeric, chili powder and **tomato sauce**, and
    cooks it for 2 minutes. That is a masala base, not a tempering. The crackle-and-pour is the technique.
  - **Turmeric is in the wrong place.** Turmeric goes into the lentils *while they boil* — that is what
    makes dal yellow and what takes the raw edge off the pulse. Here it goes into the tadka.
  - **Tomato sauce in the tadka** is unusual; where tomato is used it is fresh and cooked into the onion
    base, not jarred sauce added to a tempering.
  - No ginger, no green chili, no cilantro, no lemon at the end (a squeeze of lemon or a pinch of amchur is
    standard).
  - **Dal variety:** classic dal tadka is **toor (arhar) dal**, often blended with a little masoor or
    moong. This uses pure `Red Lentils` (masoor). A pure masoor dal tadka is a genuinely eaten variation —
    faster-cooking, and it gives an orange dal — so I am not calling this wrong. Note it as a variation in
    a comment. Toor dal is not in the registry.
  - `Butter` for ghee: acceptable stand-in, treated as fine.
  - 40 g of dry lentils in 2.5 cups of water is very thin — roughly 15:1. Expect soup. Reduce to
    ~1.25 cups. Minor but the steps should say something reasonable.
  - `Brown Rice` — dal-chawal is white rice. Minor.
- **Proposed fix:**
  - Ingredients: **remove** `Tomato Sauce` 30 g, **add** `Tomato` 50 g (fresh) and `Ginger` 6 g,
    `Cilantro` 5 g, `Lemon` 8 g. Swap `Brown Rice` 56 g → `Basmati Rice` 56 g.
  - Spices: **add Cumin Seeds** (whole), **Dried Red Chili**, **Asafoetida (Hing)**, **Green Chili**.
    Keep ground cumin (optional), turmeric, chili powder, salt, pepper.
  - Steps: (1) boil the rinsed lentils with **turmeric**, salt and ~1.25 cups water until soft, whisk to
    break them down; (2) separately, in a small pan, heat the butter and **crackle whole cumin seeds, a
    dried red chili and a pinch of hing**; add sliced garlic and fry to pale gold, then ginger, green
    chili and onion, then fresh tomato and chili powder and cook until the fat separates; (3) **pour the
    sizzling tadka over the dal**, stir, finish with lemon and cilantro; serve with rice.
- **New ingredients required:** none for the registry. Optional registry addition: **`Toor Dal`** — NOT in
  registry — only if you want the canonical pulse; `Red Lentils` is a defensible variation. Spice-override
  additions: **Cumin Seeds**, **Dried Red Chili**, **Asafoetida (Hing)**, **Green Chili**.
- **Ingredients no longer used:** `Tomato Sauce`, `Brown Rice` (in this recipe).
- **Macro impact:** negligible.
- **Confidence:** high
- **Sources:** Dassana's Veg Recipes (restaurant-style dal tadka); Swasthi's Recipes (dal tadka); Piping
  Pot Curry (dal tadka); Cook With Manali (dal tadka)

---

### Lamb Biryani
- **Verdict:** `significantly-off`
- **Cuisine label:** `Indian` is correct but **too vague for this dish specifically**. Biryani is defined by
  its regional school — Hyderabadi (kacchi, raw marinated meat, heavy saffron and mint), Lucknowi/Awadhi
  (pakki, gentler, more whole-spice aroma), Kolkata (potato and egg), Malabar, Sindhi. As written — yogurt
  marinade, whole garam spices, layered and sealed — it is closest to **Hyderabadi/North Indian**. Name
  the school.
- **Findings:**
  - **Ground lamb is the disqualifying problem.** Biryani is made with **bone-in** lamb/mutton in roughly
    2-inch pieces, marinated in yogurt and spices; the bone and the long cook are where the flavour comes
    from. Layering *minced* meat with rice produces **keema pulao** (or at best a modern "keema biryani",
    which is explicitly a variant, not the dish). If it stays as ground lamb, the honest name is
    "Lamb Keema Pulao".
  - **No birista.** Deep-fried crisp onions are not optional decoration in biryani — they are folded
    between the layers and are one of the three things (with saffron and mint) that make a biryani smell
    like a biryani. This recipe browns the onion with the meat instead.
  - **No saffron.** Saffron steeped in warm milk, drizzled over the top layer, is what gives biryani its
    two-tone white-and-gold rice.
  - **No mint, no cilantro.** Both are scattered between the layers.
  - No ginger, no ginger-garlic paste (garlic alone is present).
  - **Turmeric does not belong.** Hyderabadi and Lucknowi biryani take their colour from saffron and fried
    onions. Turmeric pushes it toward a tehri/pulao.
  - Missing whole spices: **cloves**, **black cardamom**, and (in Hyderabadi) shahi jeera. Green cardamom,
    cinnamon and bay leaf are correctly present.
  - No lemon and no acid in the marinade.
  - **Not findings — these are right:** soaking and parboiling the rice to ~70%, the yogurt marinade, the
    layering, and "cover tightly and cook on low" as a reasonable home stand-in for *dum*. Credit where
    due; the skeleton of the method is correct.
- **Proposed fix:**
  - *If keeping the name "Lamb Biryani":* the meat must change. **`Lamb Shoulder` or `Lamb Leg` is NOT in
    the registry** and would have to be added (bone-in weight complicates the macros — boneless shoulder,
    ~230 cal/100 g raw, is the practical entry). Swap `Ground Lamb` 130 g → `Lamb Shoulder` 140 g.
  - *If keeping ground lamb:* **rename to "Lamb Keema Pulao"** and drop the layering language in favour of
    a one-pot method. This is the cheap, honest route.
  - Either way — ingredients: **add** `Ginger` 8 g, `Cilantro` 5 g, `Lemon` 8 g; raise `Onion` 60 → 70 g
    and dedicate part of it to **birista** (thin-sliced, fried crisp, half into the marinade and half
    between the layers).
  - Spices: **drop `Turmeric`**. **Add Saffron, Mint, Cloves, Black Cardamom.** Keep cumin, garam masala,
    green cardamom, cinnamon, bay leaf, salt, pepper.
  - Steps: marinate the lamb in yogurt, ginger-garlic, ground spices, half the birista, mint, cilantro and
    lemon (2 h+); soak and parboil the rice to 70% with the whole spices in the water; layer meat, then
    rice, scattering mint, cilantro and the remaining birista; drizzle **saffron steeped in warm milk**
    over the top; seal and dum on the lowest heat 20–25 min; rest 10 min before fluffing from the edges.
- **New ingredients required:** **`Lamb Shoulder`** (or `Lamb Leg`) — **NOT in registry** — required only
  under the keep-the-name route. `Whole Milk` (for the saffron) is already in the registry. Spice-override
  additions: **Saffron**, **Mint**, **Cloves**, **Black Cardamom**.
- **Ingredients no longer used:** `Ground Lamb` (in this recipe) under the keep-the-name route; nothing
  under the rename route.
- **Macro impact:** significant under the keep-the-name route — lean lamb shoulder is markedly lower in fat
  than 80/20-style ground lamb, so expect roughly **−80 to −120 cal and −6 to −10 g fat**, with protein
  flat or slightly up. No macro change under the rename route.
- **Confidence:** high
- **Sources:** Sinfully Spicy (authentic dum mutton biryani); The Storied Recipe (Hyderabadi mutton
  biryani); Swasthi's Recipes (birista / crispy fried onions); multiple pulao-vs-biryani explainers on the
  dum-as-defining-step point

---

### Saag Chicken
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — **Punjabi / North Indian**, and the dish's proper name is **murgh
  saagwala**. The name is genuinely ambiguous and should be pinned down, see below.
- **Findings:**
  - **"Saag" and "palak" are not synonyms, and this recipe is palak.** In Punjabi, *saag* means mixed
    leafy greens — classically **sarson (mustard greens)**, often with spinach, bathua and methi. A dish
    made with spinach alone is **palak chicken**. Calling a spinach-only dish "Saag Chicken" is the
    restaurant-menu convention, not the Punjabi one. Two honest fixes: add mustard greens, or rename to
    "Palak Chicken (Murgh Saagwala)".
  - **`Paneer` 50 g does not belong in a chicken dish.** Chicken *and* paneer in the same bowl is not a
    dish in any Indian tradition — you eat saag chicken or saag paneer. This is macro padding.
  - **`Cauliflower` 60 g does not belong either.** Same problem.
  - **No garlic at all**, and no ginger. Onion-garlic-ginger is the base of every version of this dish.
  - No green chili, no tomato, no cilantro.
  - **Phantom ingredient:** step 4 says "Sauté onion" with no fat in the ingredient list.
  - Greek yogurt is dropped into a simmering pan and cooked 15 minutes — it will split. Yogurt should be
    whisked smooth and folded in on low heat at the end, or cream used instead.
  - The spinach is blanched and puréed with nothing in it; the ginger, garlic and green chili should go
    into the blender with the greens.
- **Proposed fix:**
  - Ingredients: **remove** `Paneer` 50 g and `Cauliflower` 60 g. **Add** `Garlic` 8 g, `Ginger` 8 g,
    `Butter` 10 g (fixes the phantom fat, ghee is traditional), `Tomato` 60 g, `Cilantro` 5 g. Keep
    `Chicken Breast` 160 g (bone-in thigh would be more traditional — the bone is part of the flavour —
    but breast is a defensible planner choice; `Chicken Thigh` is in the registry if you want it).
  - Optional: **add `Mustard Greens` 60 g — NOT in registry** — and keep the name "Saag Chicken".
    Otherwise rename to **"Palak Chicken"**.
  - Spices: **add Green Chili**, **Cumin Seeds** (whole), **Kasuri Methi**. Keep the rest.
  - Steps: blanch spinach 1 min then ice bath; blend **with ginger, garlic and green chili**; crackle cumin
    seeds in the butter, fry onion golden, add tomato and ground spices and cook until the fat separates;
    brown the chicken; add the purée and simmer 12 min; **whisk the yogurt smooth and fold it in off the
    heat**; finish with kasuri methi and cilantro.
- **New ingredients required:** **`Mustard Greens`** — **NOT in registry** — required only if the "Saag"
  name is kept. Spice-override additions: **Green Chili**, **Cumin Seeds**, **Kasuri Methi**.
- **Ingredients no longer used:** `Paneer`, `Cauliflower` (in this recipe).
- **Macro impact:** meaningful. Dropping paneer and cauliflower costs roughly **−90 cal and −9 g protein**;
  adding 10 g butter returns ~+72 cal as fat. Net: calories roughly flat, **protein clearly down**. This is
  currently one of the app's high-protein recipes and it will stop being one.
- **Confidence:** high
- **Sources:** Swasthi's Recipes (palak chicken / chicken saag); Sinfully Spicy (murgh saagwala); Ruchi's
  Kitchen (saagwala chicken); Foodess / Chef In You on the saag-vs-palak distinction

---

### Chicken Korma
- **Verdict:** `significantly-off`
- **Cuisine label:** `Indian` is technically fine but **the recipe is two cuisines fused together and the
  name only claims one of them.** *Korma* is Mughlai/North Indian: yogurt, fried onions, nut or seed paste,
  gentle whole spices, **no coconut**. *Kurma* is the South Indian dish: **coconut**-based, fennel-forward,
  curry leaves. This recipe uses coconut milk (South) with cardamom, cinnamon and a garam-masala-adjacent
  set (North). It has to pick one.
  - **Nuts:** a Mughlai korma is traditionally thickened with almond or cashew paste (and white poppy or
    melon seeds). Cashews and almonds are banned and are not proposed. The nut-free traditional answer is
    **birista — deep-fried onions blitzed to a paste — plus a larger quantity of thick yogurt.** This is
    exactly how Awadhi korma is built, so it is not a downgrade; it is a different authentic lineage. Gram
    flour (besan) is a second nut-free thickener used in home kitchens.
- **Findings:**
  - **No fried-onion base.** Golden-fried onions ground into a paste are the structural backbone of korma;
    "sauté onion until golden" is not the same operation and yields a thin sauce.
  - **No ginger, no garlic.** Both are foundational.
  - **Turmeric is not a korma spice.** A korma — especially a shahi/white korma — is deliberately pale
    gold to ivory. Turmeric pushes it yellow. (Medium confidence: a minority of home kormas do use a
    pinch.)
  - **Phantom ingredient:** step 3 says "Sauté onion in oil"; the ingredient list has no fat at all. A
    korma is a rich dish and needs one.
  - **Yogurt handling.** The yogurt goes into a hot pan with coconut milk and is simmered 15–20 minutes; it
    will split. Korma yogurt is whisked, added off the heat or on the lowest flame, and stirred constantly.
  - Missing the fennel/mace/nutmeg aromatics that make a korma smell like a korma; missing cilantro; and
    (optionally) kewra or rose water, which I would skip as impractical.
  - `Basmati Rice` is correct here.
- **Proposed fix:** Pick a lane. I recommend the **Mughlai** one, since the name says korma:
  - Ingredients: **remove** `Coconut Milk` 50 g. **Raise** `Greek Yogurt` 50 → 80 g. **Raise** `Onion`
    50 → 70 g (fried to birista and ground). **Add** `Ginger` 8 g, `Garlic` 8 g, `Butter` 12 g (ghee
    stand-in — fixes the phantom fat), `Cilantro` 4 g. Keep `Chicken Breast` 150 g and `Basmati Rice` 47 g.
  - Spices: **drop `Turmeric`**. **Add Fennel Seeds, Cloves, Green Chili, White Pepper** (already an
    established name), and optionally **Mace**. Keep cumin, coriander, cardamom, cinnamon, salt.
  - Steps: fry the sliced onion in the butter until deep golden and crisp, remove and grind to a paste;
    bloom the whole spices in the same fat; add ginger-garlic; add chicken and seal; add the birista paste;
    **take the pan off the heat, whisk the yogurt smooth and fold it in a spoonful at a time**, then return
    to the lowest flame and simmer covered 15 min without boiling; finish with cilantro.
  - *Alternative lane:* keep the coconut milk, **rename to "Chicken Kurma"**, drop cardamom/cinnamon in
    favour of **fennel seeds, curry leaves, coriander and Kashmiri chili**, and label it South Indian.
- **New ingredients required:** none for the registry. Optional registry addition: **`Gram Flour (Besan)`**
  — **NOT in registry** — as a second nut-free thickener. Spice-override additions: **Fennel Seeds**,
  **Cloves**, **Green Chili**, and optionally **Mace**.
- **Ingredients no longer used:** `Coconut Milk` (in this recipe, under the Mughlai route).
- **Macro impact:** removing coconut milk drops ~−90 cal and ~−9 g fat; adding 12 g butter and 30 g extra
  Greek yogurt returns ~+105 cal, ~+9 g fat and **+3 g protein**. Net roughly flat on calories, slightly up
  on protein.
- **Confidence:** high on the North/South fusion and the missing birista/ginger-garlic; medium on turmeric.
- **Sources:** Swasthi's Recipes (chicken korma; chicken kurma — the two are separate recipes on the same
  site, which makes the distinction cleanly); Sinfully Spicy (shahi/white korma and goat korma);
  cookingandme.com (South Indian veg kurma); Cooking Carnival / Swasthi on birista

---

### Paneer Tikka Wrap
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — and specifically this is a **kathi roll** (also kati/kathi), Kolkata
  street food, the format popularised by Nizam's where a kebab is wrapped in paratha for eating on the
  move. Worth naming, since "wrap" reads generic.
- **Findings:**
  - **The wrapper is a tortilla, not a paratha.** A kathi roll is rolled in a paratha or rumali roti, often
    egg-coated on one side. A whole-wheat tortilla is a reasonable pantry stand-in and I would not force
    a change here, but the dish should say it is an adaptation rather than imply a paratha.
  - **The marinade is missing besan.** Paneer tikka marinade is hung curd + **besan (gram flour)** +
    ginger-garlic + **ajwain** + **kasuri methi** + Kashmiri chili + chaat masala. The besan is not
    optional filler: it thickens the marinade so it clings to the paneer and browns into a crust on the
    grill. Without it the yogurt slides off and you get plain seared paneer.
  - Missing **ajwain** (the carom-seed note is characteristic of tikka marinades), **kasuri methi**,
    **chaat masala**, ginger, garlic, green chili and cilantro.
  - No acid: a squeeze of lemon plus chaat masala over the hot paneer at the end is the signature finish.
  - No chutney or sauce inside the roll. A kathi roll carries green chutney (cilantro-mint) and sliced raw
    onion. The onion is present — good — but it is grilled with the peppers rather than going in raw.
  - `Chili Powder` where **Kashmiri chili** is what gives paneer tikka its red without heat.
  - **Not findings:** Greek yogurt is an excellent hung-curd stand-in, and paneer + bell pepper + onion on
    the skewer is exactly right.
- **Proposed fix:**
  - Ingredients: **add** `Ginger` 5 g, `Garlic` 5 g, `Cilantro` 5 g, `Lemon` 10 g, and **`Gram Flour
    (Besan)` 10 g — NOT in registry**. Split the `Onion` 40 g: ~25 g grilled, ~15 g raw slivers inside the
    roll. Keep everything else.
  - Spices: replace `Chili Powder` with **Kashmiri Chili Powder**; **add Ajwain, Kasuri Methi, Chaat
    Masala, Green Chili**.
  - Steps: whisk Greek yogurt with besan, ginger-garlic, ajwain, crushed kasuri methi, Kashmiri chili,
    turmeric, cumin, coriander, garam masala and salt into a thick paste; coat the paneer and peppers and
    rest 30 min; grill/tawa-sear hard until charred at the edges; **squeeze lemon and dust chaat masala
    over while hot**; warm the tortilla, spread a spoon of cilantro-green-chili chutney, lay the paneer and
    peppers with the raw onion slivers, roll tight and serve.
- **New ingredients required:** **`Gram Flour (Besan)`** — **NOT in registry**; would need an
  `INGREDIENT_REGISTRY` entry (~387 cal / 22 g protein / 58 g carb / 6.7 g fat per 100 g raw) and an
  `INGREDIENT_CATEGORIES` placement (baking/dry goods). Spice-override additions: **Kashmiri Chili
  Powder**, **Ajwain**, **Kasuri Methi**, **Chaat Masala**, **Green Chili**.
- **Ingredients no longer used:** none.
- **Macro impact:** small — 10 g besan adds ~39 cal and ~2 g protein; the rest is aromatics. Direction:
  marginally up on both.
- **Confidence:** high
- **Sources:** Dassana's Veg Recipes (paneer tikka); Swasthi's Recipes (paneer tikka; kathi rolls);
  Archana's Kitchen and Tarla Dalal (paneer tikka kathi roll); Howrah district / CurryUpNow on the Nizam's
  Kolkata origin

---

### Tandoori Chicken
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — **Punjabi**, via Moti Mahal in Peshawar and then Delhi. Same lineage as
  butter chicken; worth noting since butter chicken is literally made from leftovers of this dish.
- **Findings:**
  - **`Paprika` is standing in for `Kashmiri Chili Powder`, and that is a real substitution finding.**
    Kashmiri chili is the defining ingredient of the marinade: it supplies the deep red without heat.
    Paprika is the Western pantry substitute and tastes sweet and flat by comparison. This is the same
    class of finding as using turmeric where aji amarillo is required.
  - **Turmeric is not a tandoori spice.** It dulls the red toward orange-brown. Drop it or reduce it to a
    trace.
  - **One marinade instead of two.** The canonical method is a first marinade of **lemon juice + salt +
    Kashmiri chili rubbed into slashed chicken (20–30 min)** to tenderise and penetrate, then a second
    yogurt + ginger-garlic + spice marinade. Here the lemon is folded into the single yogurt mix, so the
    acid never gets to the meat on its own.
  - **10 minutes of marinating.** Every source says 4 hours minimum, overnight preferred. On a 10-minute
    marinade the yogurt has not done anything.
  - **No ginger.** Garlic is present; ginger-garlic paste is the pair and ginger is the half that's missing.
  - **No slashing.** Deep diagonal slits cut to the bone are how the marinade gets inside; without them a
    thick piece is seasoned only on the surface.
  - No **kasuri methi**, no **chaat masala** finish, and no fat in the marinade (mustard oil is the classic
    Punjabi choice; not in the registry — a little `Olive Oil` or `Butter` would do the mechanical job).
  - **Serving with basmati rice is not how this dish is eaten.** Tandoori chicken is a kebab/starter served
    with raw onion rings, lemon wedges and mint chutney, with naan or roti if anything. I'd treat the rice
    as a planner concession rather than demand its removal — but the onion rings and lemon should be
    explicit.
  - **Not findings:** the onion rings as garnish are correct and a nice touch; 220 C is the right
    temperature; `Chicken Thigh` is a good choice (bone-in, skin removed, is the traditional cut and the
    registry entry can be read that way).
- **Proposed fix:**
  - Ingredients: **add** `Ginger` 8 g and `Olive Oil` 5 g (marinade). Raise `Lemon` 15 → 20 g so some is
    reserved for squeezing at the table. Keep the rest.
  - Spices: **remove `Paprika`**, **add Kashmiri Chili Powder** in its place (2 g). **Drop `Turmeric`** (or
    reduce to a trace). **Add Kasuri Methi and Chaat Masala.** Keep cumin, garam masala, salt, pepper.
  - Steps: (1) remove skin, **cut deep slashes**, rub with half the lemon juice, salt and Kashmiri chili;
    rest 30 min; (2) whisk Greek yogurt with ginger-garlic, cumin, garam masala, crushed kasuri methi and
    oil; coat and **refrigerate at least 4 hours, ideally overnight**; (3) roast/grill at 220 C, 15–20 min,
    turning once, until charred at the edges; (4) **dust with chaat masala and squeeze the remaining lemon
    over while hot**; (5) serve with raw onion rings and rice.
- **New ingredients required:** none for the registry. Spice-override additions: **Kashmiri Chili Powder**,
  **Kasuri Methi**, **Chaat Masala**.
- **Ingredients no longer used:** `Paprika` (in this recipe's spice overrides).
- **Macro impact:** negligible — +5 g oil is ~+44 cal; everything else is aromatics.
- **Confidence:** high
- **Sources:** Ministry of Curry (authentic tandoori chicken); Sinfully Spicy (restaurant-worthy tandoori
  chicken); Saveur (tandoori chicken); Hassanchef (restaurant-style tandoori chicken)

---

## Summary

### Counts by verdict
| Verdict | Count | Recipes |
|---|---|---|
| `authentic` | **0** | — |
| `minor-drift` | **5** | Palak Paneer, Aloo Gobi, Dal Tadka, Paneer Tikka Wrap, Tandoori Chicken |
| `significantly-off` | **6** | Egg & Potato Paratha, Chana Masala, Butter Chicken, Lamb Biryani, Saag Chicken, Chicken Korma |
| `mislabeled` | **1** | Chicken Tikka Masala (British-Indian, not Indian) |
| `not-a-real-dish` | **1** | Mango Chicken Curry |

Zero `authentic` looks harsh, so to be clear about what that means: the five `minor-drift` recipes are
each one small edit away — ginger, cilantro, a green chili and a proper tempering step. They are not
broken. The reason none reaches `authentic` at the traditional bar is the systemic gap described at the
top: **no ginger anywhere, no cilantro anywhere, no green chili anywhere, and no whole-spice tempering
anywhere.** Fix those four things across all thirteen and roughly half of this slice becomes authentic
without touching anything else.

### The 3 worst offenders
1. **Chana Masala** — carries `Paneer`, `Eggplant`, `Cauliflower` and `Red Lentils`, none of which belong,
   and lacks the souring agent (amchur/anardana) that defines the dish. It is neither chana nor masala.
2. **Mango Chicken Curry** — not a traditional Indian dish at all; a restaurant-diaspora fusion that bolts
   a North Indian powder set (garam masala) onto a South Indian coconut base, and cooks ripe mango into
   sweetness where the tradition uses green mango to sour.
3. **Lamb Biryani** — ground lamb makes it keema pulao, not biryani, and it has none of the three things
   that define a biryani's aroma: birista, saffron and mint.

Runners-up worth naming: **Butter Chicken** (no marinade, no char, and yogurt stirred into the finished
sauce instead of cream) and **Chicken Korma** (Mughlai and South Indian traditions fused, with no
fried-onion base and no ginger-garlic).

### Consolidated new ingredients required

**Must be added to `INGREDIENT_REGISTRY` (these carry macros) — none currently in registry.md:**
| Ingredient | Needed by | Necessity |
|---|---|---|
| `Gram Flour (Besan)` | Paneer Tikka Wrap (marinade); optional korma thickener | **Required** for a real paneer tikka marinade |
| `Lamb Shoulder` (or `Lamb Leg`) | Lamb Biryani | Required **only** if the dish keeps the name "Biryani"; unnecessary if renamed to Keema Pulao |
| `Mustard Greens` | Saag Chicken | Required **only** if the dish keeps the name "Saag"; unnecessary if renamed to Palak Chicken |
| `Toor Dal` | Dal Tadka | Optional — `Red Lentils` is a legitimate masoor-dal variation |
| `Ghee` | all savoury dishes | Optional — `Butter` is an accepted stand-in throughout this report |
| `Coconut Oil` | Kerala chicken curry | Optional |

**Already in `INGREDIENT_REGISTRY` but unused by this slice, and needed:** `Ginger` (11 recipes),
`Cilantro` (11 recipes), `Tomato` fresh (5 recipes), `Evaporated Milk` as the cream stand-in (3 recipes),
`Basmati Rice` replacing `Brown Rice` (5 recipes), `Lemon` (3 recipes), `Flour` + `Water` (paratha).

**Spice-override names to add (zero-macro, no registry entry needed — they only need a grocery category):**
`Cumin Seeds` (whole), `Mustard Seeds`, `Dried Red Chili`, `Green Chili`, `Kashmiri Chili Powder`,
`Kasuri Methi`, `Asafoetida (Hing)`, `Amchur`, `Anardana`, `Chaat Masala`, `Ajwain`, `Cloves`,
`Black Cardamom`, `Saffron`, `Mint`, `Curry Leaves`, `Fenugreek Seeds`, `Fennel Seeds`, optionally `Mace`.

Highest-leverage four, by recipe count: **Kashmiri Chili Powder** (5 recipes), **Kasuri Methi** (6),
**Green Chili** (9), **Cumin Seeds** (5).

### Consolidated list of ingredients this slice would stop using

Per-recipe removals (none of these disappears from the app — each is still used by another recipe in the
slice, though I have not checked the other ~126 recipes for orphaning, so run the usual data-hygiene sweep):

| Ingredient | Removed from |
|---|---|
| `Cauliflower` | Chicken Tikka Masala, Chana Masala, Saag Chicken (**still used by Aloo Gobi**) |
| `Paneer` | Chana Masala, Saag Chicken (**still used by Palak Paneer, Paneer Tikka Wrap**) |
| `Eggplant` | Chana Masala |
| `Red Lentils` | Chana Masala (**still used by Dal Tadka**) |
| `Coconut Milk` | Chicken Korma, under the Mughlai route (**still used by the Kerala curry**) |
| `Tomato Sauce` | Chana Masala, Aloo Gobi, Dal Tadka (**still used by Butter Chicken, Chicken Tikka Masala**) |
| `Brown Rice` | Palak Paneer, Chana Masala, Aloo Gobi, Mango/Kerala Curry, Dal Tadka — all → `Basmati Rice` |
| `Whole Wheat Tortilla` | Egg & Potato Paratha, under the real-paratha route (**still used by Paneer Tikka Wrap**) |
| `Ground Lamb` | Lamb Biryani, under the keep-the-name route only |

Spice-override removals: `Paprika` from Tandoori Chicken; `Turmeric` from Butter Chicken, Lamb Biryani,
Chicken Korma and Egg & Potato Paratha; `Garam Masala` from the Kerala curry version of Mango Chicken
Curry; `Chili Powder` → `Kashmiri Chili Powder` in Chicken Tikka Masala, Butter Chicken and
Paneer Tikka Wrap.

### Macro warning
Three fixes cut protein noticeably and the planner will feel it: **Chana Masala** (−9 g, losing the
paneer), **Saag Chicken** (−9 g, losing the paneer and cauliflower) and **Lamb Biryani** (fat drops sharply
if the ground lamb is swapped for a lean cut). Butter Chicken, Palak Paneer and Chicken Korma all gain
50–110 calories, mostly fat, from adding the cream and cooking fat the dishes actually require. Worth
running `node tests/run.js validator` and `simulator` after applying, since three of the app's
high-protein recipes change character.
