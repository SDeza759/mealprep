# Authenticity audit — Spanish + French (5 recipes)

Mode: **traditional** (the specifics ARE the dish).

Constraint note carried throughout: Spanish cooking leans hard on **almonds** (picada, romesco, salsa
española) and both cuisines use **olives** freely (tapas, olivada, canard aux olives). Per the hard
constraints, nothing below proposes either. `Olive Oil` is untouched and correct everywhere it appears.

---

### Paella Mixta
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — Spanish. "Mixta" (meat + seafood) is a real, if Valencian-purist-mocked,
  category and is exactly what the ingredient list describes, so the *name* is honest about what this is.
  Nothing here belongs to another national cuisine.
- **Findings:**
  1. **No saffron.** This is the defining seasoning of paella — its colour, aroma and the reason the dish
     looks like paella. It is simply absent from both the ingredient list and the spice overrides. Under
     the traditional bar this is a missing defining component, not a nicety. Every source consulted treats
     saffron threads bloomed in warm stock as non-optional.
  2. **The liquid quantity is flatly wrong and would ruin the dish.** Step 4 calls for **2 cups (~475 ml)
     of water for 60 g of rice** — roughly 8:1. Paella rice takes about 2.5–3× its volume in liquid
     (bomba "drinks up three times its volume"). 60 g of rice needs ~150–180 ml. As written this is soup
     that never absorbs, and the "simmer 18–20 minutes until rice absorbs liquid" instruction can't
     complete.
  3. **No socarrat step.** The caramelised crust on the pan base, made by raising the heat hard for the
     last 2–3 minutes until you hear it crackle, is a defining finish, not a chef's flourish. Step 6 goes
     straight from simmer to rest.
  4. **Onion in the sofrito.** Valencian practice deliberately excludes onion from paella — it releases
     water and softens the grain; the sofrito is tomato + garlic + pimentón in oil. (See confirmation
     note below; this is the one finding of the four where regional latitude exists.)
  5. **Chicken breast.** Paella uses bone-in dark chicken (thigh/drumstick), which survives 20 minutes of
     simmering; breast turns to string. `Chicken Thigh` is already in the registry.
  6. **`Tomato Sauce` stands in for grated fresh tomato.** The sofrito is made from a ripe tomato grated
     on a box grater, not from a jarred sauce. Defensible pantry shortcut, but it is a technique
     substitution and worth naming.
  7. **Rice is a garnish here.** 60 g rice against 220 g of protein inverts a rice dish. Flagged as an
     observation, not a fix — this is the macro solver's doing and correcting it fights the app's purpose.
- **What it already gets right** (worth not breaking): the no-stir rule is correctly encoded — "Stir once"
  when the rice goes in to distribute it, then "Do not stir again". Green beans are genuinely Valencian
  (*bajoqueta*/*ferradura*). Plain `Paprika` is right — Valencian paella uses sweet pimentón, **not** the
  smoked pimentón de la Vera, so do not "upgrade" it to `Smoked Paprika`. Bell pepper and peas are not in
  canonical Valenciana but are standard in *mixta*/seafood paellas — leave them.
- **Proposed fix:**
  - *Spices:* add `{ name: "Saffron", grams: 0.1 }`. Zero-macro seasoning, so per project convention it
    can live in `RECIPE_SPICE_OVERRIDES` without a registry entry — it only needs a grocery category.
  - *Ingredients:* remove `Onion` 50 g. Swap `Chicken Breast` 100 g → `Chicken Thigh` 100 g. Optionally
    swap `Tomato Sauce` 40 g → `Tomato` 60 g (grated).
  - *Steps:* rewrite 1, 3, 4 and 6.
    - 1: drop the onion dice; "Dice bell pepper. Mince garlic. Trim green beans and halve."
    - 3: "Add bell pepper and garlic and cook 2 minutes, then the tomato and paprika, and fry down to a
      dark sofrito, about 5 minutes." (Onion removed; sofrito named.)
    - 4: "Crumble the saffron into 180 ml of warm water or broth and let it steep. Add the rice, spread it
      evenly across the pan, pour in the saffron liquid, and stir once."
    - 6: "Simmer 18–20 minutes until the rice has absorbed the liquid, adding the shrimp for the last 5
      minutes. Raise the heat to high for the final 2 minutes until you hear the base crackle — this is
      the socarrat. Rest 5 minutes before serving."
  - *Rice variety:* the registry has only generic `White Rice`, and a bomba entry would carry identical
    macros, so this is a wording fix rather than an ingredient one — say "short-grain rice (bomba or
    Calasparra)" in step 4 rather than adding a registry row.
- **New ingredients required:** `Saffron` — **not** in registry.md or the existing spice list. Add to
  `RECIPE_SPICE_OVERRIDES` + a grocery category only; no `INGREDIENT_REGISTRY` row needed (zero macros).
- **Ingredients no longer used:** `Onion` (this recipe only), `Chicken Breast` (this recipe only, → thigh),
  optionally `Tomato Sauce` (this recipe only). All three are used by many other recipes — nothing is
  orphaned.
- **Macro impact:** Small and mostly upward in fat. Breast → thigh adds roughly 40–60 cal and a few grams
  of fat per 100 g while shedding ~2 g protein. Dropping 50 g onion removes ~20 cal / ~5 g carbs. Saffron
  is zero. Tomato-for-tomato-sauce is a wash. Net: modestly fattier, marginally fewer carbs.
- **Confidence:** high on saffron, the liquid ratio and socarrat; medium on the onion exclusion (it is
  Valencian orthodoxy, and paella *mixta* is by definition already outside the DO canon, so a cook could
  reasonably keep it).
- **Sources:** spanishsabores.com/traditional-spanish-paella-recipe (Spain-based food writer),
  honestcooking.com/paella-valenciana, lucandjune.com/spanish-paella, thehungrygoddess.com paella
  valenciana / bomba rice.

---

### Gambas al Ajillo
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — Spanish. A Madrid tapas-bar standard; nothing pan-Mediterranean or
  otherwise misfiled about it.
- **Findings:**
  1. **The spinach bed is invented.** Gambas al ajillo is served in a small earthenware *cazuela*, still
     sizzling, in its own garlic oil. It is not plated over greens. This is a meal-prep vegetable
     addition wearing the dish's name.
  2. **Not enough olive oil.** 15 g (~1 tbsp) for 200 g of shrimp misses the point of the dish: the oil
     *is* the sauce — infused with garlic and chili, and the reason bread is on the table. Traditional
     ratios are closer to 30–45 g. This one collides head-on with the macro targets (oil is 9 cal/g), so
     it is flagged as a real finding with an honest caveat rather than a confident fix.
  3. **Shrimp are overcooked as written.** "2–3 minutes per side" is 4–6 minutes for peeled shrimp;
     sources give 1–2 minutes per side. Small numbers, but this is a 10-minute dish where timing is the
     whole technique.
  4. **Garlic goes in too hot, too briefly.** The garlic should be sliced thin and coaxed to pale gold in
     oil over **low** heat for 3–4 minutes so it perfumes the oil. "Medium heat, 1 minute" risks the one
     failure mode everyone warns about — burnt garlic turning the oil bitter.
  5. **No parsley.** Chopped flat-leaf parsley off the heat is the canonical finish (Saveur files the
     dish as "Sizzling Shrimp with Garlic and **Parsley**"). `Dried Parsley` already exists in the
     project's spice vocabulary.
  6. **Lemon is contested, not wrong.** Sources explicitly note some Spanish restaurants add lemon and
     others adamantly refuse. Under the strict bar I'd drop it in favour of parsley and a splash of dry
     sherry, but this is the weakest of the findings and I'm not calling it an error.
  7. **Whole wheat bread** is a diet substitution — the bread for mopping is white crusty *pan rústico*.
     The registry has no white-bread row, so this is a note, not a fix.
- **What it already gets right:** thinly *sliced* (not minced) garlic is correct and specific. `Chili
  Flakes` is a legitimate registry-compatible stand-in for the dried *guindilla*. Bread on the side is
  right in spirit.
- **Proposed fix:**
  - *Ingredients:* remove `Spinach` 80 g (or, if the vegetable must stay for macro reasons, serve it as an
    explicitly separate side in the step text rather than as a bed). Raise `Olive Oil` 15 g → 30 g if the
    macro budget tolerates it. Optionally remove `Lemon` 15 g.
  - *Spices:* add `{ name: "Dried Parsley", grams: 1 }`. Optionally add `{ name: "Dry Sherry", grams: 15 }`
    as a zero-macro seasoning. Drop `Black Pepper` — it does nothing here and the heat comes from the
    chili — though leaving it is harmless.
  - *Steps:* rewrite 2, 3, 4 and 6.
    - 2: "Heat the olive oil in a small skillet or earthenware cazuela over **low** heat. Add the sliced
      garlic and cook gently for 3–4 minutes until pale gold and fragrant — do not let it brown."
    - 3: "Raise the heat, add the shrimp and the chili flakes, and cook 1–2 minutes per side until pink
      and just curled."
    - 4: "Off the heat, stir in the dried parsley (and a splash of dry sherry, if using), swirling to
      emulsify the oil."
    - 6: "Serve immediately in the pan, still sizzling, with the toasted bread for mopping up the garlic
      oil." (Spinach, if kept, is named as a side here rather than as a bed.)
- **New ingredients required:** `Dry Sherry` — **not** in registry.md, optional, and only needed as a
  zero-macro `RECIPE_SPICE_OVERRIDES` entry. `Dried Parsley` is already in the spice list. No
  `INGREDIENT_REGISTRY` additions.
- **Ingredients no longer used:** `Spinach` (this recipe only), optionally `Lemon` (this recipe only).
  Both are heavily used elsewhere; nothing is orphaned.
- **Macro impact:** Dropping 80 g spinach costs ~18 cal and ~2 g protein — negligible. Doubling the olive
  oil to 30 g adds ~135 cal, all fat, which is the material change and the reason to decide it
  deliberately rather than by default.
- **Confidence:** high on the spinach bed and the shrimp/garlic timings; medium on the oil quantity
  (correct traditionally, but genuinely in tension with this app's purpose) and low-to-medium on lemon,
  which the sources themselves describe as a live disagreement among Spanish cooks.
- **Sources:** thespanishchef.com/recipes/gambas-al-ajillo (Omar Allibhoy, Spanish chef),
  spanishsabores.com/gambas-al-ajillo-recipe-spanish-garlic-shrimp, saveur.com "Sizzling Shrimp with
  Garlic and Parsley", thekitchn.com gambas-al-ajillo.

---

### Tortilla Espanola
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — Spanish. The dish, the technique and the plate-flip are all unambiguously
  Spanish; nothing here reads as an Italian frittata by another name once the spinach is out.
- **Findings:**
  1. **Spinach does not belong in a tortilla española.** The canonical dish is potato + egg + olive oil +
     salt, with onion as the one permitted variable. Adding a third vegetable makes it a different dish —
     Spain has *tortilla de espinacas*, and it is not this. Under the traditional bar this is an added
     component that changes what the name means.
  2. **The potato-to-egg ratio is roughly inverted.** The reference proportion is about 100 g of potato
     per egg (six large eggs to 600 g potato for a proper thick tortilla). This recipe has 150 g egg
     (≈3 large eggs) to 150 g potato — about **half** the potato it needs. A tortilla is potatoes barely
     bound by egg; as written this is an omelette with some potato in it. This, more than the spinach, is
     the finding that changes the dish's identity.
  3. **15 g of olive oil cannot confit anything.** The potatoes and onion are supposed to be *poached*
     in a deep pool of olive oil — traditionally about a cup — over low heat until silky, never browned,
     then drained (the oil is reused, not eaten). The recipe's single tablespoon forces a shallow fry,
     which is a different texture entirely. The registry has no way to model "used then drained", so the
     honest fix is to bump the recorded grams to roughly what the potatoes actually absorb and put the
     deep-pool technique in the step text.
  4. **The *reposo* is missing.** After the hot potato and onion go into the beaten egg, the mixture rests
     5–15 minutes so the potato drinks up egg and the starch loosens. Every serious source includes it;
     step 3 goes straight from mixing to the pan.
  5. **"Gently fry ... until soft" undersells it.** The instruction should say explicitly not to brown or
     crisp — browning is the classic failure. Also, "slice onion into thin rings" is a stylistic oddity;
     Spanish practice is a fine julienne or dice that melts into the potato.
  6. Minor: purists season a tortilla with salt only. `Black Pepper` is harmless — not worth changing.
- **What it already gets right** (do not "fix" these): **onion is legitimate.** The *cebollista* vs
  *sincebollista* argument is a genuine, unresolved and much-enjoyed national dispute, and the with-onion
  camp is fully traditional — this is exactly the "legitimate regional variation" case, not a finding.
  Flipping with a plate is the correct *vuelta*. Serving warm or at room temperature is correct.
- **Proposed fix:**
  - *Ingredients:* remove `Spinach` 60 g. Raise `Potato` 150 g → 300 g. Raise `Olive Oil` 15 g → 25 g.
  - *Spices:* no change.
  - *Steps:* rewrite 1, 2 and 3.
    - 1: "Peel the potato and slice it thinly, about 2–3 mm. Slice the onion finely."
    - 2: "Heat the olive oil in a non-stick skillet over low heat and add the potato and onion. Cook
      gently for 15–20 minutes, turning occasionally, until completely tender — they should poach in the
      oil, not brown or crisp. Drain, reserving the oil."
    - 3: "Beat the eggs with salt and pepper in a large bowl. Fold in the hot potato and onion and let the
      mixture rest for 10 minutes so the potato absorbs the egg." (Spinach reference removed.)
    - 4: keep, but "Return a little of the reserved oil to the skillet and pour in the mixture over
      medium-low heat."
- **New ingredients required:** `none`.
- **Ingredients no longer used:** `Spinach` (this recipe only — `Spinach` is referenced by 20 recipes in
  `data.js`, so nothing is orphaned).
- **Macro impact:** Meaningful and in a useful direction. Doubling potato adds roughly +115 cal and +26 g
  carbs; +10 g olive oil adds ~90 cal of fat; dropping 60 g spinach removes ~14 cal. Net roughly +190 cal,
  carb-heavy, protein essentially unchanged. It becomes a materially larger plate, so the solver's serving
  scale will do more work here — worth watching the validator after the change.
- **Confidence:** high. The confit-then-rest method and the ~100 g potato per egg proportion are
  consistent across Spain-based sources; the onion question is explicitly a matter of taste, not
  correctness.
- **Sources:** spainonafork.com "The Authentic Tortilla Espanola", spanishsabores.com best-spanish-omelet-
  recipe, saveur.com spanish-egg-tortilla-potatoes-onions-recipe, olympiankitchen.substack.com
  "tortilla de patata".

---

### Duck Confit with Lentils
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` — French, specifically the Southwest (Gascony/Périgord/Quercy), where
  *confit de canard aux lentilles* is an emblematic dish. The label is right; the execution is not.
- **Findings:**
  1. **This is not confit.** Confit is a two-stage preservation technique: the leg is **salt-cured** with
     garlic, thyme and bay for 12–24 hours in the fridge, then wiped clean of the salt and dried, and only
     then poached. Step 1 seasons the leg and step 2 cooks it immediately. What the recipe describes is
     slow-cooked seasoned duck leg. The dish name promises a technique the steps do not perform — which is
     the single most serious finding in this slice.
  2. **"in its own rendered fat" is not physically possible.** Confit means *submerged* in fat. A 130 g
     duck leg renders perhaps 20–30 g of its own fat — it would sit in a puddle, not a bath. Traditionally
     the leg is poached in melted duck fat deep enough to cover, then stored under that fat. The
     ingredient list contains no fat at all.
  3. **Red lentils are the wrong lentil, and the error is structural.** The dish requires **lentilles
     vertes du Puy** — small green-blue AOP lentils that hold their shape however long they cook. Red
     lentils are specifically the lentil that collapses into purée, which is why they belong to Indian,
     Turkish and Middle Eastern cooking and not to this plate. After 25–30 minutes of simmering (step 5)
     they will be soup. This is the same class of error as substituting a staple in the Peruvian audit:
     the specific lentil *is* the dish.
  4. **20 g of dry lentils is a garnish, not the bed.** That is about two tablespoons. In the real dish
     the lentils are the body of the bowl and the duck sits on them; 60–80 g dry is a portion. And as in
     the paella, the liquid is wildly out of proportion — "2 cups water" for 20 g of lentils is ~24:1
     where it should be nearer 3:1.
  5. **The skin is never crisped.** Confit taken straight from the fat is flabby. It is finished
     skin-side-down in a hot dry pan (or under a broiler) for a few minutes until the skin shatters. Step
     6 just arranges the leg on the lentils.
  6. **The aromatic base is incomplete.** The classic garnish for lentils is onion + carrot + **celery**,
     sweated in duck fat, plus a bouquet garni. Celery is absent and is not in the registry. Lower
     priority than the above, and honestly optional.
  7. **No acid to finish.** Lentilles du Puy are classically sharpened at the end with red wine vinegar or
     a spoon of Dijon; without it the bowl is flat under all that fat. `Red Wine Vinegar` already exists
     in the project's spice vocabulary.
- **What it already gets right:** 90 °C / 195 °F for 2–3 hours is the correct poaching temperature and
  time for confit — whoever wrote it knew the target, just not the cure or the submersion. Bay and thyme
  are the correct aromatics. Sautéing the vegetables in duck fat (step 4) is exactly right.
- **Proposed fix:**
  - *Ingredients:* swap `Red Lentils` 20 g → **`Green Lentils` 70 g** (new registry entry). Add
    **`Duck Fat` 10 g** (new registry entry) — record only what is actually eaten, since the poaching fat
    is drained and reused, and describe the full submersion in the step text. Optionally add `Celery` 30 g
    (new registry entry).
  - *Spices:* add `{ name: "Red Wine Vinegar", grams: 5 }`. Existing salt/pepper/bay/thyme all stay and
    are now doing double duty as the cure.
  - *Steps:* rewrite 1, 2, 5 and 6, and add a crisping step.
    - 1: "Rub the duck leg all over with the salt, pepper, thyme and a crushed garlic clove. Cover and
      refrigerate for 12–24 hours to cure."
    - 2: "Rinse the cure off the leg and dry it thoroughly. Melt enough duck fat to submerge the leg and
      poach it at 90 °C / 195 °F for 2–3 hours, until the meat pulls easily from the bone."
    - 5: "Add the green lentils, a bay leaf and about 250 ml of water or stock. Simmer 25–30 minutes until
      the lentils are tender but still holding their shape, then stir in the red wine vinegar."
    - new step before plating: "Lift the leg out of the fat and crisp it skin-side down in a hot dry pan
      for 3–4 minutes until the skin is golden and shatters."
    - 6: "Remove the bay leaf, spoon the lentils into a bowl and set the duck leg on top."
- **New ingredients required:**
  - `Green Lentils` — **NOT in registry.md.** Required. USDA raw/100g. (Name it for the lentil, not the
    AOP, so other recipes can reuse it.)
  - `Duck Fat` — **NOT in registry.md.** Recommended; also unlocks the pommes sarladaises fix in the next
    recipe. Would need an `INGREDIENT_CATEGORIES` entry.
  - `Celery` — **NOT in registry.md.** Optional.
- **Ingredients no longer used:** `Red Lentils` in this recipe. Note: `data.js` shows exactly **5** recipe
  references to `Red Lentils`, so removing this one drops it to 4 — below the project's "aim ≥5 recipes per
  ingredient" convention. Not an orphan, but it moves onto the same watchlist as Cod and Kimchi.
- **Macro impact:** Substantial, and mostly deliberate. Green lentils at 70 g vs red at 20 g is roughly
  +175 cal, +30 g carbs and +12 g protein — this turns a duck-leg-and-scraps entry into a genuine bowl.
  `Duck Fat` at 10 g adds ~90 cal of pure fat. Celery is negligible. Expect the recipe to go from
  protein-lean-and-small to a much more balanced, larger dish; re-run the validator.
- **Confidence:** high. The cure-then-submerge definition of confit and the red-vs-Puy lentil distinction
  are both unambiguous and consistently sourced.
- **Sources:** lalentillevertedupuy.com (the Lentille Verte du Puy AOP producers' own recipe page),
  petitsplatsentreamis.com "Cuisses de canard confites aux lentilles vertes du Puy", ledevoir.com recette
  "Lentilles vertes du Puy au canard confit", americastestkitchen.com lentilles-du-puy,
  frenchamericancultural.org "French Lentils".

---

### Pan-Seared Duck Breast with Cherry Sauce & Brown Rice
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct` — French. *Magret de canard aux cerises* is a genuine Southwest French
  classic (the magret is the breast of the fattened duck whose legs become confit — so this recipe and the
  previous one are literally two halves of the same bird, which is a nice bit of internal coherence).
- **Findings:**
  1. **Brown rice is the drift.** Nothing about brown rice is French, and it is the one component that
     doesn't belong on this plate. The traditional accompaniments are potatoes — *pommes sarladaises*,
     sliced potatoes sautéed in the duck fat you just poured off — or roast potatoes, or a purée
     (mashed sweet potato also appears in the sources). Duck fat plus potato is the whole point of
     Southwest cooking, and the recipe already generates the fat and then discards it in step 5.
  2. **An internal note leaked into the user-facing steps.** Step 5 reads, verbatim, "Add minced garlic
     and finely diced onion **(substituting for shallot)**". That parenthetical is a developer comment
     sitting in a cooking instruction the user reads while cooking. It should come out regardless of
     whether the substitution stays. (`Shallots` are already on the project's data backlog in CLAUDE.md —
     this is the recipe that wants them.)
  3. **The sauce is a jar deglaze, not a reduction.** The classical build is: shallot sweated in the duck
     fat, deglazed with red wine (Cahors, Madiran) or port, sharpened with a splash of vinegar, sweetened
     with honey or redcurrant jelly, cherries added, then reduced slowly to a syrup and often finished
     with a knob of cold butter (*monter au beurre*). "Deglaze with cherry sauce and simmer 2 minutes"
     produces warmed jam. This is fixable entirely from ingredients already in the registry.
  4. **Garlic is not the aromatic here.** Shallot is. Garlic in a cherry-and-duck pan sauce is an
     improvisation; it isn't wrong so much as not the dish.
  5. **The rest has no duration.** "Rest on a cutting board" should specify 5–10 minutes — for a magret,
     resting is not optional and an unspecified rest tends to become no rest.
  6. **Renaming caution.** The recipe *name* contains "Brown Rice", so swapping the starch means changing
     the recipe key. Per CLAUDE.md, plans are cloned to localStorage at generation time and favorites are
     stored by name, so a rename orphans existing favorites and stale saved plans. Worth doing — suggest
     "Pan-Seared Duck Breast with Cherry Sauce & Potatoes", or simply "Magret de Canard aux Cerises" — but
     do it knowingly, not as a silent edit.
- **What it already gets right — this is the best-executed technique in the slice, do not touch it:**
  scoring the skin in a crosshatch, starting **skin-side down in a cold pan** over medium-low, rendering
  about 10 minutes to a crisp golden skin, flipping for ~3 minutes to medium-rare, then resting and
  slicing thinly. The cold-pan start is a modern refinement rather than the classical preheated dry pan,
  but it is a legitimate and widely used one that renders the fat cap more thoroughly — not a finding.
  Never cooking the magret past pink is correctly implied. Asparagus is a perfectly French spring
  accompaniment.
- **Proposed fix:**
  - *Ingredients:* swap `Brown Rice` 50 g → `Potato` 150 g. Add `Butter` 5 g and `Honey` 5 g for the
    sauce. Remove `Garlic` 5 g. Ideally swap `Onion` 20 g → `Shallot` 20 g (new registry entry); if
    shallots aren't added, keep the onion but delete the parenthetical from the step text.
  - *Spices:* add `{ name: "Red Wine Vinegar", grams: 5 }` (already in the project's spice vocabulary).
  - *Steps:* rewrite 1, 4, 5 and 7.
    - 1: "Peel and slice the potato into thin rounds."
    - 4: "Flip the duck and cook for 3 more minutes for medium-rare. Move it to a board and rest 5–10
      minutes."
    - new step after 4: "Pour off most of the duck fat, reserving it. Fry the potato slices in the
      reserved fat over medium heat for 10–12 minutes, turning, until golden and tender. Season with salt."
    - 5: "Add the finely diced shallot to the pan and sweat for 1 minute. Add the red wine vinegar and let
      it hiss away, then stir in the cherry sauce and the honey and simmer 2–3 minutes until syrupy. Take
      off the heat and swirl in the butter."
    - 7: "Slice the duck thinly across the grain. Plate with the potatoes and asparagus, and spoon the
      cherry sauce over the duck."
- **New ingredients required:** `Shallot` — **NOT in registry.md** (optional but recommended; already on
  the project's own data backlog). `Butter`, `Honey`, `Potato` and `Red Wine Vinegar` are all already
  available.
- **Ingredients no longer used:** `Brown Rice` (this recipe only — 24 references across `data.js`, so no
  orphan risk), `Garlic` (this recipe only). If shallot is added, `Onion` also leaves this recipe.
- **Macro impact:** Roughly neutral, trending slightly down. 50 g dry brown rice (~180 cal, ~38 g carbs) →
  150 g potato (~115 cal, ~26 g carbs) is a net loss; 5 g butter (~36 cal) and 5 g honey (~15 cal) add a
  little back. Protein unchanged. Note that if the potatoes are genuinely fried in the rendered duck fat,
  real-world calories exceed what the registry will record — same modelling gap as the confit.
- **Confidence:** high on the accompaniment and the sauce construction; high on the leaked parenthetical
  (it's right there in the data). Medium on dropping garlic — a defensible cook's choice either way.
- **Sources:** lavarenne.com "Duck Breast with Cherries (Magret de Canard aux Cerises)" and Anne Willan,
  *The Country Cooking of France* (via ckbk.com); villagesetpatrimoine.fr "magret de canard aux cerises :
  une recette du terroir"; aufilduthym.fr magret-de-canard-cerises.

---

## Cross-cutting finding (applies beyond this slice)

Two of the five recipes call for **"2 cups water"** in the steps against tiny solver-scaled grain/pulse
quantities — 475 ml for 60 g of paella rice, and 475 ml for 20 g of lentils. Both are 3–8× too much and
would leave the dish soupy and the "simmer until absorbed" instruction unable to complete. The pattern
looks systematic rather than coincidental: the steps read as if written for a normal restaurant portion
while the ingredient grams were later shrunk to fit macro targets, and the two were never reconciled.

`data.js` contains **13 cooking steps with hard-coded cup measures of water** (5× "3 cups water",
4× "2 cups water", 2× "5 cups water", 1× "2 cups of water", 1× "1 cup water"). Recommend sweeping all 13
against their recipes' actual dry-ingredient grams. This is outside the authenticity remit but it is a
correctness bug in user-facing instructions, and it was only visible because two of my five happened to
hit it.

---

## Summary

**Counts by verdict**
- `authentic`: 0
- `minor-drift`: 3 — Gambas al Ajillo, Tortilla Espanola, Pan-Seared Duck Breast with Cherry Sauce
- `significantly-off`: 2 — Paella Mixta, Duck Confit with Lentils
- `mislabeled`: 0 — all five cuisine labels are correct
- `not-a-real-dish`: 0 — all five are real, named dishes

**The 3 worst offenders**
1. **Duck Confit with Lentils** — it is not confit: no salt cure, and a duck leg cannot be submerged in
   "its own rendered fat". Compounded by red lentils, which dissolve, where the dish is defined by green
   Puy lentils that hold their shape.
2. **Paella Mixta** — no saffron (the defining seasoning), no socarrat (the defining finish), and ~8×
   more liquid than 60 g of rice can absorb.
3. **Tortilla Espanola** — contains spinach, which no tortilla española contains, and carries about half
   the potato it needs per egg, making it an omelette with potato rather than a tortilla.

**Consolidated NEW ingredients required across the slice**

Needing an `INGREDIENT_REGISTRY` row (all four are **absent from registry.md**):
| Ingredient | For | Priority |
|---|---|---|
| `Green Lentils` | Duck Confit with Lentils | **required** — the fix depends on it |
| `Duck Fat` | Duck Confit; also the Duck Breast potatoes | recommended |
| `Shallot` | Pan-Seared Duck Breast | recommended (already on the project's data backlog) |
| `Celery` | Duck Confit (mirepoix) | optional |

Needing only a `RECIPE_SPICE_OVERRIDES` entry + grocery category (zero-macro, no registry row):
| Seasoning | For | Priority |
|---|---|---|
| `Saffron` | Paella Mixta | **required** — this is the single most important addition in the slice |
| `Dry Sherry` | Gambas al Ajillo | optional |

Already in the registry / spice list, just newly used: `Chicken Thigh`, `Tomato`, `Potato`, `Butter`,
`Honey`, `Dried Parsley`, `Red Wine Vinegar`.

**Consolidated ingredients the slice would STOP using**

| Ingredient | Leaves | App-wide status |
|---|---|---|
| `Spinach` | Gambas al Ajillo, Tortilla Espanola | 20 refs in `data.js` — safe |
| `Onion` | Paella Mixta (and Duck Breast if shallot is added) | very widely used — safe |
| `Chicken Breast` | Paella Mixta (→ `Chicken Thigh`) | very widely used — safe |
| `Brown Rice` | Pan-Seared Duck Breast (→ `Potato`) | 24 refs — safe |
| `Garlic` | Pan-Seared Duck Breast sauce | very widely used — safe |
| `Red Lentils` | Duck Confit (→ `Green Lentils`) | **5 refs → 4** — drops below the project's ≥5-recipes-per-ingredient guideline; joins the Cod/Kimchi watchlist |
| `Tomato Sauce` | Paella Mixta (optional, → `Tomato`) | widely used — safe |
| `Lemon` | Gambas al Ajillo (optional) | widely used — safe |

Nothing in this slice would be orphaned. `Red Lentils` is the only entry whose footprint shrinks enough
to matter.

**Constraint compliance:** no nut and no olive is proposed anywhere above. Spanish cooking would normally
reach for almonds (picada, romesco) and both cuisines use olives freely — notably *canard aux olives* is
the sibling dish to the cherry magret — and all of that is deliberately left out. `Olive Oil` is
untouched and, in the tortilla and gambas, is argued *upward*.
