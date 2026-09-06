import { useState } from 'react';
import { DAYS_NAMES, RECIPE_COOKING_DATA, round1 } from '../core/index.js';
import { ingQtyText, fmtInt } from '../core/display.js';
import { Sheet, Button, Stepper, Tag, Icon, Chip, cx } from '../ui/index.jsx';
import { macroLine } from './common.js';
import { useFavorites, useSettings } from './hooks.js';

// readOnly hides the editing actions (swap, remove) — Home logs, Fuel edits.
export default function MealDetailSheet({ planDoc, di, mi, onClose, actions, onSwap, readOnly = false }) {
  const [favorites, toggleFav] = useFavorites();
  const [settings] = useSettings();
  const [stepsOpen, setStepsOpen] = useState(true);
  const day = planDoc && planDoc.days[di];
  const meal = day && day.meals[mi];
  if (!meal) return null;
  const key = `${di}-${mi}`;
  const isEaten = !!planDoc.eaten[key];
  const servings = planDoc.servings[key] || 1;
  const isFresh = planDoc.tags[key] === 'fresh';
  const cook = RECIPE_COOKING_DATA[meal.originalName];
  const mainIngs = meal.ingredients.filter((x) => !x.isSpice);
  const spiceIngs = meal.ingredients.filter((x) => x.isSpice);
  const isFav = !!favorites[meal.originalName];

  return (
    <Sheet open onClose={onClose}
      title={<span className="row-sm wrap">{meal.name}{meal.variantLabel && <Tag>{meal.variantLabel}</Tag>}<Tag>{meal.cuisine}</Tag></span>}
      subtitle={DAYS_NAMES[di]}
      footer={
        <>
          {!readOnly && <Button variant="ghost" icon="swap" onClick={() => onSwap(di, mi)}>Swap</Button>}
          {!readOnly && <Button variant="danger" icon="trash" onClick={() => { actions.remove(di, mi); onClose(); }} aria-label="Remove meal" />}
          <Button variant="ghost" icon="star" onClick={() => toggleFav(meal.originalName)} className={isFav ? 'accent' : ''} aria-label={isFav ? 'Unfavorite' : 'Favorite'} />
          <Button variant={isEaten ? 'primary' : 'ghost'} icon="check" block onClick={() => actions.toggleEaten(di, mi)}>{isEaten ? 'Eaten' : 'Mark eaten'}</Button>
        </>
      }>
      <div className="row between">
        <div className="stack-sm" style={{ gap: 3 }}>
          <div className="num" style={{ fontSize: 26 }}>{fmtInt(meal.totalMacros.calories)} <span className="eyebrow">kcal</span></div>
          <div className="small muted">{macroLine(meal.totalMacros, { kcal: false })}</div>
        </div>
        <div className="stack-sm" style={{ alignItems: 'flex-end', gap: 4 }}>
          <Stepper value={servings} onChange={(v) => actions.setServing(di, mi, v)} min={1} max={12} ariaLabel="Servings" />
          <div className="eyebrow" style={{ fontSize: 10 }}>servings (grocery)</div>
        </div>
      </div>
      <div className="row-sm wrap">
        <Chip on={!isFresh} icon={isFresh ? undefined : 'pot'} onClick={() => actions.toggleTag(di, mi)}>{isFresh ? 'Fresh · cook that day' : 'Batch · cook ahead'}</Chip>
        {cook && <span className="small muted">Prep {cook.prepTime} · Cook {cook.cookTime}</span>}
      </div>
      <table className="ing-table">
        <thead><tr><th>Ingredient</th><th>Qty</th><th>kcal</th><th>C</th><th>P</th><th>F</th></tr></thead>
        <tbody>
          {mainIngs.map((ing, i) => (
            <tr key={i}>
              <td>{ing.name}{ing.adjustment && <div className="small" style={{ color: 'var(--warn)' }}>{ing.adjustment}</div>}</td>
              <td className="nowrap">{ingQtyText(ing, settings.units)}</td>
              <td>{round1(ing.calories)}</td><td>{round1(ing.carbs)}</td><td>{round1(ing.protein)}</td><td>{round1(ing.fat)}</td>
            </tr>
          ))}
          {spiceIngs.length > 0 && <tr><td colSpan={6} className="muted">{spiceIngs.map((s) => s.name).join(', ')}</td></tr>}
        </tbody>
      </table>
      {cook && cook.steps && (
        <div className="stack">
          <button type="button" className="row-sm link" onClick={() => setStepsOpen(!stepsOpen)}>
            <Icon name={stepsOpen ? 'chevronDown' : 'chevronRight'} size={16} />Cooking instructions
          </button>
          {stepsOpen && <ol className={cx('steps', 'small')}>{cook.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>}
        </div>
      )}
    </Sheet>
  );
}
