import React, { useState } from 'react';
import './App.css';
import CharacterCreation from './components/CharacterCreation';
import ArrivalScene from './components/ArrivalScene';
import TransportChoice from './components/TransportChoice';
import GameComplete from './components/GameComplete';

function App() {
  const [gameState, setGameState] = useState('character-creation');
  const [character, setCharacter] = useState(null);
  const [resources, setResources] = useState({
    money: 10000, // rubles
    time: 100, // time units
    documents: {
      passport: true,
      visa: true,
      migrationCard: false,
      registration: false
    },
    language: 0, // 0-100 Russian proficiency
    stress: 0 // 0-100 stress level
  });

  const handleCharacterCreated = (characterData) => {
    setCharacter(characterData);

    // Adjust initial resources based on character choices
    const newResources = { ...resources };

    // Belarus gets simplified visa (less stress, more time)
    if (characterData.nationality === 'Belarus') {
      newResources.stress = 5;
      newResources.time = 120;
    } else {
      newResources.stress = 15;
    }

    // Students have less money but more language skills
    if (characterData.purpose === 'study') {
      newResources.money = 5000;
      newResources.language = 30;
    } else if (characterData.purpose === 'business') {
      newResources.money = 50000;
      newResources.language = 10;
    } else { // tourism
      newResources.money = 15000;
      newResources.language = 5;
    }

    // Age affects initial energy/time
    if (characterData.age < 25) {
      newResources.time = 120;
    } else if (characterData.age > 50) {
      newResources.time = 80;
      newResources.stress = 20;
    }

    setResources(newResources);
    setGameState('arrival');
  };

  const handleArrivalComplete = () => {
    setGameState('transport');
  };

  const handleTransportComplete = () => {
    setGameState('complete');
  };

  const updateResources = (updates) => {
    setResources(prev => ({
      ...prev,
      ...updates,
      documents: {
        ...prev.documents,
        ...(updates.documents || {})
      }
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏛️ How a Foreigner Settles Down in Moscow</h1>
        {character && (
          <div className="resource-bar">
            <div className="resource">💰 {resources.money}₽</div>
            <div className="resource">⏱️ Time: {resources.time}</div>
            <div className="resource">😰 Stress: {resources.stress}%</div>
            <div className="resource">🗣️ Russian: {resources.language}%</div>
          </div>
        )}
      </header>

      <main className="game-container">
        {gameState === 'character-creation' && (
          <CharacterCreation onComplete={handleCharacterCreated} />
        )}

        {gameState === 'arrival' && (
          <ArrivalScene
            character={character}
            resources={resources}
            updateResources={updateResources}
            onComplete={handleArrivalComplete}
          />
        )}

        {gameState === 'transport' && (
          <TransportChoice
            character={character}
            resources={resources}
            updateResources={updateResources}
            onComplete={handleTransportComplete}
          />
        )}

        {gameState === 'complete' && (
          <GameComplete
            character={character}
            resources={resources}
          />
        )}
      </main>
    </div>
  );
}

export default App;
