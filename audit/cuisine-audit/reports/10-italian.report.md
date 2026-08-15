# Authenticity audit — Italian (11 recipes)

Mode: **traditional** — the specifics ARE the dish.

Constraints honored: no nuts, no olives, `Olive Oil` untouched, `Pesto Sauce` nut-free packaged product
accepted as-is (never flagged, no pine nuts proposed). No project file was edited.

Note on registry gaps that recur below: **Celery**, **White Wine**, **Fresh Parsley**, **Fresh Basil**
and **Rosemary/Sage** are absent. The last four are zero-macro or near-zero and per the app's own
convention can live in `RECIPE_SPICE_OVERRIDES` without a registry entry. Celery and Clams would need
real registry rows.

---

### Spaghetti Bolognese
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` as a country label (Emilia-Romagna), but the *name* is Anglo. There is no
  "spaghetti bolognese" in Bologna; the dish is **tagliatelle al ragù**. The Accademia Italiana della
  Cucina's registered recipe states outright that the ragù is served with tagliatelle, not spaghetti.
- **Findings:**
  1. **White Beans (19g) do not belong in a ragù in any form.** No Bolognese tradition puts beans in the
     sauce. This is macro filler and it is the single most obviously alien ingredient in the recipe.
  2. **No soffritto.** Ragù starts with onion + carrot + celery sweated in fat. Only onion is present.
  3. **No pork.** The Accademia's 2023 registered recipe pairs the beef with 150g fresh pork belly
     (or cured pancetta) — it is not an all-beef sauce. `Pork Belly` is already in the registry.
  4. **No wine and no milk.** Both are defining steps: wine is added and cooked off completely, then
     milk goes in halfway through the simmer. Their absence is why the sauce reads as generic mince.
  5. **Oregano + Dried Basil are wrong.** Ragù bolognese carries no dried herbs at all. Dried oregano
     and basil in a meat-and-tomato sauce is the Italian-American red-sauce signature, not Emilian.
  6. **30-minute cook time.** A ragù is a 2–3 hour sauce; the long simmer is the technique, not a
     detail. Thirty minutes produces browned mince in tomato, which is what this currently is.
  7. Tomato-to-meat ratio (100g sauce : 150g beef) is actually **fine** — close to the Accademia's own
     300g passata : 550g meat. Not a finding.
- **Proposed fix:**
  - *Ingredients:* remove `White Beans` 19g. Add `Carrot` 30g. Add `Pork Belly` 30g (and drop
    `Ground Beef (80% lean)` 150g → `Ground Beef (lean)` 120g to hold calories). Add `Whole Milk` 40g.
    Add `Celery` 30g **(new registry entry required)**.
  - *Spices:* delete `Oregano` and `Dried Basil`. Keep Salt + Black Pepper only. Optionally add
    `White Wine` as a zero-macro spice-override (it is cooked off entirely).
  - *Steps:* raise `cookTime` to "2 hrs". Rewrite as: soffritto of onion/carrot/celery in olive oil →
    render pork belly → brown the beef → add wine and cook until fully evaporated → tomato sauce →
    simmer 2 hours, stirring in the milk at the halfway point → toss with **tagliatelle**, finish with
    grated parmigiano. Rename the recipe `Tagliatelle al Ragù` if the name should match the dish.
- **New ingredients required:** `Celery` **(NOT in registry)**; `White Wine` **(NOT in registry** —
  zero-macro after reduction, fits `RECIPE_SPICE_OVERRIDES`**)**. `Carrot`, `Pork Belly`, `Whole Milk`,
  `Ground Beef (lean)` are all already present.
- **Ingredients no longer used:** `White Beans` (in this recipe), `Ground Beef (80% lean)` (in this
  recipe, if the lean swap is taken), `Oregano` + `Dried Basil` (in this recipe).
- **Macro impact:** Moderate. Pork belly is very fat-dense (+~160 cal, mostly fat, per 30g); dropping
  to lean beef at 120g roughly offsets it. Whole milk +25 cal. Losing the beans costs ~1g protein.
  Net: similar calories, noticeably higher fat share, protein down ~4g.
- **Confidence:** high
- **Sources:** Accademia Italiana della Cucina — official updated ragù alla bolognese recipe (2023
  revision of the 1982 Chamber of Commerce deposit),
  https://www.accademiaitalianadellacucina.it/en/notizie/notizia/italian-academy-cuisine-registers-updated-recipe-true-rag%C3%B9-alla-bolognese ;
  TasteAtlas summary of the 2023 update, https://www.tasteatlas.com/the-official-ragu-alla-bolognese-recipe-gets-an-update

---

### Shrimp Primavera
- **Verdict:** `mislabeled`
- **Cuisine label:** should be **Italian-American**, not Italian. Pasta primavera was invented by Sirio
  Maccioni in 1975 and made famous at Le Cirque in New York via a 1977 Craig Claiborne / Pierre Franey
  piece in the New York Times. "Primavera" is not a pasta category in Italy.
- **Findings:**
  1. **Origin.** This is a New York restaurant dish of the 1970s. Filing it under `Italian` is the same
     class of error as filing fra diavolo or shrimp scampi there.
  2. **It doesn't match its own dish either.** The Le Cirque original is defined by butter + cream +
     parmigiano over a specific spring-vegetable set (broccoli, zucchini, asparagus, peas, mushrooms,
     cherry tomatoes, basil). Here there are two vegetables, one of which — **bell pepper** — appears
     in no version of the dish and is not a spring vegetable in the Italian sense.
  3. Shrimp is a legitimate and very common US variant; not a finding.
  4. Parmesan on a shrimp pasta breaks the Italian cheese-with-seafood convention, but the original
     primavera is a cream-and-cheese dish, so this is internally consistent. Noted, not flagged.
  5. Steps name "penne"; the ingredient is generic `Pasta`, so no phantom. The original used spaghetti.
- **Proposed fix:** Change `cuisine` to `Italian-American`. If it must read as Italian instead, rename
  to `Pasta con Gamberi e Zucchine` and it becomes an unremarkable but honest Italian dish.
  Either way, to match the name's vegetable promise: swap `Bell Pepper` 60g → `Asparagus` 60g and add
  `Green Peas` 40g (both already in the registry). Add `Fresh Basil` to the spice overrides in place of
  `Dried Basil`. Step wording: "penne" → "spaghetti" if tracking the original.
- **New ingredients required:** none for the registry. `Fresh Basil` as a spice-override name only
  (`Basil` already exists in the registry as a fresh herb, so this may be a straight ingredient add).
- **Ingredients no longer used:** `Bell Pepper` (in this recipe), `Dried Basil` (in this recipe).
- **Macro impact:** negligible — asparagus and peas for bell pepper is within a few calories.
- **Confidence:** high
- **Sources:** Wikipedia, *Pasta primavera*, https://en.wikipedia.org/wiki/Pasta_primavera ; Saveur,
  "The Classics: Le Cirque's Pasta Primavera", https://www.saveur.com/article/video/video-the-classics-le-cirques-pasta-primavera

---

### Spaghetti alle Vongole
- **Verdict:** `significantly-off` — the name is the headline: **there are no clams in it.**
- **Cuisine label:** `correct` (Neapolitan / Campania) for the dish the name claims. The dish actually
  encoded is a shrimp aglio-olio-peperoncino, which is also Italian, so the label survives; the *name*
  does not.
- **Findings:**
  1. **`vongole` means clams. The ingredient list is 160g shrimp and no clams.** This is a total
     name/ingredient mismatch — the equivalent of the Peruvian audit's mango ceviche.
  2. **Phantom ingredient in the steps.** Step 2 reads "(or scrub clams if using)" — clams appear
     nowhere in the ingredient list, so the steps reference something the recipe cannot contain.
  3. **Lemon is not in the dish.** Neither the *in bianco* nor the *in rosso* version uses lemon juice;
     the acid and aroma come from dry white wine. Squeezing lemon through the pasta is an Anglo habit.
  4. **No white wine** — the defining liquid of the bianco version, along with the clam liquor.
  5. **Dried Parsley.** The signature is a fistful of *fresh* flat-leaf parsley added off the heat.
     Dried parsley is a different and largely inert ingredient here.
  6. **Correct and worth keeping:** no cheese (cheese on vongole is a hard no), garlic + chili + olive
     oil, al dente, reserved pasta water. The technique skeleton is right.
- **Proposed fix — two honest options, pick one:**
  - **(a) Make it the real dish.** Remove `Shrimp` 160g, add `Clams` ~250g in shell / ~120g meat
    **(new registry entry required)**. Remove `Lemon` 15g. Add `White Wine` as a spice-override.
    Swap `Dried Parsley` → `Fresh Parsley`. Steps: open the clams in the pan with wine and a lid,
    keep the strained liquor, toss the pasta in it. Delete the shrimp language.
  - **(b) Keep the shrimp, fix the name.** Rename to `Spaghetti con Gamberi, Aglio e Peperoncino` — a
    real preparation. Remove `Lemon`, add `White Wine`, swap dried → fresh parsley, and delete the
    "or scrub clams if using" clause. Zero macro disruption.
  - Option (b) is the better fit for this app: it costs nothing in macros and stops the recipe lying.
- **New ingredients required:** `Clams` **(NOT in registry;** USDA "Mollusks, clam, mixed species, raw"
  ≈ 74 cal / 12.8g protein / 2.6g carb / 1.0g fat per 100g meat — note shell-on vs meat weight**)** for
  option (a) only. `White Wine` and `Fresh Parsley` **(NOT in registry;** both fit
  `RECIPE_SPICE_OVERRIDES` as zero-macro**)** for either option.
- **Ingredients no longer used:** `Lemon` (in this recipe); `Dried Parsley` (in this recipe);
  `Shrimp` (in this recipe) under option (a) only.
- **Macro impact:** Option (b): none. Option (a): **material protein loss** — 160g shrimp ≈ 31g protein
  for ~115 cal, versus ~120g clam meat ≈ 15g protein for ~89 cal. The recipe's `high-protein` tag would
  no longer hold without roughly doubling the clam weight.
- **Confidence:** high
- **Sources:** Wikipedia, *Spaghetti alle vongole*, https://en.wikipedia.org/wiki/Spaghetti_alle_vongole ;
  Great Italian Chefs, Spaghetti alle Vongole,
  https://www.greatitalianchefs.com/recipes/spaghetti-alle-vongole-recipe ; The Pasta Project,
  linguine alle vongole, https://www.the-pasta-project.com/linguine-pasta-alle-vongole-linguine-with-clams/

---

### Tuscan White Bean Soup
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` (Italian / Tuscan) as an aspiration, but what is encoded is a generic
  pork-and-bean soup rather than a member of the Tuscan bean-soup family (zuppa di fagioli, ribollita,
  zuppa di pane).
- **Findings:**
  1. **The ratio is inverted.** 120g pork loin against 50g beans makes this a meat soup with beans in
     it. The Tuscan dish is a bean-and-bread soup; meat, when present at all, is a flavouring scrap of
     pancetta or a prosciutto end, not a 120g protein portion.
  2. **Wrong cut of pork.** Lean loin cubes contribute no fat and no cure. Tuscan bean soups get their
     backbone from pancetta/guanciale/prosciutto ends. `Pork Belly` is in the registry.
  3. **The bread is served on the side.** This is the defining error. The whole Tuscan bean-soup family
     is built on stale bread going *into* the pot to thicken and collapse — that is what makes it
     ribollita or zuppa di pane rather than soup with toast.
  4. **No soffritto.** No onion, no carrot, no celery. Every version starts there; garlic alone is not
     the base.
  5. **Oregano is the wrong herb** — it is southern. Tuscan bean soups run on rosemary, sage and thyme.
     `Thyme` is already both a registry ingredient and an accepted spice-override name.
  6. **Spinach stands in for cavolo nero** (lacinato/Tuscan black kale), the signature green of the
     ribollita family. There is no kale in the registry, so spinach is the best available substitute —
     I flag this as a known compromise rather than an error, unless `Kale` is added.
  7. No bean-mashing step (part of the beans are usually puréed to thicken) and no finishing drizzle
     of olive oil. Minor but they are what give the soup its texture.
- **Proposed fix:**
  - *Ingredients:* `Pork Loin` 120g → `Pork Belly` 30g (or drop the meat entirely); `White Beans`
    50g → 90g; add `Onion` 50g and `Carrot` 40g; add `Celery` 30g **(new registry entry)**; keep
    `Whole Wheat Bread` 30g but change its role; optionally `Spinach` → `Kale` **(new registry entry)**.
  - *Spices:* remove `Oregano`; add `Thyme` plus `Rosemary` and/or `Sage` as zero-macro spice-overrides.
  - *Steps:* build a soffritto of onion, carrot, celery and garlic in olive oil first; after simmering,
    mash or purée about a third of the beans back into the pot; final step becomes "tear the bread into
    the pot and simmer 5 minutes until it collapses into the soup; finish with a drizzle of olive oil"
    rather than toasting it alongside. Consider renaming to `Ribollita` (bread in the pot) or
    `Zuppa di Fagioli`.
  - *Note:* if the meat is cut to 30g the recipe stops being a protein anchor. That is a real tension
    with the app's macro solver, not something authenticity can resolve — see macro impact.
- **New ingredients required:** `Celery` **(NOT in registry)**; `Kale` **(NOT in registry**, optional
  but it is the actual green of the dish**)**; `Rosemary`, `Sage` **(NOT in registry;** zero-macro,
  spice-override only**)**.
- **Ingredients no longer used:** `Pork Loin` (in this recipe), `Oregano` (in this recipe),
  `Spinach` (in this recipe, only if kale is added).
- **Macro impact:** **Large and adverse.** Cutting 120g pork loin removes roughly 30g protein / ~145
  cal; raising white beans 50g → 90g adds roughly 11g protein but ~130 cal of mostly carbohydrate
  (registry beans are raw/dry weight). Net: protein down sharply, carbs up sharply. If the solver needs
  this recipe as a protein source, the honest move is a partial fix — pork belly at 60–70g rather than
  30g — and accepting the drift knowingly.
- **Confidence:** high
- **Sources:** Wikipedia, *Zuppa toscana* / ribollita, https://en.wikipedia.org/wiki/Zuppa_toscana ;
  Coley Cooks, "Authentic Tuscan Ribollita", https://coleycooks.com/ribollita/ ; Feasting at Home,
  Ribollita (Tuscan bean soup), https://www.feastingathome.com/ribollita-recipe/

---

### Chicken Pesto Pasta
- **Verdict:** `mislabeled`
- **Cuisine label:** should be **Italian-American**. Chicken breast over pesto pasta, finished with
  melted mozzarella, is a US casual-dining composition, not a Ligurian one.
- **Findings:**
  1. **Chicken does not go with pesto in Liguria.** Pesto dresses pasta (or goes into minestrone, or
     onto potatoes and green beans). It is not a sauce for a protein-and-starch plate. This is the
     clearest Italian-American tell in the recipe.
  2. **Mozzarella 30g on top is wrong twice over.** No Italian pesto pasta gets melted mozzarella, and
     pesto already carries hard cheese, so this stacks a third cheese onto the plate purely for the
     American "cheesy pasta" effect.
  3. **Missing the dish's actual defining extras.** The canonical Ligurian plate — trofie or trenette
     al pesto *avvantaggiata* — cooks diced potato and green beans in the same pot as the pasta. Both
     `Potato` and `Green Beans` are already in the registry, so this is a free fix.
  4. **No pasta shape named.** The steps just say "pasta". Trofie, trenette or linguine are the shapes;
     naming one costs nothing since the ingredient is generic.
  5. **Pesto must never be cooked.** Step 3 should specify tossing off the heat with a spoonful of
     pasta water to loosen the sauce; heating pesto in the pan dulls the basil.
  6. *Not a finding, by standing decision:* the nut-free packaged `Pesto Sauce`. Deliberate, correct,
     left alone.
- **Proposed fix:** *(Option A recommended — keeps the protein)*
  - **A:** set `cuisine` to `Italian-American`; remove `Mozzarella Cheese` 30g; add `Green Beans` 60g
    and `Potato` 60g; keep the chicken. Step 3 → "Off the heat, loosen the pesto with a spoonful of
    reserved pasta water and toss with the drained trofie, potatoes and green beans."
  - **B (fully Ligurian):** rename `Trofie al Pesto`, drop both the chicken and the mozzarella, add the
    potato and green beans. Authentic, but strips ~44g of protein — likely unusable for this app.
- **New ingredients required:** none — `Potato` and `Green Beans` are already in the registry.
- **Ingredients no longer used:** `Mozzarella Cheese` (in this recipe).
- **Macro impact:** Roughly calorie-neutral. Dropping 30g mozzarella removes ~85 cal / ~7g protein;
  adding potato and green beans returns ~65 cal, almost all carbohydrate. Net: protein down ~7g,
  carbs up.
- **Confidence:** high
- **Sources:** Rachel Roddy via The Happy Foodie, "Trofie with Pesto alla Genovese, Potatoes and Green
  Beans", https://thehappyfoodie.co.uk/articles/an-a-z-of-pasta-with-rachel-roddy-trofie-with-pesto-alla-genovese-potatoes-and-green-beans/ ;
  Recipes from Italy, Trenette al Pesto, https://www.recipesfromitaly.com/trenette-al-pesto-recipe/ ;
  TasteAtlas, Trofie al Pesto Genovese,
  https://www.tasteatlas.com/trofie-al-pesto/recipe/trofie-al-pesto-genovese-green-beans-and-potatoes

---

### Pork Milanese
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` (Italian / Lombardy). The *name* overreaches: "alla milanese" denotes a
  bone-in **veal** chop. There is no veal in the registry, so pork is a forced substitution — worth
  stating in the recipe rather than presenting this as the Milanese proper.
- **Findings:**
  1. **Tomato sauce 80g does not belong.** The cotoletta is served naked with a wedge of lemon. Putting
     a breaded cutlet on tomato sauce is the American parmigiana/"milanese" convention and it is the
     single biggest identity error here.
  2. **Fried in olive oil instead of butter.** The defining fat is clarified butter — it is what gives
     the crust its colour and flavour, and it is not optional in the Milanese. `Butter` is already in
     the registry. *(This is a technique finding about the correct frying fat; it has nothing to do
     with the olive ban — `Olive Oil` is fine and stays everywhere else.)*
  3. **Panko is the wrong breadcrumb.** Italian breading uses fine dry pangrattato; panko is Japanese
     and produces a coarse, shaggy crust that reads as katsu, not cotoletta. The registry has only
     `Panko Breadcrumbs`, so a plain `Breadcrumbs` entry is needed.
  4. **The flour dredge is genuinely contested** — Milanese sources split between egg-only and
     flour-egg-breadcrumb. I would leave the flour and not call it an error.
  5. **Pounding to 1cm is legitimate regional variation.** The classic is a thick bone-in chop, but the
     thin plate-sized *orecchia d'elefante* is equally Milanese. Not a finding.
  6. **Bed of spinach** is a modern restaurant plating. The Milanese accompaniment is nothing, or the
     modern Milan salad of rocket and cherry tomato. Minor; spinach is the registry's closest green.
  7. **Correct and worth keeping:** salt and pepper only (the dish is deliberately unseasoned beyond
     salt), and the lemon, which is essential.
- **Proposed fix:**
  - *Ingredients:* remove `Tomato Sauce` 80g. Swap `Olive Oil` 10g → `Butter` 20g. Swap
    `Panko Breadcrumbs` 25g → `Breadcrumbs` 25g **(new registry entry)**. Keep `Flour`, `Egg`, `Lemon`,
    `Spinach`.
  - *Spices:* no change (salt + black pepper is correct).
  - *Steps:* step 4/5 → "Melt butter in a large skillet over medium heat until foaming… fry the
    breaded pork 3–4 minutes per side until deep golden." Final step → "Serve with a wedge of lemon and
    the sautéed spinach alongside — no sauce." Optionally add a line noting this is the pork version of
    the veal cotoletta.
- **New ingredients required:** `Breadcrumbs` **(NOT in registry** — plain fine dry Italian
  pangrattato; USDA "Bread crumbs, dry, grated, plain" ≈ 395 cal / 13.4g protein / 71.9g carb /
  5.3g fat per 100g**)**. Optionally `Veal Cutlet` **(NOT in registry)** if the dish should carry its
  real name.
- **Ingredients no longer used:** `Tomato Sauce` (in this recipe), `Panko Breadcrumbs` (in this
  recipe), `Olive Oil` (in this recipe only, replaced by butter as the frying fat).
- **Macro impact:** Net **+60–90 cal and a meaningful fat increase**. Dropping 80g tomato sauce is
  about −25 cal; trading 10g olive oil (~88 cal) for 20g butter (~145 cal) adds saturated fat.
  Using 15g butter keeps it closer to the current numbers.
- **Confidence:** high on tomato sauce, butter and panko; medium on the flour dredge, which is
  legitimately contested.
- **Sources:** Sanpellegrino, Cotoletta alla Milanese,
  https://www.sanpellegrino.com/sparkling-drinks/zesty-food/cotoletta-milanese ; Recipes from Italy,
  "Veal Milanese original recipe", https://www.recipesfromitaly.com/veal-milanese-original-recipe/ ;
  Mangia with Nonna, "Cotoletta alla Milanese",
  https://mangiawithnonna.com/cotoletta-alla-milanese-authentic-milanese-veal-cutlet/

---

### Chicken Alfredo
- **Verdict:** `mislabeled`
- **Cuisine label:** should be **Italian-American**. The underlying sauce is genuinely Roman —
  Alfredo di Lelio, Rome, 1908, fettuccine with butter and Parmigiano — but "Chicken Alfredo" as a
  plated dish is an American restaurant construction and is not served in Italy.
- **Findings:**
  1. **The sauce technique here is correct, and that deserves saying.** Butter, grated Parmigiano and
     pasta water emulsified into a sauce, with **no cream**. That is the real dish. Cream in Alfredo is
     the single most common Italian-American error and this recipe does not make it — do not "fix" it.
  2. **Garlic 8g does not belong.** Alfredo is three ingredients: pasta, butter, cheese. There is no
     garlic in it, and step 3's garlic sauté is a US steakhouse habit.
  3. **Chicken thigh and asparagus are the Italian-American layer.** Neither appears in any Roman
     version. They are what the name promises to an American diner, which is precisely why the label,
     not the ingredients, is the thing to change.
  4. **Pasta shape unnamed.** It should be fettuccine, ideally fresh egg fettuccine; the steps just say
     "pasta". Free to fix since the ingredient is generic.
  5. 15g butter and 25g parmesan against 51g dry pasta is lean for a dish nicknamed *al triplo burro*.
     That is a deliberate macro compromise, not an authenticity error. Noted only.
- **Proposed fix:** *(minimal, recommended)* set `cuisine` to `Italian-American`; remove `Garlic` 8g;
  rewrite step 3 to "Melt butter in a large pan over low heat" with no garlic; name the pasta
  "fettuccine" in step 1. Keep the chicken and asparagus — they are what makes this the dish it is, and
  the app needs the protein.
  *Purist alternative:* rename `Fettuccine al Burro`, keep `cuisine: Italian`, drop chicken, garlic and
  asparagus, raise butter to 25g and parmesan to 40g. Authentic, but loses ~30g protein.
- **New ingredients required:** none.
- **Ingredients no longer used:** `Garlic` (in this recipe).
- **Macro impact:** negligible — 8g of garlic is about 11 cal.
- **Confidence:** high
- **Sources:** Wikipedia, *Fettuccine Alfredo*, https://en.wikipedia.org/wiki/Fettuccine_Alfredo ;
  Giallozafferano, "Fettuccine Alfredo (no heavy cream)",
  https://www.giallozafferano.com/recipes/Fettuccine-Alfredo.html ; John Mariani, Forbes,
  "Why Fettuccine All'Alfredo Is One Of The World's Greatest Simplest Dishes",
  https://www.forbes.com/sites/johnmariani/2021/08/10/why-fettuccine-allalfredo-is-one-of-the-worlds-greatest-simplest-dishes/

---

### Shrimp Fra Diavolo
- **Verdict:** `mislabeled`
- **Cuisine label:** should be **Italian-American**. Fra diavolo was created by Italian immigrants in
  New York — Grotta Azzurra in Little Italy has served lobster fra diavolo since 1908 — and it is not
  a dish served in Italy. Giuliano Bugialli's objection is almost a description of this recipe: a heavy
  tomato sauce with hot peppers, seafood and pasta in one dish is not Italian cooking. The Italian
  analogues are `all'arrabbiata` (tomato, garlic, chili, no seafood) and `gamberi alla diavola`
  (spiced grilled shrimp, no pasta).
- **Findings:**
  1. **Origin, as above.** This is the whole finding — the composition is not confused, the label is.
  2. **Within its own tradition it is well built.** Garlic, oil, chili, tomato, shrimp, pasta, pasta
     water, and — importantly — **no cheese**. Seafood pasta recipes usually fail exactly there. Credit.
  3. **No white wine.** Practically every version deglazes with dry white wine before the tomato goes
     in; it is the one real omission.
  4. **Nothing fresh at the finish.** Fra diavolo is finished with fresh parsley or basil off the heat.
  5. **Chili Flakes at 1g is timid** for a dish named "Brother Devil". 2g would match the name.
  6. **Onion 40g** is a mild drift even for the Italian-American version, which is usually garlic-only.
     Low stakes; optional.
  7. Tomato sauce 120g to 180g shrimp is a correct ratio for this dish — it *is* a heavy-sauce dish.
     Not a finding.
- **Proposed fix:** set `cuisine` to `Italian-American`. Spices: raise `Chili Flakes` 1g → 2g, add
  `White Wine` and `Fresh Parsley` as zero-macro spice-overrides. Steps: after step 3, "Pour in a splash
  of white wine and cook until it has evaporated"; final step gains "…and finish with chopped fresh
  parsley off the heat." Optionally remove `Onion` 40g for a garlic-only base. No other ingredient
  changes needed.
- **New ingredients required:** `White Wine`, `Fresh Parsley` — **both NOT in registry**, both
  zero-macro and suitable for `RECIPE_SPICE_OVERRIDES` rather than registry rows.
- **Ingredients no longer used:** `Onion` (in this recipe) — only if the garlic-only base is taken.
- **Macro impact:** none.
- **Confidence:** high
- **Sources:** Wikipedia, *Fra Diavolo sauce*, https://en.wikipedia.org/wiki/Fra_Diavolo_sauce ;
  Red Sauce America, "Shrimp fra Diavolo" (quoting Nancy Verde Barr, Tony May and Giuliano Bugialli on
  the New York origin), https://www.redsauceamerica.com/blog/shrimp-fra-diavolo/ ; Paesana,
  "Fra Diavolo: The Bedeviling Origins Of This Fiery Sauce",
  https://www.paesana.com/blog/fra-diavolo-the-bedeviling-origins-of-this-fiery-sauce

---

### Shrimp Scampi
- **Verdict:** `mislabeled`
- **Cuisine label:** should be **Italian-American**. In Italian, *scampi* are langoustines
  (*Nephrops norvegicus*) — "shrimp scampi" literally reads "shrimp langoustines". Lidia Bastianich
  describes the dish as immigrants adapting an Italian technique to the American ingredient that was
  actually available. The Italian relatives are *scampi alla busara* (Trieste) and *spaghetti con gli
  scampi*; neither is this.
- **Findings:**
  1. **Name and origin, as above.** The dish is fine; the label is not.
  2. **No white wine — the one substantive omission.** Scampi sauce is butter + garlic + dry white
     wine + lemon + parsley. Without the wine this is garlic-butter shrimp with pasta, which is a
     different and flatter thing.
  3. **Dried Parsley again.** Fresh flat-leaf parsley, added off the heat, is half the dish's identity.
     The step also hedges "parsley **if desired**" — in scampi it isn't optional.
  4. **Butter alone as the fat.** The standard version uses butter *and* a little olive oil so the
     butter does not brown at searing heat. Minor technique point.
  5. **No chili flakes.** Common but genuinely optional; regional variation, not an error.
  6. **No cheese — correct**, and worth keeping that way.
  7. Steps say "spaghetti"; linguine is the Italian-American default. Either is defensible.
- **Proposed fix:** set `cuisine` to `Italian-American`. *Spices:* add `White Wine`, swap
  `Dried Parsley` → `Fresh Parsley`, optionally add `Chili Flakes` 1g. *Ingredients:* optionally add
  `Olive Oil` 5g alongside the butter. *Steps:* after the garlic, "add a splash of white wine and
  simmer 1–2 minutes until slightly reduced"; final step → "Toss with fresh parsley off the heat" —
  drop "if desired".
- **New ingredients required:** `White Wine`, `Fresh Parsley` — **both NOT in registry**, both
  zero-macro spice-override candidates.
- **Ingredients no longer used:** `Dried Parsley` (in this recipe).
- **Macro impact:** negligible; +45 cal if the 5g of olive oil is added.
- **Confidence:** high
- **Sources:** Tasting Table, "An Italian Might Laugh At The Name 'Shrimp Scampi'",
  https://www.tastingtable.com/1925591/is-shrimp-scampi-traditional-italian/ ; America's Test Kitchen,
  "What Does 'Scampi' Mean?", https://www.americastestkitchen.com/articles/7930-in-the-library-with-toni-tipton-martin-what-is-a-scampi ;
  Wikipedia, *Scampi*, https://en.wikipedia.org/wiki/Scampi

---

### Minestrone Soup
- **Verdict:** `significantly-off`
- **Cuisine label:** `correct` (Italian). Minestrone is genuinely pan-Italian and legitimately varies
  by region and season, so the vegetable list has wide latitude — but the *base* does not.
- **Findings:**
  1. **No soffritto, and no onion at all.** Minestrone starts with onion, celery and carrot chopped
     fine and sweated slowly in olive oil for 10–15 minutes until sweet. Here there is no onion, no
     celery, and the carrot gets 3 minutes after the pork. This is the structural error: the soffritto
     is the dish's foundation, not a garnish.
  2. **Red Lentils 13g are not Italian.** Italian lentil cooking uses small brown/green lentils
     (Castelluccio, Colfiorito) in a dedicated *zuppa di lenticchie*. Red lentils are Middle Eastern /
     South Asian, they dissolve entirely into the broth, and here they are doing nothing but macro
     filler. This is the alien ingredient in the pot.
  3. **Pork Loin 120g inverts the dish.** Minestrone is a vegetable soup. Where pork appears it is
     cubed pancetta, guanciale or a ham bone used as a flavour base — small, fatty, cured. 120g of lean
     loin makes it a pork soup and contributes neither fat nor salt-cure.
  4. **No parmesan rind and no grated parmesan.** Simmering a rind in the pot and grating cheese over
     the bowl are near-universal and are where a lot of the savour comes from. `Parmesan Cheese` is
     already in the registry.
  5. **The pasta goes in too early.** It is added with the beans and simmered 15 minutes, which turns
     it to mush. Pasta belongs in the last ~8 minutes, or cooked separately.
  6. **Oregano** is not a minestrone herb; basil (fresh), bay and rosemary are. Minor.
  7. **Eggplant** is unusual — not wrong enough to call an error, defensible in a southern summer
     version, but it collapses in a long simmer and no standard minestrone includes it. Minor drift.
  8. Spinach as the leafy green is fine — spinach, chard and cavolo nero are all used. Not a finding.
- **Proposed fix:**
  - *Ingredients:* remove `Red Lentils` 13g. Add `Onion` 50g and `Celery` 40g **(new registry entry)**.
    `Pork Loin` 120g → `Pork Belly` 30g, or drop the meat entirely. Raise `White Beans` 31g → 60g.
    Add `Parmesan Cheese` 10g. Optionally swap `Eggplant` 60g → `Green Beans` 60g (registry).
  - *Spices:* remove `Oregano`; keep basil but as `Fresh Basil` added at the end; add `Bay Leaf`.
  - *Steps:* new step 1 → "Chop onion, celery and carrot fine and sweat in olive oil over medium-low
    heat for 10 minutes until soft and sweet." Add a parmesan rind with the broth and remove it before
    serving. Move the pasta to the **last 8 minutes**. Finish with grated parmesan and torn fresh basil.
- **New ingredients required:** `Celery` **(NOT in registry)**. `Fresh Basil` is effectively covered —
  `Basil` already exists as a registry ingredient.
- **Ingredients no longer used:** `Red Lentils` (in this recipe), `Pork Loin` (in this recipe),
  `Oregano` (in this recipe), `Eggplant` (in this recipe, optional).
- **Macro impact:** **Large and adverse**, same tension as the Tuscan soup. Cutting 120g pork loin
  removes ~30g protein / ~145 cal; +29g white beans returns ~7g protein but ~95 cal of carbohydrate;
  +10g parmesan adds ~40 cal / 4g protein. Net: protein down roughly 19g. Minestrone is not a
  high-protein dish and cannot be made into one authentically — if the solver relies on it, keep pork
  belly nearer 60g and record that as a knowing compromise.
- **Confidence:** high
- **Sources:** Recipes from Italy, "Authentic Italian Minestrone",
  https://www.recipesfromitaly.com/italian-minestrone-soup-recipe/ ; Italian Recipe Book,
  "The Best Minestrone Soup (How Italians Make It)", https://www.italianrecipebook.com/minestrone-soup/ ;
  Sip and Feast, Minestrone, https://www.sipandfeast.com/minestrone/

---

### Pesto Shrimp Pasta
- **Verdict:** `minor-drift`
- **Cuisine label:** `correct`, but with a caveat: this is a modern Italian-style pasta rather than a
  traditional dish. The name is generic and descriptive, so it isn't claiming to be a named classic —
  which is why this scores lower than the mislabeled entries above, not higher.
- **Findings:**
  1. **15g of grated parmesan over a shrimp pasta breaks the Italian no-cheese-with-seafood rule.**
     This is the one concrete, uncontested finding. Southern exceptions exist, but they are trace
     amounts inside baked dishes, not grated cheese finished over a bowl of shellfish pasta. *(The
     cheese inside the packaged pesto is a separate matter and is not the issue — the visible grating
     on top is.)*
  2. **Pesto with shrimp is a modern international pairing, not a Ligurian one.** Liguria's pesto pasta
     is trofie or trenette with potato and green beans; pesto's traditional partners are vegetables and
     cheese, not shellfish. Modern Italian restaurants do serve *trofie al pesto con gamberi*, so this
     is not absurd — but under the traditional bar it isn't a traditional dish.
  3. **No pasta shape named** in the steps. Trofie, trenette or linguine.
  4. **Near-duplicate of `Chicken Pesto Pasta`** — same pesto + pasta + hard cheese skeleton with the
     protein swapped. Worth noting given the project's own ingredient-overlap hygiene sweep.
  5. **Pesto is tossed, not cooked** — correct, and step 3 says so. Credit.
  6. *Not a finding, by standing decision:* the nut-free packaged `Pesto Sauce`.
- **Proposed fix:** remove `Parmesan Cheese` 15g and drop it from step 4; raise `Shrimp` 140g → 165g to
  hold the protein. Name the shape in step 1 ("Cook trofie…"). Optionally add `Green Beans` 50g and
  `Potato` 50g cooked in the pasta water and rename `Trofie al Pesto con Gamberi`, which turns it into
  a recognisable Ligurian plate and also de-duplicates it from `Chicken Pesto Pasta`.
- **New ingredients required:** none — `Green Beans` and `Potato` are already in the registry.
- **Ingredients no longer used:** `Parmesan Cheese` (in this recipe).
- **Macro impact:** Small. Removing 15g parmesan drops ~59 cal / ~5g protein; +25g shrimp returns ~5g
  protein for ~18 cal. Roughly protein-neutral, ~40 cal lighter. Adding the potato and green beans
  would add ~70 cal of carbohydrate.
- **Confidence:** high on the cheese rule; medium on how hard to push the pesto-and-shellfish pairing,
  since it is genuinely current in modern Ligurian restaurants.
- **Sources:** Mangia with Nonna, "Why Italians Don't Put Cheese on Seafood Pasta",
  https://mangiawithnonna.com/why-italians-dont-put-cheese-on-seafood-pasta/ ; Food Republic,
  "The Case For Not Sprinkling Parmesan Cheese On Italian Seafood Meals",
  https://www.foodrepublic.com/2208345/skip-sprinkling-parmesan-cheese-italian-seafood-meals/ ;
  Rachel Roddy via The Happy Foodie, trofie with pesto alla genovese, potatoes and green beans (as above)

---

## Summary

### Counts by verdict
| Verdict | Count | Recipes |
|---|---|---|
| `authentic` | 0 | — |
| `minor-drift` | 1 | Pesto Shrimp Pasta |
| `significantly-off` | 5 | Spaghetti Bolognese, Spaghetti alle Vongole, Tuscan White Bean Soup, Pork Milanese, Minestrone Soup |
| `mislabeled` | 5 | Shrimp Primavera, Chicken Pesto Pasta, Chicken Alfredo, Shrimp Fra Diavolo, Shrimp Scampi |
| `not-a-real-dish` | 0 | — |

### The 3 worst offenders
1. **Spaghetti alle Vongole** — *vongole* means clams and the recipe contains none, only 160g of shrimp;
   the cooking steps even reference scrubbing clams that are not in the ingredient list. Plus lemon,
   which the dish never has, and no white wine, which it always has.
2. **Spaghetti Bolognese** — white beans in a ragù, no soffritto, no pork, no wine, no milk, dried
   oregano and basil that no Emilian ragù contains, and a 30-minute cook for a 2–3 hour sauce.
3. **Tuscan White Bean Soup** — 120g of lean pork loin against 50g of beans inverts a bean-and-bread
   soup into a meat soup; oregano instead of rosemary/sage; and the bread toasted on the side rather
   than collapsed into the pot, which is the entire point of the Tuscan bread-soup family.

*Runner-up:* **Minestrone Soup** — red lentils (not an Italian ingredient) and no onion or celery at
all, so the soffritto the dish is built on simply isn't there.

### Consolidated: new ingredients required
**Need real `INGREDIENT_REGISTRY` rows (NOT currently present):**
| Ingredient | Wanted by | Priority |
|---|---|---|
| `Celery` | Spaghetti Bolognese, Tuscan White Bean Soup, Minestrone Soup | **High** — one add fixes the soffritto in three recipes |
| `Pancetta` (cured) | same three — better than `Pork Belly`, which is the only pork fat currently available | **High**, optional but recommended |
| `Breadcrumbs` (plain dry pangrattato) | Pork Milanese | Medium |
| `Clams` | Spaghetti alle Vongole — only under fix option (a) | Medium; option (b) needs no new ingredient |
| `Kale` (cavolo nero) | Tuscan White Bean Soup | Low / optional |
| `Veal Cutlet` | Pork Milanese, if the dish should carry its real name | Low / optional |

**Spice-override only — zero-macro, no registry row needed** (per the project's own convention for
vinegars, fresh chilies and fresh aromatics):
- `White Wine` — Spaghetti Bolognese, Spaghetti alle Vongole, Shrimp Fra Diavolo, Shrimp Scampi (4 recipes)
- `Fresh Parsley` — Spaghetti alle Vongole, Shrimp Fra Diavolo, Shrimp Scampi (3 recipes)
- `Rosemary`, `Sage` — Tuscan White Bean Soup
- `Bay Leaf` — Minestrone Soup (already an accepted override name)
- `Fresh Basil` — Shrimp Primavera, Minestrone Soup (`Basil` already exists as a registry ingredient)

### Consolidated: ingredients this slice would stop using
Per-recipe removals. **These are removals from these recipes, not app-wide orphan calls** — I only saw
11 of the 139 recipes, so run the project's orphan sweep before deleting any registry row.
- `White Beans` — Spaghetti Bolognese
- `Ground Beef (80% lean)` — Spaghetti Bolognese (if the lean-beef swap is taken)
- `Bell Pepper` — Shrimp Primavera
- `Lemon` — Spaghetti alle Vongole
- `Shrimp` — Spaghetti alle Vongole (option (a) only)
- `Pork Loin` — Tuscan White Bean Soup, Minestrone Soup
- `Mozzarella Cheese` — Chicken Pesto Pasta
- `Tomato Sauce` — Pork Milanese
- `Panko Breadcrumbs` — Pork Milanese
- `Olive Oil` — Pork Milanese **only** (replaced by butter as the correct frying fat; this is a
  technique finding and has nothing to do with the olive ban — olive oil stays everywhere else)
- `Garlic` — Chicken Alfredo
- `Onion` — Shrimp Fra Diavolo (optional)
- `Red Lentils` — Minestrone Soup
- `Eggplant` — Minestrone Soup (optional)
- `Parmesan Cheese` — Pesto Shrimp Pasta
- Spice overrides dropped: `Oregano` (Bolognese, Tuscan soup, Minestrone), `Dried Basil` (Bolognese,
  Primavera), `Dried Parsley` (Vongole, Scampi)

### Cross-cutting notes for the owner
1. **Five of eleven are Italian-American dishes filed as Italian** — Primavera, Chicken Pesto Pasta,
   Chicken Alfredo, Fra Diavolo, Shrimp Scampi. All five are fixed by a label change alone, with no
   ingredient edits. **But note the generation consequence:** the app enforces a cuisine cap of 2 per
   week. Splitting `Italian` into `Italian` + `Italian-American` would let up to four of these appear
   in one week instead of two. That is a real behavioural change, not just a data relabel — worth
   deciding deliberately.
2. **No cream anywhere in this slice, including in the Alfredo.** The single most common
   Italian-American drift is absent, and the Alfredo actually uses the correct butter-and-parmesan
   pasta-water emulsion. Do not "fix" that.
3. **There is no carbonara in the slice**, so the guanciale/pancetta/bacon question does not arise
   there — but three other recipes want cured pork and the registry has only fresh `Pork Belly`.
4. **Repetition:** 6 of 11 recipes use `Shrimp` and 8 of 11 are pasta plates. Two near-duplicate pairs:
   `Chicken Pesto Pasta` / `Pesto Shrimp Pasta`, and `Tuscan White Bean Soup` / `Minestrone Soup`,
   which share an identical 120g-pork-loin + tomato-sauce + spinach + white-beans skeleton. The
   Ligurian potato-and-green-bean fix would de-duplicate the pesto pair.
5. **Recurring macro tension:** the two soups and the vongole fix all lose substantial protein when
   made authentic, because bean soups and clam pasta are not high-protein dishes. Authenticity cannot
   resolve that — it is a deliberate trade for the owner to make per recipe, and I have flagged the
   partial-fix option in each block.
