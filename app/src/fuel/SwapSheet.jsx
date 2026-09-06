import { useMemo, useState } from 'react';
import { RECIPES, DAYS_NAMES, round1 } from '../core/index.js';
import { fmtInt } from '../core/display.js';
import { Sheet, Search, Icon } from '../ui/index.jsx';
import { useFavorites } from './hooks.js';

// A plain, complete list — no macro-fit ranking, no compatible/incompatible split (that dry run
// mislabelled workable recipes as incompatible). Every recipe is pickable; the day re-solves
// around the pick and a toast reports if the result lands outside 95–105%.
export default function SwapSheet({ target, onClose, onPick }) {
  const [q, setQ] = useState('');
  const [favorites] = useFavorites();
  const listed = useMemo(() => {
    const s = q.trim().toLowerCase();
    return RECIPES
      .filter((r) => !s || r.name.toLowerCase().includes(s) || r.cuisine.toLowerCase().includes(s))
      .slice()
      .sort((a, b) => {
        const fa = favorites[a.name] ? 0 : 1, fb = favorites[b.name] ? 0 : 1;
        return fa !== fb ? fa - fb : a.name.localeCompare(b.name);
      });
  }, [q, favorites]);
  const favCount = listed.filter((r) => favorites[r.name]).length;
  if (!target) return null;
  const title = target.isAdd ? 'Add a meal' : 'Swap recipe';
  const subtitle = `${DAYS_NAMES[target.di]} · the day re-solves around your pick${target.isAdd ? ', rescaling every meal to fit' : ''}`;
  return (
    <Sheet open onClose={onClose} title={title} subtitle={subtitle}>
      <Search value={q} onChange={setQ} placeholder="Search by name or cuisine" autoFocus />
      <div className="list">
        {listed.map((r, i) => {
          const isFav = !!favorites[r.name];
          const divider = favCount > 0 && i === favCount && favCount < listed.length;
          return (
            <button key={r.name} type="button" className="item" style={divider ? { borderTopWidth: 3 } : undefined} onClick={() => onPick(r)}>
              <div className="grow stack-sm" style={{ gap: 3 }}>
                <div className="row-sm">
                  {isFav && <Icon name="star" size={14} fill style={{ color: 'var(--fat)' }} />}
                  <span className="item-name ellipsis">{r.name}</span>
                  <span className="small muted nowrap">· {r.cuisine}</span>
                </div>
                <div className="small muted">{round1(r.totalMacros.carbs)} C · {round1(r.totalMacros.protein)} P · {round1(r.totalMacros.fat)} F{r.variants ? ' · variants' : ''}</div>
              </div>
              <div className="num" style={{ fontSize: 18 }}>{fmtInt(r.totalMacros.calories)}</div>
            </button>
          );
        })}
        {listed.length === 0 && <div className="empty">No recipes match.</div>}
      </div>
      <div className="small dim">{listed.length} of {RECIPES.length} recipes · favorites first</div>
    </Sheet>
  );
}
