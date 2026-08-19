// One-shot: append the 33 packaged ingredients added since the S10 audit (S11 Peruvian
// rebuild + S14/S15 cuisine audit) to records.json. Run once, then build.js owns the file.
//
// Method matches the original audit: Amazon product pages do not render their nutrition
// label to a fetcher, so each row pairs a real Amazon listing (provenance) with a label
// read from a nutrition aggregator (values). "ours" is not stored — build.js reads the
// live registry.
const fs = require("fs");
const path = require("path");

const A = (url, label) => ({ url, label });

const NEW = [
  // ---------------- Bakery & Bread ----------------
  {
    name: "Breadcrumbs", category: "Bakery & Bread",
    source: "aggregator", confidence: "medium", form: "as-sold", formMismatch: false,
    serving: 33, label: { calories: 130, carbs: 26, protein: 3, fat: 1.5 },
    notes: "Progresso Plain, the default plain breadcrumb on Amazon. Calories land within 0.3% of our USDA plain-dry data, but the label's protein is a third lower (9.1 vs 13.4 per 100g) — Progresso is a white-bread crumb where USDA's row is a mixed-grain average. Distinct from our separate Panko Breadcrumbs row.",
    links: [
      A("https://www.amazon.com/Progresso-Plain-Bread-Crumbs-Canister/dp/B00099XO5U", "Progresso Plain Bread Crumbs, 15 oz canister (Amazon)"),
      A("https://www.amazon.com/Progresso-Plain-Bread-Crumbs-Ounce/dp/B003TL1ZNI", "Progresso Plain Bread Crumbs, 15 oz (Amazon)"),
      A("https://www.myfooddiary.com/foods/825936/progresso-plain-bread-crumbs", "Progresso Plain Bread Crumbs label (MyFoodDiary)"),
    ],
  },
  {
    name: "Flour Tortilla", category: "Bakery & Bread",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 49, label: { calories: 150, carbs: 24, protein: 3, fat: 4.5 },
    notes: "Mission Soft Taco, the volume leader. One tortilla is 49g on the label against the 45g/unit our registry comment assumes, so a recipe counting units is understating by ~9%. Carbs match almost exactly; the label runs leaner on protein and fattier than our USDA row.",
    links: [
      A("https://www.amazon.com/Mission-Flour-Tortillas-Trans-Authentic/dp/B004XJLYRM", "Mission Soft Taco Flour Tortillas, 10 count (Amazon)"),
      A("https://www.nutritionvalue.org/Soft_taco_flour_tortillas_by_Mission_Foods_Inc_1611248_nutritional_value.html", "Mission Soft Taco Flour Tortillas label (NutritionValue)"),
    ],
  },

  // ---------------- Canned & Legumes ----------------
  {
    name: "Canned Tuna", category: "Canned & Legumes",
    source: "aggregator", confidence: "medium", form: "as-sold", formMismatch: false,
    serving: 74, label: { calories: 70, carbs: 0, protein: 17, fat: 0.5 },
    notes: "StarKist Chunk Light in water, drained — the same basis as our row. Protein agrees to within 1%, which is the number that matters here; calories run ~12% under ours because USDA's drained figure carries more residual fat than the label admits. Tuna in oil would roughly double both.",
    links: [
      A("https://www.amazon.com/s?k=starkist+chunk+light+tuna+in+water", "StarKist Chunk Light Tuna in Water (Amazon search)"),
      A("https://www.nutritionvalue.org/Starkist%2C_chunk_light_tuna_in_water_by_STARKIST_386162_nutritional_value.html", "StarKist Chunk Light Tuna in Water label (NutritionValue)"),
      A("https://starkist.com/product/chunk-light-tuna-in-water-can/", "StarKist Chunk Light Tuna in Water (manufacturer)"),
    ],
  },
  {
    name: "Grape Leaves", category: "Canned & Legumes",
    source: "aggregator", confidence: "low", form: "as-sold", formMismatch: false,
    serving: 8, label: { calories: 5, carbs: 1, protein: 0, fat: 0 },
    notes: "Krinos in vinegar brine — plain leaves, NOT the stuffed dolma that dominates Amazon search (those are ~190cal/100g and a different food). Carbs match our USDA row exactly. Protein and fat read -100% only because a 2-leaf 8g serving rounds everything under 0.5g to zero; treat those two deltas as label rounding, not evidence.",
    links: [
      A("https://www.amazon.com/Krinos-Grape-Leaves-Vinegar-Brine/dp/B01B02CF6S", "Krinos Imported Grape Leaves in Vinegar Brine, 16 oz (Amazon)"),
      A("https://www.amazon.com/Krinos-Gourmet-Leaves-Vinegar-Ounces/dp/B000LRFY7Q", "Krinos Gourmet Grape Leaves in a Jar, 16 oz (Amazon)"),
      A("https://tools.myfooddata.com/nutrition-facts/408944/wt1", "Krinos Grape Leaves in Vinegar Brine label (MyFoodData)"),
    ],
  },
  {
    name: "Green Lentils", category: "Canned & Legumes",
    source: "aggregator", confidence: "high", form: "dry", formMismatch: false,
    serving: 45, label: { calories: 160, carbs: 29, protein: 10, fat: 0.5 },
    notes: "Bob's Red Mill green lentils, dry — same basis as our row. Everything agrees inside 10%, confirming the S15 decision to give green lentils the same USDA numbers as Red Lentils and split them on culinary grounds only.",
    links: [
      A("https://us.amazon.com/Bobs-Red-Mill-LENTIL-GREEN/dp/B09PMLLSFG", "Bob's Red Mill Green Lentils, 24 oz (Amazon)"),
      A("https://www.amazon.com/Bobs-Red-Mill-Petite-Lentils/dp/B084J5YGZJ", "Bob's Red Mill Petite French Green Lentils, 24 oz (Amazon)"),
      A("https://www.myfooddiary.com/foods/5053636/bobs-red-mill-green-lentils", "Bob's Red Mill Green Lentils label (MyFoodDiary)"),
    ],
  },
  {
    name: "Kidney Beans", category: "Canned & Legumes",
    source: "aggregator", confidence: "medium", form: "canned", formMismatch: true,
    serving: 123, label: { calories: 110, carbs: 21, protein: 8, fat: 0 },
    notes: "Goya's only published kidney-bean label is the drained can, while our row is DRY — hence the ~73% gap, which is water, not a data error. It is still worth reading: at 89cal/100g drained vs 337 dry, a recipe that means canned beans and uses dry grams triples the entry. The registry comment already warns of the ~2.7x factor.",
    links: [
      A("https://www.amazon.com/Goya-Kidney-Beans-Red-Pound/dp/B004XHLAGO", "Goya Red Kidney Beans, Dry, 1 lb (Amazon — matches our dry row)"),
      A("https://www.amazon.com/Goya-Kidney-Beans-15-5-ounces/dp/B0004MZ28O", "Goya Red Kidney Beans, 15.5 oz can (Amazon — the labelled form)"),
      A("https://www.myfooddiary.com/foods/5126848/goya-red-kidney-beans", "Goya Red Kidney Beans (canned) label (MyFoodDiary)"),
    ],
  },
  {
    name: "Toor Dal", category: "Canned & Legumes",
    source: "aggregator", confidence: "high", form: "dry", formMismatch: false,
    serving: 35, label: { calories: 120, carbs: 22, protein: 8, fat: 0.5 },
    notes: "Swad toor dal, dry — the standard Indian-grocery brand. Calories and carbs match our USDA dry row to within 0.2%, the closest agreement of any row added this pass. Cooked toor dal is ~121cal/100g, so the dry basis must be preserved.",
    links: [
      A("https://www.amazon.com/s?k=swad+toor+dal", "Swad Toor Dal, split pigeon peas (Amazon search)"),
      A("https://www.nutritionvalue.org/Toor_dal_%28split_pigeon_peas%29_by_SWAD_565000_nutritional_value.html", "Swad Toor Dal label (NutritionValue)"),
    ],
  },

  // ---------------- Condiments & Oils ----------------
  {
    name: "Aji Amarillo Paste", category: "Condiments & Oils",
    source: "aggregator", confidence: "low", form: "as-sold", formMismatch: false,
    serving: 14, label: { calories: 5, carbs: 0, protein: 0, fat: 0 },
    notes: "Doña Isabel, the brand our registry line already cites. Calories match to within 1%, vindicating the S11 anchor. Carbs, protein and fat all read -100% purely because a 14g serving rounds every macro under 0.5g to zero — the label cannot resolve them, so it is no evidence against our USDA-chili-derived values.",
    links: [
      A("https://www.amazon.com/Isabel-Amarillo-Molido-Yellow-Pepper/dp/B00BKAFS2Y", "Doña Isabel Aji Amarillo Molido, 7.5 oz (Amazon)"),
      A("https://www.amazon.com/Goya-Yellow-Hot-Pepper-Paste/dp/B07NDXY8QG", "Goya Aji Amarillo Yellow Hot Pepper Paste, 7.5 oz (Amazon)"),
      A("https://www.nutritionvalue.org/Aji_amarillo_yellow_hot_pepper_paste_by_DONA_ISABEL_570087_nutritional_value.html", "Doña Isabel Aji Amarillo label (NutritionValue)"),
    ],
  },
  {
    name: "Doenjang", category: "Condiments & Oils",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 30, label: { calories: 50, carbs: 6, protein: 4, fat: 1 },
    notes: "Chung Jung One Sunchang, one of the three brands the S14 registry line was reconciled from. Every macro lands within 20% and calories within 2%, so the derived row holds up. Sodium remains the real story at ~1150mg per 30g serving.",
    links: [
      A("https://us.amazon.com/Chung-Jung-One-Sunchang-Doenjang/dp/B004JHL5IG", "Chung Jung One O'Food Doenjang Soybean Paste (Amazon)"),
      A("https://www.amazon.com/Chung-Jung-One-Sunchang-Traditional/dp/B01MYE73DS", "Chung Jung One Doenjang, 1.1 lb / 500g (Amazon)"),
      A("https://tools.myfooddata.com/nutrition-facts/464050/wt1", "Chung Jung One Sunchang Doenjang label (MyFoodData)"),
    ],
  },
  {
    name: "Dry Sherry", category: "Condiments & Oils",
    source: "none", confidence: "low", form: "as-sold", formMismatch: false,
    serving: null, label: null,
    notes: "No comparison possible. Alcoholic beverages are exempt from FDA nutrition labelling, so no sherry bottle carries a Nutrition Facts panel, and Amazon does not retail drinking sherry in most states. Our 116cal/100g is USDA and is mostly ethanol, which the app does not model as a macro. Nothing to decide against — keep ours by default.",
    links: [
      A("https://www.amazon.com/s?k=dry+sherry+cooking+wine", "Dry sherry (Amazon search — returns salted cooking sherry, a different product at ~83cal)"),
    ],
  },
  {
    name: "Duck Fat", category: "Condiments & Oils",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 14, label: { calories: 130, carbs: 0, protein: 0, fat: 14 },
    notes: "EPIC rendered duck fat. Fat matches at 100g/100g; the +5% calorie gap is pure label rounding — 14g of fat is 126cal, printed as 130. Same artifact as the existing olive and sesame oil rows, in the opposite direction. Recipes should still record only the fat actually eaten, not confit poaching fat.",
    links: [
      A("https://www.amazon.com/Epic-Animal-Fats-Duck-Count/dp/B01B8V7ACA", "EPIC Provisions Rendered Duck Fat, 11 oz jar (Amazon)"),
      A("https://tools.myfooddata.com/nutrition-facts/2109539/wt1", "EPIC Traditional Duck Fat label (MyFoodData)"),
    ],
  },
  {
    name: "Fish Sauce", category: "Condiments & Oils",
    source: "aggregator", confidence: "medium", form: "as-sold", formMismatch: false,
    serving: 15, label: { calories: 16, carbs: 2, protein: 2, fat: 0 },
    notes: "THE BIGGEST GAP IN THIS BATCH. Three Crabs reads 107cal/100g against our USDA 35 — a 3x understatement — and Red Boat is in the same range (15cal per 15ml tbsp). Real bottles carry added sugar and far more dissolved protein than USDA's generic row. Our fish sauce entry is very likely too low.",
    links: [
      A("https://www.amazon.com/Three-Crabs-Brand-24-Ounce-Bottle/dp/B001OQWK0W", "Three Crabs Brand Fish Sauce, 24 oz (Amazon)"),
      A("https://www.nutritionvalue.org/Fish_sauce_by_THREE_CRABS_BRAND_497393_nutritional_value.html", "Three Crabs Fish Sauce label (NutritionValue)"),
      A("https://www.recipal.com/ingredients/21121-nutrition-facts-calories-protein-carbs-fat-red-boat-fish-sauce", "Red Boat Fish Sauce label (Recipal) — corroborates the higher basis"),
    ],
  },
  {
    name: "Mayonnaise", category: "Condiments & Oils",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 13, label: { calories: 90, carbs: 0, protein: 0, fat: 10 },
    notes: "Hellmann's Real, the category default. Calories and fat agree within 3%; the -100% carb and protein deltas are the 13g serving rounding 0.08g and 0.13g down to zero. One of the cleanest matches in the audit.",
    links: [
      A("https://www.amazon.com/Hellmanns-Real-Mayonnaise-30-oz/dp/B000LQTTVY", "Hellmann's Real Mayonnaise, 30 fl oz (Amazon)"),
      A("https://tools.myfooddata.com/nutrition-facts/1195723/wt1", "Hellmann's Real Mayonnaise label (MyFoodData)"),
    ],
  },
  {
    name: "Mirin", category: "Condiments & Oils",
    source: "aggregator", confidence: "medium", form: "as-sold", formMismatch: false,
    serving: 15, label: { calories: 35, carbs: 8, protein: 0, fat: 0 },
    notes: "Kikkoman Aji-Mirin. Calories match within 3%, but the label carries ~23% more carbohydrate — Aji-Mirin is a sweetened mirin-style seasoning with added corn syrup, not the hon-mirin our USDA-adjacent row describes. The label's 15ml is treated as 15g here; mirin is ~1.1 g/ml, so the per-100g figures run slightly high.",
    links: [
      A("https://www.amazon.com/s?k=kikkoman+aji+mirin", "Kikkoman Aji-Mirin Sweet Cooking Rice Wine (Amazon search)"),
      A("https://foods.fatsecret.com/calories-nutrition/kikkoman/manjo-aji-mirin", "Kikkoman Manjo Aji-Mirin label (FatSecret)"),
    ],
  },
  {
    name: "Nori", category: "Condiments & Oils",
    source: "aggregator", confidence: "low", form: "as-sold", formMismatch: false,
    serving: 2.6, label: { calories: 10, carbs: 1, protein: 1, fat: 0 },
    notes: "gimme organic sushi nori. Calories and protein both land within 8% of our dried-sheet row, which is the important confirmation — the S14 warning that USDA 'laver, raw' (35cal) is WET and a ~10x trap holds. Low confidence only because the 2.6g sheet weight is derived from pack weight over sheet count, and every macro on a 2.6g serving is heavily rounded.",
    links: [
      A("https://www.amazon.com/Seaweed-Premium-Organic-Gluten-Free-Restaurant-style/dp/B01ESBNFGC", "gimme Organic Sushi Nori Sheets, 0.81 oz (Amazon)"),
      A("https://www.amazon.com/ORGANIC-Premium-Roasted-Organic-Seaweed/dp/B00I01ZXYE", "ONE ORGANIC Sushi Nori, 50 full sheets (Amazon)"),
      A("https://gimmeseaweed.com/products/organic-sushi-nori-seaweed-sheets", "gimme Organic Sushi Nori (manufacturer label)"),
    ],
  },
  {
    name: "Palm Oil (Dendê)", category: "Condiments & Oils",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 14, label: { calories: 130, carbs: 0, protein: 0, fat: 14 },
    notes: "Nutiva unrefined red palm oil — the dendê used in Bahian cooking. Fat is exactly 100g/100g as ours has it; the +5% calorie delta is the same 14g-serving rounding that inflates the duck fat row. No action indicated.",
    links: [
      A("https://www.amazon.com/Nutiva-Organic-Trade-Certified-Ounce/dp/B00CLZ1QR8", "Nutiva Organic Red Palm Oil, Virgin, 15 fl oz (Amazon)"),
      A("https://www.amazon.com/Nutiva-Certified-Cold-Filtered-Unrefined-Ecuadorian/dp/B00JJ1E83G", "Nutiva Organic Fair-Trade Ecuadorian Red Palm Oil, 15 oz (Amazon)"),
      A("https://www.eatthismuch.com/calories/red-palm-oil-unrefined-2073640", "Nutiva Red Palm Oil, unrefined label (Eat This Much)"),
    ],
  },
  {
    name: "Sake", category: "Condiments & Oils",
    source: "none", confidence: "low", form: "as-sold", formMismatch: false,
    serving: null, label: null,
    notes: "No comparison possible — drinking sake is an alcoholic beverage, exempt from FDA nutrition labelling and not retailed by Amazon in most states. Our 134cal/100g is USDA as-poured and is largely ethanol, most of which boils off in a simmered dish. Labelled cooking sake exists but is salted and a different product.",
    links: [
      A("https://www.amazon.com/s?k=cooking+sake+ryorishu", "Cooking sake / ryorishu (Amazon search — salted, not the same as drinking sake)"),
    ],
  },
  {
    name: "Sugar", category: "Condiments & Oils",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 4, label: { calories: 15, carbs: 4, protein: 0, fat: 0 },
    notes: "Granulated cane sugar, any brand — the label is identical across the category. Carbohydrate is exactly 100g/100g as ours has it; the -3% calorie delta is the 4g teaspoon rounding 15.5cal to 15. Nothing to fix.",
    links: [
      A("https://www.amazon.com/Imperial-Sugar-Granulated-25-Pound/dp/B007SNIK68", "Imperial Sugar Granulated, 25 lb (Amazon)"),
      A("https://www.amazon.com/White-Granulated-Sugar/b?ie=UTF8&node=23656497011", "White granulated sugar (Amazon category)"),
    ],
  },
  {
    name: "Tonkatsu Sauce", category: "Condiments & Oils",
    source: "aggregator", confidence: "medium", form: "as-sold", formMismatch: false,
    serving: 15, label: { calories: 25, carbs: 6, protein: 0, fat: 0 },
    notes: "Bull-Dog, the exact brand our registry line cites as its basis — yet the label reads 167cal/100g against our 127, a 31% gap. Worth a look: the S14 note says Kikkoman and Shirakiku run 140-170, so 127 may sit below the whole brand range. The label's 15ml is treated as 15g; the sauce is ~1.15 g/ml, which would pull the per-100g figures down toward 145.",
    links: [
      A("https://www.amazon.com/Bull-Dog-Bull-Dog-Tonkatsu-Sauce/dp/B0002IZD1G", "Bull-Dog Tonkatsu Sauce (Amazon)"),
      A("https://tools.myfooddata.com/nutrition-facts/2455990/wt1", "Bull-Dog Vegetable & Fruit Tonkatsu Sauce label (MyFoodData)"),
      A("https://foods.fatsecret.com/calories-nutrition/bull-dog/vegetable-fruit-sauce-(tonkatsu-sauce)", "Bull-Dog Tonkatsu Sauce label (FatSecret)"),
    ],
  },
  {
    name: "Vegetable Oil", category: "Condiments & Oils",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 14, label: { calories: 120, carbs: 0, protein: 0, fat: 14 },
    notes: "Amazon Grocery vegetable oil. Identical in every respect to the existing Olive Oil and Sesame Oil rows, including the -3% calorie artifact from a 14g serving printed as 120cal. Fat is exact. No action indicated.",
    links: [
      A("https://www.amazon.com/Amazon-Brand-Vegetable-Gallon-Ounces/dp/B07MK2XKKV", "Amazon Grocery Vegetable Oil, 128 fl oz (Amazon)"),
      A("https://www.amazon.com/Crisco-Pure-Vegetable-Oil-Gallon/dp/B0BF48VJB6", "Crisco Pure Vegetable Oil, 1 gallon (Amazon)"),
    ],
  },
  {
    name: "White Wine", category: "Condiments & Oils",
    source: "none", confidence: "low", form: "as-sold", formMismatch: false,
    serving: null, label: null,
    notes: "No comparison possible — wine is exempt from FDA nutrition labelling and Amazon does not retail it in most states. Our 82cal/100g is USDA as-poured and is mostly ethanol, which the app does not model and which largely cooks off. Labelled 'cooking wine' is salted and not the same ingredient.",
    links: [
      A("https://www.amazon.com/s?k=white+cooking+wine", "White cooking wine (Amazon search — salted, not the same as drinking wine)"),
    ],
  },
  {
    name: "Worcestershire Sauce", category: "Condiments & Oils",
    source: "aggregator", confidence: "medium", form: "as-sold", formMismatch: false,
    serving: 5, label: { calories: 5, carbs: 1.1, protein: 0, fat: 0 },
    notes: "Lea & Perrins, the reference bottle. Reads 100cal/100g against our 78 (+28%) with carbs +13%, so our row may run a little low — though at a 5g teaspoon serving the label's own precision is poor. Low stakes: recipes use this by the teaspoon.",
    links: [
      A("https://www.amazon.com/PERRINS-Original-Worcestershire-Sauce-Bottle/dp/B000R2Z2WM", "Lea & Perrins The Original Worcestershire Sauce, 10 fl oz (Amazon)"),
      A("https://www.amazon.com/Lea-Perrins-Worcestershire-Sauce-Ounce/dp/B0005XO2ME", "Lea & Perrins Worcestershire Sauce, 10 oz (Amazon)"),
      A("https://tools.myfooddata.com/nutrition-facts/100121796/wt1", "Lea & Perrins Original Worcestershire Sauce label (MyFoodData)"),
    ],
  },

  // ---------------- Eggs & Dairy ----------------
  {
    name: "Blue Cheese", category: "Eggs & Dairy",
    source: "mixed", confidence: "medium", form: "as-sold", formMismatch: false,
    serving: 28, label: { calories: 100, carbs: 1, protein: 6, fat: 8 },
    notes: "Amazon sells Happy Belly blue cheese crumbles; the published label is from the equivalent Happy Farms crumble, since the Amazon listing does not render one. Protein and fat match ours to within 0.4%, calories to 1%. As clean a confirmation as the audit produces.",
    links: [
      A("https://us.amazon.com/Crumbled-Previously-Happy-Belly-Packaging/dp/B07WJGLBHL", "Happy Belly (Amazon Grocery) Blue Cheese Crumbles, 6 oz (Amazon)"),
      A("https://foods.fatsecret.com/calories-nutrition/happy-farms/crumbled-blue-cheese", "Crumbled blue cheese label (FatSecret)"),
    ],
  },
  {
    name: "Evaporated Milk", category: "Eggs & Dairy",
    source: "aggregator", confidence: "medium", form: "as-sold", formMismatch: false,
    serving: 32, label: { calories: 40, carbs: 3, protein: 2, fat: 2 },
    notes: "Carnation, the reference can. Everything reads modestly under ours — calories -7%, fat -18% — consistent with Carnation being a standardised 6.5%-fat product where USDA's row averages richer stock. The label states 2 tbsp (30ml); converted at 1.07 g/ml for the 32g serving used here.",
    links: [
      A("https://www.amazon.com/Carnation-Evaporated-Milk-Can-Vitamin/dp/B00XI11WBY", "Carnation Evaporated Milk, Vitamin D added, 12 oz (Amazon)"),
      A("https://www.amazon.com/Carnation-Evaporated-Milk-12-Cout/dp/B00K7VZRDW", "Carnation Evaporated Milk, 12 fl oz, pack of 12 (Amazon)"),
      A("https://foods.fatsecret.com/calories-nutrition/carnation/evaporated-milk", "Carnation Evaporated Milk label (FatSecret)"),
    ],
  },
  {
    name: "Queso Fresco", category: "Eggs & Dairy",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 28, label: { calories: 80, carbs: 0, protein: 6, fat: 6 },
    notes: "Cacique, the dominant US brand. Calories within 5% and fat within 11%; the label's protein runs 18% higher than our row and its carbs round to zero. Cacique is part-skim, which is exactly the style the Peruvian recipes assume.",
    links: [
      A("https://www.amazon.com/Cacique-Queso-Fresco/dp/B00CJ5S7IG", "Cacique Queso Fresco Cheese, 10 oz (Amazon)"),
      A("https://www.amazon.com/Cacique-Queso-Fresco-Ranchero-12/dp/B00CJ5S4KW", "Cacique Queso Fresco Ranchero, 10 oz (Amazon)"),
      A("https://tools.myfooddata.com/nutrition-facts/358110/wt1/1", "Cacique Ranchero Queso Fresco label (MyFoodData)"),
    ],
  },
  {
    name: "Tofu", category: "Eggs & Dairy",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 56, label: { calories: 48, carbs: 0.5, protein: 6.1, fat: 2.3 },
    notes: "THE LARGEST GAP IN THIS BATCH. House Foods firm tofu reads 86cal/100g with 10.9g protein, against our 144cal and 17.3g — our row is 68% higher in calories and 59% higher in protein. Our value is USDA 'tofu, raw, firm, prepared with calcium sulfate', an unusually dense preparation; every mainstream US retail firm tofu label sits near 80-90cal. This one materially affects protein targets and deserves the closest look of any row here.",
    links: [
      A("https://www.amazon.com/House-Foods-Organic-Firm-Tofu/dp/B000VHRNUW", "House Foods Organic Firm Tofu, 14 oz (Amazon)"),
      A("https://www.amazon.com/House-Foods-Premium-Tofu-Extra/dp/B071WC228D", "House Foods Premium Tofu Extra Firm, 16 oz (Amazon)"),
      A("https://www.nutritionvalue.org/HOUSE_FOODS_Premium_Firm_Tofu_nutritional_value.html", "House Foods Premium Firm Tofu label (NutritionValue)"),
    ],
  },

  // ---------------- Grains & Pasta ----------------
  {
    name: "Bulgur", category: "Grains & Pasta",
    source: "aggregator", confidence: "high", form: "dry", formMismatch: false,
    serving: 45, label: { calories: 160, carbs: 35, protein: 4, fat: 0.5 },
    notes: "Bob's Red Mill red bulgur, dry. Calories and carbs sit within 4% of ours, but the label's protein is 28% lower (8.9 vs 12.3 per 100g) — a real spread between USDA's bulgur row and what the bag claims. The tabbouleh and kisir recipes lean on this for protein.",
    links: [
      A("https://www.amazon.com/Bobs-Red-Mill-Bulgur-Wheat/dp/B000VVWUMY", "Bob's Red Mill Bulgur Wheat, 28 oz (Amazon)"),
      A("https://www.amazon.com/Red-Bulgur-Hard-Wheat-Ounce/dp/B07XSHQ21Z", "Bob's Red Mill Red Bulgur, 24 oz (Amazon)"),
      A("https://www.myfooddiary.com/foods/4484172/bobs-red-mill-whole-grain-red-bulgur", "Bob's Red Mill Whole Grain Red Bulgur label (MyFoodDiary)"),
    ],
  },
  {
    name: "Cassava Flour", category: "Grains & Pasta",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 32, label: { calories: 110, carbs: 28, protein: 1, fat: 0 },
    notes: "Otto's Naturals, the reference cassava flour. Carbs match within 1% and calories within 4%, comfortably inside the 344-371 brand range the S14 registry line documents. No action indicated.",
    links: [
      A("https://www.amazon.com/Ottos-Naturals-Cassava-Grain-Free-Gluten-Free/dp/B00S5AZRYG", "Otto's Naturals Multi-Purpose Cassava Flour, 2 lb (Amazon)"),
      A("https://www.nutritionvalue.org/Multi-purpose_cassava_flour_by_OTTO%27S_NATURALS_701806_nutritional_value.html", "Otto's Naturals Cassava Flour label (NutritionValue)"),
    ],
  },
  {
    name: "Cornstarch", category: "Grains & Pasta",
    source: "aggregator", confidence: "high", form: "as-sold", formMismatch: false,
    serving: 8, label: { calories: 30, carbs: 7, protein: 0, fat: 0 },
    notes: "Argo, the category reference. Calories within 2% and carbs within 4% of ours. The -100% protein and fat deltas are an 8g serving rounding 0.02g of each to zero. No action indicated.",
    links: [
      A("https://www.amazon.com/Argo-Cornstarch-1-Pound-LB/dp/B076ZVGN79", "Argo Cornstarch, 1 lb (Amazon)"),
      A("https://www.amazon.com/Argo-Corn-Starch-oz-pack/dp/B06XKF3ZQL", "Argo Corn Starch, 35 oz, pack of 2 (Amazon)"),
      A("https://www.myfooddiary.com/foods/7325305/argo-corn-starch", "Argo Corn Starch label (MyFoodDiary)"),
    ],
  },
  {
    name: "Gram Flour (Besan)", category: "Grains & Pasta",
    source: "aggregator", confidence: "low", form: "as-sold", formMismatch: false,
    serving: 30, label: { calories: 110, carbs: 27, protein: 7, fat: 1 },
    notes: "Swad besan. Protein matches ours within 4%, but the label's 90g carb per 100g is not credible for chickpea flour — Deep's besan reads 17g per the same 30g serving (56.7 per 100g) and USDA says 57.8, both close to ours. Read the +56% carb delta as a bad label, not a bad registry row. Flagged low confidence for that reason.",
    links: [
      A("https://www.amazon.com/Swad-Besan-Flour-Chick-Peas/dp/B00K8DW7XW", "Swad Besan Flour (Chick Pea Flour), 2 lb (Amazon)"),
      A("https://www.amazon.com/Swad-Besan-Gram-Chick-Flour/dp/B004LJX0SK", "Swad Besan (Gram or Chick Pea Flour), 4 lb (Amazon)"),
      A("https://www.eatthismuch.com/calories/besan-2870167", "Swad Besan label (Eat This Much)"),
      A("https://www.eatthismuch.com/calories/besan-chickpea-flour-2509202", "Deep Besan label (Eat This Much) — the sane comparison"),
    ],
  },
  {
    name: "Ramen Noodles", category: "Grains & Pasta",
    source: "aggregator", confidence: "high", form: "dry", formMismatch: false,
    serving: 55, label: { calories: 190, carbs: 41, protein: 8, fat: 0.5 },
    notes: "Ka-Me chuka soba, dry and non-fried — exactly the form S14 re-based this row to. Calories, carbs and protein all agree within 12%, confirming that re-basing. The flash-fried instant block would be ~440cal with 16.5g fat and must not use this row.",
    links: [
      A("https://www.amazon.com/Ka-Me-Noodles-Japanese-Curly-Chuka/dp/B000ET8XAQ", "Ka-Me Japanese Curly Noodles (Chuka Soba), 5 oz (Amazon)"),
      A("https://www.myfooddiary.com/foods/7193863/ka-me-japanese-curly-noodles", "Ka-Me Japanese Curly Noodles label (MyFoodDiary)"),
    ],
  },
  {
    name: "Tteok", category: "Grains & Pasta",
    source: "none", confidence: "low", form: "as-sold", formMismatch: false,
    serving: null, label: null,
    notes: "No usable label. The Korean rice cakes on Amazon are imported and mostly ship without a published US Nutrition Facts panel; the figures that do circulate span 140-230cal/100g depending on whether the cake is refrigerated-fresh or vacuum-packed. That is the same ~25% brand spread the S14 registry line already documents, so there is nothing here our own note does not already say.",
    links: [
      A("https://www.amazon.com/Korean-Rice-Cake-Tteokbokki-Stick/dp/B09B2XR99G", "Unha's Korean Tteokbokki Garaetteok Rice Cake Sticks, 21.16 oz (Amazon)"),
      A("https://www.amazon.com/garaetteok/s?k=garaetteok", "Garaetteok rice cakes (Amazon search)"),
    ],
  },

  // ---------------- Meat & Seafood ----------------
  {
    name: "Bacon", category: "Meat & Seafood",
    source: "aggregator", confidence: "high", form: "cooked", formMismatch: true,
    serving: 15, label: { calories: 80, carbs: 0, protein: 5, fat: 7 },
    notes: "Hormel Black Label, but the label's serving is 2 PAN-FRIED slices while our row is USDA raw — so the +187% protein and +16% calorie deltas are rendered-out water and fat, not a data error. The practical warning stands: 15g of cooked bacon comes from roughly 34g raw, so a recipe that weighs cooked strips against this raw row understates by well over half.",
    links: [
      A("https://www.amazon.com/HORMEL-BLACK-LABEL-Original-Bacon/dp/B000Q3AEBG", "HORMEL Black Label Original Bacon, 16 oz (Amazon)"),
      A("https://www.amazon.com/Wellshire-Farms-Thick-Sliced-Dry-Rubbed/dp/B074VD2YC2", "Wellshire Farms Thick Sliced Uncured Bacon, 12 oz (Amazon)"),
      A("https://www.nutritionvalue.org/Hormel%2C_black_label%2C_original_bacon_by_Hormel_Foods_Corporation_376998_nutritional_value.html", "Hormel Black Label Original Bacon label (NutritionValue)"),
    ],
  },
];

const p = path.join(__dirname, "records.json");
const records = JSON.parse(fs.readFileSync(p, "utf8"));
const have = new Set(records.map((r) => r.name));

const dupes = NEW.filter((r) => have.has(r.name));
if (dupes.length) {
  console.error("Already present, refusing to double-add:", dupes.map((d) => d.name));
  process.exit(1);
}

// order 1000+ keeps the new rows after the original ones inside each category,
// so existing #detail-N anchors move as little as possible.
NEW.forEach((r, i) => { r.order = 1000 + i; });
records.push(...NEW);
fs.writeFileSync(p, JSON.stringify(records, null, 2) + "\n");
console.log(`added ${NEW.length} records, now ${records.length}`);
console.log(`  with labels: ${NEW.filter((r) => r.label).length}, no data: ${NEW.filter((r) => !r.label).map((r) => r.name).join(", ")}`);
