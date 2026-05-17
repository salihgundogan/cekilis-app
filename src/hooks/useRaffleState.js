import { useState, useEffect } from 'react';

// Helper to get from local storage safely
const getLocal = (key, initial) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initial;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return initial;
  }
};

export function useRaffleState() {
  // PERSON DRAW STATE
  const [personPool, setPersonPool] = useState(() => getLocal('cekilis_personPool', []));
  const [originalPersonPool, setOriginalPersonPool] = useState(() => getLocal('cekilis_originalPersonPool', []));
  const [currentPerson, setCurrentPerson] = useState(() => getLocal('cekilis_currentPerson', null));
  const [drawnPersons, setDrawnPersons] = useState(() => getLocal('cekilis_drawnPersons', []));

  // PRIZE DRAW STATE
  const [prizePool, setPrizePool] = useState(() => getLocal('cekilis_prizePool', []));
  const [originalPrizePool, setOriginalPrizePool] = useState(() => getLocal('cekilis_originalPrizePool', []));
  const [currentPrize, setCurrentPrize] = useState(() => getLocal('cekilis_currentPrize', null));
  const [drawnPrizes, setDrawnPrizes] = useState(() => getLocal('cekilis_drawnPrizes', []));

  // Save changes to local storage whenever state updates
  useEffect(() => {
    window.localStorage.setItem('cekilis_personPool', JSON.stringify(personPool));
    window.localStorage.setItem('cekilis_originalPersonPool', JSON.stringify(originalPersonPool));
    window.localStorage.setItem('cekilis_currentPerson', JSON.stringify(currentPerson));
    window.localStorage.setItem('cekilis_drawnPersons', JSON.stringify(drawnPersons));
  }, [personPool, originalPersonPool, currentPerson, drawnPersons]);

  useEffect(() => {
    window.localStorage.setItem('cekilis_prizePool', JSON.stringify(prizePool));
    window.localStorage.setItem('cekilis_originalPrizePool', JSON.stringify(originalPrizePool));
    window.localStorage.setItem('cekilis_currentPrize', JSON.stringify(currentPrize));
    window.localStorage.setItem('cekilis_drawnPrizes', JSON.stringify(drawnPrizes));
  }, [prizePool, originalPrizePool, currentPrize, drawnPrizes]);

  // PERSON ACTIONS
  const loadPersons = (persons) => {
    setOriginalPersonPool(persons);
    setPersonPool(persons);
    setCurrentPerson(null);
    setDrawnPersons([]);
  };

  const drawPerson = () => {
    if (personPool.length === 0) return null;
    
    // Cryptographically secure random selection
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const randomFloat = randomBuffer[0] / (0xffffffff + 1);
    const randomIndex = Math.floor(randomFloat * personPool.length);
    const selected = personPool[randomIndex];
    
    // Create new pool without the selected person
    const newPool = [...personPool];
    newPool.splice(randomIndex, 1);
    
    setPersonPool(newPool);
    setCurrentPerson(selected);
    setDrawnPersons(prev => [...prev, selected]);
    
    return selected;
  };

  const resetPersons = () => {
    setPersonPool(originalPersonPool);
    setCurrentPerson(null);
    setDrawnPersons([]);
  };

  // PRIZE ACTIONS
  const loadPrizes = (prizes) => {
    setOriginalPrizePool(prizes);
    setPrizePool(prizes);
    setCurrentPrize(null);
    setDrawnPrizes([]);
  };

  const addPrize = (prize) => {
    const newPrizes = [...originalPrizePool, prize];
    setOriginalPrizePool(newPrizes);
    setPrizePool([...prizePool, prize]);
  };

  const removePrize = (indexToRemove) => {
    const newPrizes = originalPrizePool.filter((_, idx) => idx !== indexToRemove);
    setOriginalPrizePool(newPrizes);
    // Rough logic for active pool sync (we rebuild it if simple)
    // To be precise, if we delete from original, we might want to just reset to avoid complexity
    setPrizePool(newPrizes);
    setCurrentPrize(null);
    setDrawnPrizes([]);
  };

  const drawPrize = () => {
    if (prizePool.length === 0) return null;
    
    // Cryptographically secure random selection
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const randomFloat = randomBuffer[0] / (0xffffffff + 1);
    const randomIndex = Math.floor(randomFloat * prizePool.length);
    const selected = prizePool[randomIndex];
    
    const newPool = [...prizePool];
    newPool.splice(randomIndex, 1);
    
    setPrizePool(newPool);
    setCurrentPrize(selected);
    setDrawnPrizes(prev => [...prev, selected]);
    
    return selected;
  };

  const resetPrizes = () => {
    setPrizePool(originalPrizePool);
    setCurrentPrize(null);
    setDrawnPrizes([]);
  };

  return {
    // Person State & Methods
    personPool,
    originalPersonPool,
    currentPerson,
    loadPersons,
    drawPerson,
    resetPersons,
    
    // Prize State & Methods
    prizePool,
    originalPrizePool,
    currentPrize,
    loadPrizes,
    addPrize,
    removePrize,
    drawPrize,
    resetPrizes
  };
}
