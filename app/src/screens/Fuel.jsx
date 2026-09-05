import { useNavigate, useParams } from 'react-router-dom';
import { Seg, Button, Confirm, cx } from '../ui/index.jsx';
import { useState } from 'react';
import PlanView from '../fuel/PlanView.jsx';
import GroceryView from '../fuel/GroceryView.jsx';
import RecipesView from '../fuel/RecipesView.jsx';
import LogView from '../fuel/LogView.jsx';
import { usePlanDoc, usePlanActions } from '../fuel/hooks.js';
import { weekLabel, useIsDesktop } from '../fuel/common.js';

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
  const [planDoc] = usePlanDoc();
  const actions = usePlanActions();
  const [confirm, setConfirm] = useState(false);
  const current = VIEWS.some((v) => v.value === view) ? view : 'plan';

  return (
    <div className={cx('page', desktop && 'page-wide')}>
      <div className="page-head">
        <div className="page-head-l">
          <div className="eyebrow">{weekLabel(planDoc && planDoc.weekStart, desktop)}</div>
          <div className="num page-title">Fuel</div>
        </div>
        <Button variant="primary" size={desktop ? undefined : 'sm'} icon={desktop ? 'refresh' : undefined} onClick={() => (planDoc ? setConfirm(true) : actions.generate())}>{desktop ? 'Generate week' : 'Generate'}</Button>
      </div>
      <Seg value={current} onChange={(v) => navigate(VIEWS.find((x) => x.value === v).path)} options={VIEWS} />
      {current === 'plan' && <PlanView />}
      {current === 'grocery' && <GroceryView />}
      {current === 'recipes' && <RecipesView />}
      {current === 'log' && <LogView />}
      <Confirm open={confirm} onClose={() => setConfirm(false)} title="Replace this week's plan?" confirmLabel="Generate" onConfirm={() => actions.generate()}
        body="A fresh week is generated from your targets and day groups. Eaten marks, servings and batch tags on the current plan are cleared." />
    </div>
  );
}
