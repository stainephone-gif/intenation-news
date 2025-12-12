import React, { useState, useEffect } from 'react';
import './ArrivalScene.css';

function ArrivalScene({ character, resources, updateResources, onComplete }) {
  const [stage, setStage] = useState('customs-line');
  const [waitTime, setWaitTime] = useState(30);
  const [messages, setMessages] = useState([]);
  const [showChoices, setShowChoices] = useState(true);
  const [customsOfficerMood, setCustomsOfficerMood] = useState('neutral');

  useEffect(() => {
    if (stage === 'customs-line' && waitTime > 0) {
      const timer = setTimeout(() => {
        setWaitTime(prev => prev - 1);
      }, 100); // Simulated time passing
      return () => clearTimeout(timer);
    } else if (stage === 'customs-line' && waitTime === 0) {
      setStage('customs-interaction');
      addMessage('You reach the customs officer. They look at you and gesture for your documents.');
    }
  }, [stage, waitTime]);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleCustomsApproach = (choice) => {
    setShowChoices(false);

    if (choice === 'wait') {
      addMessage('You patiently wait in the long queue, observing other travelers...');
      updateResources({
        time: resources.time - 5,
        stress: resources.stress + 3
      });
    } else if (choice === 'ask-help') {
      if (resources.language >= 20) {
        addMessage('You successfully ask someone in Russian where to go. They help you!');
        setWaitTime(15); // Cut wait time in half
        updateResources({
          time: resources.time - 2,
          stress: resources.stress - 2,
          language: resources.language + 2
        });
      } else {
        addMessage('You try to ask in broken Russian, but create confusion. You end up waiting longer...');
        setWaitTime(45);
        updateResources({
          time: resources.time - 8,
          stress: resources.stress + 5
        });
      }
    }
  };

  const handleCustomsInteraction = (choice) => {
    setShowChoices(false);

    if (choice === 'smile-polite') {
      addMessage('You smile and hand over your documents politely.');
      setCustomsOfficerMood('neutral');

      if (character.nationality === 'Belarus') {
        addMessage('The officer smiles slightly seeing your Belarusian passport. "Welcome," they say.');
        updateResources({
          stress: resources.stress - 3,
          documents: { migrationCard: true }
        });
        setTimeout(() => setStage('migration-card'), 2000);
      } else {
        addMessage('The officer takes your passport and examines it carefully...');
        setTimeout(() => setStage('document-check'), 2000);
      }
    } else if (choice === 'rush') {
      addMessage('You seem impatient. The officer gives you a stern look.');
      setCustomsOfficerMood('annoyed');
      updateResources({
        stress: resources.stress + 8
      });
      addMessage('"Papers," they say coldly in Russian.');
      setTimeout(() => setStage('document-check'), 2000);
    } else if (choice === 'speak-russian') {
      if (resources.language >= 30) {
        addMessage('You greet them in Russian: "Добрый день!" The officer nods approvingly.');
        setCustomsOfficerMood('friendly');
        updateResources({
          stress: resources.stress - 5,
          language: resources.language + 3
        });
        setTimeout(() => setStage('document-check'), 2000);
      } else {
        addMessage('You attempt Russian but mispronounce badly. The officer looks confused.');
        setCustomsOfficerMood('confused');
        updateResources({
          stress: resources.stress + 3
        });
        setTimeout(() => setStage('document-check'), 2000);
      }
    }
  };

  const handleDocumentCheck = () => {
    setShowChoices(false);

    const hasAllDocuments = character.purpose === 'study' || character.purpose === 'business';

    if (customsOfficerMood === 'friendly' || character.nationality === 'Belarus') {
      addMessage('The officer quickly checks your documents and stamps your passport.');
      addMessage('You receive your migration card. Keep it safe - you need it for registration!');
      updateResources({
        documents: { migrationCard: true },
        time: resources.time - 3
      });
    } else if (customsOfficerMood === 'annoyed') {
      addMessage('The officer takes their time, asking many questions in Russian...');

      if (resources.language < 15) {
        addMessage('You struggle to understand. You have to call a translator. This takes time.');
        updateResources({
          time: resources.time - 15,
          stress: resources.stress + 10,
          money: resources.money - 500
        });
      } else {
        addMessage('You manage to answer in basic Russian. Finally, they let you through.');
        updateResources({
          time: resources.time - 10,
          stress: resources.stress + 5,
          language: resources.language + 5
        });
      }

      addMessage('You receive your migration card.');
      updateResources({
        documents: { migrationCard: true }
      });
    } else {
      addMessage('The officer processes your documents normally.');
      addMessage('You receive your migration card. Remember to register within 7 days!');
      updateResources({
        documents: { migrationCard: true },
        time: resources.time - 5,
        stress: resources.stress + 2
      });
    }

    setTimeout(() => setStage('completed'), 2000);
  };

  const handleComplete = () => {
    addMessage('✅ You have successfully cleared customs and received your migration card!');
    setTimeout(() => onComplete(), 1500);
  };

  return (
    <div className="arrival-scene">
      <div className="scene-header">
        <h2>🛂 Scene 1: Arrival & Immigration</h2>
        <p className="scene-description">
          You've just landed at Sheremetyevo International Airport in Moscow.
          The airport is busy, signs are in Russian and English, and you see a long line at passport control.
        </p>
      </div>

      <div className="scene-content">
        <div className="message-log">
          {stage === 'customs-line' && waitTime > 0 && (
            <div className="waiting-indicator">
              <p>⏳ Waiting in queue... Time remaining: {waitTime} seconds</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((30 - waitTime) / 30) * 100}%` }}
                />
              </div>
              <p className="flavor-text">
                You see people from all over the world. Some look confident, others nervous like you...
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className="message">
              {msg}
            </div>
          ))}
        </div>

        {stage === 'customs-line' && waitTime > 0 && showChoices && (
          <div className="choices">
            <h3>What do you do while waiting?</h3>
            <button
              className="choice-btn"
              onClick={() => handleCustomsApproach('wait')}
            >
              📱 Wait patiently and check your phone
            </button>
            <button
              className="choice-btn"
              onClick={() => handleCustomsApproach('ask-help')}
              disabled={resources.language < 10}
            >
              🗣️ Ask someone for help in Russian
              {resources.language < 10 && ' (Need 10% Russian)'}
            </button>
          </div>
        )}

        {stage === 'customs-interaction' && showChoices && (
          <div className="choices">
            <h3>How do you approach the customs officer?</h3>
            <button
              className="choice-btn"
              onClick={() => handleCustomsInteraction('smile-polite')}
            >
              😊 Smile and be polite
            </button>
            <button
              className="choice-btn"
              onClick={() => handleCustomsInteraction('rush')}
            >
              ⚡ Look impatient (you want to get through quickly)
            </button>
            <button
              className="choice-btn"
              onClick={() => handleCustomsInteraction('speak-russian')}
              disabled={resources.language < 15}
            >
              🇷🇺 Greet them in Russian
              {resources.language < 15 && ' (Need 15% Russian)'}
            </button>
          </div>
        )}

        {stage === 'document-check' && (
          <div className="document-check-scene">
            <div className="checking-animation">
              <p>📋 Checking documents...</p>
            </div>
            <button
              className="btn-primary"
              onClick={handleDocumentCheck}
            >
              Continue →
            </button>
          </div>
        )}

        {stage === 'completed' && (
          <div className="completion-section">
            <button
              className="btn-primary btn-large"
              onClick={handleComplete}
            >
              Continue to Transport Selection →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArrivalScene;
