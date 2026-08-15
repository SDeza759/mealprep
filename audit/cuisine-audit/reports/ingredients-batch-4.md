# Ingredient research — batch 4

16 ingredients. Macros are per 100 g of the RAW ingredient unless the Note says otherwise.

### Parsley
- **Type:** `registry`
- **Macros per 100g raw:** calories: 36, carbs: 6.3, protein: 3, fat: 0.8
- **Source:** USDA FDC 170416 (Parsley, fresh, raw)
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no (sold by the bunch, ~60 g per bunch; used by weight)
- **Note:** This is FRESH flat-leaf/curly parsley, matching the existing fresh `Basil` (23) and `Cilantro` (23) registry rows. The registry already has a separate `Dried Parsley` zero-macro spice used by 4 recipes — these are different entries and must not be merged; dried parsley is ~292 cal/100g but is used at 1–2 g.
- **Confidence:** high

### Chipotle Powder
- **Type:** `spice`
- **Source:** USDA FDC 171329 (Spices, pepper, red or cayenne) as the closest basis; chipotle powder is smoke-dried jalapeño, ~318 cal/100g dry, used at 1–3 g
- **Category:** Spices & Seasonings
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Ground dried chile, used in 1–3 g pinches (<5 cal), so it belongs in `RECIPE_SPICE_OVERRIDES`, not the registry. Some supermarket "chipotle powder" is a blend cut with salt/garlic/anti-caking agents rather than pure chile — brand variance affects flavor and sodium, not the (zero) macros.
- **Confidence:** high

### Asian Pear
- **Type:** `registry`
- **Macros per 100g raw:** calories: 42, carbs: 10.7, protein: 0.5, fat: 0.2
- **Source:** USDA FDC 168177 (Pears, asian, raw)
- **Category:** Fruit
- **Flesh meat?:** no
- **Unit-based?:** no — bought individually (~275 g per medium fruit, USDA reference weight) but used by weight, typically grated into a marinade
- **Note:** ~275 g/unit is worth adding to `GROCERY_COUNTABLE` so the list says "1 Asian pear" rather than a gram figure. Nashi/apple pear are the same fruit; do not substitute the European pear row (57 cal/100g) — Asian pear is meaningfully lower.
- **Confidence:** high

### Guajillo Chile
- **Type:** `spice`
- **Source:** no USDA entry for guajillo specifically; nearest is USDA SR Legacy "Peppers, hot chile, sun-dried" (~324 cal/100g dry)
- **Category:** Spices & Seasonings
- **Flesh meat?:** no
- **Unit-based?:** no (sold in bags of whole dried pods, ~10 g per pod)
- **Note:** Whole dried mirasol chile, toasted and blended into adobos/salsas at 2–3 pods (~20–30 g dry) for a 4-serving batch. That is genuinely ~20 cal/serving at the top of the range, but the pods are usually strained out after blending and only the paste is eaten, so the zero-macro spice route is the honest call. If a recipe blends the pods in whole and keeps everything, treat 100 g dry as ~324 cal / 70 g carb / 10.6 g protein / 5.8 g fat.
- **Confidence:** medium

### Pork Shoulder
- **Type:** `registry`
- **Macros per 100g raw:** calories: 186, carbs: 0, protein: 17.7, fat: 12.4
- **Source:** USDA FDC 167849 (Pork, fresh, shoulder, (Boston butt), blade (steaks), separable lean and fat, raw)
- **Category:** Meat & Seafood
- **Flesh meat?:** yes
- **Unit-based?:** no
- **Note:** RAW basis, lean-and-fat, which is how a Boston butt is actually sold. Cooked/braised is ~269 cal/100g — do not use that number. This is a much fattier cut than the existing `Pork Loin` row (143 cal, 26 P, 3.5 F); the two are not interchangeable and carnitas/pernil recipes should point here.
- **Confidence:** high

### Ancho Chile
- **Type:** `spice`
- **Source:** USDA SR Legacy "Peppers, ancho, dried" — ~281 cal/100g dry
- **Category:** Spices & Seasonings
- **Flesh meat?:** no
- **Unit-based?:** no (whole dried pods, ~15 g per pod)
- **Note:** Dried poblano. Same reasoning as Guajillo: rehydrated and blended into a sauce base at 2–3 pods per batch, usually strained. As a registry row it would be ~281 cal / 51.4 g carb / 12.3 g protein / 8.2 g fat per 100 g dry. Ancho powder (ground) is the same food and also belongs in the spice list.
- **Confidence:** medium

### Breadcrumbs
- **Type:** `registry`
- **Macros per 100g raw:** calories: 395, carbs: 72, protein: 13.4, fat: 5.3
- **Source:** USDA SR Legacy "Bread crumbs, dry, grated, plain" (FDC 172700)
- **Category:** Bakery & Bread
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Dry as-sold basis (they are never wet-weighed), so no raw/cooked trap. The registry already has `Panko Breadcrumbs` (374 / 73.4 / 10.7 / 2.3) — this is the separate finer plain/Italian style, denser per cup and higher in fat and sodium (~730 mg/100g). Keep both rows; they are not interchangeable in a breading recipe. GLUTEN: wheat-based; also commonly milk-containing if "Italian seasoned". Not a nut risk.
- **Confidence:** high

### Caraway
- **Type:** `spice`
- **Source:** USDA SR Legacy "Spices, caraway seed" (~333 cal/100g dry)
- **Category:** Spices & Seasonings
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Whole or ground seed, used at 1–3 g (rye bread, sauerkraut, harissa, goulash). Caraway is a carrot-family seed, not a nut — no allergen issue.
- **Confidence:** high

### Daikon
- **Type:** `registry`
- **Macros per 100g raw:** calories: 18, carbs: 4.1, protein: 0.6, fat: 0.1
- **Source:** USDA FDC 168451 (Radishes, oriental, raw)
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no — sold as a whole root (~340 g each) but always used by weight
- **Note:** Registry row rather than spice because daikon is used in real quantity (80–150 g in a banchan, salad, or simmered dish), even though the calories are tiny. Raw basis; simmered daikon loses water and concentrates slightly, but the app stores raw.
- **Confidence:** high

### Epazote
- **Type:** `spice`
- **Source:** no USDA entry; herb used at sprig quantities (1–3 g dried, one sprig fresh ~2 g)
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no (sold as a fresh bunch or dried in the Latin spice aisle)
- **Note:** Categorized Produce to match the app's existing fresh-seasoning convention (`Aji Limo` is Produce), but it is frequently only available dried — if the grocery list should send the user to the spice aisle instead, move it to Spices & Seasonings. Classic use is one sprig per pot of black beans, so the macro contribution is nil.
- **Confidence:** high

### Kale
- **Type:** `registry`
- **Macros per 100g raw:** calories: 49, carbs: 8.8, protein: 4.3, fat: 0.9
- **Source:** USDA FDC 168421 (Kale, raw — SR Legacy)
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no (sold by the bunch, ~200 g; bagged pre-chopped also common)
- **Note:** USDA has two conflicting entries — SR Legacy 168421 at 49 cal (4.3 P) and the newer Foundation Foods re-analysis (FDC 323505) at 35 cal / 4.4 C / 2.9 P / 1.5 F. I chose SR Legacy because every existing registry row (Spinach 23, Basil 23, Cilantro 23) is on the SR Legacy basis, and mixing the two would make leafy greens inconsistent. Flag if the project would rather standardize on Foundation Foods.
- **Confidence:** medium (numbers are exact; the source-version choice is a judgment call)

### Mustard Greens
- **Type:** `registry`
- **Macros per 100g raw:** calories: 27, carbs: 4.7, protein: 2.9, fat: 0.4
- **Source:** USDA FDC 169256 (Mustard greens, raw)
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no (sold by the bunch, ~150 g)
- **Note:** RAW entry (169256), not the boiled-and-drained one (169257) at 26 cal — they look nearly identical per 100 g but the cooked entry represents ~2.5x the starting leaf weight, exactly the trap that bit the seven legume/pasta rows. Also distinct from `Mustard` the condiment and from mustard seed.
- **Confidence:** high

### Perilla Leaves
- **Type:** `spice`
- **Source:** no USDA entry; Korean/Japanese food-composition tables put raw kkaennip/shiso at ~37 cal/100g, and the published macro splits disagree with each other
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** yes — bought and used as countable leaves, ~3 g per leaf (a bunch is ~20 leaves / 60 g)
- **Note:** Routed to spice deliberately: 2–5 leaves per serving is 6–15 g, so under 6 cal, and the only available macro splits conflict (one source gives 7 g carb / 0 g protein, another 0.39 g protein per 10 g). If a recipe ever uses them as a bulk green (e.g. kkaennip jangajji, 30 g+), promote to a registry row and re-source the split first. Not a nut; perilla SEED and perilla OIL are different products and neither is implied here.
- **Confidence:** medium

### Shallot
- **Type:** `registry`
- **Macros per 100g raw:** calories: 72, carbs: 16.8, protein: 2.5, fat: 0.1
- **Source:** USDA FDC 170499 (Shallots, raw)
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no — sold loose/netted and used by weight; ~40 g per medium shallot if a countable unit is wanted
- **Note:** Nearly twice the calories and carbs of the existing `Onion` row (40 / 9.3) because shallots are denser and sweeter — do not treat as an onion substitute in the solver. This closes half of the documented `Pan-Seared Duck` fallback in the data backlog.
- **Confidence:** high

### Sumac
- **Type:** `spice`
- **Source:** no USDA entry; ground dried Rhus coriaria drupes, used at 1–3 g
- **Category:** Spices & Seasonings
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** ALLERGEN FLAG — sumac is in the Anacardiaceae family alongside cashew, pistachio and mango, and case reports document cashew–sumac cross-reactivity. It is botanically a drupe, not a tree nut, and is not covered by any nut ban on its own, but given this app's hard no-nuts rule the owner should confirm before it goes into recipes. Separately, some bulk sumac is packed by nut retailers (shared facility) and most bagged sumac is cut with salt — buy a pure, dedicated-facility jar. Pre-mixed za'atar is a different product (contains sesame, sometimes nuts).
- **Confidence:** high

### Vanilla Extract
- **Type:** `spice`
- **Source:** USDA FDC 173470 (Vanilla extract) — 288 cal, 12.7 carbs, 0.1 protein, 0.1 fat per 100 g, if it is ever promoted to a registry row
- **Category:** Spices & Seasonings
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Borderline call, resolved toward spice per the spec: 288 cal/100g is real, but a recipe uses 2–5 g (½–1 tsp), i.e. 6–14 cal spread across the batch — usually under 5 cal/serving. This is NOT the Fish Sauce / Mirin / Sugar case; those go in at 15–30 g. Most of the calories are ethanol (~35% ABV), so imitation vanilla and alcohol-free extracts differ substantially by brand. Promote to a registry row only if a dessert recipe uses 10 g+.
- **Confidence:** high
