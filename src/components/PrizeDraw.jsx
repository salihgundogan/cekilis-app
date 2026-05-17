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
        colors: ['#D4AF37', '#2C355A', '#bc992d']
      });
    }, 600);
  };

  const isDrawn = current !== null;
  const isFinished = pool.length === 0 && originalPool.length > 0;
  
  return (
    <div className="split-section">
      <div className="section-header">
        <h2 className="section-title">
          <Gift size={28} color="#D4AF37" />
          Ödül Çekilişi
        </h2>
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
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8972e)', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)' }}
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
                style={{ background: 'linear-gradient(135deg, #D4AF37, #b8972e)', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)' }}
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
