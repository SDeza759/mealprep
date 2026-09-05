import { useMemo, useState } from 'react';
import { RECIPES, RECIPE_COOKING_DATA, DEFAULT_MACROS_PER100, getCategory, round1 } from '../core/index.js';
import { fmtInt } from '../core/display.js';
import { Card, Search, Sheet, Tag, Icon, Chip, Button, Seg, cx } from '../ui/index.jsx';
import { useFavorites } from './hooks.js';
import { macroLine } from './common.js';

const CUISINES = ['All', ...new Set(RECIPES.map((r) => r.cuisine))].sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)));

function RecipeSheet({ recipe, onClose, favorites, toggleFav }) {
  if (!recipe) return null;
  const cook = RECIPE_COOKING_DATA[recipe.name];
  const main = recipe.ingredients.filter((i) => !i.isSpice);
  const spices = recipe.ingredients.filter((i) => i.isSpice);
  const isFav = !!favorites[recipe.name];
  return (
    <Sheet open onClose={onClose} title={recipe.name} subtitle={`${recipe.cuisine} · ${recipe.servingSize} · ${recipe.tags.join(', ')}`}
      headRight={<button type="button" className={cx('icon-btn sm', isFav ? 'accent' : 'muted')} aria-label="Favorite" onClick={() => toggleFav(recipe.name)}><Icon name="star" size={18} fill={isFav} /></button>}
      footer={<div className="small muted">As written — the solver scales every ingredient 0.5–3× to hit the day's targets.</div>}>
      <div className="row baseline" style={{ gap: 8 }}>
        <div className="num" style={{ fontSize: 26 }}>{fmtInt(recipe.totalMacros.calories)} <span className="eyebrow">kcal</span></div>
        <div className="small muted">{macroLine(recipe.totalMacros, { kcal: false })}</div>
      </div>
      {cook && <div className="small muted">Prep {cook.prepTime} · Cook {cook.cookTime}</div>}
      <table className="ing-table">
        <thead><tr><th>Ingredient</th><th>g</th><th>kcal</th><th>C</th><th>P</th><th>F</th></tr></thead>
        <tbody>
          {main.map((ing, i) => <tr key={i}><td>{ing.name}</td><td>{Math.round(ing.grams)}</td><td>{round1(ing.calories)}</td><td>{round1(ing.carbs)}</td><td>{round1(ing.protein)}</td><td>{round1(ing.fat)}</td></tr>)}
          {spices.length > 0 && <tr><td colSpan={6} className="muted">{spices.map((s) => s.name).join(', ')}</td></tr>}
        </tbody>
      </table>
      {recipe.variants && <div className="small"><span className="muted">Variants: </span>{recipe.variants.map((v) => v.label).join(', ')}</div>}
      {cook && cook.steps && <ol className="steps small">{cook.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>}
    </Sheet>
  );
}

function IngredientsTable() {
  const [q, setQ] = useState('');
  const names = useMemo(() => Object.keys(DEFAULT_MACROS_PER100).sort(), []);
  const s = q.trim().toLowerCase();
  const filtered = names.filter((n) => !s || n.toLowerCase().includes(s) || getCategory(n).toLowerCase().includes(s));
  return (
    <>
      <Search value={q} onChange={setQ} placeholder="Search ingredients or aisles" />
      <div className="small muted">Per 100 g · {filtered.length} ingredients</div>
      <Card pad={false} style={{ padding: '4px 16px' }}>
        <table className="ing-table">
          <thead><tr><th>Ingredient</th><th>kcal</th><th>C</th><th>P</th><th>F</th></tr></thead>
          <tbody>
            {filtered.map((n) => { const d = DEFAULT_MACROS_PER100[n]; return <tr key={n}><td>{n}<div className="small muted">{getCategory(n)}</div></td><td>{d.calories}</td><td>{d.carbs}</td><td>{d.protein}</td><td>{d.fat}</td></tr>; })}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export default function RecipesView() {
  const [q, setQ] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [favOnly, setFavOnly] = useState(false);
  const [mode, setMode] = useState('recipes');
  const [open, setOpen] = useState(null);
  const [favorites, toggleFav] = useFavorites();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return RECIPES.filter((r) => {
      const ms = !s || r.name.toLowerCase().includes(s) || r.ingredients.some((i) => i.name.toLowerCase().includes(s));
      return ms && (cuisine === 'All' || r.cuisine === cuisine) && (!favOnly || favorites[r.name]);
    });
  }, [q, cuisine, favOnly, favorites]);
  const favCount = Object.keys(favorites).length;

  return (
    <>
      <Seg value={mode} onChange={setMode} options={[{ value: 'recipes', label: `Recipes · ${RECIPES.length}` }, { value: 'ingredients', label: 'Ingredients' }]} />
      {mode === 'ingredients' ? <IngredientsTable /> : (
        <>
          <Search value={q} onChange={setQ} placeholder="Search recipes or ingredients" />
          <div className="row-sm">
            <select className="input" value={cuisine} onChange={(e) => setCuisine(e.target.value)} aria-label="Cuisine" style={{ flex: 1 }}>
              {CUISINES.map((c) => <option key={c} value={c}>{c === 'All' ? 'All cuisines' : c}</option>)}
            </select>
            <Chip on={favOnly} hi={favOnly} icon="star" onClick={() => setFavOnly(!favOnly)}>Favorites{favCount ? ` · ${favCount}` : ''}</Chip>
          </div>
          <div className="small muted">{filtered.length} recipe{filtered.length === 1 ? '' : 's'}</div>
          <div className="stack">
            {filtered.map((r) => {
              const isFav = !!favorites[r.name];
              const main = r.ingredients.filter((i) => !i.isSpice);
              return (
                <Card key={r.name} className="stack-sm" role="button" tabIndex={0} onClick={() => setOpen(r)} onKeyDown={(e) => { if (e.key === 'Enter') setOpen(r); }} style={{ cursor: 'pointer', gap: 6 }}>
                  <div className="row top">
                    <div className="grow row-sm wrap" style={{ gap: 6 }}><span className="meal-name">{r.name}</span><Tag>{r.cuisine}</Tag></div>
                    <button type="button" className={cx('icon-btn sm', isFav ? 'accent' : 'muted')} style={{ border: 0, background: 'none' }} aria-label={isFav ? 'Unfavorite' : 'Favorite'} onClick={(e) => { e.stopPropagation(); toggleFav(r.name); }}><Icon name="star" size={18} fill={isFav} /></button>
                  </div>
                  <div className="small muted ellipsis">{main.map((i) => i.name).join(', ')}</div>
                  <div className="small">{macroLine(r.totalMacros)}</div>
                </Card>
              );
            })}
            {filtered.length === 0 && <Card><div className="empty">No recipes match.</div></Card>}
          </div>
        </>
      )}
      {open && <RecipeSheet recipe={open} onClose={() => setOpen(null)} favorites={favorites} toggleFav={toggleFav} />}
    </>
  );
}
