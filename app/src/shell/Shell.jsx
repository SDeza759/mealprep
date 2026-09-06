import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon, Seg } from '../ui/index.jsx';
import { useSettings } from '../fuel/hooks.js';

const TABS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/fuel', label: 'Fuel', icon: 'fuel' },
  { to: '/train', label: 'Train', icon: 'train' },
  { to: '/body', label: 'Body', icon: 'body' },
  { to: '/more', label: 'More', icon: 'more' },
];

const SIDE = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/fuel', label: 'Fuel', icon: 'fuel' },
  { to: '/train', label: 'Train', icon: 'train' },
  { to: '/body', label: 'Body', icon: 'body' },
  { to: '/more', label: 'Settings', icon: 'gear' },
];

export default function Shell({ children }) {
  const { pathname } = useLocation();
  const [settings, patch] = useSettings();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <nav className="sidebar" aria-label="Sections">
        <div className="brand">
          <Icon name="today" size={26} stroke={2} style={{ color: 'var(--accent)' }} />
          <div className="num brand-name">DIALED</div>
        </div>
        {SIDE.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `nav${isActive ? ' on' : ''}`}>
            <Icon name={t.icon} size={20} />{t.label}
          </NavLink>
        ))}
        <div className="grow" />
        <Seg value={settings.theme} onChange={(v) => patch({ theme: v })} options={[
          { value: 'system', label: 'Auto', icon: 'monitor' },
          { value: 'light', label: 'Light', icon: 'sun' },
          { value: 'dark', label: 'Dark', icon: 'moon' },
        ]} />
      </nav>
      <main className="shell-main">{children}</main>
      <nav className="tabbar" aria-label="Sections">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tab${isActive ? ' on' : ''}`}>
            <Icon name={t.icon} size={22} />{t.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
