# Ingredient research — batch 2

16 ingredients. Macros are per 100 g of the RAW/as-sold ingredient.

### Vegetable Oil
- **Type:** `registry`
- **Macros per 100g raw:** calories: 884, carbs: 0, protein: 0, fat: 100
- **Source:** USDA FDC 171412 (Oil, soybean, salad or cooking) — identical to canola/corn/blend "vegetable oil"
- **Category:** Condiments & Oils
- **Flesh meat?:** no
- **Unit-based?:** no
- **Confidence:** high

### Bean Sprouts
- **Type:** `registry`
- **Macros per 100g raw:** calories: 30, carbs: 5.9, protein: 3, fat: 0.2
- **Source:** USDA FDC 168475 (Beans, mung, mature seeds, sprouted, raw)
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Mung bean sprouts, the standard thick sprout for pad thai / bibimbap / pho. Soybean sprouts (kongnamul) are a different, denser food (~120 cal/100g) — do not substitute the number.
- **Confidence:** high

### Sugar
- **Type:** `registry`
- **Macros per 100g raw:** calories: 387, carbs: 100, protein: 0, fat: 0
- **Source:** USDA FDC 169655 (Sugars, granulated)
- **Category:** Condiments & Oils
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Registry row on purpose (spec) — used in gram quantities in sauces/marinades where the carb load is real. Brown sugar is ~380 cal with the same macro shape, so one row covers both.
- **Confidence:** high

### Cornstarch
- **Type:** `registry`
- **Macros per 100g raw:** calories: 381, carbs: 91.3, protein: 0.3, fat: 0.1
- **Source:** USDA FDC 169698 (Cornstarch)
- **Category:** Grains & Pasta
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Registry rather than spice because a 1 Tbsp (8 g) slurry is ~30 cal, above the rounds-to-nothing line. Matches the existing `Flour` row's category.
- **Confidence:** high

### Lamb Shoulder
- **Type:** `registry`
- **Macros per 100g raw:** calories: 244, carbs: 0, protein: 17.1, fat: 19
- **Source:** USDA FDC 172553 (Lamb, shoulder, whole (arm and blade), separable lean and fat, trimmed to 1/8" fat, choice, raw)
- **Category:** Meat & Seafood
- **Flesh meat?:** yes
- **Unit-based?:** no
- **Note:** Lean-and-fat basis, matching how the cut is actually sold and braised. The other USDA bases differ a lot — 1/4" trim is 264 cal / 21.4 f, lean-only is 144 cal / 6.8 f — so a trimmed-shoulder recipe would be overstated here. Sits sensibly beside the existing `Ground Lamb` (250).
- **Confidence:** high

### Sake
- **Type:** `registry`
- **Macros per 100g raw:** calories: 134, carbs: 5, protein: 0.5, fat: 0
- **Source:** USDA FDC 167723 (Alcoholic beverage, rice (sake))
- **Category:** Condiments & Oils
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Registry (not spice) to match the Mirin/Fish Sauce rule. Caveat: ~16 g/100g of this is ethanol, and most of that boils off in cooking — the as-poured 134 cal overstates what a simmered dish delivers by roughly two-thirds. Carbs (5 g) are the part that stays.
- **Confidence:** high

### Baking Powder
- **Type:** `spice`
- **Source:** USDA FDC 172805 (Leavening agents, baking powder, double-acting, sodium aluminum sulfate) — 53 cal/100g, essentially all from starch filler
- **Category:** Spices & Seasonings
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Spice route: a full teaspoon is ~4 g, i.e. 2 cal. Zero macros loses nothing.
- **Confidence:** high

### Butter Lettuce
- **Type:** `registry`
- **Macros per 100g raw:** calories: 13, carbs: 2.2, protein: 1.4, fat: 0.2
- **Source:** USDA FDC 168429 (Lettuce, butterhead (includes boston and bibb types), raw)
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Butterhead = Boston/Bibb. Distinct from the existing `Romaine Lettuce` row, though at 13 cal/100g the difference is nutritionally cosmetic — the reason to keep both is that lettuce cups and salads are not interchangeable in the recipes.
- **Confidence:** high

### Clams
- **Type:** `registry`
- **Macros per 100g raw:** calories: 86, carbs: 3.6, protein: 14.7, fat: 1
- **Source:** USDA FDC 174214 (Mollusks, clam, mixed species, raw)
- **Category:** Meat & Seafood
- **Flesh meat?:** yes
- **Unit-based?:** no
- **Note:** Shellfish allergen. Weight is SHUCKED meat, not in-shell — live clams in the shell yield only ~25-30% meat, so a recipe calling for 150 g of clam meat is ~500-600 g at the fish counter. Say which in the cooking step. (This value is the current FDC figure; older SR28 tables list 74 cal / 12.8 protein.)
- **Confidence:** high

### Doenjang
- **Type:** `registry`
- **Macros per 100g raw:** calories: 170, carbs: 20, protein: 13, fat: 4
- **Source:** Chung Jung One Sunchang Doenjang label (USDA FDC 2067532), cross-checked against Sempio and Haechandle labels
- **Category:** Condiments & Oils
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Non-USDA-standard: no SR Legacy entry exists, and the FDC Branded rows for doenjang are mis-scaled (they report per-serving numbers in the per-100g field, giving impossible values like 557-1733 cal/100g); dividing by the serving factor reconciles them with the physical labels, which is how this number was derived. Brand variance is real — 125-190 cal/100g across Chung Jung One, Sempio and Haechandle. Soy, and many brands also contain wheat; no nut concern. Sodium is very high (~3,800 mg/100g) if that ever matters. Sits beside the existing `Miso Paste` (199) as expected — doenjang is coarser and less sweet.
- **Confidence:** medium

### Flour Tortilla
- **Type:** `registry`
- **Macros per 100g raw:** calories: 297, carbs: 49.3, protein: 8, fat: 7.6
- **Source:** USDA FDC 167535 (Tortillas, ready-to-bake or -fry, flour, shelf stable)
- **Category:** Bakery & Bread
- **Flesh meat?:** no
- **Unit-based?:** yes — 45 g per 8-inch (soft taco / fajita) tortilla
- **Note:** Shelf-stable basis, i.e. the bagged supermarket product, rather than the refrigerated dough entry (306 cal). Size drives the unit weight hard: 6-inch ~30 g, 8-inch ~45 g, 10-inch burrito ~70 g — pick the recipe's size deliberately. Note the app already has `Corn Tortillas` (plural) at 30 g and `Whole Wheat Tortilla` (singular) at 35 g; this name is singular per the batch file, so add it to `UNIT_INGREDIENTS` in that exact form.
- **Confidence:** high

### Kidney Beans
- **Type:** `registry`
- **Macros per 100g raw:** calories: 337, carbs: 61.3, protein: 22.5, fat: 1.1
- **Source:** USDA FDC 173744 (Beans, kidney, red, mature seeds, raw)
- **Category:** Canned & Legumes
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** DRY raw seed, the trap this project already fixed once — boiled kidney beans are 127 cal/100g and canned/drained ~124, so a cooked-basis number would understate calories ~2.7x. This value is consistent with the existing dry-basis `Black Beans` (341) and `Chickpeas` (378). If a recipe is written against a drained can, its grams must be divided by ~2.7 to stay on the registry's dry basis.
- **Confidence:** high

### Orange
- **Type:** `registry`
- **Macros per 100g raw:** calories: 47, carbs: 11.8, protein: 0.9, fat: 0.1
- **Source:** USDA FDC 169097 (Oranges, raw, all commercial varieties)
- **Category:** Fruit
- **Flesh meat?:** no
- **Unit-based?:** yes — 130 g per medium orange (edible flesh)
- **Note:** 130 g is the EDIBLE portion; a medium orange weighs ~154 g whole, the difference being peel. Follow whichever convention the existing rows use — `Lime`/`Lemon` carry 15 g in `UNIT_INGREDIENTS` (juice actually used) but 70/100 g in `GROCERY_COUNTABLE` (whole fruit bought), so an orange eaten as fruit wants ~130 g in both, while an orange used only for juice/zest wants a much smaller `UNIT_INGREDIENTS` figure.
- **Confidence:** high

### Saffron
- **Type:** `spice`
- **Source:** USDA FDC 170935 (Spices, saffron) — 310 cal/100g, irrelevant at the quantities used
- **Category:** Spices & Seasonings
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** A generous pinch for a paella or biryani is ~0.05-0.1 g, i.e. well under half a calorie. Clear spice route. Worth a cooking-step mention that the threads get bloomed in warm liquid first, since that is where the color comes from.
- **Confidence:** high

### Shiitake Mushroom
- **Type:** `registry`
- **Macros per 100g raw:** calories: 34, carbs: 6.8, protein: 2.2, fat: 0.5
- **Source:** USDA FDC 169242 (Mushrooms, shiitake, raw)
- **Category:** Produce
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** FRESH raw shiitake. Dried shiitake (FDC 168436) is a completely different row at 296 cal/100g — nearly 9x — so if a recipe means the dried, rehydrated kind, it must not reference this name. Dried caps roughly quadruple in weight when soaked.
- **Confidence:** high

### Toor Dal
- **Type:** `registry`
- **Macros per 100g raw:** calories: 343, carbs: 62.8, protein: 21.7, fat: 1.5
- **Source:** USDA FDC 172436 (Pigeon peas (red gram), mature seeds, raw)
- **Category:** Canned & Legumes
- **Flesh meat?:** no
- **Unit-based?:** no
- **Note:** Toor dal is split, hulled pigeon peas; USDA only carries the whole mature seed, and packet labels for the split form run ~335-350 cal with the same macro shape, so the USDA figure stands in cleanly. DRY basis — cooked dal is ~121 cal/100g, a ~2.8x gap. Oiled toor dal (a common South Asian pack type, rubbed with oil to extend shelf life) reads a few grams higher in fat; rinse-and-soak recipes are unaffected enough to ignore.
- **Confidence:** high
