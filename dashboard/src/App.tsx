import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Geral } from './pages/Geral';
import { Listagem } from './pages/Listagem';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes';
import { Documentacao } from './pages/Documentacao';
import './App.css';

function App() {
  const [currentTab, setTab] = useState('geral');

  // Load settings from localStorage or defaults
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('xcore_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('xcore_notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [dailyReport, setDailyReport] = useState(() => {
    const saved = localStorage.getItem('xcore_dailyReport');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('xcore_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist other settings
  useEffect(() => {
    localStorage.setItem('xcore_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('xcore_dailyReport', JSON.stringify(dailyReport));
  }, [dailyReport]);

  return (
    <Layout currentTab={currentTab} setTab={setTab}>
      {currentTab === 'geral' && <Geral />}
      {currentTab === 'leads' && <Listagem />}
      {currentTab === 'relatorios' && <Relatorios />}
      {currentTab === 'configuracoes' && (
        <Configuracoes
          theme={theme}
          setTheme={setTheme}
          notifications={notifications}
          setNotifications={setNotifications}
          dailyReport={dailyReport}
          setDailyReport={setDailyReport}
        />
      )}
      {currentTab === 'documentacao' && <Documentacao />}
    </Layout>
  );
}

export default App;
