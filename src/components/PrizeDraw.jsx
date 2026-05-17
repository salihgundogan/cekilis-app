import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, RotateCcw, Play, RefreshCw } from 'lucide-react';

export default function PrizeDraw({ 
  pool, 
  originalPool, 
  current, 
  onDraw, 
  onReset 
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = () => {
    if (pool.length === 0) return;
    
    setIsDrawing(true);
    
    setTimeout(() => {
      onDraw();
      setIsDrawing(false);
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#3b82f6']
      });
    }, 600);
  };

  const isDrawn = current !== null;
  const isFinished = pool.length === 0 && originalPool.length > 0;
  
  return (
    <div className="split-section">
      <div className="section-header">
        <h2 className="section-title">
          <Gift size={28} color="#ec4899" />
          Ödül Çekilişi
        </h2>
        <div className="stats-badge">
          Kalan Ödül: {pool.length} / {originalPool.length}
        </div>
      </div>
      
      <div className="draw-area">
        <div className={`result-card ${isDrawing ? 'animate-pop-in' : ''}`}>
          {isDrawing ? (
            <div className="result-empty animate-pulse">Çekiliyor...</div>
          ) : current ? (
            <div className="result-name text-gradient animate-pop-in">
              {current}
            </div>
          ) : isFinished ? (
            <div className="result-empty">Tüm ödüller dağıtıldı!</div>
          ) : (
            <div className="result-empty">Çekilişe başlamak için butona basın</div>
          )}
        </div>
        
        <div className="controls">
          {!isDrawn && !isFinished && (
            <button 
              className="btn btn-primary" 
              onClick={handleDraw}
              disabled={pool.length === 0 || isDrawing}
              style={{ background: 'linear-gradient(135deg, #ec4899, #f59e0b)', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)' }}
            >
              <Play size={18} />
              Ödül Çek
            </button>
          )}
          
          {(isDrawn || isFinished) && (
            <>
              <button 
                className="btn btn-primary" 
                onClick={handleDraw}
                disabled={pool.length === 0 || isDrawing}
                style={{ background: 'linear-gradient(135deg, #ec4899, #f59e0b)', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)' }}
              >
                <RefreshCw size={18} />
                Yeni Ödül Çek
              </button>
              
              <button 
                className="btn btn-secondary" 
                onClick={onReset}
              >
                <RotateCcw size={18} />
                Sıfırla
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
