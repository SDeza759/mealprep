import { useEffect, useLayoutEffect } from 'react';
import { useDoc } from '../store/store.js';
import { DEFAULT_SETTINGS, ACCENTS } from '../store/defaults.js';

const DARK_BG = '#0B0F14';
const LIGHT_BG = '#F5F7F9';

function applyThemeColor(theme) {
  const dark = theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? DARK_BG : LIGHT_BG);
}

// Applies the saved theme (System / Light / Dark) and accent to <html>, and mirrors them into
// localStorage so index.html can paint the right theme before the bundle loads.
export default function ThemeProvider({ children }) {
  const [settings] = useDoc('settings', DEFAULT_SETTINGS);
  const theme = settings.theme || 'system';
  const accent = settings.accent || 'orange';

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
    const a = ACCENTS[accent] || ACCENTS.orange;
    root.style.setProperty('--accent-dark', a.dark);
    root.style.setProperty('--accent-light', a.light);
    applyThemeColor(theme);
    try { localStorage.setItem('dialed:theme', theme); localStorage.setItem('dialed:accent', accent); } catch { /* private mode */ }
  }, [theme, accent]);

  useEffect(() => {
    if (theme !== 'system') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyThemeColor('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  return children;
}
