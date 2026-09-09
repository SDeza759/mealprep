import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Seg, Button, Confirm, Stepper, cx } from '../ui/index.jsx';
import PlanView from '../fuel/PlanView.jsx';
import GroceryView from '../fuel/GroceryView.jsx';
import RecipesView from '../fuel/RecipesView.jsx';
import LogView from '../fuel/LogView.jsx';
import { useSettings, useRangeActions, useUnits, useWeekPlan } from '../fuel/hooks.js';
import { useSelectedDate } from '../fuel/selection.js';
import { parseIso, todayIso, weekStartOf, weekdayIndex } from '../fuel/dates.js';
import { unitForDay } from '../core/planOps.js';
import { fmtLongDate, fmtShortDate, fmtRange, useIsDesktop } from '../fuel/common.js';

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
  const [settings, patchSettings] = useSettings();
  const { generateRange, plannedCount } = useRangeActions();
  const [confirm, setConfirm] = useState(null); // { from, planned }
  const current = VIEWS.some((v) => v.value === view) ? view : 'plan';
  const n = settings.planDays || 7;

  // Cook day for the selected day's unit, when that unit has batch meals in this week's plan.
  const units = useUnits();
  const weekStart = weekStartOf(date);
  const [week] = useWeekPlan(weekStart);
  const unit = unitForDay(units, weekdayIndex(date));
  const hasBatch = !!(unit && week && unit.days.some((d) => week.days[d] && week.days[d].meals.some((_, mi) => week.tags[`${d}-${mi}`] !== 'fresh')));

  // Generate from a day for the usual number of days. Days that already hold meals are only
  // replaced after a confirmation.
  const startGenerate = (from = date) => {
    const planned = plannedCount(from, n);
    if (planned > 0) { setConfirm({ from, planned }); return; }
    if (generateRange(from, n)) { setDate(from); if (current !== 'plan') navigate('/fuel'); }
  };

  // Cook day · days to plan · Generate. Beside the title on desktop; on the phone the Plan view puts
  // them in their own full-width row under the title (the title row can't fit all three), the other
  // views keep Generate beside the title.
  const actions = (
    <>
      {current === 'plan' && hasBatch && <Button size={desktop ? undefined : 'sm'} icon="pot" onClick={() => navigate(`/fuel/cook/${weekStart}/${unit.key}`)}>Cook day</Button>}
      {current === 'plan' && <Stepper value={n} onChange={(v) => patchSettings({ planDays: v })} min={1} max={28} ariaLabel="Days to plan" />}
      <Button variant="primary" size={desktop ? undefined : 'sm'} icon={desktop ? 'refresh' : undefined} className={!desktop && current === 'plan' ? 'grow' : undefined}
        onClick={() => startGenerate(date)}>{desktop ? `Generate ${n} day${n === 1 ? '' : 's'}` : 'Generate'}</Button>
    </>
  );

  return (
    <div className={cx('page', desktop && 'page-wide')}>
      <div className="page-head">
        <div className="page-head-l">
          <div className="eyebrow nowrap">{(desktop ? fmtLongDate : fmtShortDate)(parseIso(date))}{date === todayIso() ? ' · today' : ''}</div>
          <div className="num page-title">Fuel</div>
        </div>
        {(desktop || current !== 'plan') && <div className="row-sm">{actions}</div>}
      </div>
      {!desktop && current === 'plan' && <div className="row-sm">{actions}</div>}
      <Seg value={current} onChange={(v) => navigate(VIEWS.find((x) => x.value === v).path)} options={VIEWS} />
      {current === 'plan' && <PlanView />}
      {current === 'grocery' && <GroceryView />}
      {current === 'recipes' && <RecipesView />}
      {current === 'log' && <LogView />}
      <Confirm open={!!confirm} onClose={() => setConfirm(null)} title={confirm ? `Replace ${confirm.planned} planned day${confirm.planned === 1 ? '' : 's'}?` : ''} confirmLabel="Generate"
        onConfirm={() => { if (confirm && generateRange(confirm.from, n)) { setDate(confirm.from); if (current !== 'plan') navigate('/fuel'); } }}
        body={confirm ? `${fmtRange(confirm.from, n)} gets a fresh plan from your targets and day groups. Eaten marks, servings and batch tags on those days are cleared.` : ''} />
    </div>
  );
}
