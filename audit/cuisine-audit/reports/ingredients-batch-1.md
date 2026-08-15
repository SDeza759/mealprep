# Ingredient research — Batch 1 (17 ingredients)

All macros are per 100 g of the RAW / as-sold ingredient. Blocks are in batch-file order.
10 registry rows, 7 zero-macro spices.

### Fish Sauce
- **Type:** `registry`
- **Macros per 100g raw:** calories: 35, carbs: 3.6, protein: 5.1, fat: 0
- **Source:** USDA FDC 174531 — "Sauce, fish, ready-to-serve"
- **Category:** Condiments & Oils
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Anchovy-based, so it is a fish allergen; also extremely high sodium (~7,850 mg/100g), which matters more than the macros.
- **Confidence:** high

### Mirin
- **Type:** `registry`
- **Macros per 100g raw:** calories: 241, carbs: 43.2, protein: 0.3, fat: 0
- **Source:** Japanese Standard Tables of Food Composition (hon-mirin, item 16025); no USDA entry exists
- **Category:** Condiments & Oils
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Energy exceeds 4×carbs because true hon-mirin is ~14% alcohol, which the app does not model. US-supermarket "aji-mirin" / mirin-style seasoning (Kikkoman) is a corn-syrup product at roughly 206–260 cal and ~41 carbs per 100 g — same ballpark, so either bottle is fine, but the label will not match exactly.
- **Confidence:** medium

### Mint
- **Type:** `spice`
- **Source:** n/a — garnish quantities, zero-macro route
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Bought as a fresh bunch. Even a heavy 10 g of leaves is ~7 cal, so the spice route loses nothing; dried mint is likewise a spice.
- **Confidence:** high

### Bacon
- **Type:** `registry`
- **Macros per 100g raw:** calories: 458, carbs: 1.3, protein: 11.6, fat: 45
- **Source:** USDA SR Legacy — "Pork, cured, bacon, unprepared" (FDC 168277; the same data also appears as 168308)
- **Category:** Meat & Seafood
- **Flesh meat?:** yes — add to the `MEAT_INGREDIENTS` Set
- **Unit-based?:** no
- **Note:** RAW basis. Bacon loses roughly 60–65% of its weight when pan-fried (cooked bacon is ~540 cal/100 g), so recipe grams must be the uncooked slice weight — a regular-cut raw slice averages ~14 g.
- **Confidence:** high

### Jalapeno
- **Type:** `spice`
- **Source:** n/a — fresh chili, zero-macro route (raw jalapeño is only ~29 cal/100 g)
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Fine as a spice at the usual 5–20 g dice (<6 cal). If a recipe ever uses jalapeño as the body of the dish (stuffed peppers, 50 g+), promote it to a registry row at 29 cal / 6.5 C / 0.9 P / 0.4 F.
- **Confidence:** high

### Rice Vinegar
- **Type:** `spice`
- **Source:** n/a — vinegar, zero-macro route (unseasoned rice vinegar is ~18 cal/100 g)
- **Category:** Condiments & Oils
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Buy UNSEASONED. "Seasoned" sushi rice vinegar has added sugar and salt and runs ~100–140 cal/100 g, which would no longer be negligible at 30 g in a sushi-rice recipe.
- **Confidence:** high

### Annatto
- **Type:** `spice`
- **Source:** n/a — dried seed/ground powder, used by the teaspoon
- **Category:** Spices & Seasonings
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Sold three ways — whole seeds, ground achiote powder, and achiote/recado paste (a block that also contains garlic, cumin, vinegar). All are pinch-to-teaspoon quantities; the paste is the easiest to find in US markets.
- **Confidence:** high

### Bulgur
- **Type:** `registry`
- **Macros per 100g raw:** calories: 342, carbs: 75.9, protein: 12.3, fat: 1.3
- **Source:** USDA FDC 170688 — "Bulgur, dry"
- **Category:** Grains & Pasta
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** DRY basis — this is exactly the raw-vs-cooked trap the project already fixed once: bulgur roughly triples in weight when cooked (~83 cal/100 g cooked). Contains gluten.
- **Confidence:** high

### Cassava Flour
- **Type:** `registry`
- **Macros per 100g raw:** calories: 359, carbs: 87, protein: 0.9, fat: 0.5
- **Source:** No USDA entry for cassava flour (USDA only has raw cassava root, 160 cal/100 g). Values are the standard published cassava-flour composition, bracketed by two mainstream US labels: Otto's Naturals (110 cal / 32 g = 344 cal/100 g) and Bob's Red Mill (130 cal / 35 g = 371 cal/100 g).
- **Category:** Grains & Pasta
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Brand variance ~±8% on calories — pick one bag and stay with it. Do NOT confuse with tapioca starch (a different, near-pure-starch extract from the same root) or with raw cassava root. Naturally gluten-free and grain-free; Otto's is explicitly nut-free, which matters given the owner's nut ban.
- **Confidence:** medium

### Dill
- **Type:** `spice`
- **Source:** n/a — fresh herb, garnish quantities
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no
- **Confidence:** high

### Flank Steak
- **Type:** `registry`
- **Macros per 100g raw:** calories: 165, carbs: 0, protein: 21.2, fat: 8.3
- **Source:** USDA SR Legacy — "Beef, flank, steak, separable lean and fat, trimmed to 0" fat, choice, raw" (FDC ID not verified)
- **Category:** Meat & Seafood
- **Flesh meat?:** yes — add to the `MEAT_INGREDIENTS` Set
- **Unit-based?:** no
- **Note:** This is the lean-and-fat (as-sold) cut, which is what a supermarket flank steak actually is. Trimmed lean-only is leaner (~146 cal, 5.5 g fat) — do not use that unless the recipe says trimmed.
- **Confidence:** high

### Karashi
- **Type:** `spice`
- **Source:** n/a — Japanese hot mustard, used in ~1 tsp dabs
- **Category:** Condiments & Oils
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Sold as dry powder (S&B tin) or ready-made tube paste; the powder is ~500 cal/100 g but the serving is 3–5 g, so the contribution rounds to nothing either way.
- **Confidence:** high

### Ogo Seaweed
- **Type:** `registry`
- **Macros per 100g raw:** calories: 26, carbs: 6.8, protein: 0.5, fat: 0
- **Source:** USDA SR Legacy — "Seaweed, agar, raw" used as a proxy (agar is made from *Gracilaria*, which is ogo); no USDA entry for ogo itself
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** FRESH/salted basis (~90% water) — this is how ogo is sold for poke. Dried ogo is roughly 10x more concentrated; if the recipe uses dried, the grams are wrong by an order of magnitude. Borderline registry-vs-spice: at a 20–30 g poke portion it contributes only ~5–8 cal.
- **Confidence:** medium

### Ramen Noodles
- **Type:** `registry`
- **Macros per 100g raw:** calories: 250, carbs: 51, protein: 9.5, fat: 1.5
- **Source:** Fresh refrigerated ramen noodles — UMI Organic label (239 cal/100 g) cross-checked against Sun Noodle Kaedama (~260 cal/100 g); no USDA entry for fresh ramen
- **Category:** Grains & Pasta
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** BIG fork in the road — this row is for FRESH refrigerated ramen. Dried instant blocks are flash-fried and run ~440 cal / 60 C / 10 P / 16.5 F per 100 g, i.e. 1.8x the calories and 11x the fat. Whichever form the recipe grams were written for has to match this row. Contains gluten.
- **Confidence:** medium

### Shichimi Togarashi
- **Type:** `spice`
- **Source:** n/a — dried seven-spice blend, shaken on at the table
- **Category:** Spices & Seasonings
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Standard blends contain sesame seeds, dried citrus peel, chili, nori and ginger — sesame is a common allergen but is NOT a nut, and no mainstream blend contains nuts.
- **Confidence:** high

### Tofu
- **Type:** `registry`
- **Macros per 100g raw:** calories: 144, carbs: 2.8, protein: 17.3, fat: 8.7
- **Source:** USDA FDC 172475 — "Tofu, raw, firm, prepared with calcium sulfate"
- **Category:** Eggs & Dairy
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** FIRM tofu basis. Firmness drives huge variance — silken/soft is ~55–62 cal and ~5 g protein per 100 g, super-firm/high-protein blocks reach ~190 cal and 24 g protein. If the app ever wants both, they need separate rows the way the two ground-beef entries are split. Soy allergen. Category is a judgment call: it lives in the refrigerated case, so Eggs & Dairy walks the store better than Produce.
- **Confidence:** high

### Worcestershire Sauce
- **Type:** `registry`
- **Macros per 100g raw:** calories: 78, carbs: 19.5, protein: 0, fat: 0
- **Source:** USDA FDC 171610 — "Sauce, worcestershire"
- **Category:** Condiments & Oils
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Contains anchovies (fish allergen) in every mainstream brand including Lea & Perrins; vegan versions exist and are close enough on macros. Sodium ~980 mg/100 g.
- **Confidence:** high
