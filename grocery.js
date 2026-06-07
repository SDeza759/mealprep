// grocery.js — extracted from index.html. Mechanical extraction; function bodies unchanged.
// Browser usage: load data.js and algorithm.js first, then this file.
// Node usage: require this module — data.js and algorithm.js are loaded automatically below.

// Node compatibility: load dependencies and expose as globals so the functions below
// work without any changes to their bodies. In the browser, those scripts set the globals.
if (typeof module !== 'undefined' && module.exports) {
  Object.assign(global, require('./data.js'));
  Object.assign(global, require('./algorithm.js'));
}

// ===== CATEGORY LOOKUP =====
function getCategory(name) { return INGREDIENT_CATEGORIES[name] || "Other"; }

// ===== IMPERIAL FORMATTING =====
function formatImperial(grams) {
  var oz = grams / 28.3495;
  if (oz >= 16) { var lbs = Math.floor(oz / 16); var rem = round1(oz % 16); return rem > 0 ? lbs+" lb "+rem+" oz" : lbs+" lb"; }
  return round1(oz) + " oz";
}

// Grocery list verification: buildGroceryList iterates every day and every meal slot,
// summing ingredient grams by name into a shared map. Duplicate recipe appearances (same
// recipe on multiple days, or same recipe twice in a week) are handled correctly — each
// meal slot contributes independently. Verified: no changes needed.
function buildGroceryList(plan, servingsMap) {
  var map = {};
  var sv = servingsMap || {};
  plan.forEach(function(day, di) {
    if (!day) return;
    day.meals.forEach(function(meal, mi) {
      var servings = sv[di + "-" + mi] || 1;
      meal.ingredients.forEach(function(ing) {
        if (!map[ing.name]) map[ing.name] = { name: ing.name, totalGrams: 0, totalUnits: 0, appearances: [], isSpice: !!ing.isSpice };
        map[ing.name].totalGrams += ing.grams * servings;
        if (isUnitBased(ing.name)) map[ing.name].totalUnits += Math.max(1, getUnitCount(ing.name, ing.grams)) * servings;
        map[ing.name].appearances.push("Day " + (di+1) + " \u2013 " + meal.name + (servings > 1 ? " (\u00D7" + servings + ")" : ""));
      });
    });
  });
  var categories = {};
  Object.values(map).forEach(function(item) { var cat = getCategory(item.name); if (!categories[cat]) categories[cat] = []; categories[cat].push(item); });
  var order = ["Produce","Fruit","Meat & Seafood","Eggs & Dairy","Bakery & Bread",
               "Grains & Pasta","Canned & Legumes","Condiments & Oils","Spices & Seasonings","Other"];
  return order.filter(function(c) { return categories[c]; }).map(function(c) {
    return { category: c, items: categories[c].sort(function(a, b) { return b.totalGrams - a.totalGrams; }) };
  });
}

function groceryQtyText(item) {
  if (item.isSpice) return Math.round(item.totalGrams) + "g (~" + Math.max(1, Math.round(item.totalGrams / 3)) + " tsp)";
  var gc = GROCERY_COUNTABLE[item.name];
  if (gc) {
    var count = Math.ceil(item.totalGrams / gc.gPerUnit);
    return count + " " + (count === 1 ? gc.unit : gc.plural) + " (~" + Math.round(item.totalGrams) + "g)";
  }
  if (isUnitBased(item.name)) {
    var u = UNIT_INGREDIENTS[item.name];
    return item.totalUnits + " " + (item.totalUnits === 1 ? u.unit : u.plural);
  }
  var g = Math.round(item.totalGrams);
  var cat = getCategory(item.name);
  if (cat === "Meat & Seafood") return g + "g (" + formatImperial(g) + ")";
  if (item.name.indexOf("Oil") !== -1 || item.name.indexOf("Sauce") !== -1 || item.name === "Coconut Milk" || item.name === "Maple Syrup" || item.name === "Honey") {
    return g + "g (" + round1(g / 28.35) + " oz)";
  }
  return g + "g (" + formatImperial(g) + ")";
}

function groceryToText(groceryList) {
  var lines = ["Weekly Grocery List","==================",""];
  groceryList.forEach(function(section) {
    lines.push(section.category); lines.push("-".repeat(section.category.length));
    section.items.forEach(function(item) { lines.push("  " + item.name + " - " + groceryQtyText(item)); });
    lines.push("");
  });
  return lines.join("\n");
}

// ===== UMD EXPORTS =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCategory,
    formatImperial,
    buildGroceryList,
    groceryQtyText,
    groceryToText,
  };
}
