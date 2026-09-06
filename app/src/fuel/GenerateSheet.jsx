import { useEffect, useState } from 'react';
import { Sheet, Button, Stepper, Icon } from '../ui/index.jsx';
import { useSettings, useDayGroups, useTargets, useRangeActions } from './hooks.js';
import { useSelectedDate } from './selection.js';
import { todayIso, weekdayIndex } from './dates.js';
import { windowDates } from './grocery.js';
import { fmtRange } from './common.js';
import { SHORT_DAYS } from '../core/planOps.js';

// "Plan ahead": the first day (any date, today by default) and how many days to cover.
export default function GenerateSheet({ open, onClose, from }) {
  const [settings] = useSettings();
  const [dg] = useDayGroups();
  const T = useTargets();
  const { generateRange, copyPattern, plannedCount, canCopy } = useRangeActions();
  const [, setDate] = useSelectedDate();
  const [start, setStart] = useState(from || todayIso());
  const [n, setN] = useState(settings.planDays || 7);
  useEffect(() => { if (open) { setStart(from || todayIso()); setN(settings.planDays || 7); } }, [open, from, settings.planDays]);

  const valid = /^\d{4}-\d{2}-\d{2}$/.test(start);
  const dates = valid ? windowDates(start, n) : [];
  const free = dates.filter((iso) => dg.excluded.includes(weekdayIndex(iso)));
  const planned = valid ? plannedCount(start, n) : 0;
  const copyable = valid && canCopy(start, n);

  const go = () => { if (!valid) return; if (generateRange(start, n)) { setDate(start); onClose(); } };
  const copy = () => { if (!valid) return; if (copyPattern(start, n)) { setDate(start); onClose(); } };

  return (
    <Sheet open={open} onClose={onClose} title="Plan ahead" subtitle="Pick the first day and how many days to cover"
      footer={
        <>
          <Button block icon="copy" onClick={copy} disabled={!copyable} title={copyable ? undefined : 'Nothing earlier to copy from'}>Repeat last plan</Button>
          <Button block variant="primary" icon="refresh" onClick={go} disabled={!valid || !T.pctValid || free.length === dates.length}>Generate {n} day{n === 1 ? '' : 's'}</Button>
        </>
      }>
      <div className="grid-2">
        <label className="field"><span>From</span><input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label className="field"><span>Days</span><Stepper value={n} onChange={setN} min={1} max={28} ariaLabel="Days to plan" /></label>
      </div>
      {valid && (
        <div className="small muted" style={{ lineHeight: 1.5 }}>
          <div><span className="strong">{fmtRange(start, n)}</span>{free.length ? ` · ${free.map((iso) => SHORT_DAYS[weekdayIndex(iso)]).filter((v, i, a) => a.indexOf(v) === i).join(', ')} free` : ''}</div>
          {planned > 0 && <div className="row-sm" style={{ marginTop: 4 }}><Icon name="alert" size={14} style={{ color: 'var(--warn)' }} />{planned} of these days already have meals — generating replaces them.</div>}
          <div style={{ marginTop: 4 }}>Grouped days inside the range share one plan; days outside it are left alone.</div>
        </div>
      )}
      {!T.pctValid && <div className="warnbox">Macro percentages add up to {T.pctSum}% — fix them under Settings › Targets first.</div>}
    </Sheet>
  );
}
