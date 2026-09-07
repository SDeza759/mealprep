import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import ThemeProvider from './theme/ThemeProvider.jsx';
import { ToastProvider, Confirm } from './ui/index.jsx';
import { clearAll } from './store/store.js';
import Shell from './shell/Shell.jsx';
import Home from './screens/Home.jsx';
import Fuel from './screens/Fuel.jsx';
import CookDay from './screens/CookDay.jsx';
import Train from './screens/Train.jsx';
import Body from './screens/Body.jsx';
import More from './screens/More.jsx';
import SettingsSection from './screens/SettingsSection.jsx';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

// `?fresh` on any URL: ask, then erase everything on this device and reload as a first launch.
// A review/testing aid — the same thing as More › Backup › Erase everything, reachable from a bookmark.
function FreshStart() {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(() => params.has('fresh'));
  const dismiss = () => {
    setOpen(false);
    setParams((p) => { p.delete('fresh'); return p; }, { replace: true });
  };
  const go = async () => {
    await clearAll();
    const url = new URL(window.location.href);
    url.searchParams.delete('fresh');
    window.location.replace(url.href);
  };
  return (
    <Confirm open={open} onClose={dismiss} title="Start as a new user?" confirmLabel="Start fresh" danger onConfirm={go}
      body="Erases every plan, log, favorite and setting Dialed keeps on this device, then reloads as a first launch. The old app's data is not picked up again." />
  );
}

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <ToastProvider>
          <FreshStart />
          <Shell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fuel/cook/:week/:unit" element={<CookDay />} />
              <Route path="/fuel/:view?" element={<Fuel />} />
              <Route path="/train" element={<Train />} />
              <Route path="/body" element={<Body />} />
              <Route path="/more" element={<More />} />
              <Route path="/more/:section" element={<SettingsSection />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Shell>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
