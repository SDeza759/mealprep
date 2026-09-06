import { useMemo, useState } from 'react';
import { RECIPES } from '../core/index.js';
import { fmtInt, formatWeight, getUnitDisplay } from '../core/display.js';
import { Card, Button, Bar, Icon, Empty, Confirm } from '../ui/index.jsx';
import { usePlanDoc, useStats, usePlanActions, useSettings } from './hooks.js';

// Eaten history. The old app's Stats view, trimmed to what earns its place on a phone.
export default function LogView() {
  const [planDoc] = usePlanDoc();
  const [stats, setStats] = useStats();
  const [settings] = useSettings();
  const actions = usePlanActions();
  const [confirmDel, setConfirmDel] = useState(null);
  const [showAllRecipes, setShowAllRecipes] = useState(false);

  const eatenCount = planDoc ? Object.keys(planDoc.eaten || {}).length : 0;
  const plans = stats.plans || [];

  const derived = useMemo(() => {
    if (!plans.length) return null;
    const recipeMap = {};
    RECIPES.forEach((r) => { recipeMap[r.name] = { name: r.name, cuisine: r.cuisine, count: 0, lastDate: null }; });
    plans.forEach((p) => p.meals.forEach((m) => {
      if (!recipeMap[m.recipe]) recipeMap[m.recipe] = { name: m.recipe, cuisine: m.cuisine, count: 0, lastDate: null };
      recipeMap[m.recipe].count++;
      if (!recipeMap[m.recipe].lastDate || p.date > recipeMap[m.recipe].lastDate) recipeMap[m.recipe].lastDate = p.date;
    }));
    const recipes = Object.values(recipeMap).sort((a, b) => (b.count !== a.count ? b.count - a.count : a.name.localeCompare(b.name)));
    const trends = plans.map((p) => {
      const hit = (v, t) => Math.abs(v / t - 1) <= 0.05;
      return { date: p.date, avg: p.avgDaily, cal: hit(p.avgDaily.calories, p.targets.calories), c: hit(p.avgDaily.carbs, p.targets.carbs), p: hit(p.avgDaily.protein, p.targets.protein), f: hit(p.avgDaily.fat, p.targets.fat), id: p.id, score: p.consistencyScore, meals: p.totalMeals };
    });
    const cuisineTotals = {}; let totalCuisine = 0;
    plans.forEach((p) => Object.keys(p.cuisines).forEach((c) => { cuisineTotals[c] = (cuisineTotals[c] || 0) + p.cuisines[c]; totalCuisine += p.cuisines[c]; }));
    const cuisines = Object.entries(cuisineTotals).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count, pct: Math.round((count / totalCuisine) * 100) }));
    const ingTotals = {};
    plans.forEach((p) => Object.entries(p.ingredientGrams || p.ingredientCounts || {}).forEach(([n, g]) => { ingTotals[n] = (ingTotals[n] || 0) + g; }));
    const ingredients = Object.entries(ingTotals).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([name, grams]) => ({ name, grams: Math.round(grams) }));
    const avgScore = Math.round(plans.reduce((s, p) => s + p.consistencyScore, 0) / plans.length);
    const dates = plans.map((p) => p.date).sort();
    let streak = 1, longest = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = Math.round((new Date(dates[i]) - new Date(dates[i - 1])) / 86400000);
      streak = diff <= 8 ? streak + 1 : 1;
      if (streak > longest) longest = streak;
    }
    if (dates.length <= 1) { streak = plans.length; longest = plans.length; }
    return { recipes, trends, cuisines, ingredients, avgScore, streak, longest, eatenRecipes: recipes.filter((r) => r.count > 0).length };
  }, [plans]);

  const deleteEntry = (id) => setStats({ ...stats, plans: plans.filter((p) => p.id !== id) });

  return (
    <>
      <Card className="stack">
        <div className="section-head"><div className="eyebrow">This week</div><div className="small muted">{eatenCount} meal{eatenCount === 1 ? '' : 's'} ticked</div></div>
        <div className="small muted" style={{ lineHeight: 1.45 }}>Tick meals as you eat them (on Home or in the plan), then log them here. Logging records what you actually ate and clears the ticks.</div>
        <Button variant="primary" block icon="clipboard" onClick={() => actions.logEaten()} disabled={!eatenCount}>Log {eatenCount || ''} eaten meal{eatenCount === 1 ? '' : 's'}</Button>
      </Card>
      {!derived ? (
        <Card><Empty title="Nothing logged yet">Your eaten history — recipes, cuisines, macro consistency — builds up here.</Empty></Card>
      ) : (
        <>
          <div className="grid-3">
            <Card className="kpi"><div className="eyebrow" style={{ fontSize: 10 }}>Logged</div><div className="num">{plans.length}</div></Card>
            <Card className="kpi"><div className="eyebrow" style={{ fontSize: 10 }}>Avg score</div><div className="num">{derived.avgScore}</div></Card>
            <Card className="kpi"><div className="eyebrow" style={{ fontSize: 10 }}>Streak</div><div className="num">{derived.streak}<span className="small muted" style={{ fontFamily: 'var(--font)', fontWeight: 500 }}> / {derived.longest}</span></div></Card>
          </div>
          <Card className="stack">
            <div className="eyebrow">Macro trend · daily average per log</div>
            <div className="list">
              {derived.trends.slice().reverse().map((w) => (
                <div key={w.id} className="item" style={{ padding: '8px 0' }}>
                  <div className="grow stack-sm" style={{ gap: 2 }}>
                    <div className="row-sm"><span className="strong small">{w.date}</span><span className="small muted">· {w.meals} meals · score {w.score}</span></div>
                    <div className="small row-sm wrap" style={{ gap: 8 }}>
                      {[['kcal', fmtInt(w.avg.calories), w.cal], ['C', `${Math.round(w.avg.carbs)} g`, w.c], ['P', `${Math.round(w.avg.protein)} g`, w.p], ['F', `${Math.round(w.avg.fat)} g`, w.f]].map(([l, v, ok]) => (
                        <span key={l} style={{ color: ok ? 'var(--fg)' : 'var(--warn)' }}>{l} {v}</span>
                      ))}
                    </div>
                  </div>
                  <button type="button" className="icon-btn sm muted" aria-label="Delete log" onClick={() => setConfirmDel(w.id)}><Icon name="trash" size={16} /></button>
                </div>
              ))}
            </div>
          </Card>
          <Card className="stack">
            <div className="section-head"><div className="eyebrow">Recipes eaten</div><div className="small muted">{derived.eatenRecipes} of {derived.recipes.length}</div></div>
            <div className="stack-sm">
              {(showAllRecipes ? derived.recipes : derived.recipes.filter((r) => r.count > 0).slice(0, 10)).map((r) => (
                <div key={r.name} className="row-sm">
                  <span className="small ellipsis" style={{ width: 150, flex: '0 0 auto', opacity: r.count ? 1 : 0.5 }}>{r.name}</span>
                  <div className="grow"><Bar value={r.count} target={derived.recipes[0].count || 1} color="var(--protein)" thin /></div>
                  <span className="num small" style={{ width: 28, textAlign: 'right' }}>{r.count || '—'}</span>
                </div>
              ))}
            </div>
            <button type="button" className="link" onClick={() => setShowAllRecipes(!showAllRecipes)}>{showAllRecipes ? 'Show top 10' : 'Show every recipe'}</button>
          </Card>
          <div className="grid-2">
            <Card className="stack">
              <div className="eyebrow">Cuisines</div>
              <div className="stack-sm">
                {derived.cuisines.map((c) => (
                  <div key={c.name} className="row-sm">
                    <span className="small ellipsis" style={{ width: 84, flex: '0 0 auto' }}>{c.name}</span>
                    <div className="grow"><Bar value={c.pct} target={100} color="var(--carbs)" thin /></div>
                    <span className="num small" style={{ width: 34, textAlign: 'right' }}>{c.pct}%</span>
                  </div>
                ))}
              </div>
              {derived.cuisines[0] && derived.cuisines[0].pct > 40 && <div className="small muted">{derived.cuisines[0].name} dominates at {derived.cuisines[0].pct}% — consider more variety.</div>}
            </Card>
            <Card className="stack">
              <div className="eyebrow">Top ingredients</div>
              <div className="stack-sm">
                {derived.ingredients.map((ig) => (
                  <div key={ig.name} className="row-sm">
                    <span className="small ellipsis" style={{ width: 84, flex: '0 0 auto' }}>{ig.name}</span>
                    <div className="grow"><Bar value={ig.grams} target={derived.ingredients[0].grams} color="var(--fat)" thin /></div>
                    <span className="num small nowrap" style={{ textAlign: 'right' }}>{getUnitDisplay(ig.name, ig.grams) || formatWeight(ig.grams, settings.units)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
      <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Delete this log entry?" confirmLabel="Delete" danger onConfirm={() => deleteEntry(confirmDel)} />
    </>
  );
}
