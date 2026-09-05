import { Card, Icon } from '../ui/index.jsx';

export default function Body() {
  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-l"><div className="eyebrow">Milestone 2</div><div className="num page-title">Body</div></div>
      </div>
      <Card className="stack">
        <div className="row"><Icon name="body" size={22} style={{ color: 'var(--accent)' }} /><div className="strong">Weight trend and adaptive targets</div></div>
        <div className="small muted" style={{ lineHeight: 1.45 }}>
          Log a morning weight, see the trend, and let next week's calories follow it. Apple Health sync arrives with the phone app.
        </div>
      </Card>
    </div>
  );
}
