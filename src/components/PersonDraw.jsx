import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Users, RotateCcw, Play, RefreshCw } from 'lucide-react';

export default function PersonDraw({ 
  pool, 
  originalPool, 
  current, 
  onDraw, 
  onReset 
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = () => {
    if (pool.length === 0) return;
    
    // Simple animation effect
    setIsDrawing(true);
    
    setTimeout(() => {
      onDraw();
      setIsDrawing(false);
      
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2C355A', '#D4AF37', '#ffffff']
      });
    }, 600); // Wait a bit for suspense
  };

  const isDrawn = current !== null;
  const isFinished = pool.length === 0 && originalPool.length > 0;
  
  return (
    <div className="split-section">
      <div className="section-header">
        <h2 className="section-title">
          <Users size={28} color="#2C355A" />
          Kişi Çekilişi
        </h2>
        <div className="stats-badge">
          Kalan Kişi: {pool.length} / {originalPool.length}
        </div>
      </div>
      
      <div className="draw-area">
        <div className={`result-card ${isDrawing ? 'animate-pop-in' : ''}`}>
          {isDrawing ? (
            <div className="result-empty animate-pulse">Çekiliyor...</div>
          ) : current ? (
            <div className="result-name text-gradient-accent animate-pop-in">
              {typeof current === 'object' && current !== null ? (
                <>
                  <span style={{ fontSize: '0.6em', opacity: 0.8, display: 'block', marginBottom: '8px' }}>
                    #{current.id}
                  </span>
                  {current.name}
                </>
              ) : current}
            </div>
          ) : isFinished ? (
            <div className="result-empty">Herkes çekildi!</div>
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
            >
              <Play size={18} />
              Kişi Çek
            </button>
          )}
          
          {(isDrawn || isFinished) && (
            <>
              <button 
                className="btn btn-primary" 
                onClick={handleDraw}
                disabled={pool.length === 0 || isDrawing}
              >
                <RefreshCw size={18} />
                Yeni Kişi Çek
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
