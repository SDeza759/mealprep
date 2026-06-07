// validator.js — 100-week macro accuracy validator.
// Mirrors the logic of the browser debug panel's 100-week validator.

function run(targets, ctx) {
  const { algorithm, data } = ctx;
  const { state, generatePlan } = algorithm;
  const { DAYS_NAMES } = data;

  const result = {
    mode: 'validator',
    timestamp: new Date().toISOString(),
    targets: { cal: targets.cal, carbs: targets.carbs, protein: targets.protein, fat: targets.fat },
    totalDays: 0,
    passCount: 0,
    failCount: 0,
    passRate: 0,
    failures: [],
    summary: {
      byMacro: { cal: 0, carbs: 0, protein: 0, fat: 0 },
      worstDeviation: null,
      meanDeviation: { cal: 0, carbs: 0, protein: 0, fat: 0 },
    },
    error: null,
  };

  const sumAbsDev = { cal: 0, carbs: 0, protein: 0, fat: 0 };

  try {
    // Reset rotation + diagnostics ONCE before the run (matches browser runValidation).
    state.recipeRotation = { counts: {}, totalSlots: 0 };
    state.solverDiagnostics = [];

    for (let week = 0; week < 100; week++) {
      const plan = generatePlan(targets.cal, targets.carbs, targets.protein, targets.fat, {}, [], []);

      plan.forEach((day, dayIdx) => {
        if (!day) return;
        result.totalDays++;

        const t = day.totals;
        const macros = { cal: t.calories, carbs: t.carbs, protein: t.protein, fat: t.fat };

        // Use the browser validator's pass logic exactly: integer-percentage round
        // then check >=95 && <=105 on all four macros.
        const cp = Math.round((t.calories / targets.cal) * 100);
        const bp = Math.round((t.carbs / targets.carbs) * 100);
        const pp = Math.round((t.protein / targets.protein) * 100);
        const fp = Math.round((t.fat / targets.fat) * 100);

        const failedMacros = [];
        if (cp < 95 || cp > 105) failedMacros.push('cal');
        if (bp < 95 || bp > 105) failedMacros.push('carbs');
        if (pp < 95 || pp > 105) failedMacros.push('protein');
        if (fp < 95 || fp > 105) failedMacros.push('fat');

        // Precise deviations for the JSON report (un-rounded).
        const deviations = {
          cal: ((t.calories - targets.cal) / targets.cal) * 100,
          carbs: ((t.carbs - targets.carbs) / targets.carbs) * 100,
          protein: ((t.protein - targets.protein) / targets.protein) * 100,
          fat: ((t.fat - targets.fat) / targets.fat) * 100,
        };

        sumAbsDev.cal += Math.abs(deviations.cal);
        sumAbsDev.carbs += Math.abs(deviations.carbs);
        sumAbsDev.protein += Math.abs(deviations.protein);
        sumAbsDev.fat += Math.abs(deviations.fat);

        if (failedMacros.length === 0) {
          result.passCount++;
        } else {
          result.failCount++;
          for (const m of failedMacros) result.summary.byMacro[m]++;

          for (const m of failedMacros) {
            const absDev = Math.abs(deviations[m]);
            if (
              !result.summary.worstDeviation ||
              absDev > Math.abs(result.summary.worstDeviation.percentage)
            ) {
              result.summary.worstDeviation = {
                macro: m,
                percentage: Math.round(deviations[m] * 10) / 10,
                week: week + 1,
                day: dayIdx + 1,
              };
            }
          }

          result.failures.push({
            week: week + 1,
            day: dayIdx + 1,
            dayName: DAYS_NAMES[dayIdx],
            macros: {
              cal: Math.round(macros.cal),
              carbs: Math.round(macros.carbs),
              protein: Math.round(macros.protein),
              fat: Math.round(macros.fat),
            },
            deviations: {
              cal: Math.round(deviations.cal * 10) / 10,
              carbs: Math.round(deviations.carbs * 10) / 10,
              protein: Math.round(deviations.protein * 10) / 10,
              fat: Math.round(deviations.fat * 10) / 10,
            },
            failedMacros,
            meals: day.meals.map((m) => ({
              name: m.originalName,
              cuisine: m.cuisine,
              selectedVariant: m.variantLabel || null,
            })),
          });
        }
      });
    }

    result.passRate = result.totalDays > 0 ? result.passCount / result.totalDays : 0;
    if (result.totalDays > 0) {
      result.summary.meanDeviation = {
        cal: Math.round((sumAbsDev.cal / result.totalDays) * 10) / 10,
        carbs: Math.round((sumAbsDev.carbs / result.totalDays) * 10) / 10,
        protein: Math.round((sumAbsDev.protein / result.totalDays) * 10) / 10,
        fat: Math.round((sumAbsDev.fat / result.totalDays) * 10) / 10,
      };
    }
  } catch (e) {
    result.error = { message: e.message, stack: e.stack };
  }

  return result;
}

function formatSummary(result, filename) {
  const t = result.targets;
  const targetStr = `${t.cal}/${t.carbs}/${t.protein}/${t.fat}`;
  const rate = (result.passRate * 100).toFixed(1);
  let s = `Validator: ${result.passCount}/${result.totalDays} days passed (${rate}%) | targets ${targetStr} | output: ${filename}`;

  if (result.failCount > 0) {
    const m = result.summary.byMacro;
    const w = result.summary.worstDeviation;
    s += `\n  Failed days: ${result.failCount} (cal: ${m.cal}, carbs: ${m.carbs}, protein: ${m.protein}, fat: ${m.fat})`;
    if (w) {
      const sign = w.percentage >= 0 ? '+' : '';
      s += ` | worst deviation: ${sign}${w.percentage}% ${w.macro} on week ${w.week} day ${w.day}`;
    }
  }

  if (result.error) {
    s += `\n  ERROR: ${result.error.message}`;
  }

  return s;
}

module.exports = { run, formatSummary };
