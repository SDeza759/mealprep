import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Seg, Button, cx } from '../ui/index.jsx';
import GenerateSheet from '../fuel/GenerateSheet.jsx';
import PlanView from '../fuel/PlanView.jsx';
import GroceryView from '../fuel/GroceryView.jsx';
import RecipesView from '../fuel/RecipesView.jsx';
import LogView from '../fuel/LogView.jsx';
import { useSelectedDate } from '../fuel/selection.js';
import { parseIso, todayIso } from '../fuel/dates.js';
import { fmtLongDate, useIsDesktop } from '../fuel/common.js';

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
  const [date] = useSelectedDate();
  const [planOpen, setPlanOpen] = useState(false);
  const current = VIEWS.some((v) => v.value === view) ? view : 'plan';

  return (
    <div className={cx('page', desktop && 'page-wide')}>
      <div className="page-head">
        <div className="page-head-l">
          <div className="eyebrow">{fmtLongDate(parseIso(date))}{date === todayIso() ? ' · today' : ''}</div>
          <div className="num page-title">Fuel</div>
        </div>
        <Button variant="primary" size={desktop ? undefined : 'sm'} icon={desktop ? 'refresh' : undefined} onClick={() => setPlanOpen(true)}>Plan ahead</Button>
      </div>
      <Seg value={current} onChange={(v) => navigate(VIEWS.find((x) => x.value === v).path)} options={VIEWS} />
      {current === 'plan' && <PlanView />}
      {current === 'grocery' && <GroceryView />}
      {current === 'recipes' && <RecipesView />}
      {current === 'log' && <LogView />}
      <GenerateSheet open={planOpen} onClose={() => setPlanOpen(false)} from={date} />
    </div>
  );
}
