import { useState } from 'react';
import { Layout } from './components/Layout';
import { Geral } from './pages/Geral';
import { Listagem } from './pages/Listagem';
import { Relatorios } from './pages/Relatorios';
import './App.css';

function App() {
  const [currentTab, setTab] = useState('geral');

  return (
    <Layout currentTab={currentTab} setTab={setTab}>
      {currentTab === 'geral' && <Geral />}
      {currentTab === 'leads' && <Listagem />}
      {currentTab === 'relatorios' && <Relatorios />}
    </Layout>
  );
}

export default App;
