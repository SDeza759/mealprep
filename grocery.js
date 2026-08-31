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
// Decimal pounds first — grocery-store scales read decimal pounds, so 680g is "1.5lbs / 24oz".
function formatImperial(grams) {
  var oz = grams / 28.3495;
  var lbs = Math.round(oz / 16 * 100) / 100;
  return lbs + "lbs / " + round1(oz) + "oz";
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
        if (!map[ing.name]) map[ing.name] = { name: ing.name, totalGrams: 0, totalServings: 0, appearances: [], isSpice: !!ing.isSpice };
        map[ing.name].totalGrams += ing.grams * servings;
        map[ing.name].totalServings += servings;
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
  if (item.isSpice) return "~" + Math.max(1, Math.round(item.totalGrams / 3)) + " tsp";
  var gc = GROCERY_COUNTABLE[item.name];
  if (gc) {
    var count = Math.ceil(item.totalGrams / gc.gPerUnit);
    return count + " " + (count === 1 ? gc.unit : gc.plural);
  }
  return formatImperial(item.totalGrams);
}

function groceryToText(groceryList) {
  var lines = ["Weekly Grocery List","==================",""];
  groceryList.forEach(function(section) {
    lines.push(section.category); lines.push("-".repeat(section.category.length));
    section.items.forEach(function(item) {
      lines.push("  " + item.name + " - " + groceryQtyText(item));
    });
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
