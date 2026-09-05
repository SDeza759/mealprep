/* global INGREDIENT_REGISTRY, UNIT_INGREDIENTS, RECIPE_SPICE_OVERRIDES, RECIPE_COOKING_DATA, RECIPES,
   INGREDIENT_CATEGORIES, GROCERY_COUNTABLE, DAYS_NAMES, isUnitBased, getUnitCount, round1,
   applyIngredientOverrides, adjustDayMeals, generatePlan, selectVariant, solveDayShakeAware,
   PROTEIN_SHAKE, initializeData, setRandomSeed, state, DEFAULT_MACROS_PER100, getCategory,
   formatImperial, buildGroceryList, groceryQtyText, groceryToText */

// The solver core — data.js, algorithm.js, grocery.js at the repo root — is loaded as three classic
// scripts ahead of this bundle (see coreScripts() in vite.config.js), exactly the files the Node
// test harness runs. They define globals; this module is the ONLY place that reads them, so the
// rest of the app imports a normal ES module. When the core is converted to ES modules, only this
// file changes.

function need(name) {
  const v = globalThis[name];
  if (v === undefined) throw new Error(`Dialed: core global "${name}" is missing — were data.js, algorithm.js and grocery.js loaded?`);
  return v;
}

// ----- data.js -----
const _UNIT_INGREDIENTS = need('UNIT_INGREDIENTS');
const _INGREDIENT_REGISTRY = need('INGREDIENT_REGISTRY');
const _RECIPE_SPICE_OVERRIDES = need('RECIPE_SPICE_OVERRIDES');
const _RECIPE_COOKING_DATA = need('RECIPE_COOKING_DATA');
const _RECIPES = need('RECIPES');
const _INGREDIENT_CATEGORIES = need('INGREDIENT_CATEGORIES');
const _GROCERY_COUNTABLE = need('GROCERY_COUNTABLE');
const _DAYS_NAMES = need('DAYS_NAMES');

// ----- algorithm.js -----
const _isUnitBased = need('isUnitBased');
const _getUnitCount = need('getUnitCount');
const _round1 = need('round1');
const _applyIngredientOverrides = need('applyIngredientOverrides');
const _adjustDayMeals = need('adjustDayMeals');
const _generatePlan = need('generatePlan');
const _selectVariant = need('selectVariant');
const _solveDayShakeAware = need('solveDayShakeAware');
const _PROTEIN_SHAKE = need('PROTEIN_SHAKE');
const _initializeData = need('initializeData');
const _setRandomSeed = need('setRandomSeed');
const _DEFAULT_MACROS_PER100 = need('DEFAULT_MACROS_PER100');
// `state` is declared with `const` in algorithm.js. That makes it a global lexical binding —
// reachable by name from any script or module, but NOT a property of globalThis.
const _state = state;

// ----- grocery.js -----
const _getCategory = need('getCategory');
const _formatImperial = need('formatImperial');
const _buildGroceryList = need('buildGroceryList');
const _groceryQtyText = need('groceryQtyText');
const _groceryToText = need('groceryToText');

// initializeData() enriches RECIPES in place (spices, macros, steps) and must run exactly once.
// The guard makes this module safe to evaluate again (e.g. after a hot reload of the bundle
// without a page reload).
if (!_RECIPES[0] || !_RECIPES[0].totalMacros) _initializeData();

export {
  _UNIT_INGREDIENTS as UNIT_INGREDIENTS,
  _INGREDIENT_REGISTRY as INGREDIENT_REGISTRY,
  _RECIPE_SPICE_OVERRIDES as RECIPE_SPICE_OVERRIDES,
  _RECIPE_COOKING_DATA as RECIPE_COOKING_DATA,
  _RECIPES as RECIPES,
  _INGREDIENT_CATEGORIES as INGREDIENT_CATEGORIES,
  _GROCERY_COUNTABLE as GROCERY_COUNTABLE,
  _DAYS_NAMES as DAYS_NAMES,
  _isUnitBased as isUnitBased,
  _getUnitCount as getUnitCount,
  _round1 as round1,
  _applyIngredientOverrides as applyIngredientOverrides,
  _adjustDayMeals as adjustDayMeals,
  _generatePlan as generatePlan,
  _selectVariant as selectVariant,
  _solveDayShakeAware as solveDayShakeAware,
  _PROTEIN_SHAKE as PROTEIN_SHAKE,
  _setRandomSeed as setRandomSeed,
  _DEFAULT_MACROS_PER100 as DEFAULT_MACROS_PER100,
  _state as state,
  _getCategory as getCategory,
  _formatImperial as formatImperial,
  _buildGroceryList as buildGroceryList,
  _groceryQtyText as groceryQtyText,
  _groceryToText as groceryToText,
};
