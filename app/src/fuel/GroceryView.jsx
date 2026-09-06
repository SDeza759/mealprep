import { useMemo, useState } from 'react';
import { groceryQty } from '../core/display.js';
import { Card, Button, Icon, Empty, Stepper, cx, useToast } from '../ui/index.jsx';
import { usePlansDoc, useDayGroups, useSettings } from './hooks.js';
import { useSelectedDate } from './selection.js';
import { groceryForWindow } from './grocery.js';
import { fmtRange } from './common.js';

// The list for a rolling window: from the day you are looking at, for the number of days you
// usually plan. Check-offs live on the plans document so they survive moving between days.
export default function GroceryView() {
  const [date] = useSelectedDate();
  const [plans, setPlans] = usePlansDoc();
  const [dg] = useDayGroups();
  const [settings, patchSettings] = useSettings();
  const toast = useToast();
  const [showUses, setShowUses] = useState(false);
  const n = settings.planDays || 7;

  const { list, scoops, planned } = useMemo(() => groceryForWindow(plans, dg, date, n), [plans, dg, date, n]);
  const checked = plans.groceryChecked || {};
  const total = list.reduce((c, s) => c + s.items.length, 0) + (scoops ? 1 : 0);
  const done = Object.keys(checked).filter((k) => checked[k]).length;

  const toggle = (name) => setPlans((prev) => {
    const next = { ...(prev.groceryChecked || {}) };
    if (next[name]) delete next[name]; else next[name] = true;
    return { ...prev, groceryChecked: next };
  });
  const clearChecks = () => setPlans((prev) => ({ ...prev, groceryChecked: {} }));

  const text = () => {
    const lines = [`Grocery list · ${fmtRange(date, n)}`, '', ''];
    lines[1] = '='.repeat(lines[0].length);
    list.forEach((section) => {
      lines.push(section.category, '-'.repeat(section.category.length));
      section.items.forEach((item) => lines.push(`  ${item.name} - ${groceryQty(item, settings.units)}`));
      lines.push('');
    });
    if (scoops > 0) lines.push('Supplements', '-----------', `  Protein Powder - ${scoops} ${scoops === 1 ? 'scoop' : 'scoops'}`, '');
    return lines.join('\n');
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(text()); toast('Copied the list.', { kind: 'ok' }); }
    catch { toast('Could not copy — your browser blocked clipboard access.', { kind: 'warn' }); }
  };
  const share = async () => {
    try { if (navigator.share) await navigator.share({ title: 'Grocery list', text: text() }); else await copy(); }
    catch (err) { if (!err || err.name !== 'AbortError') toast('Sharing failed.', { kind: 'warn' }); }
  };

  return (
    <>
      <Card className="row" style={{ padding: '10px 16px' }}>
        <div className="grow stack-sm" style={{ gap: 2 }}>
          <div className="strong">{fmtRange(date, n)}</div>
          <div className="small muted">{planned} planned day{planned === 1 ? '' : 's'} from the day you're looking at</div>
        </div>
        <Stepper value={n} onChange={(v) => patchSettings({ planDays: v })} min={1} max={28} ariaLabel="Days covered" />
      </Card>
      {planned === 0 ? (
        <Card><Empty title="Nothing planned in this range">Generate from the day you're looking at under Plan, or move to a planned day, and the list builds itself.</Empty></Card>
      ) : (
        <>
          <div className="row between">
            <div className="small muted">{total} items · {list.length} aisles{done ? ` · ${done} in the cart` : ''}</div>
            <div className="row-sm">
              {done > 0 && <button type="button" className="link" onClick={clearChecks}>Reset</button>}
              <button type="button" className="link" onClick={() => setShowUses(!showUses)}>{showUses ? 'Hide uses' : 'Show uses'}</button>
              <Button size="sm" icon="copy" onClick={copy}>Copy</Button>
              {typeof navigator !== 'undefined' && navigator.share && <Button size="sm" icon="upload" onClick={share} aria-label="Share" />}
            </div>
          </div>
          {list.map((section) => (
            <Card key={section.category} pad={false} style={{ padding: '6px 16px' }}>
              <div className="eyebrow" style={{ padding: '10px 0 4px' }}>{section.category}</div>
              <div className="list">
                {section.items.map((item) => {
                  const on = !!checked[item.name];
                  return (
                    <button key={item.name} type="button" className="item" onClick={() => toggle(item.name)} style={{ opacity: on ? 0.5 : 1 }}>
                      <span className={cx('checkbox', on && 'on')}><Icon name="check" size={14} stroke={3} /></span>
                      <div className="grow stack-sm" style={{ gap: 2 }}>
                        <div className="item-name" style={{ textDecoration: on ? 'line-through' : undefined }}>{item.name}</div>
                        {showUses && <div className="small muted">{[...new Set(item.appearances)].join(', ')}</div>}
                      </div>
                      <div className="num nowrap" style={{ fontSize: 16 }}>{groceryQty(item, settings.units)}</div>
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
          {scoops > 0 && (
            <Card pad={false} style={{ padding: '6px 16px' }}>
              <div className="eyebrow" style={{ padding: '10px 0 4px' }}>Supplements</div>
              <button type="button" className="item" onClick={() => toggle('Protein Powder')} style={{ opacity: checked['Protein Powder'] ? 0.5 : 1 }}>
                <span className={cx('checkbox', checked['Protein Powder'] && 'on')}><Icon name="check" size={14} stroke={3} /></span>
                <div className="grow stack-sm" style={{ gap: 2 }}><div className="item-name">Protein powder</div>{showUses && <div className="small muted">Protein shake on {scoops} {scoops === 1 ? 'day' : 'days'}</div>}</div>
                <div className="num nowrap" style={{ fontSize: 16 }}>{scoops} {scoops === 1 ? 'scoop' : 'scoops'}</div>
              </button>
            </Card>
          )}
        </>
      )}
    </>
  );
}
