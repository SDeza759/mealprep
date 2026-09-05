import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import './theme/tokens.css';
import './theme/base.css';
import { createRoot } from 'react-dom/client';
import { boot } from './store/store.js';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<div className="splash">Loading…</div>);

boot()
  .then(() => root.render(<App />))
  .catch((err) => {
    console.error(err);
    root.render(
      <div className="splash" style={{ flexDirection: 'column', gap: 12, padding: 24, textAlign: 'center' }}>
        <div className="num" style={{ fontSize: 24, color: 'var(--fg)' }}>Dialed could not start</div>
        <div className="small">{String(err && err.message ? err.message : err)}</div>
      </div>,
    );
  });
