import { useMemo, useState } from 'react';
import { buildGroceryList, groceryToText } from '../core/index.js';
import { groceryQty } from '../core/display.js';
import * as ops from '../core/planOps.js';
import { Card, Button, Icon, Empty, cx, useToast } from '../ui/index.jsx';
import { usePlanDoc, useDayGroups, useSettings } from './hooks.js';

export default function GroceryView() {
  const [planDoc, setPlanDoc] = usePlanDoc();
  const [dg] = useDayGroups();
  const [settings] = useSettings();
  const toast = useToast();
  const [showUses, setShowUses] = useState(false);

  const list = useMemo(() => {
    if (!planDoc) return [];
    return buildGroceryList(planDoc.days.map((d, di) => (dg.excluded.includes(di) ? null : d)), planDoc.servings);
  }, [planDoc, dg.excluded]);
  const scoops = planDoc ? ops.shakeScoops(planDoc.days) : 0;
  const checked = (planDoc && planDoc.groceryChecked) || {};
  const total = list.reduce((n, s) => n + s.items.length, 0) + (scoops ? 1 : 0);
  const done = Object.keys(checked).filter((k) => checked[k]).length;

  const toggle = (name) => setPlanDoc((prev) => {
    if (!prev) return prev;
    const next = { ...(prev.groceryChecked || {}) };
    if (next[name]) delete next[name]; else next[name] = true;
    return { ...prev, groceryChecked: next };
  });
  const clearChecks = () => setPlanDoc((prev) => (prev ? { ...prev, groceryChecked: {} } : prev));

  const text = () => {
    let t = groceryToText(list);
    if (settings.units === 'metric') {
      // groceryToText formats weights in lbs/oz; rebuild lines in the user's units instead.
      const lines = ['Weekly Grocery List', '==================', ''];
      list.forEach((section) => {
        lines.push(section.category, '-'.repeat(section.category.length));
        section.items.forEach((item) => lines.push(`  ${item.name} - ${groceryQty(item, 'metric')}`));
        lines.push('');
      });
      t = lines.join('\n');
    }
    if (scoops > 0) t += `\nSupplements\n-----------\n  Protein Powder - ${scoops} ${scoops === 1 ? 'scoop' : 'scoops'}\n`;
    return t;
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(text()); toast('Copied the list.', { kind: 'ok' }); }
    catch { toast('Could not copy — your browser blocked clipboard access.', { kind: 'warn' }); }
  };
  const share = async () => {
    try { if (navigator.share) await navigator.share({ title: 'Grocery list', text: text() }); else await copy(); }
    catch (err) { if (!err || err.name !== 'AbortError') toast('Sharing failed.', { kind: 'warn' }); }
  };

  if (!planDoc) return <Card><Empty title="No plan yet">Generate a week under Plan and the grocery list builds itself.</Empty></Card>;

  return (
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
                    <div className={cx('item-name')} style={{ textDecoration: on ? 'line-through' : undefined }}>{item.name}</div>
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
            <div className="grow stack-sm" style={{ gap: 2 }}><div className="item-name">Protein powder</div>{showUses && <div className="small muted">Protein shake on {scoops} {scoops === 1 ? 'day' : 'days'} this week</div>}</div>
            <div className="num nowrap" style={{ fontSize: 16 }}>{scoops} {scoops === 1 ? 'scoop' : 'scoops'}</div>
          </button>
        </Card>
      )}
    </>
  );
}
