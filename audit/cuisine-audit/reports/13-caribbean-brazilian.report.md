# Authenticity audit — Caribbean + Brazilian (7 recipes)

Mode: **traditional** — the specifics ARE the dish.

Cross-cutting note before the per-recipe blocks:

**1. `cuisine:"Caribbean"` is a catch-all that hides four different traditions.** Pollo Guisado (Dominican),
Arroz con Pollo (Puerto Rican), Ropa Vieja (Cuban) and Jerk Chicken (Jamaican) are filed under one label.
The first three are Spanish-Caribbean and share a *sofrito* base; the fourth is Anglo-Jamaican and shares
nothing with them. Whether to split the label is the owner's call (it affects the cuisine ≤2/wk rule), but
the audit below treats each dish by its actual island tradition.

**2. `Sofrito` is the single biggest gap in this slice.** Three of the four Spanish-Caribbean dishes are
*defined* by it and none of them have it. In this app it does not need a registry entry: sofrito is
onion + bell pepper + garlic + cilantro (all already in the registry) with culantro/ají dulce as
zero-macro additions that can live in `RECIPE_SPICE_OVERRIDES` (the `Aji Limo` precedent from the Peruvian
rebuild). Same for `Sazón` / annatto-achiote colour.

**3. Olives and capers.** Traditional Dominican pollo guisado, Puerto Rican arroz con pollo and Cuban ropa
vieja all carry green olives and capers. Per the standing rule these stay out and are **not** proposed
anywhere below. Noted once here so it is not mistaken for an oversight, and never again.

---

### Pollo Guisado
- **Verdict:** `significantly-off`
- **Cuisine label:** `Caribbean` is defensible but imprecise — this is specifically **Dominican**
  (also made in Puerto Rico). If the label stays `Caribbean`, at minimum the dish should cook like the
  Dominican one.
- **Findings:**
  1. **No sofrito.** Dominican pollo guisado is chicken marinated in *sazón/sofrito* — garlic, onion,
     cubanelle or bell pepper, cilantro and culantro, plus oregano and sour-orange or lime juice — then
     braised. The current recipe has the raw vegetables but never builds them into the marinade, and has
     no cilantro at all. This is the same class of error as the Peruvian "turmeric for ají amarillo":
     the aromatic base *is* the dish.
  2. **No `azúcar quemada` (burnt sugar).** The mahogany colour and faint bittersweet edge of Dominican
     pollo guisado come from caramelising sugar in the oil before the chicken goes in. It is the single
     most identifiable step of the Dominican version and it is absent.
  3. **Coconut milk is not in this dish.** 40 g of coconut milk pushes it toward a Samaná/Trinidadian
     coconut-stew idiom. Standard pollo guisado is tomato-based, not coconut-based.
  4. **Green beans are not a pollo guisado vegetable.** The stew's vegetables are potato and carrot.
     (Vainitas in a stew reads Peruvian/Andean, not Dominican.)
  5. **Chicken breast is the wrong cut.** Guiso means a long braise; the dish is made with bone-in thighs
     or a cut-up whole chicken. Breast at 170 g braised 25 minutes goes dry and shreds badly.
  6. **Step/ingredient mismatch:** step 1 dices onion, bell pepper and potato but garlic is never prepped;
     lime appears only as a finishing squeeze when it belongs in the marinade.
- **Proposed fix:**
  - **Ingredients:** swap `Chicken Breast 170` → `Chicken Thigh 170`. Remove `Coconut Milk 40`. Remove
    `Green Beans 60`. Add `Carrot 50`. Add `Cilantro 5`. Keep tomato sauce, onion, bell pepper, potato,
    garlic, olive oil, lime. Optionally raise `Onion` 60→70 and `Bell Pepper` 60→70 so the sofrito reads
    as a base rather than a garnish.
  - **Spices:** keep Cumin/Oregano/Salt/Black Pepper; add `Adobo 3` and `Culantro 1` (zero-macro override,
    Aji Limo precedent). Sugar for the burnt-sugar step is ~3 g — either add a zero-listed spice-row entry
    or fold it into the step text as "1 tsp sugar"; it is too small to matter macro-wise.
  - **Steps:** rewrite as (a) blend/chop onion, bell pepper, garlic and cilantro into a sofrito and
    marinate the thighs in it with lime juice, oregano, cumin and adobo for 30 min; (b) caramelise sugar
    in the oil until copper-coloured, then brown the chicken in it; (c) add tomato sauce and water, then
    potato and carrot; (d) simmer covered 25–30 min; (e) finish with the reserved cilantro. Delete the
    coconut-milk and green-bean mentions.
- **New ingredients required:** `none` — Carrot and Cilantro are already in the registry. `Culantro` is a
  new zero-macro **spice-override** name (not a registry entry); flag it as new to
  `RECIPE_SPICE_OVERRIDES`. It needs a grocery category.
- **Ingredients no longer used:** `Coconut Milk`, `Green Beans`, `Chicken Breast` (within this recipe only
  — all three are used by other recipes, so nothing is orphaned).
- **Macro impact:** roughly neutral to slightly lower. Losing 40 g coconut milk removes ~9 g fat/~80 cal;
  breast→thigh adds back fat and cuts protein a few grams. Net: similar calories, ~3–5 g less protein.
- **Confidence:** high
- **Sources:** dominicancooking.com/pollo-guisado (Aunt Clara's Kitchen — Dominican author);
  mydominicankitchen.com; sandravalvassori.com Dominican pollo guisado; chefyoyo.com Dominican sofrito.

---

### Arroz con Pollo
- **Verdict:** `significantly-off`
- **Cuisine label:** `Caribbean` — imprecise; this is specifically **Puerto Rican** (the Cuban version is
  close but uses beer/wine and no gandules).
- **Findings:**
  1. **No sofrito and no sazón.** Puerto Rican arroz con pollo is built on sofrito (culantro, cilantro,
     onion, garlic, ají dulce, cubanelle) plus sazón *con culantro y achiote* — coriander, cumin, garlic
     and **annatto**, which is what makes the rice orange-gold. Without achiote this cooks up a pale
     tomato rice. The colour is diagnostic.
  2. **Coconut milk does not belong.** It is not in any Puerto Rican or Cuban arroz con pollo. It is
     dragging the dish toward an arroz con coco idiom.
  3. **Green beans do not belong.** The legume in the dish is **gandules** (pigeon peas) — or, in the
     plainer version, sweet peas, which the recipe already has. Green beans are a filler.
  4. **Rice type:** Puerto Rican arroz con pollo uses medium- or short-grain rice, which is what gives the
     dish its body and the `pegao` crust at the bottom of the caldero. `White Rice` is as close as the
     registry gets, so this is a note, not a fix.
  5. Minor: the liquid should be chicken stock (or beer, in the classic PR version), not plain water; and
     tomato *paste* rather than tomato sauce, but the registry has no paste, so `Tomato Sauce` stands.
- **Proposed fix:**
  - **Ingredients:** remove `Coconut Milk 40`; remove `Green Beans 50`; raise `Green Peas` 40→70 (stands in
    for gandules and replaces the lost volume). Keep everything else. Cilantro already present — good.
  - **Spices:** add `Sazón 3` **or**, preferably, spell out its parts as `Annatto 1` + `Coriander Powder 1`
    (Coriander Powder already exists as an override name; Cumin already present). Add `Culantro 1`.
  - **Steps:** step 1 becomes "blend onion, bell pepper, garlic and cilantro into a sofrito; marinate the
    chicken in half of it with cumin, oregano, salt and pepper"; step 3 sautés the sofrito rather than raw
    diced vegetables and blooms the annatto in the oil; step 4 drops coconut milk and green beans and says
    "add rice, tomato sauce and 1.5 cups chicken stock, stirring so each grain is coated"; step 6 stirs in
    the peas and remaining cilantro. Add a line about not stirring while the rice steams, so the pegao
    forms.
- **New ingredients required:** `Annatto` (a.k.a. Achiote/Sazón) — **NOT in the registry and not in the
  existing override list**. It is a zero-macro colouring spice, so it belongs in `RECIPE_SPICE_OVERRIDES`
  rather than `INGREDIENT_REGISTRY`, and needs a grocery category. `Culantro` likewise (new override).
- **Ingredients no longer used:** `Coconut Milk`, `Green Beans` (recipe-local only).
- **Macro impact:** small drop. −40 g coconut milk ≈ −80 cal / −9 g fat; +30 g green peas ≈ +25 cal / +2 g
  protein. Net roughly −55 cal, protein essentially unchanged.
- **Confidence:** high
- **Sources:** senseandedibility.com "Authentic Puerto Rican Arroz con Pollo"; latinamommeals.com;
  chilipeppermadness.com PR arroz con pollo; Wikipedia "Arroz con gandules" (for the gandules/sofrito base).

---

### Ropa Vieja
- **Verdict:** `significantly-off`
- **Cuisine label:** `Caribbean` — imprecise; this is the **Cuban** national dish. (A Canarian ancestor
  exists, but the dish as named here is Cuban.)
- **Findings:**
  1. **Eggplant is a phantom vegetable.** Ropa vieja has no eggplant, in any regional version. It is the
     clearest single error in this slice — the equivalent of tomato in salsa criolla. The vegetables are
     onion and bell peppers (ideally more than one colour), full stop.
  2. **Soy sauce does not belong in a Cuban braise.** The savoury depth comes from the sofrito, adobo,
     bay and a splash of dry white wine or dry cooking wine (*vino seco*), which is the actual missing
     liquid. Soy sauce is an East-Asian import in a dish that never had it.
  3. **Wrong cut.** Ropa vieja means "old clothes" — the shreds *are* the dish, and that texture comes
     from **flank** (falda) or skirt steak, whose long parallel fibres pull into ribbons. Sirloin is a
     short-fibre cut that goes stringy-then-mushy in a 3½-hour braise and will not give the right texture.
     The registry has only `Beef Sirloin`, so this is a real finding with no in-registry fix unless
     `Flank Steak` is added.
  4. **`Lemon 0.5 g` is a non-ingredient.** Half a gram is roughly ten drops. Ropa vieja is not finished
     with lemon in any case; if an acid is wanted it is the wine in the braise. Either drop it or make it
     `Lime 10` as a table squeeze (common at home, not canonical).
  5. **No cilantro**, and the sofrito is again added as raw diced vegetables at the very end (step 6)
     rather than built at the start. Peppers dumped in for the last 10–15 minutes stay crunchy; in ropa
     vieja they melt into the sauce.
  6. Minor: `Garlic 23 g` (≈7 cloves) is high but genuinely characteristic — no finding.
  7. Braising 3½ hours is right for flank; keep the time when the cut is fixed.
- **Proposed fix:**
  - **Ingredients:** remove `Eggplant 60`. Remove `Soy Sauce 8`. Remove `Lemon 0.5`. Add `Lime 10`
    (optional table squeeze). Raise `Bell Pepper` 80→110 to cover the removed eggplant volume. Add
    `Cilantro 4`. Swap `Beef Sirloin 180` → **`Flank Steak 180`** if the owner is willing to add the
    ingredient; otherwise keep sirloin and note the compromise in a comment.
  - **Spices:** keep Oregano/Cumin/Black Pepper/Bay Leaves/Adobo/Water. Add `Smoked Paprika 1` (pimentón
    is common in Cuban sofrito) and `Dry White Wine 60` as an override entry replacing the soy sauce
    (alcohol cooks off; near-zero macro impact, and it is the authentic braising liquid). If wine is
    unwanted, drop it and leave the water — do not reinstate soy sauce.
  - **Steps:** step 2 marinates the beef in mashed garlic, adobo, oregano, cumin and pepper (no soy, no
    lemon); step 4 deglazes with the wine before adding water and bay; **move the sofrito forward** — sauté
    onion and bell pepper with the garlic before the braise, and add the tomato sauce with the braising
    liquid, so step 6 becomes "return the shredded beef to the sauce, simmer 10–15 min to marry, finish
    with cilantro, serve over rice." Delete the eggplant mention.
- **New ingredients required:** `Flank Steak` — **NOT in the registry** (registry has `Beef Sirloin`,
  `Ground Beef ×2` only). Needs USDA raw/100 g macros, `INGREDIENT_CATEGORIES` and the `MEAT_INGREDIENTS`
  Set. `Dry White Wine` is a new zero-macro override name. Both are flagged as new.
- **Ingredients no longer used:** `Eggplant`, `Soy Sauce`, `Lemon` (recipe-local; all three are used
  elsewhere in the book, so nothing is orphaned — worth a data-hygiene sweep after the edit regardless).
- **Macro impact:** minimal. Eggplant and soy sauce are both near-zero-calorie at these grams. Flank vs
  sirloin is within a few grams of fat and protein either way. Call it flat.
- **Confidence:** high
- **Sources:** Saveur "Ropa Vieja (Shredded Beef)"; asassyspoon.com (Cuban-American author);
  foodfidelity.com Cuban ropa vieja; chilipeppermadness.com ropa vieja.

---

### Jerk Chicken Rice Bowl
- **Verdict:** `significantly-off`
- **Cuisine label:** `Caribbean` — imprecise; jerk is specifically **Jamaican**, and shares no technique or
  aromatic base with the three Spanish-Caribbean dishes above.
- **Findings:**
  1. **No Scotch bonnet.** This is the headline finding. Jerk without Scotch bonnet is not jerk — the
     pepper is as definitional here as ají amarillo is to a Peruvian dish. `Cayenne` supplies heat with
     none of the fruity, apricot-ish character that makes the seasoning recognisable. Direct parallel to
     the turmeric-for-ají-amarillo finding.
  2. **No scallion (Green Onion).** Scallion is one of the three pillars of jerk (pimento, thyme,
     scallion) and `Green Onion` is *already in the registry* — a free fix.
  3. **No ginger, no warm spices.** Authentic jerk carries ginger plus a warm-spice back note (cinnamon,
     and traditionally nutmeg/clove). `Ginger` is already in the registry; `Cinnamon` is already an
     override name.
  4. **No marinade, no acid, no sweetness.** Jerk is a wet paste, blended and left on the meat for hours
     (overnight for a serious cook). Here the chicken is merely dusted with dry spices and pan-seared —
     "season the chicken with allspice, thyme, garlic powder and cayenne" is a rub, not jerk. The paste
     also wants soy sauce or browning, vinegar or lime, and a little brown sugar/honey.
  5. **The coconut milk is doing the wrong job.** "Heat coconut milk gently for a drizzle" is invented —
     no Jamaican preparation drizzles coconut milk over jerk. Coconut milk's real place on this plate is
     in **rice and peas**, the standard accompaniment: rice simmered with kidney beans, coconut milk,
     thyme, scallion, garlic, allspice and a whole Scotch bonnet. That reuses the same 15 g of coconut milk
     honestly (though it wants more like 60 g).
  6. **`Garlic Powder`** where fresh garlic belongs — the paste is blended from fresh aromatics. The
     recipe already lists fresh `Garlic 5 g`, so the powder is redundant.
  7. Bell pepper and onion sautéed as a side are a bowl-format liberty rather than an error; harmless.
- **Proposed fix:**
  - **Ingredients:** add `Green Onion 20`, `Ginger 6`, `Kidney Beans 30` (for rice and peas). Raise
    `Coconut Milk` 15→60 and move it into the rice. Raise `Garlic` 5→10. Keep chicken thigh (correct cut),
    rice, lime, bell pepper, onion.
  - **Spices:** **replace `Cayenne 1` with `Scotch Bonnet 2`** (fresh chili, zero macro, lives in
    `RECIPE_SPICE_OVERRIDES` exactly like `Aji Limo`). Remove `Garlic Powder 1` (fresh garlic is in the
    ingredient list). Keep `Allspice 2` — correct and central — and `Thyme 1`. Add `Cinnamon 0.5` and
    `Soy Sauce 8` *or* `Browning 3` for the dark colour, plus `Honey 6` (registry ingredient) for the
    small sweetness. Note: traditional jerk also uses **nutmeg**; nutmeg is a seed, not a tree nut, but
    given the standing no-nuts rule this audit does **not** propose it — flag for the owner if they want
    it. The dish is fine without.
  - **Steps:** step 2 becomes "blend green onion, garlic, ginger, Scotch bonnet, allspice, thyme,
    cinnamon, soy sauce, honey and lime juice into a paste; coat the chicken thighs and marinate at least
    4 hours, ideally overnight." Step 1 becomes "simmer the rice with the kidney beans, coconut milk,
    a sprig of thyme, a smashed garlic clove and a whole Scotch bonnet (left unbroken) until absorbed;
    discard the pepper." Delete the "heat coconut milk for a drizzle" step entirely. Step 3 keeps the
    grill/sear; add "char the outside — jerk should be smoky."
  - Optionally rename to **`Jerk Chicken with Rice and Peas`**, which is what the fixed dish is.
- **New ingredients required:** `Kidney Beans` — **NOT in the registry** (registry has `Black Beans`,
  `White Beans`, `Chickpeas`, `Red Lentils`). Needs USDA raw/100 g macros and a grocery category. Substituting
  black beans would be visibly wrong; Jamaican "peas" here are red kidney beans (or gungo/pigeon peas).
  `Scotch Bonnet` is a new zero-macro override name. `Browning` (if chosen over soy sauce) likewise.
- **Ingredients no longer used:** `none` — nothing is dropped; `Garlic Powder` leaves this recipe's spice
  list but is used elsewhere.
- **Macro impact:** meaningful increase. +45 g coconut milk ≈ +90 cal / +10 g fat, +30 g kidney beans
  (dry) ≈ +100 cal / +7 g protein / +18 g carb, +6 g honey ≈ +18 cal. Roughly +200 cal and +8 g protein.
  This is currently a light bowl (170 g thigh + 50 g rice), so the solver has room, but it will change
  where the recipe lands in the plan.
- **Confidence:** high on the jerk paste and Scotch bonnet; medium on the rice-and-peas restructuring,
  which is a scope decision rather than a correctness one (the bowl could stay plain rice and still be
  authentic once the paste is fixed).
- **Sources:** seasonedskilletblog.com "Authentic Jamaican Jerk Marinade" and jerk chicken (Jamaican
  author); hangrywoman.com "Jamaican Jerk Marinade made just like Jamaicans do"; foodfidelity.com jerk
  marinade; onceuponachef.com Jamaican jerk chicken.

---

### Feijoada
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — Brazilian, and specifically the Rio-style *feijoada carioca*.
- **Findings:**
  1. **Black beans are right.** Credit where due: `Black Beans` is the correct legume (a Bahian or
     Minas cook might use a different bean, but feijoada as a national dish is black-bean). No finding.
  2. **The cuts are wrong, and this is the core of the dish.** Feijoada is defined by a *mix* of salted,
     smoked and fresh pork plus cured beef: carne seca (salt-dried beef), linguiça or paio (smoked
     sausage), pork ribs, pork shoulder, and the traditional trimmings — ear, foot, tail. A single lean
     `Pork Loin` is the one cut nobody uses. There is no smoke, no salt-cure and no fat, and those three
     things *are* what feijoada tastes like.
  3. **Cumin does not belong.** Brazilian feijoada is seasoned with garlic, onion, bay leaf, salt and
     black pepper — that is the whole list. Cumin reads Mexican/Middle Eastern and is a wrong-cuisine
     import. **Bay leaf is missing** and should be there instead.
  4. **All three accompaniments are missing.** A plate of feijoada is never just beans and rice. It comes
     with **farofa** (toasted cassava flour), **couve** (collard greens cut into ribbons and flash-sautéed
     with garlic) and **sliced orange**. These are not garnishes — the orange cuts the fat, the farofa
     absorbs the bean liquor, the couve is the fresh counterpoint. Their absence is the difference between
     feijoada and a generic pork-and-bean stew.
  5. **The citrus is wrong.** `Lime 15` finished over the bowl is not a feijoada gesture; the citrus is
     **orange**, served in slices alongside (and orange peel sometimes goes into the pot).
  6. **The bean-to-meat ratio is inverted.** 46 g dry beans to 150 g pork makes this a pork stew with
     beans in it. *Feijão* is in the name; the beans are the body of the dish and the meat flavours them.
  7. **Technique:** 40 minutes is not a feijoada. The beans soak overnight and the pot goes 2–3 hours;
     salted meats are soaked and blanched first to draw off salt. The step list should say so even if the
     app's `cookTime` field stays short for planning reasons.
- **Proposed fix:**
  - **Ingredients:** replace `Pork Loin 150` with a mix — `Pork Belly 70` + `Linguiça 60` (new) — or, if no
    new ingredient is wanted, `Pork Belly 70` + `Pork Loin 70`, which at least gets fat and two textures in.
    Raise `Black Beans` 46→75. Add `Collard Greens 70` (new), `Cassava Flour 20` (new), `Orange 80` (new).
    Remove `Lime 15`. Add `Butter 6` for the farofa and the couve. Keep rice, onion, garlic, olive oil.
  - **Spices:** remove `Cumin 1`. Add `Bay Leaves 1`. Keep Salt and Black Pepper.
  - **Steps:** rewrite to (a) soak beans overnight, blanch the salted/smoked meats; (b) brown the pork
    belly and sausage, add onion and garlic; (c) add beans, bay leaves and water, simmer 2–3 hours until
    the liquor is dark and thick, mashing a ladle of beans to thicken; (d) separately toast the cassava
    flour in butter with a little onion and garlic to make farofa; (e) separately shred and flash-sauté the
    collard greens in butter/oil with garlic; (f) serve the beans over rice with farofa, couve and orange
    slices on the side. Delete the cumin and lime mentions.
- **New ingredients required:** three-to-four, **all NOT in the registry**:
  `Cassava Flour` (farinha de mandioca — for farofa; also needed by Picanha below, so it earns its place
  twice), `Collard Greens` (couve — `Cabbage` and `Spinach` are both wrong; couve is collard/kale),
  `Orange`, and optionally `Linguiça` (smoked pork sausage; non-USDA jarred/packaged provenance is
  acceptable per the app's conventions, note it on the line). All need `INGREDIENT_CATEGORIES` entries and
  `Linguiça` needs the `MEAT_INGREDIENTS` Set.
- **Ingredients no longer used:** `Lime` (recipe-local; `Lime` is used widely elsewhere). `Pork Loin`
  drops from 8 uses to 7 if fully replaced — not orphaned.
- **Macro impact:** significant increase, and it shifts fatty. Pork belly is far fattier than loin
  (+150–200 cal at these grams), +29 g dry black beans ≈ +100 cal / +7 g protein, cassava flour is nearly
  pure starch (+70 cal), orange +40 cal, butter +45 cal. Expect roughly **+350–450 cal** and a notably
  higher fat share. That is authentic — feijoada is a heavy dish — but the owner should decide whether they
  want it in a 2000-cal plan at full weight or as a reduced portion. Halving the belly is the honest lever.
- **Confidence:** high
- **Sources:** Saveur "Black Beans With Mixed Meats and Accompaniments (Feijoada Completa)";
  oliviascuisine.com feijoada (Brazilian author); brazileats.com feijoada; Britannica "feijoada completa".

---

### Moqueca
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — Brazilian. Worth naming the region: with 80 g of coconut milk this is
  clearly aiming at **moqueca baiana** (Bahia), not moqueca capixaba (Espírito Santo), which uses no
  coconut milk and no palm oil at all. Once you pick baiana, the baiana rules apply.
- **Findings:**
  1. **No dendê (palm oil).** This is the defining fat of moqueca baiana — a deep orange, musky palm oil
     that supplies both the colour and the flavour the dish is known for. `Paprika 2 g` is standing in for
     it, and that is a colour-only substitute with a completely different taste: exactly the
     turmeric-for-ají-amarillo error. Dendê is **not a nut product** (it is pressed from the palm *fruit*),
     so the no-nuts rule does not apply here.
  2. **No cilantro (coentro).** Every moqueca, baiana or capixaba, is finished with a generous handful of
     cilantro. It is not optional. `Cilantro` is already in the registry — free fix.
  3. **No garlic.** Also present in both regional versions, also already in the registry.
  4. **Tomato sauce instead of fresh tomato.** Moqueca is built from *sliced* fresh tomato, onion and bell
     pepper layered in the pot. Cooked tomato sauce gives a homogeneous red braise instead of the layered,
     brothy result. `Tomato` is in the registry.
  5. **The technique is wrong.** Moqueca is not a sauté-then-simmer. Everything is **layered raw** in a
     clay pot (panela de barro), the liquid is added, and it is covered and cooked gently — nothing is
     browned. The current steps 3–4 sauté the aromatics and cook out the tomato first, which is a generic
     stew method.
  6. **The lime is misplaced.** The shrimp should be marinated in lime, garlic and salt for 20–30 minutes
     before it goes in the pot; a squeeze at the end is not the same thing.
  7. Shrimp is a legitimate moqueca (*moqueca de camarão*) — no finding on the protein choice.
- **Proposed fix:**
  - **Ingredients:** swap `Tomato Sauce 50` → `Tomato 120`. Add `Cilantro 8`, `Garlic 8`. Add
    `Palm Oil (Dendê) 10` (new) and reduce `Olive Oil` 8→4, or drop olive oil entirely and use 12 g dendê.
    Keep shrimp, coconut milk, onion, bell pepper, lime, rice. Optionally add `Green Onion 15`.
  - **Spices:** remove `Paprika 2` — its only job was faking the dendê colour, and it stops earning its
    place once real dendê is there. Keep Salt and Black Pepper. Optionally add `Malagueta` or `Cayenne 0.5`
    for a mild heat.
  - **Steps:** (a) marinate the shrimp in lime juice, minced garlic and salt for 20 min; (b) layer sliced
    onion, tomato and bell pepper in the bottom of a heavy pot with half the cilantro; (c) lay the shrimp
    on top; (d) pour over the coconut milk and dendê, cover, and cook gently 8–10 min without stirring —
    do not brown anything; (e) finish with the remaining cilantro and serve over rice, spooning the broth
    over. Remove the "sauté onion and bell pepper" and "cook 2 minutes until softened" language.
  - If the owner prefers to avoid a new oil, the honest alternative is to **relabel it moqueca capixaba**:
    drop the coconut milk, keep olive oil, and use annatto for colour. That is a real dish, not a
    compromise. But do not keep coconut milk *and* skip dendê — that combination is neither version.
- **New ingredients required:** `Palm Oil (Dendê)` — **NOT in the registry**. Nut-free. Needs macros
  (essentially 100% fat, ~884 cal/100 g like other pure oils) and a grocery category. `Annatto` (already
  flagged under Arroz con Pollo) if the capixaba route is taken instead.
- **Ingredients no longer used:** `Tomato Sauce` (recipe-local; 24 uses app-wide, not orphaned).
- **Macro impact:** small and fat-shifted. +10 g dendê ≈ +88 cal / +10 g fat, offset by −4 g olive oil
  (−35 cal); fresh tomato vs tomato sauce is roughly a wash. Net ≈ **+60 cal**, protein unchanged.
- **Confidence:** high
- **Sources:** Instituto Brasil a Gosto, "What is the difference between the moqueca baiana and the
  moqueca capixaba?"; oliviascuisine.com moqueca baiana (Brazilian author); easyanddelish.com moqueca
  baiana (Brazilian author); Wikipedia "Moqueca".

---

### Picanha with Farofa
- **Verdict:** `significantly-off` — and the farofa half is closer to `not-a-real-dish`.
- **Cuisine label:** `correct` — Brazilian churrasco.
- **Findings:**
  1. **There is no farofa in a recipe named "with Farofa".** This is the worst error in the slice. Farofa
     is toasted **cassava flour** (farinha de mandioca) — that ingredient is the entire dish, and it is
     absent from the ingredient list. Step 4, *"Dice onion and saute with garlic in a dry pan for farofa
     flavor base,"* is a phantom step: it produces sautéed onion and garlic and calls it farofa. Onions
     and garlic are the *aromatics* in farofa; without the flour there is nothing to toast. Either the
     ingredient gets added or the name has to change.
  2. **Salt-only seasoning is correct.** Credit: picanha at a churrascaria is seasoned with coarse salt
     and nothing else, and `Salt 3` alone is right. Do not add spices to the steak.
  3. **The fat cap is unmentioned.** Picanha *is* the sirloin cap, and the technique is defined by it: the
     fat cap is scored, the meat is skewered or seared **fat-side down first** so the cap renders and bastes
     the steak. `Beef Sirloin` is the nearest registry match and is an acceptable proxy, but the steps
     should describe the fat-cap method rather than a generic "4–5 minutes per side".
  4. **The fried egg is not part of this plate.** Steak-with-a-fried-egg is *bife a cavalo*, a different
     Brazilian dish. A churrasco picanha plate is steak + rice + feijão + farofa + vinagrete. The egg
     appears to be here for macros; that is a legitimate reason to keep it, but it should be acknowledged
     as a liberty, not presented as traditional.
  5. **Vinagrete is missing.** The tomato/onion/bell-pepper/vinegar relish is the standard acidic partner
     to picanha and does the job the lone lime squeeze is gesturing at. All its components are already in
     the registry, and `Red Wine Vinegar` already exists as a spice-override name.
  6. **The lime is a stand-in for the missing vinagrete** — not a churrasco element on its own.
  7. Rice and plain black beans alongside are correct — no finding.
- **Proposed fix:**
  - **Ingredients:** add `Cassava Flour 25` and `Butter 8` (farofa is toasted in butter or bacon fat).
    Add `Tomato 60` and `Red Onion 25` for vinagrete (`Bell Pepper 30` optional). Keep `Garlic 8` — it now
    has a real job in the farofa. Remove `Lime 15` (replaced by the vinegar in the vinagrete) or keep it as
    a table wedge. Keep or drop `Egg 50` per the owner's macro preference — flag it as non-traditional
    either way.
  - **Spices:** keep `Salt 3` on the steak. Add `Red Wine Vinegar 10` (existing override name) and
    `Black Pepper 0.5` for the vinagrete.
  - **Steps:** rewrite step 4 to the real farofa — "melt butter in a skillet, soften the diced onion and
    garlic, then stir in the cassava flour over low heat and toast, stirring constantly, until golden and
    sandy; season with salt." Rewrite step 3 for the cut — "score the fat cap in a crosshatch, salt
    generously, and sear fat-side down until the cap renders and browns, then 3–4 minutes on the meat side
    for medium-rare." Add a vinagrete step — "dice tomato, red onion and bell pepper, dress with red wine
    vinegar, salt and pepper, rest 10 minutes." Final step serves steak, rice, beans, farofa and vinagrete.
  - **If no new ingredient is acceptable**, the only honest alternative is to **rename the recipe** —
    `Picanha with Rice and Beans`, or `Bife a Cavalo` if the egg stays. Do not keep "with Farofa" in the
    name with no farofa in the dish.
- **New ingredients required:** `Cassava Flour` — **NOT in the registry**. Same entry as the one Feijoada
  needs, so one addition serves two recipes (which also helps toward the ≥5-recipes-per-ingredient
  convention, though two is still short of it).
- **Ingredients no longer used:** `Lime` (recipe-local, optional), `Egg` (recipe-local, optional).
- **Macro impact:** moderate increase, carb- and fat-leaning. +25 g cassava flour ≈ +90 cal / ~22 g carb,
  +8 g butter ≈ +57 cal, vinagrete vegetables ≈ +20 cal. Net ≈ **+165 cal**, protein essentially unchanged
  (or −6 g if the egg is dropped).
- **Confidence:** high

- **Sources:** today.com "Grilled Steak with Farofa (Picanha con Farofa)"; braziliankitchenabroad.com
  farofa; iheartbrazil.com Brazilian farofa; thetakeout.com guide to Brazilian steakhouse sides.

---

## Summary

### Counts by verdict
| Verdict | Count | Recipes |
|---|---|---|
| `authentic` | 0 | — |
| `minor-drift` | 0 | — |
| `significantly-off` | **7** | Pollo Guisado, Arroz con Pollo, Ropa Vieja, Jerk Chicken Rice Bowl, Feijoada, Moqueca, Picanha with Farofa |
| `mislabeled` | 0 (see note) | — |
| `not-a-real-dish` | 0 | (the farofa component of Picanha comes closest) |

Note on labels: no recipe is *mislabeled* outright — every dish is genuinely from the region its `cuisine`
field claims. But `Caribbean` is a four-tradition catch-all covering Dominican, Puerto Rican, Cuban and
Jamaican dishes that share almost nothing; consider splitting it, bearing in mind the cuisine ≤2/wk
generation rule would then behave differently.

Also note: **nothing here is a fake dish.** All seven are real, correctly named preparations. The failure
mode across the slice is consistent and narrow — **the defining aromatic base or the defining accompaniment
is missing, and something generic has been put in its place.** Three of four Spanish-Caribbean dishes have
no sofrito; jerk has no Scotch bonnet; moqueca has no dendê; feijoada has none of its three accompaniments;
"Picanha with Farofa" has no farofa. Coconut milk has also been sprinkled across three dishes that do not
use it, which suggests it was reached for as a generic "tropical" signal.

### The 3 worst offenders
1. **Picanha with Farofa** — the name promises farofa, cassava flour is nowhere in the ingredients, and a
   step openly sautés onion and garlic "for farofa flavor base." A named component that does not exist.
2. **Jerk Chicken Rice Bowl** — no Scotch bonnet (cayenne instead), no scallion, no ginger, and no
   marinade at all; it is a dry rub calling itself jerk. Same class of error as turmeric-for-ají-amarillo.
3. **Ropa Vieja** — eggplant, which appears in no version of the dish, plus soy sauce in a Cuban braise,
   the wrong beef cut for a dish whose entire identity is the shredded texture, and a 0.5 g lemon.

Runner-up: **Feijoada**, whose lean pork loin, cumin, and total absence of farofa, couve and orange make
it a generic pork-and-bean stew wearing the name of Brazil's national dish.

### Consolidated NEW INGREDIENTS required (all flagged NOT in `registry.md`)
**`INGREDIENT_REGISTRY` additions** (need USDA raw/100 g macros, `INGREDIENT_CATEGORIES`, and the
`MEAT_INGREDIENTS` Set where flesh):
| Ingredient | Needed by | Notes |
|---|---|---|
| `Cassava Flour` | Feijoada, Picanha with Farofa | farinha de mandioca; serves 2 recipes |
| `Collard Greens` | Feijoada | couve — `Cabbage`/`Spinach` are not substitutes |
| `Orange` | Feijoada | sliced, served alongside |
| `Palm Oil (Dendê)` | Moqueca | **nut-free** (palm fruit, not a nut); ~100% fat |
| `Kidney Beans` | Jerk Chicken Rice Bowl | for rice and peas; only if that restructuring is taken |
| `Flank Steak` | Ropa Vieja | MEAT_INGREDIENTS; optional — sirloin works if a note is added |
| `Linguiça` | Feijoada | MEAT_INGREDIENTS; optional — Pork Belly alone is a workable fallback |

**`RECIPE_SPICE_OVERRIDES` additions** (zero-macro, no registry entry needed — the `Aji Limo` precedent;
each still needs a grocery category):
| Name | Needed by |
|---|---|
| `Scotch Bonnet` | Jerk Chicken Rice Bowl |
| `Annatto` (achiote/sazón) | Arroz con Pollo; Moqueca if taken capixaba |
| `Culantro` | Pollo Guisado, Arroz con Pollo |
| `Dry White Wine` | Ropa Vieja (replaces the soy sauce) |
| `Browning` | Jerk Chicken Rice Bowl (optional; soy sauce is the alternative) |

Already-in-registry ingredients the fixes pull in, no addition needed: `Cilantro`, `Green Onion`, `Ginger`,
`Carrot`, `Tomato`, `Red Onion`, `Butter`, `Honey`, `Pork Belly`. Existing override names reused:
`Bay Leaves`, `Cinnamon`, `Coriander Powder`, `Smoked Paprika`, `Red Wine Vinegar`, `Adobo`.

### Consolidated ingredients this slice would STOP using
Verified against `data.js` — **none of these becomes an orphan**, but three drop below the app's
"aim ≥5 recipes per ingredient" convention and are worth watching:

| Ingredient | Dropped from | Uses now | Uses after | Below 5? |
|---|---|---|---|---|
| `Coconut Milk` | Pollo Guisado, Arroz con Pollo | 6 | 4 | **yes** |
| `Green Beans` | Pollo Guisado, Arroz con Pollo | 5 | 3 | **yes** |
| `Eggplant` | Ropa Vieja | 5 | 4 | **yes** |
| `Soy Sauce` | Ropa Vieja | 30 | 29 | no |
| `Lemon` | Ropa Vieja | 21 | 20 | no |
| `Tomato Sauce` | Moqueca | 24 | 23 | no |
| `Lime` | Feijoada; Picanha (optional) | many | many | no |
| `Chicken Breast` | Pollo Guisado (→ Chicken Thigh) | 30 | 29 | no |
| `Pork Loin` | Feijoada (→ Pork Belly / Linguiça) | 8 | 7 | no |
| `Egg` | Picanha (optional) | 27 | 26 | no |

Spice-override entries removed: `Cumin` (Feijoada — wrong cuisine), `Paprika` (Moqueca — was faking
dendê), `Cayenne` and `Garlic Powder` (Jerk — replaced by Scotch bonnet and fresh garlic).

### One thing deliberately NOT proposed
Traditional Dominican pollo guisado, Puerto Rican arroz con pollo and Cuban ropa vieja all carry **green
olives and capers**; traditional jerk seasoning carries **nutmeg**. Per the standing preferences-outrank-
authenticity rule, olives are not proposed anywhere in this report, and nutmeg is only flagged for the
owner's judgement (it is botanically a seed, not a tree nut) rather than recommended. None of the seven
dishes needs any of them to be recognisably itself once the fixes above land.
