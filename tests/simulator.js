// simulator.js — 1000-week distribution simulator.
// Mirrors the logic of the browser debug panel's 1000-week simulator + frequency analyzer.

function run(targets, ctx) {
  const { algorithm, data } = ctx;
  const { state, generatePlan } = algorithm;
  const { RECIPES } = data;

  const result = {
    mode: 'simulator',
    timestamp: new Date().toISOString(),
    targets: { cal: targets.cal, carbs: targets.carbs, protein: targets.protein, fat: targets.fat },
    totalDays: 0,
    passCount: 0,
    failCount: 0,
    passRate: 0,
    recipeFrequency: [],
    variantDistribution: [],
    cuisineDistribution: [],
    ingredientFrequency: [],
    error: null,
  };

  const recipeCount = {};
  // variantCount[recipeName][variantKey] — variantKey is 'base' when no variant was selected.
  const variantCount = {};
  const cuisineCount = {};
  // ingredientCount[name] = { count, totalGrams }
  const ingredientCount = {};

  // Pre-seed all recipes with 0 so the report includes any that never appeared.
  RECIPES.forEach((r) => {
    recipeCount[r.name] = 0;
  });

  try {
    // Reset rotation + diagnostics ONCE before the run (matches browser runSimulation).
    state.recipeRotation = { counts: {}, totalSlots: 0 };
    state.solverDiagnostics = [];

    for (let week = 0; week < 1000; week++) {
      const plan = generatePlan(targets.cal, targets.carbs, targets.protein, targets.fat, {}, [], []);

      plan.forEach((day) => {
        if (!day) return;
        result.totalDays++;

        const t = day.totals;
        const cp = Math.round((t.calories / targets.cal) * 100);
        const bp = Math.round((t.carbs / targets.carbs) * 100);
        const pp = Math.round((t.protein / targets.protein) * 100);
        const fp = Math.round((t.fat / targets.fat) * 100);
        const passed =
          cp >= 95 && cp <= 105 &&
          bp >= 95 && bp <= 105 &&
          pp >= 95 && pp <= 105 &&
          fp >= 95 && fp <= 105;
        if (passed) result.passCount++; else result.failCount++;

        day.meals.forEach((meal) => {
          recipeCount[meal.originalName] = (recipeCount[meal.originalName] || 0) + 1;

          if (!variantCount[meal.originalName]) variantCount[meal.originalName] = {};
          const variantKey = meal.variantLabel || 'base';
          variantCount[meal.originalName][variantKey] =
            (variantCount[meal.originalName][variantKey] || 0) + 1;

          cuisineCount[meal.cuisine] = (cuisineCount[meal.cuisine] || 0) + 1;

          meal.ingredients.forEach((ing) => {
            if (!ingredientCount[ing.name]) ingredientCount[ing.name] = { count: 0, totalGrams: 0 };
            ingredientCount[ing.name].count++;
            ingredientCount[ing.name].totalGrams += ing.grams || 0;
          });
        });
      });
    }

    const totalSlots = Object.values(recipeCount).reduce((a, b) => a + b, 0);

    // Recipe frequency: include all 136, sort desc by count.
    result.recipeFrequency = RECIPES.map((r) => ({
      name: r.name,
      count: recipeCount[r.name] || 0,
      percentage: totalSlots > 0
        ? Math.round((recipeCount[r.name] / totalSlots) * 10000) / 10000
        : 0,
    })).sort((a, b) => b.count - a.count);

    // Variant distribution: only for recipes that have variants. Sort alphabetically.
    result.variantDistribution = RECIPES
      .filter((r) => r.variants && r.variants.length > 0)
      .map((r) => {
        const counts = variantCount[r.name] || {};
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        const variants = [];
        if (counts.base !== undefined) {
          variants.push({
            id: 'base',
            label: 'base',
            count: counts.base,
            percentage: total > 0 ? Math.round((counts.base / total) * 10000) / 10000 : 0,
          });
        }
        r.variants.forEach((v) => {
          if (counts[v.label] !== undefined) {
            variants.push({
              id: v.id,
              label: v.label,
              count: counts[v.label],
              percentage: total > 0 ? Math.round((counts[v.label] / total) * 10000) / 10000 : 0,
            });
          }
        });
        return { recipe: r.name, variants };
      })
      .sort((a, b) => a.recipe.localeCompare(b.recipe));

    const cuisineTotal = Object.values(cuisineCount).reduce((a, b) => a + b, 0);
    result.cuisineDistribution = Object.entries(cuisineCount)
      .map(([cuisine, count]) => ({
        cuisine,
        count,
        percentage: cuisineTotal > 0 ? Math.round((count / cuisineTotal) * 10000) / 10000 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    result.ingredientFrequency = Object.entries(ingredientCount)
      .map(([name, v]) => ({
        name,
        count: v.count,
        totalGrams: Math.round(v.totalGrams),
      }))
      .sort((a, b) => b.count - a.count);

    result.passRate = result.totalDays > 0 ? result.passCount / result.totalDays : 0;
  } catch (e) {
    result.error = { message: e.message, stack: e.stack };
  }

  return result;
}

function formatSummary(result, filename) {
  const t = result.targets;
  const targetStr = `${t.cal}/${t.carbs}/${t.protein}/${t.fat}`;
  const recipesSelected = result.recipeFrequency.filter((r) => r.count > 0).length;
  const totalRecipes = result.recipeFrequency.length;
  const rate = (result.passRate * 100).toFixed(2);

  let s = `Simulator: ${result.totalDays} days, ${result.passCount}/${result.totalDays} passed (${rate}%) | ${recipesSelected}/${totalRecipes} recipes selected | targets ${targetStr} | output: ${filename}`;

  if (result.error) {
    s += `\n  ERROR: ${result.error.message}`;
  }

  return s;
}

module.exports = { run, formatSummary };
