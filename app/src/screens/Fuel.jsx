import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Seg, Button, Confirm, cx } from '../ui/index.jsx';
import PlanView from '../fuel/PlanView.jsx';
import GroceryView from '../fuel/GroceryView.jsx';
import RecipesView from '../fuel/RecipesView.jsx';
import LogView from '../fuel/LogView.jsx';
import { useSettings, useRangeActions } from '../fuel/hooks.js';
import { useSelectedDate } from '../fuel/selection.js';
import { parseIso, todayIso } from '../fuel/dates.js';
import { fmtLongDate, fmtRange, useIsDesktop } from '../fuel/common.js';

const VIEWS = [
  { value: 'plan', label: 'Plan', path: '/fuel' },
  { value: 'grocery', label: 'Grocery', path: '/fuel/grocery' },
  { value: 'recipes', label: 'Recipes', path: '/fuel/recipes' },
  { value: 'log', label: 'Log', path: '/fuel/log' },
];

export default function Fuel() {
  const { view = 'plan' } = useParams();
  const navigate = useNavigate();
  const desktop = useIsDesktop();
  const [date, setDate] = useSelectedDate();
  const [settings] = useSettings();
  const { generateRange, plannedCount } = useRangeActions();
  const [confirm, setConfirm] = useState(null); // { from, planned }
  const current = VIEWS.some((v) => v.value === view) ? view : 'plan';
  const n = settings.planDays || 7;

  // Generate from a day for the usual number of days. Days that already hold meals are only
  // replaced after a confirmation.
  const startGenerate = (from = date) => {
    const planned = plannedCount(from, n);
    if (planned > 0) { setConfirm({ from, planned }); return; }
    if (generateRange(from, n)) { setDate(from); if (current !== 'plan') navigate('/fuel'); }
  };

  return (
    <div className={cx('page', desktop && 'page-wide')}>
      <div className="page-head">
        <div className="page-head-l">
          <div className="eyebrow">{fmtLongDate(parseIso(date))}{date === todayIso() ? ' · today' : ''}</div>
          <div className="num page-title">Fuel</div>
        </div>
        <Button variant="primary" size={desktop ? undefined : 'sm'} icon={desktop ? 'refresh' : undefined} onClick={() => startGenerate(date)}>{desktop ? `Generate ${n} days` : 'Generate'}</Button>
      </div>
      <Seg value={current} onChange={(v) => navigate(VIEWS.find((x) => x.value === v).path)} options={VIEWS} />
      {current === 'plan' && <PlanView onGenerate={startGenerate} />}
      {current === 'grocery' && <GroceryView />}
      {current === 'recipes' && <RecipesView />}
      {current === 'log' && <LogView />}
      <Confirm open={!!confirm} onClose={() => setConfirm(null)} title={confirm ? `Replace ${confirm.planned} planned day${confirm.planned === 1 ? '' : 's'}?` : ''} confirmLabel="Generate"
        onConfirm={() => { if (confirm && generateRange(confirm.from, n)) { setDate(confirm.from); if (current !== 'plan') navigate('/fuel'); } }}
        body={confirm ? `${fmtRange(confirm.from, n)} gets a fresh plan from your targets and day groups. Eaten marks, servings and batch tags on those days are cleared.` : ''} />
    </div>
  );
}
