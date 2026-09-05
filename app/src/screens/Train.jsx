import { Card, Icon } from '../ui/index.jsx';

export default function Train() {
  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-l"><div className="eyebrow">Milestone 4</div><div className="num page-title">Train</div></div>
      </div>
      <Card className="stack">
        <div className="row"><Icon name="train" size={22} style={{ color: 'var(--accent)' }} /><div className="strong">Planning and logging come later</div></div>
        <div className="small muted" style={{ lineHeight: 1.45 }}>
          Train gets its own session after your brief: programme, per-session logging, and the link into Fuel — a lifting day raises that day's carb target.
        </div>
      </Card>
    </div>
  );
}
