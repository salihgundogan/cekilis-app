import React, { useState } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import './App.css';
import { useRaffleState } from './hooks/useRaffleState';
import PersonDraw from './components/PersonDraw';
import PrizeDraw from './components/PrizeDraw';
import SettingsModal from './components/SettingsModal';

function App() {
  const raffleState = useRaffleState();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="text-gradient">
          <Sparkles color="#8b5cf6" size={32} />
          Şanslı Çekiliş
        </h1>
        
        <button 
          className="btn btn-secondary" 
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings size={20} />
          Ayarlar
        </button>
      </header>

      <main className="main-content glass-panel">
        <PersonDraw 
          pool={raffleState.personPool}
          originalPool={raffleState.originalPersonPool}
          current={raffleState.currentPerson}
          onDraw={raffleState.drawPerson}
          onReset={raffleState.resetPersons}
        />
        
        <div style={{ height: '1px', background: 'var(--panel-border)', margin: '0 32px' }}></div>
        
        <PrizeDraw 
          pool={raffleState.prizePool}
          originalPool={raffleState.originalPrizePool}
          current={raffleState.currentPrize}
          onDraw={raffleState.drawPrize}
          onReset={raffleState.resetPrizes}
        />
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)} 
          raffleState={raffleState}
        />
      )}
    </div>
  );
}

export default App;
