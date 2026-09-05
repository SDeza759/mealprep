import { useNavigate } from 'react-router-dom';
import { Card, SRow, Icon } from '../ui/index.jsx';
import { useSettings, useDayGroups, useUnits, useTargets } from '../fuel/hooks.js';
import { targetsLine, useIsDesktop } from '../fuel/common.js';
import { ACCENTS } from '../store/defaults.js';
import { SHORT_DAYS } from '../core/planOps.js';

const THEME_LABEL = { system: 'Follows the system', light: 'Light', dark: 'Dark' };

export default function More() {
  const navigate = useNavigate();
  const desktop = useIsDesktop();
  const [settings] = useSettings();
  const [dg] = useDayGroups();
  const units = useUnits();
  const T = useTargets();
  const go = (s) => () => navigate(`/more/${s}`);
  const unitsText = units.length ? units.map((u) => u.name).join(' · ') + (dg.excluded.length ? ` · ${dg.excluded.map((d) => SHORT_DAYS[d]).join(', ')} free` : '') : 'Every day is free';
  const cookText = units.filter((u) => dg.cookDays[u.lead] != null && dg.cookDays[u.lead] !== '').map((u) => `${SHORT_DAYS[dg.cookDays[u.lead]]} for ${u.name}`).join(' · ');
  const mealsText = [...new Set(units.map((u) => u.meals))].length === 1 && units.length ? `${units[0].meals} · shake when needed` : units.map((u) => `${u.name} ${u.meals}`).join(' · ');

  return (
    <div className="page" style={desktop ? { maxWidth: 720 } : undefined}>
      <div className="page-head">
        <div className="page-head-l"><div className="eyebrow">More</div><div className="num page-title">Settings</div></div>
      </div>
      <Card pad={false} className="card-rows">
        <SRow title="Appearance" value={`${THEME_LABEL[settings.theme] || 'Follows the system'} · ${(ACCENTS[settings.accent] || ACCENTS.orange).label} accent`} onClick={go('appearance')} />
        <SRow title="Units" value={settings.units === 'metric' ? 'kg · g' : 'lb · oz'} onClick={go('units')} />
      </Card>
      <Card pad={false} className="card-rows">
        <SRow title="Targets" value={T.pctValid ? targetsLine(T) : `Percentages add up to ${T.pctSum}% — fix`} onClick={go('targets')} />
        <SRow title="Day groups" value={unitsText} onClick={go('days')} />
        <SRow title="Cook days" value={cookText || 'Not set — pick a day per group'} onClick={go('days')} />
        <SRow title="Meals per day" value={mealsText} onClick={go('meals')} />
      </Card>
      <Card pad={false} className="card-rows">
        <SRow title="Notifications" value={settings.notifications.enabled ? 'On' : 'Off — nothing will ping you'} onClick={go('notifications')} />
      </Card>
      <Card pad={false} className="card-rows">
        <SRow title="Backup" value="Export or import everything as one file" onClick={go('backup')} />
        <SRow title="About Dialed" value="Version, data sources, the old app" onClick={go('about')} />
      </Card>
      <div className="row-sm small muted" style={{ padding: '0 4px' }}><Icon name="info" size={16} />Everything stays on this device. Nothing is sent anywhere.</div>
    </div>
  );
}
