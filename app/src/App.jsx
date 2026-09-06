import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ThemeProvider from './theme/ThemeProvider.jsx';
import { ToastProvider } from './ui/index.jsx';
import Shell from './shell/Shell.jsx';
import Home from './screens/Home.jsx';
import Fuel from './screens/Fuel.jsx';
import CookDay from './screens/CookDay.jsx';
import Train from './screens/Train.jsx';
import Body from './screens/Body.jsx';
import More from './screens/More.jsx';
import SettingsSection from './screens/SettingsSection.jsx';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <ToastProvider>
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
