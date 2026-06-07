// algorithm.js — extracted from index.html. Mechanical extraction; algorithm logic unchanged.
// Browser usage: load data.js first, then this file. Then call initializeData() once.
// Node usage: require this module — data.js is loaded automatically via the shim below.

// Node compatibility: load data and expose as globals so the functions below work
// without any changes to their bodies. In the browser, data.js sets these as globals.
if (typeof module !== 'undefined' && module.exports) {
  Object.assign(global, require('./data.js'));
}

// ===== MUTABLE MODULE STATE =====
// Solver diagnostics and recipe rotation tracker, exposed via the exported `state` object
// so importers can reset/inspect cleanly.
const state = {
  solverDiagnostics: [],
  recipeRotation: { counts: {}, totalSlots: 0 },
};

// ===== UNIT INGREDIENT HELPERS =====
function isUnitBased(name) { return !!UNIT_INGREDIENTS[name]; }
function getUnitCount(name, grams) {
  var u = UNIT_INGREDIENTS[name];
  if (!u) return null;
  return Math.round(grams / u.gPerUnit);
}

// ===== ENRICHMENT FROM REGISTRY =====
function _enrichFromRegistry(ingredients) {
  ingredients.forEach(function(ing) {
    var reg = INGREDIENT_REGISTRY[ing.name];
    if (reg) {
      var s = ing.grams / 100;
      ing.calories = Math.round(reg.calories * s * 10) / 10;
      ing.carbs = Math.round(reg.carbs * s * 10) / 10;
      ing.protein = Math.round(reg.protein * s * 10) / 10;
      ing.fat = Math.round(reg.fat * s * 10) / 10;
    } else if (ing.calories === undefined && !ing.isSpice) {
      console.warn("[Registry] Missing entry for: " + ing.name);
      ing.calories = 0; ing.carbs = 0; ing.protein = 0; ing.fat = 0;
    }
  });
}

// ===== UTILITY: round to one decimal =====
function round1(n) { return Math.round(n * 10) / 10; }

// ===== STARTUP-DERIVED DATA =====
// Was top-level: assigned inside initializeData() so it picks up enriched RECIPES.
var DEFAULT_MACROS_PER100 = {};

// ===== INITIALIZATION (must be called once before any other algorithm function) =====
// Wraps the two top-level RECIPES.forEach blocks that previously ran at script load.
function initializeData() {
RECIPES.forEach(function(r) {
  var cookData = RECIPE_COOKING_DATA[r.name];
  if (cookData) { r.steps = cookData.steps; r.prepTime = cookData.prepTime; r.cookTime = cookData.cookTime; }
  var spices = RECIPE_SPICE_OVERRIDES[r.name] || [];
  spices.forEach(function(s) {
    r.ingredients.push({ name: s.name, grams: s.grams, calories: 0, carbs: 0, protein: 0, fat: 0, isSpice: true });
  });
  _enrichFromRegistry(r.ingredients);
  r.totalMacros = r.ingredients.reduce(function(a, i) {
    return { calories: a.calories+i.calories, carbs: a.carbs+i.carbs, protein: a.protein+i.protein, fat: a.fat+i.fat };
  }, { calories:0, carbs:0, protein:0, fat:0 });
  if (r.variants) {
    r.variants.forEach(function(v) {
      spices.forEach(function(s) {
        v.ingredients.push({ name: s.name, grams: s.grams, calories: 0, carbs: 0, protein: 0, fat: 0, isSpice: true });
      });
      _enrichFromRegistry(v.ingredients);
      v.totalMacros = v.ingredients.reduce(function(a, i) {
        return { calories: a.calories+i.calories, carbs: a.carbs+i.carbs, protein: a.protein+i.protein, fat: a.fat+i.fat };
      }, { calories:0, carbs:0, protein:0, fat:0 });
    });
  }
});

RECIPES.forEach(function(r) {
  r.ingredients.forEach(function(ing) {
    if (!ing.isSpice && !DEFAULT_MACROS_PER100[ing.name] && ing.grams > 0) {
      var s = 100 / ing.grams;
      DEFAULT_MACROS_PER100[ing.name] = { calories: round1(ing.calories * s), carbs: round1(ing.carbs * s), protein: round1(ing.protein * s), fat: round1(ing.fat * s) };
    }
  });
});
}

// ===== APPLY INGREDIENT OVERRIDES =====
function applyIngredientOverrides(ingredients, overrides) {
  if (!overrides || Object.keys(overrides).length === 0) return;
  ingredients.forEach(function(ing) {
    if (ing.isSpice || !overrides[ing.name]) return;
    var ov = overrides[ing.name];
    var s = ing.grams / 100;
    ing.calories = round1(ov.calories * s);
    ing.carbs = round1(ov.carbs * s);
    ing.protein = round1(ov.protein * s);
    ing.fat = round1(ov.fat * s);
  });
}

// RESCUE_ALLOWLIST and MEAT_FISH_NAMES: removed. Both were only used by the protein rescue
// phase and the macroNudge sequential selection gates, which were removed in the combo-first
// rewrite. No remaining references in the codebase.
// Dead reference scan complete: macroNudge, BREAKFAST_RECIPES, MAIN_RECIPES, rescueTotals,
// rescueProteinGap, boostTotals, boostProPct, bestRescueMi, boostMi — all confirmed absent.


// ===== SOLVER: gradient-descent macro-balance adjuster =====
function adjustDayMeals(allMealData, targetCal, targetCarbs, targetProtein, targetFat, suppressDiag) {
  var targets = [targetCal, targetCarbs, targetProtein, targetFat];
  var macroKeys = ["calories", "carbs", "protein", "fat"];

  // ===== SETUP: classify ingredients, build linear system =====
  // Partition all ingredients into fixed (non-adjustable) and adjustable.
  // For adjustable ingredients, record their macro coefficients (macros at 1x scale)
  // so the solver can find optimal scale factors s_i ∈ [0.5, 3.0].
  var baseline = [0, 0, 0, 0]; // summed macros from non-adjustable ingredients
  var vars = []; // adjustable: {mi, ii, grams0, A:[cal,carbs,pro,fat], perGram:[...], isEgg, isBinderEgg}

  allMealData.forEach(function(meal, mi) {
    meal.ingredients.forEach(function(ing, ii) {
      var cal = ing.calories || 0, carbs = ing.carbs || 0;
      var pro = ing.protein || 0, fat = ing.fat || 0;

      // canAdjust eligibility (same rules as before)
      if (ing.isSpice || ing.name === "Soy Sauce" ||
          (ing.name !== "Egg" && isUnitBased(ing.name)) || cal < 50) {
        baseline[0] += cal; baseline[1] += carbs;
        baseline[2] += pro; baseline[3] += fat;
        return;
      }

      // Egg binder detection: if egg is NOT the top protein source in its meal,
      // it's a binder (Katsu Curry, Pork Milanese, etc.) and must stay at original grams.
      var isEgg = ing.name === "Egg";
      var isBinderEgg = false;
      if (isEgg) {
        var isTopPro = true;
        meal.ingredients.forEach(function(other) {
          if (other.name !== "Egg" && !other.isSpice && (other.protein || 0) > pro) isTopPro = false;
        });
        isBinderEgg = !isTopPro;
      }

      var g0 = ing.grams;
      // A[k] = macro contribution of this ingredient at scale 1.0
      // At scale s, contribution = A[k] * s
      var A = [cal, carbs, pro, fat];
      var perGram = [cal / g0, carbs / g0, pro / g0, fat / g0];

      vars.push({ mi: mi, ii: ii, grams0: g0, A: A, perGram: perGram,
                   isEgg: isEgg, isBinderEgg: isBinderEgg });
    });
  });

  var K = vars.length;
  if (K === 0) return allMealData;

  // Weights: 1/target^2 normalizes errors to percentage scale
  var w = [];
  for (var wk = 0; wk < 4; wk++) {
    w.push(targets[wk] > 0 ? 1.0 / (targets[wk] * targets[wk]) : 0);
  }

  // Compute total macros from baseline + Σ A_i * s_i
  function computeMacros(scales) {
    var m = [baseline[0], baseline[1], baseline[2], baseline[3]];
    for (var i = 0; i < K; i++) {
      for (var k = 0; k < 4; k++) m[k] += vars[i].A[k] * scales[i];
    }
    return m;
  }

  // Check if all macros are within pct of target
  function converged(macros, pct) {
    for (var k = 0; k < 4; k++) {
      if (targets[k] > 0 && Math.abs(macros[k] - targets[k]) / targets[k] > pct) return false;
    }
    return true;
  }

  // Weighted sum of squared errors (percentage-normalized)
  function loss(macros) {
    var L = 0;
    for (var k = 0; k < 4; k++) { var d = macros[k] - targets[k]; L += w[k] * d * d; }
    return L;
  }

  // Clamp scales to [0.5, 3.0], enforce egg discretization
  function clamp(scales) {
    for (var i = 0; i < K; i++) {
      var v = vars[i];
      if (v.isBinderEgg) { scales[i] = 1.0; continue; }
      scales[i] = Math.max(0.5, Math.min(3.0, scales[i]));
      if (v.isEgg) {
        var newG = Math.round(v.grams0 * scales[i] / 50) * 50;
        var minG = Math.ceil(v.grams0 * 0.5 / 50) * 50;
        var maxG = Math.floor(v.grams0 * 3.0 / 50) * 50;
        newG = Math.max(minG > 0 ? minG : 50, Math.min(maxG, newG));
        scales[i] = newG / v.grams0;
      }
    }
  }

  // ===== PROJECTED GRADIENT DESCENT SOLVER (sum-of-squares) =====
  function solve(initScales) {
    var scales = initScales.slice();
    clamp(scales);

    for (var iter = 0; iter < 100; iter++) {
      var macros = computeMacros(scales);
      if (converged(macros, 0.03)) break;

      // Carb floor (Fix 3): relaxed to 80% when protein is binding constraint
      var carbFloor = 0.88;
      if (targets[2] > 0 && macros[2] < targets[2] * 0.92 && macros[1] > targets[1]) {
        carbFloor = 0.80;
      }
      var carbFloorVal = targets[1] * carbFloor;

      var errors = [0, 0, 0, 0];
      var wEff = [w[0], w[1], w[2], w[3]];
      for (var k = 0; k < 4; k++) errors[k] = macros[k] - targets[k];
      if (macros[1] < carbFloorVal) {
        errors[1] = macros[1] - carbFloorVal;
        wEff[1] = w[1] * 4;
      }

      // Gradient: g_i = 2 * Σ_k wEff_k * error_k * A_ki
      var grad = new Array(K);
      var gradNormSq = 0;
      for (var i = 0; i < K; i++) {
        if (vars[i].isBinderEgg) { grad[i] = 0; continue; }
        var g = 0;
        for (var k2 = 0; k2 < 4; k2++) g += wEff[k2] * errors[k2] * vars[i].A[k2];
        grad[i] = 2 * g;
        gradNormSq += grad[i] * grad[i];
      }
      if (gradNormSq < 1e-15) break;

      // Exact quadratic step: α = ||g||² / (g^T H g)
      var Ag = [0, 0, 0, 0];
      for (var k3 = 0; k3 < 4; k3++) {
        for (var j = 0; j < K; j++) Ag[k3] += grad[j] * vars[j].A[k3];
      }
      var gHg = 0;
      for (var k4 = 0; k4 < 4; k4++) gHg += 2 * wEff[k4] * Ag[k4] * Ag[k4];
      var alpha = gHg > 1e-15 ? gradNormSq / gHg : 0.01;
      alpha = Math.min(alpha, 2.0);

      for (var i2 = 0; i2 < K; i2++) {
        if (!vars[i2].isBinderEgg) scales[i2] -= alpha * grad[i2];
      }
      clamp(scales);
    }
    return scales;
  }

  // ===== RUN: solve from current proportions, random restarts if needed =====
  var rawMacros = computeMacros(new Array(K + 1).join("1").split("").map(Number)); // macros at scale 1.0
  var init = [];
  for (var si = 0; si < K; si++) init.push(1.0);
  var bestScales = solve(init);
  var bestMacros = computeMacros(bestScales);
  var bestLoss = loss(bestMacros);
  var solverConverged = converged(bestMacros, 0.03);

  // Random restarts if not converged within 5%
  if (!converged(bestMacros, 0.05)) {
    for (var restart = 0; restart < 5; restart++) {
      var rand = [];
      for (var ri = 0; ri < K; ri++) rand.push(0.5 + Math.random() * 2.5);
      var tryS = solve(rand);
      var tryM = computeMacros(tryS);
      var tryL = loss(tryM);
      if (tryL < bestLoss) { bestLoss = tryL; bestScales = tryS; bestMacros = tryM; }
      if (converged(tryM, 0.05)) { solverConverged = true; break; }
    }
  }

  // ===== DIAGNOSTIC: fires when any macro is outside [95%, 105%] =====
  // Suppressed during intermediate solver-as-filter attempts (only log final result).
  var inZone = true;
  for (var zk = 0; zk < 4; zk++) {
    if (targets[zk] > 0 && (bestMacros[zk] < targets[zk] * 0.95 || bestMacros[zk] > targets[zk] * 1.05)) {
      inZone = false; break;
    }
  }
  if (!inZone && !suppressDiag) {
    var mLabels = ["cal", "carbs", "pro", "fat"];
    var rawPcts = rawMacros.map(function(v, k) { return Math.round(v / targets[k] * 100); });
    var finalPcts = bestMacros.map(function(v, k) { return Math.round(v / targets[k] * 100); });

    // Build structured diagnostic
    var scaleData = [];
    for (var di = 0; di < K; di++) {
      var dv = vars[di];
      var ingName = allMealData[dv.mi].ingredients[dv.ii].name;
      var s = bestScales[di];
      var bound = null;
      if (dv.isBinderEgg) bound = "locked";
      else if (Math.abs(s - 0.5) < 0.01) bound = "min";
      else if (Math.abs(s - 3.0) < 0.01) bound = "max";
      scaleData.push({ name: ingName, scale: round1(s * 100) / 100, from: dv.grams0, to: Math.round(dv.grams0 * s), bound: bound });
    }

    // Out-of-range analysis
    var oorData = [];
    for (var ok = 0; ok < 4; ok++) {
      if (targets[ok] <= 0) continue;
      var pct = bestMacros[ok] / targets[ok];
      if (pct >= 0.95 && pct <= 1.05) continue;
      var direction = pct < 0.95 ? "low" : "high";
      var moves = [];
      for (var oi = 0; oi < K; oi++) {
        var ov = vars[oi];
        if (ov.isBinderEgg) continue;
        var delta = direction === "low" ? 0.1 : -0.1;
        if (bestScales[oi] + delta < 0.5 || bestScales[oi] + delta > 3.0) continue;
        var dM = {};
        for (var om = 0; om < 4; om++) dM[mLabels[om]] = round1(ov.A[om] * delta * 10) / 10;
        moves.push({ ingredient: allMealData[ov.mi].ingredients[ov.ii].name, delta: delta, impact: dM });
      }
      oorData.push({ macro: mLabels[ok], direction: direction, pct: Math.round(pct * 100), moves: moves });
    }

    // Feasibility ranges
    var fMin = [baseline[0], baseline[1], baseline[2], baseline[3]];
    var fMax = [baseline[0], baseline[1], baseline[2], baseline[3]];
    for (var fi = 0; fi < K; fi++) {
      for (var fk = 0; fk < 4; fk++) { fMin[fk] += vars[fi].A[fk] * 0.5; fMax[fk] += vars[fi].A[fk] * 3.0; }
    }

    // Cross-constraint
    var ccAdj = [];
    for (var ci = 0; ci < K; ci++) ccAdj.push({ cal: vars[ci].A[0], pro: vars[ci].A[2], fat: vars[ci].A[3] });
    ccAdj.sort(function(a, b) { return (b.pro / Math.max(b.cal, 1)) - (a.pro / Math.max(a.cal, 1)); });
    var ccPro = baseline[2], ccCal = baseline[0], ccFat = baseline[3];
    for (var cj = 0; cj < ccAdj.length; cj++) {
      var cc = ccAdj[cj];
      if (ccPro >= targetProtein) { ccCal += cc.cal * 0.5; ccFat += cc.fat * 0.5; }
      else if (cc.pro > 0 && cc.pro * 3.0 <= targetProtein - ccPro) { ccCal += cc.cal * 3.0; ccPro += cc.pro * 3.0; ccFat += cc.fat * 3.0; }
      else if (cc.pro > 0) { var sc = Math.max(0.5, Math.min(3.0, (targetProtein - ccPro) / cc.pro)); ccCal += cc.cal * sc; ccPro += cc.pro * sc; ccFat += cc.fat * sc; }
      else { ccCal += cc.cal * 0.5; ccFat += cc.fat * 0.5; }
    }

    var diagEntry = {
      recipes: allMealData.map(function(md) { return md.recipe.name; }),
      targets: { cal: targetCal, carbs: targetCarbs, pro: targetProtein, fat: targetFat },
      rawMacros: { cal: Math.round(rawMacros[0]), carbs: Math.round(rawMacros[1]), pro: Math.round(rawMacros[2]), fat: Math.round(rawMacros[3]) },
      rawPcts: { cal: rawPcts[0], carbs: rawPcts[1], pro: rawPcts[2], fat: rawPcts[3] },
      finalMacros: { cal: Math.round(bestMacros[0]), carbs: Math.round(bestMacros[1]), pro: Math.round(bestMacros[2]), fat: Math.round(bestMacros[3]) },
      finalPcts: { cal: finalPcts[0], carbs: finalPcts[1], pro: finalPcts[2], fat: finalPcts[3] },
      objective: round1(bestLoss * 1000000) / 1000000,
      converged: solverConverged,
      scales: scaleData,
      outOfRange: oorData,
      feasibilityRanges: {
        cal: { min: Math.round(fMin[0]), max: Math.round(fMax[0]) },
        carbs: { min: Math.round(fMin[1]), max: Math.round(fMax[1]) },
        pro: { min: Math.round(fMin[2]), max: Math.round(fMax[2]) },
        fat: { min: Math.round(fMin[3]), max: Math.round(fMax[3]) }
      },
      crossConstraint: { minCalForProtein: Math.round(ccCal), minFatForProtein: Math.round(ccFat) }
    };
    state.solverDiagnostics.push(diagEntry);

    // Console log (abbreviated)
    console.warn("[Solver Diag] FAILED: " + diagEntry.recipes.join(" + ") +
      " | raw: " + rawPcts.join("/") + "% | final: " + finalPcts.join("/") + "%" +
      " | converged: " + solverConverged +
      " | bounds: " + scaleData.filter(function(s) { return s.bound; }).map(function(s) { return s.name + "=" + s.bound; }).join(","));
  }

  // ===== APPLY: write solved scales back to ingredient objects =====
  for (var ai = 0; ai < K; ai++) {
    var v = vars[ai];
    var ing = allMealData[v.mi].ingredients[v.ii];
    var newG = Math.round(v.grams0 * bestScales[ai]);
    if (v.isEgg) {
      newG = Math.round(newG / 50) * 50;
      if (newG <= 0) newG = 50;
    }
    if (newG !== v.grams0) {
      ing.adjustment = "adjusted from " + v.grams0 + "g to " + newG + "g for macro balance";
    }
    ing.grams = newG;
    for (var mk = 0; mk < 4; mk++) {
      ing[macroKeys[mk]] = round1(v.perGram[mk] * newG);
    }
  }

  return allMealData;
}

// ===== COMBO-FIRST RECIPE SELECTION =====
// Evaluates complete day combinations (2 or 3 recipes) before committing to any meal.
// 50 random combos are sampled, hard-rejected if structurally incompatible, scored by
// macro fit + rotation, then one is selected via weighted random draw (τ=0.3).
// This eliminates failure modes from sequential selection (two ultra-lean recipes,
// two low-calorie recipes, etc.) because the FULL day is evaluated as a unit.
function generatePlan(targetCal, targetCarbs, targetProtein, targetFat, overrides, dayGroups, excludedDays, seed) {
  var days = new Array(7);
  var excluded = excludedDays || [];

  // Build generation slots: each group shares one plan, ungrouped days get individual plans
  var assigned = {};
  var slots = [];
  (dayGroups || []).forEach(function(group) {
    var active = group.filter(function(d) { return excluded.indexOf(d) === -1; });
    if (active.length > 0) { slots.push(active); active.forEach(function(d) { assigned[d] = true; }); }
  });
  for (var dd = 0; dd < 7; dd++) { if (!assigned[dd] && excluded.indexOf(dd) === -1) slots.push([dd]); }
  slots.sort(function(a, b) { return a[0] - b[0]; });

  // Cuisine hard limit: max 2 per cuisine per week
  var weekCuisineCounts = {};

  // Track recipes used this week (for same-recipe-different-day exclusion)
  var weekRecipeNames = {};

  // Optional seed: pre-populate week trackers from kept days when regenerating a
  // subset of the week, so regenerated days still avoid duplicating kept recipes/cuisines.
  if (seed) {
    if (seed.cuisineCounts) Object.keys(seed.cuisineCounts).forEach(function(c) { weekCuisineCounts[c] = seed.cuisineCounts[c]; });
    if (seed.recipeNames) Object.keys(seed.recipeNames).forEach(function(n) { weekRecipeNames[n] = seed.recipeNames[n]; });
  }

  // Rotation multiplier: session-level fairness across all recipes.
  // Fair share = totalSlots / RECIPES.length (unified pool of all recipes).
  function rotationMultiplier(recipe) {
    var total = state.recipeRotation.totalSlots;
    if (total < 1) return 1.0;
    var poolSize = RECIPES.length;
    var fairShare = total / poolSize;
    var count = state.recipeRotation.counts[recipe.name] || 0;
    var ratio = count / Math.max(fairShare, 0.1);
    if (ratio <= 1) return 1.0 + (1.0 - ratio) * 2.0;
    return Math.max(0.1, 1.0 / ratio);
  }

  // Sample one valid combo of mealsPerDay recipes from the pool.
  // Hard exclusions: no duplicate recipe in same combo, cuisine ≤2/week, no same recipe in week.
  // Select the best variant for a recipe based on remaining macro budget.
  // If recipe has no variants, sets selectedVariant to null (backward compatible).
  function selectVariant(recipe, remainingCal, remainingCarbs, remainingPro, remainingFat) {
    recipe.selectedVariant = null;
    if (!recipe.variants || recipe.variants.length === 0) return;
    var bestV = null, bestDev = Infinity;
    recipe.variants.forEach(function(v) {
      var vm = v.totalMacros;
      var devCal = remainingCal > 0 ? Math.abs(vm.calories - remainingCal) / remainingCal : 0;
      var devCarbs = remainingCarbs > 0 ? Math.abs(vm.carbs - remainingCarbs) / remainingCarbs : 0;
      var devPro = remainingPro > 0 ? Math.abs(vm.protein - remainingPro) / remainingPro : 0;
      var devFat = remainingFat > 0 ? Math.abs(vm.fat - remainingFat) / remainingFat : 0;
      var worstDev = Math.max(devCal, devCarbs, devPro, devFat);
      var avgDev = (devCal + devCarbs + devPro + devFat) / 4;
      var score = worstDev * 0.6 + avgDev * 0.4;
      if (score < bestDev) { bestDev = score; bestV = v; }
    });
    recipe.selectedVariant = bestV;
  }

  function sampleCombo(mealsPerDay) {
    var combo = [], names = {}, cuisines = {};
    // Track cumulative macros for variant selection during sampling
    var cumCal = 0, cumCarbs = 0, cumPro = 0, cumFat = 0;
    for (var m = 0; m < mealsPerDay; m++) {
      var attempts = 0;
      while (attempts < 20) {
        var r = RECIPES[Math.floor(Math.random() * RECIPES.length)];
        if (names[r.name]) { attempts++; continue; }
        var wcCount = (weekCuisineCounts[r.cuisine] || 0) + (cuisines[r.cuisine] || 0);
        if (wcCount >= 2) { attempts++; continue; }
        if (weekRecipeNames[r.name]) { attempts++; continue; }
        // Select best variant based on remaining budget
        var mealsLeft = mealsPerDay - m;
        var remCal = Math.max(1, (targetCal - cumCal) / mealsLeft);
        var remCarbs = Math.max(0.1, (targetCarbs - cumCarbs) / mealsLeft);
        var remPro = Math.max(0.1, (targetProtein - cumPro) / mealsLeft);
        var remFat = Math.max(0.1, (targetFat - cumFat) / mealsLeft);
        selectVariant(r, remCal, remCarbs, remPro, remFat);
        // Use variant macros if selected, else base macros
        var macros = (r.selectedVariant ? r.selectedVariant.totalMacros : r.totalMacros);
        combo.push(r);
        names[r.name] = true;
        cuisines[r.cuisine] = (cuisines[r.cuisine] || 0) + 1;
        cumCal += macros.calories; cumCarbs += macros.carbs;
        cumPro += macros.protein; cumFat += macros.fat;
        break;
      }
      if (combo.length <= m) {
        for (var fi = 0; fi < RECIPES.length; fi++) {
          if (!names[RECIPES[fi].name]) {
            selectVariant(RECIPES[fi], targetCal / mealsPerDay, targetCarbs / mealsPerDay, targetProtein / mealsPerDay, targetFat / mealsPerDay);
            combo.push(RECIPES[fi]); names[RECIPES[fi].name] = true; break;
          }
        }
      }
    }
    return combo;
  }

  // ===== PER-COMBO FEASIBILITY ANALYSIS =====
  // Computes achievable macro ranges with 10% buffer (FIX A), runs full multi-target
  // cross-constraint checks for all binding macro pairs (FIX B), and returns the
  // tightest feasibility margin for use in combo scoring (FIX C).
  // Returns: number. Negative = infeasible, positive = tightest margin fraction.
  function comboFeasible(combo, relaxPct) {
    var rp = relaxPct || 0;
    var fixCal = 0, fixPro = 0, fixFat = 0, fixCarbs = 0;
    var adj = [];
    combo.forEach(function(recipe) {
      var ings = recipe.selectedVariant ? recipe.selectedVariant.ingredients : recipe.ingredients;
      ings.forEach(function(ing) {
        var cal = ing.calories || 0, pro = ing.protein || 0;
        var fat = ing.fat || 0, carbs = ing.carbs || 0;
        if (ing.isSpice || ing.name === "Soy Sauce" ||
            (ing.name !== "Egg" && isUnitBased(ing.name)) || cal < 50) {
          fixCal += cal; fixPro += pro; fixFat += fat; fixCarbs += carbs;
          return;
        }
        adj.push({ cal: cal, pro: pro, fat: fat, carbs: carbs });
      });
    });

    // Independent min/max ranges
    var minCal = fixCal, maxCal = fixCal, minPro = fixPro, maxPro = fixPro;
    var minFat = fixFat, maxFat = fixFat, minCarbs = fixCarbs, maxCarbs = fixCarbs;
    for (var i = 0; i < adj.length; i++) {
      var a = adj[i];
      minCal += a.cal * 0.5;  maxCal += a.cal * 3.0;
      minPro += a.pro * 0.5;  maxPro += a.pro * 3.0;
      minFat += a.fat * 0.5;  maxFat += a.fat * 3.0;
      minCarbs += a.carbs * 0.5; maxCarbs += a.carbs * 3.0;
    }

    // FIX A: Tightened range checks — target must be well WITHIN the achievable range,
    // not at the edge. 10% buffer ensures the solver has room to maneuver when
    // multiple constraints interact. Margins widen with relaxPct.
    var rangeHi = 0.95 + rp; // target <= max * 0.95 (5% headroom from top)
    var rangeLo = 1.05 - rp; // target >= min * 1.05 (5% headroom from bottom)

    if (targetCal > maxCal * rangeHi || targetCal < minCal * rangeLo) return -1;
    if (targetProtein > maxPro * rangeHi || targetProtein < minPro * rangeLo) return -1;
    if (targetFat > maxFat * rangeHi || targetFat < minFat * rangeLo) return -1;
    if (targetCarbs > maxCarbs * rangeHi || targetCarbs < minCarbs * rangeLo) return -1;

    // Cross-constraint target zones (validation zone: 95-105%)
    var zLo = 0.95 - rp, zHi = 1.05 + rp;
    var proLo = targetProtein * zLo, proHi = targetProtein * zHi;
    var fatLo = targetFat * zLo, fatHi = targetFat * zHi;
    var calLo = targetCal * zLo, calHi = targetCal * zHi;
    var carbsLo = targetCarbs * zLo, carbsHi = targetCarbs * zHi;

    // Helper: greedy path — scale sorted ingredients to reach a target macro value.
    // macroIdx: 0=cal, 1=pro, 2=fat, 3=carbs (maps to adj.{cal,pro,fat,carbs}).
    // minRest: if true, scale non-contributing ingredients to 0.5x; if false, to 3.0x.
    function greedyPath(sorted, targetMacro, macroIdx, minRest) {
      var mnr = minRest !== false; // default true
      var sc = [];
      var tot = [fixCal, fixPro, fixFat, fixCarbs];
      for (var i2 = 0; i2 < sorted.length; i2++) {
        var s = sorted[i2];
        var macroVal = macroIdx === 0 ? s.cal : macroIdx === 1 ? s.pro : macroIdx === 2 ? s.fat : s.carbs;
        var sv;
        if (tot[macroIdx] >= targetMacro) {
          sv = mnr ? 0.5 : 3.0;
        } else if (macroVal > 0) {
          var need = targetMacro - tot[macroIdx];
          sv = (macroVal * 3.0 <= need) ? 3.0 : Math.max(0.5, Math.min(3.0, need / macroVal));
        } else {
          sv = mnr ? 0.5 : 3.0;
        }
        tot[0] += s.cal * sv; tot[1] += s.pro * sv; tot[2] += s.fat * sv; tot[3] += s.carbs * sv;
        sc.push(sv);
      }
      return { reached: tot[macroIdx] >= targetMacro * 0.999, cal: tot[0], pro: tot[1], fat: tot[2], carbs: tot[3], scales: sc };
    }

    // ===== CHECK A: PATH TO PROTEIN — cheapest protein, check fat/cal =====
    var byProCal = adj.slice().sort(function(a, b) {
      return (b.pro / Math.max(b.cal, 1)) - (a.pro / Math.max(a.cal, 1));
    });
    var cA = greedyPath(byProCal, proLo, 1);
    if (!cA.reached) return -1;
    if (cA.fat > fatHi) return -1;
    if (cA.cal > calHi * 1.10) return -1;
    // Max fat achievable when protein is fixed at these scales
    var cAFatMax = fixFat;
    for (var l = 0; l < byProCal.length; l++) {
      cAFatMax += byProCal[l].fat * (cA.scales[l] > 0.51 ? cA.scales[l] : 3.0);
    }
    if (cAFatMax < fatLo) return -1;

    // ===== CHECK B: PATH TO FAT FLOOR — fattiest first, check pro/cal =====
    var byFatCal = adj.slice().sort(function(a, b) {
      return (b.fat / Math.max(b.cal, 1)) - (a.fat / Math.max(a.cal, 1));
    });
    var cB = greedyPath(byFatCal, fatLo, 2);
    if (!cB.reached) return -1;
    if (cB.pro > proHi) return -1;
    if (cB.cal > calHi * 1.10) return -1;
    var cBProMax = fixPro;
    for (var lb = 0; lb < byFatCal.length; lb++) {
      cBProMax += byFatCal[lb].pro * (cB.scales[lb] > 0.51 ? cB.scales[lb] : 3.0);
    }
    if (cBProMax < proLo) return -1;

    // ===== CHECK C: PATH TO CALORIE TARGET — min fat check =====
    var byCalFatEff = adj.slice().sort(function(a, b) {
      var ra = a.fat > 0 ? a.cal / a.fat : 9999;
      var rb = b.fat > 0 ? b.cal / b.fat : 9999;
      return rb - ra;
    });
    var cC = greedyPath(byCalFatEff, calLo, 0);
    if (cC.reached && cC.fat > fatHi) return -1;

    // ===== CHECK D: PATH TO CARB TARGET — check calories =====
    var byCarbCal = adj.slice().sort(function(a, b) {
      return (b.carbs / Math.max(b.cal, 1)) - (a.carbs / Math.max(a.cal, 1));
    });
    var cD = greedyPath(byCarbCal, carbsLo, 3);
    if (cD.reached && cD.cal > calHi * 1.10) return -1;

    // ===== CHECK E: PROTEIN:FAT RATIO RANGE =====
    // Compute the achievable protein:fat ratio range for this combo.
    // minRatio: maximize fat, minimize protein → all fatty at 3x, all lean at 0.5x
    // maxRatio: maximize protein, minimize fat → all lean at 3x, all fatty at 0.5x
    // Target ratio must fall within [minRatio, maxRatio].
    if (targetFat > 0) {
      var targetRatio = targetProtein / targetFat;
      // For max ratio: each ingredient at scale that maximizes pro/fat contribution
      // Scale up high pro:fat ingredients (lean), scale down low pro:fat (fatty)
      var maxRPro = fixPro, maxRFat = fixFat, minRPro = fixPro, minRFat = fixFat;
      for (var re = 0; re < adj.length; re++) {
        var ra = adj[re];
        var ingRatio = ra.fat > 0 ? ra.pro / ra.fat : 9999;
        // For max ratio: scale up if ingredient is leaner than target, down if fattier
        maxRPro += ra.pro * (ingRatio >= targetRatio ? 3.0 : 0.5);
        maxRFat += ra.fat * (ingRatio >= targetRatio ? 3.0 : 0.5);
        // For min ratio: opposite
        minRPro += ra.pro * (ingRatio < targetRatio ? 3.0 : 0.5);
        minRFat += ra.fat * (ingRatio < targetRatio ? 3.0 : 0.5);
      }
      var maxRatio = maxRFat > 0 ? maxRPro / maxRFat : 9999;
      var minRatio = minRFat > 0 ? minRPro / minRFat : 0;
      if (targetRatio > maxRatio * (1.0 + rp * 2) || targetRatio < minRatio * (1.0 - rp * 2)) return -1;
    }

    // ===== CHECK G: PROTEIN CEILING FROM BELOW =====
    // If min achievable protein (all protein sources at 0.5x, others at 3.0x for cal) > proHi
    // Sort by pro/cal ascending (least protein per calorie first). Reach calLo.
    var byLeastPro = adj.slice().sort(function(a, b) {
      return (a.pro / Math.max(a.cal, 1)) - (b.pro / Math.max(b.cal, 1));
    });
    var cG = greedyPath(byLeastPro, calLo, 0);
    if (cG.reached && cG.pro > proHi) return -1;

    // Compute tightest margin for FIX C scoring bonus
    var margins = [];
    if (targetCal > 0) { margins.push((maxCal - targetCal) / targetCal); margins.push((targetCal - minCal) / targetCal); }
    if (targetProtein > 0) { margins.push((maxPro - targetProtein) / targetProtein); margins.push((targetProtein - minPro) / targetProtein); }
    if (targetFat > 0) { margins.push((maxFat - targetFat) / targetFat); margins.push((targetFat - minFat) / targetFat); }
    if (targetCarbs > 0) { margins.push((maxCarbs - targetCarbs) / targetCarbs); margins.push((targetCarbs - minCarbs) / targetCarbs); }
    return margins.length > 0 ? Math.min.apply(null, margins) : 0;
  }

  // Score a combo against daily targets. Returns { weight, macros, rejected }.
  // comboFeasible now returns a margin number (negative = infeasible, positive = margin).
  function scoreCombo(combo, relaxPct) {
    var rp = relaxPct || 0;
    var cal = 0, carbs = 0, pro = 0, fat = 0;
    combo.forEach(function(r) {
      var m = (r.selectedVariant ? r.selectedVariant.totalMacros : r.totalMacros);
      cal += m.calories; carbs += m.carbs; pro += m.protein; fat += m.fat;
    });
    var macros = { calories: cal, carbs: carbs, protein: pro, fat: fat };

    // Dynamic feasibility: negative = infeasible, positive = tightest margin
    var feasMargin = comboFeasible(combo, rp);
    var rejected = feasMargin < 0;

    // Macro deviation scoring (against DAILY targets, not per-meal)
    var devCal = targetCal > 0 ? Math.abs(cal - targetCal) / targetCal : 0;
    var devCarbs = targetCarbs > 0 ? Math.abs(carbs - targetCarbs) / targetCarbs : 0;
    var devPro = targetProtein > 0 ? Math.abs(pro - targetProtein) / targetProtein : 0;
    var devFat = targetFat > 0 ? Math.abs(fat - targetFat) / targetFat : 0;
    var worstDev = Math.max(devCal, devCarbs, devPro, devFat);
    var avgDev = (devCal + devCarbs + devPro + devFat) / 4;
    var macroDevScore = worstDev * 0.6 + avgDev * 0.4;
    var macroFitWeight = Math.max(0.1, Math.min(2.0, 2.0 - macroDevScore * 1.9));

    // FIX C: Solver-friendliness bonus — prefer combos with wide feasibility margins.
    // Wider margins mean the solver has more room to satisfy all 4 constraints simultaneously.
    if (!rejected && feasMargin > 0) {
      var marginBonus = 1.0 + Math.min(feasMargin, 0.5) * 0.3; // up to 15% bonus
      macroFitWeight *= marginBonus;
    }

    // Rotation: average of individual recipe rotation multipliers
    var rotSum = 0;
    combo.forEach(function(r) { rotSum += rotationMultiplier(r); });
    var rotationAvg = rotSum / combo.length;

    return { weight: macroFitWeight * rotationAvg, macros: macros, rejected: rejected, totalDev: devCal + devCarbs + devPro + devFat };
  }

  for (var si = 0; si < slots.length; si++) {
    var slot = slots[si];
    var d = slot[0];
    // Step 1: meals per day unchanged
    var mealsPerDay = targetCal > 2200 ? 3 : (targetCal < 1500 ? 2 : (d % 2 === 0 ? 3 : 2));

    // Step 2: Generate 100 candidate combos (increased from 50 for better hard-rejection survival)
    var COMBO_COUNT = 100;
    var combos = [];
    for (var ci = 0; ci < COMBO_COUNT; ci++) {
      combos.push(sampleCombo(mealsPerDay));
    }

    // Step 3: Score and hard-reject
    var scored = [];
    var bestFallback = null;
    for (var sci = 0; sci < combos.length; sci++) {
      var result = scoreCombo(combos[sci], 0);
      result.combo = combos[sci];
      if (!bestFallback || result.totalDev < bestFallback.totalDev) bestFallback = result;
      if (!result.rejected) scored.push(result);
    }

    // If all 100 rejected, relax thresholds by 10% and resample another 100
    // Fallback verified to scale correctly with COMBO_COUNT (was hardcoded for 50)
    if (scored.length === 0) {
      var firstRoundLen = combos.length;
      for (var ci2 = 0; ci2 < COMBO_COUNT; ci2++) {
        combos.push(sampleCombo(mealsPerDay));
      }
      for (var sci2 = firstRoundLen; sci2 < combos.length; sci2++) {
        var result2 = scoreCombo(combos[sci2], 0.10);
        result2.combo = combos[sci2];
        if (!bestFallback || result2.totalDev < bestFallback.totalDev) bestFallback = result2;
        if (!result2.rejected) scored.push(result2);
      }
    }

    // FIX 2: Fallback quality floor. If best fallback is below 65% calories or
    // 55% protein, don't use it — force 3-meal retry instead. One retry only.
    if (scored.length === 0 && bestFallback) {
      var fbCal = bestFallback.macros.calories;
      var fbPro = bestFallback.macros.protein;
      var belowFloor = (targetCal > 0 && fbCal < targetCal * 0.65) || (targetProtein > 0 && fbPro < targetProtein * 0.55);
      if (belowFloor && mealsPerDay < 3) {
        // Re-run as 3-meal day
        mealsPerDay = 3;
        combos = [];
        for (var ci3 = 0; ci3 < COMBO_COUNT; ci3++) { combos.push(sampleCombo(3)); }
        scored = [];
        bestFallback = null;
        for (var sci3 = 0; sci3 < combos.length; sci3++) {
          var result3 = scoreCombo(combos[sci3], 0);
          result3.combo = combos[sci3];
          if (!bestFallback || result3.totalDev < bestFallback.totalDev) bestFallback = result3;
          if (!result3.rejected) scored.push(result3);
        }
        if (scored.length === 0) {
          for (var ci4 = 0; ci4 < COMBO_COUNT; ci4++) { combos.push(sampleCombo(3)); }
          for (var sci4 = combos.length - COMBO_COUNT; sci4 < combos.length; sci4++) {
            var result4 = scoreCombo(combos[sci4], 0.10);
            result4.combo = combos[sci4];
            if (!bestFallback || result4.totalDev < bestFallback.totalDev) bestFallback = result4;
            if (!result4.rejected) scored.push(result4);
          }
        }
      }
      // Accept best fallback (original or 3-meal retry)
      if (scored.length === 0 && bestFallback) {
        bestFallback.rejected = false;
        scored.push(bestFallback);
      }
    }

    // Step 4: Sort scored combos by weight descending for solver-as-filter.
    scored.sort(function(a, b) { return b.weight - a.weight; });

    // Step 5: SOLVER-AS-FILTER — try top combos, accept first that solves to [95%, 105%].
    // Instead of picking one combo and accepting whatever the solver produces, we try
    // multiple combos and use the solver itself as the definitive filter.
    var MAX_SOLVE_ATTEMPTS = Math.min(10, scored.length);
    var bestSolveResult = null; // {allMealData, dayTotals, dayMeals, dayPicks, maxDev}

    function trySolveCombo(picks, suppress) {
      var mealData = picks.map(function(recipe) {
        var srcIngs = (recipe.selectedVariant ? recipe.selectedVariant.ingredients : recipe.ingredients);
        var ings = srcIngs.map(function(ing) { return Object.assign({}, ing, { adjustment: null }); });
        applyIngredientOverrides(ings, overrides);
        return { recipe: recipe, ingredients: ings };
      });
      adjustDayMeals(mealData, targetCal, targetCarbs, targetProtein, targetFat, suppress);
      var dt = { calories:0, carbs:0, protein:0, fat:0 };
      var dm = [];
      mealData.forEach(function(md) {
        var mt = md.ingredients.filter(function(i){return !i.isSpice;}).reduce(function(a, i) { return { calories: a.calories+i.calories, carbs: a.carbs+i.carbs, protein: a.protein+i.protein, fat: a.fat+i.fat }; }, { calories:0, carbs:0, protein:0, fat:0 });
        dt.calories += mt.calories; dt.carbs += mt.carbs; dt.protein += mt.protein; dt.fat += mt.fat;
        dm.push({ originalName: md.recipe.name, name: md.recipe.name, cuisine: md.recipe.cuisine, isBreakfast: md.recipe.tags.indexOf("breakfast") !== -1, ingredients: md.ingredients, totalMacros: mt, variantLabel: (md.recipe.selectedVariant ? md.recipe.selectedVariant.label : null) });
      });
      // Check if all macros are in [95%, 105%]
      var maxDev = 0;
      var targets4 = [targetCal, targetCarbs, targetProtein, targetFat];
      var vals4 = [dt.calories, dt.carbs, dt.protein, dt.fat];
      for (var tk = 0; tk < 4; tk++) {
        if (targets4[tk] > 0) {
          var dv = Math.abs(vals4[tk] - targets4[tk]) / targets4[tk];
          if (dv > maxDev) maxDev = dv;
        }
      }
      return { allMealData: mealData, dayTotals: dt, dayMeals: dm, dayPicks: picks, maxDev: maxDev, inZone: maxDev <= 0.05 };
    }

    for (var attempt = 0; attempt < MAX_SOLVE_ATTEMPTS; attempt++) {
      var solveResult = trySolveCombo(scored[attempt].combo, true); // suppress diagnostics
      if (!bestSolveResult || solveResult.maxDev < bestSolveResult.maxDev) {
        bestSolveResult = solveResult;
      }
      if (solveResult.inZone) break; // solved cleanly, accept
    }

    // If the best result is out of zone, re-run it without suppression to log diagnostics
    if (!bestSolveResult.inZone) {
      bestSolveResult = trySolveCombo(bestSolveResult.dayPicks, false);
    }

    var dayPicks = bestSolveResult.dayPicks;
    var allMealData = bestSolveResult.allMealData;
    var dayTotals = bestSolveResult.dayTotals;
    var dayMeals = bestSolveResult.dayMeals;

    // Update weekly trackers for the selected combo
    dayPicks.forEach(function(r) {
      weekRecipeNames[r.name] = true;
    });
    allMealData.forEach(function(md) {
      state.recipeRotation.counts[md.recipe.name] = (state.recipeRotation.counts[md.recipe.name] || 0) + 1;
      state.recipeRotation.totalSlots++;
    });

    // Display-only sort: breakfast-appropriate recipes appear first in the day's meal list.
    // A recipe is breakfast-appropriate if tagged "breakfast". This does NOT affect macro
    // calculations, grocery list aggregation, or any other logic — purely cosmetic ordering.
    dayMeals.sort(function(a, b) { return (b.isBreakfast ? 1 : 0) - (a.isBreakfast ? 1 : 0); });

    // Protein Shake — FINAL SAFETY NET after combo selection + adjustment loop.
    // Verified intact after combo-first rewrite and rescue phase removal.
    // Triggers when protein is still >10% below target. Max one per day. Not a meal card.
    // Macros: 1 scoop = 25g protein, 3g carbs, 1g fat, 120 calories.
    var proteinShake = null;
    var proteinDeficit = targetProtein - dayTotals.protein;
    if (proteinDeficit > targetProtein * 0.10) {
      proteinShake = { scoops: 1, protein: 25, carbs: 3, fat: 1, calories: 120 };
      dayTotals.calories += 120;
      dayTotals.carbs += 3;
      dayTotals.protein += 25;
      dayTotals.fat += 1;
    }

    dayMeals.forEach(function(meal) {
      weekCuisineCounts[meal.cuisine] = (weekCuisineCounts[meal.cuisine] || 0) + 1;
    });

    var totalsObj = { calories: round1(dayTotals.calories), carbs: round1(dayTotals.carbs), protein: round1(dayTotals.protein), fat: round1(dayTotals.fat) };

    slot.forEach(function(dayIdx) {
      var clonedMeals = dayMeals.map(function(meal) {
        return Object.assign({}, meal, {
          ingredients: meal.ingredients.map(function(ing) { return Object.assign({}, ing); }),
          totalMacros: Object.assign({}, meal.totalMacros)
        });
      });
      days[dayIdx] = { day: dayIdx, meals: clonedMeals, totals: Object.assign({}, totalsObj), proteinShake: proteinShake };
    });
  }
  return days;
}

// ===== UMD EXPORTS =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isUnitBased,
    getUnitCount,
    round1,
    _enrichFromRegistry,
    applyIngredientOverrides,
    adjustDayMeals,
    generatePlan,
    initializeData,
    state,
    get DEFAULT_MACROS_PER100() { return DEFAULT_MACROS_PER100; },
  };
}
