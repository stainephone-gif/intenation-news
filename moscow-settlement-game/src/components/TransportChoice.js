import React, { useState } from 'react';
import './TransportChoice.css';

function TransportChoice({ character, resources, updateResources, onComplete }) {
  const [stage, setStage] = useState('choice');
  const [messages, setMessages] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleTransportChoice = (transport) => {
    setSelectedTransport(transport);
    setStage('journey');

    switch (transport) {
      case 'taxi':
        handleTaxiJourney();
        break;
      case 'metro':
        handleMetroJourney();
        break;
      case 'friend':
        handleFriendPickup();
        break;
      default:
        break;
    }
  };

  const handleTaxiJourney = () => {
    addMessage('🚖 You exit the airport and look for a taxi...');
    addMessage('Several drivers approach you, offering rides.');

    setStage('taxi-negotiation');
  };

  const handleTaxiNegotiation = (choice) => {
    if (choice === 'official') {
      addMessage('You find the official taxi stand. The fare is 2000₽ to the city center.');
      addMessage('The driver speaks some English and accepts card payment.');

      updateResources({
        money: resources.money - 2000,
        time: resources.time - 8,
        stress: resources.stress - 5
      });

      addMessage('✅ You arrive safely at your destination with minimal stress!');
      setTimeout(() => setStage('complete'), 2000);
    } else if (choice === 'negotiate') {
      if (resources.language >= 40) {
        addMessage('You negotiate in Russian and agree on 1200₽.');
        addMessage('The driver is impressed by your Russian skills!');

        updateResources({
          money: resources.money - 1200,
          time: resources.time - 10,
          stress: resources.stress - 2,
          language: resources.language + 5
        });

        addMessage('✅ You saved money and practiced your Russian!');
        setTimeout(() => setStage('complete'), 2000);
      } else {
        addMessage('You try to negotiate but struggle with Russian...');
        addMessage('The driver takes advantage and charges you 3000₽!');

        updateResources({
          money: resources.money - 3000,
          time: resources.time - 12,
          stress: resources.stress + 10
        });

        addMessage('😓 You feel cheated but at least you arrived...');
        setTimeout(() => setStage('complete'), 2000);
      }
    } else if (choice === 'cash-card') {
      addMessage('You ask about payment methods...');

      if (resources.language >= 25) {
        addMessage('You successfully ask "Можно картой?" (Can I pay by card?)');
        addMessage('The driver says yes. You pay 2000₽ by card.');

        updateResources({
          money: resources.money - 2000,
          time: resources.time - 9,
          stress: resources.stress + 2,
          language: resources.language + 3
        });

        addMessage('✅ Payment successful!');
        setTimeout(() => setStage('complete'), 2000);
      } else {
        addMessage('You struggle to communicate about payment...');
        addMessage('You end up paying 2500₽ in cash (the only option you understood).');

        updateResources({
          money: resources.money - 2500,
          time: resources.time - 10,
          stress: resources.stress + 8
        });

        addMessage('😰 The language barrier made this stressful...');
        setTimeout(() => setStage('complete'), 2000);
      }
    }
  };

  const handleMetroJourney = () => {
    addMessage('🚇 You decide to take the metro. It\'s much cheaper!');
    addMessage('You follow signs (in Cyrillic) to the Aeroexpress train.');

    setStage('metro-navigation');
  };

  const handleMetroNavigation = (choice) => {
    if (choice === 'figure-out') {
      if (resources.language >= 35) {
        addMessage('You read the signs in Russian and successfully purchase an Aeroexpress ticket.');
        addMessage('Then you navigate to the metro and buy a Troika card.');
        addMessage('The journey is smooth. Total cost: 700₽');

        updateResources({
          money: resources.money - 700,
          time: resources.time - 25,
          stress: resources.stress + 5,
          language: resources.language + 8
        });

        addMessage('✅ You successfully navigated the metro system!');
        setTimeout(() => setStage('complete'), 2000);
      } else {
        addMessage('You struggle with the ticket machines (all in Russian)...');
        addMessage('After 20 minutes of confusion, you finally get help from a kind stranger.');
        addMessage('You eventually make it, but it was exhausting.');

        updateResources({
          money: resources.money - 700,
          time: resources.time - 40,
          stress: resources.stress + 15,
          language: resources.language + 5
        });

        addMessage('😓 You made it, but you\'re exhausted from the confusion...');
        setTimeout(() => setStage('complete'), 2000);
      }
    } else if (choice === 'ask-help') {
      addMessage('You approach a young person who looks friendly...');

      if (resources.language >= 15) {
        addMessage('You ask in simple Russian: "Помогите, пожалуйста" (Help, please)');
        addMessage('They help you buy tickets and show you the way!');

        updateResources({
          money: resources.money - 700,
          time: resources.time - 20,
          stress: resources.stress - 3,
          language: resources.language + 7
        });

        addMessage('✅ Kindness of strangers! You made it safely and learned more Russian!');
        setTimeout(() => setStage('complete'), 2000);
      } else {
        addMessage('You struggle to communicate, using hand gestures...');
        addMessage('They eventually understand and help, but it takes time.');

        updateResources({
          money: resources.money - 700,
          time: resources.time - 30,
          stress: resources.stress + 8,
          language: resources.language + 3
        });

        addMessage('😅 Communication was hard, but you got help.');
        setTimeout(() => setStage('complete'), 2000);
      }
    } else if (choice === 'give-up') {
      addMessage('The metro is too confusing. You decide to get a taxi instead...');
      addMessage('You end up paying 2500₽ for a taxi from the airport.');

      updateResources({
        money: resources.money - 2500,
        time: resources.time - 15,
        stress: resources.stress + 12
      });

      addMessage('😞 You gave up on the metro and spent more money...');
      setTimeout(() => setStage('complete'), 2000);
    }
  };

  const handleFriendPickup = () => {
    addMessage('📱 You call your friend who\'s already in Moscow.');
    addMessage('They arrive in 20 minutes and greet you warmly!');
    addMessage('They help you navigate everything and take you to your accommodation.');

    updateResources({
      money: resources.money - 0,
      time: resources.time - 10,
      stress: resources.stress - 15
    });

    addMessage('✅ Having a friend here makes everything so much easier! (Easy mode activated)');
    setTimeout(() => setStage('complete'), 2000);
  };

  const handleComplete = () => {
    addMessage('🏁 You have arrived at your accommodation!');
    setTimeout(() => onComplete(), 1500);
  };

  return (
    <div className="transport-choice">
      <div className="scene-header">
        <h2>🚖 Transport Selection</h2>
        <p className="scene-description">
          You've cleared customs and have your luggage. Now you need to get to your accommodation in the city.
          How will you travel?
        </p>
      </div>

      <div className="scene-content">
        <div className="message-log">
          {messages.map((msg, idx) => (
            <div key={idx} className="message">
              {msg}
            </div>
          ))}
        </div>

        {stage === 'choice' && (
          <div className="transport-options">
            <h3>Choose your transport:</h3>

            <div className="transport-card">
              <div className="transport-header">🚖 Taxi</div>
              <div className="transport-details">
                <p><strong>Cost:</strong> 1500-3000₽ (depends on negotiation)</p>
                <p><strong>Time:</strong> ~8-12 units</p>
                <p><strong>Difficulty:</strong> May require Russian communication</p>
              </div>
              <button
                className="choice-btn"
                onClick={() => handleTransportChoice('taxi')}
              >
                Choose Taxi
              </button>
            </div>

            <div className="transport-card">
              <div className="transport-header">🚇 Metro (Aeroexpress + Metro)</div>
              <div className="transport-details">
                <p><strong>Cost:</strong> ~700₽ (cheapest option)</p>
                <p><strong>Time:</strong> ~20-40 units (can get lost)</p>
                <p><strong>Difficulty:</strong> Requires navigation skills & Russian</p>
              </div>
              <button
                className="choice-btn"
                onClick={() => handleTransportChoice('metro')}
              >
                Choose Metro
              </button>
            </div>

            <div className="transport-card easy-mode">
              <div className="transport-header">👥 Friend Pickup</div>
              <div className="transport-details">
                <p><strong>Cost:</strong> 0₽ (free!)</p>
                <p><strong>Time:</strong> ~10 units</p>
                <p><strong>Difficulty:</strong> Easy mode - stress free!</p>
              </div>
              <button
                className="choice-btn"
                onClick={() => handleTransportChoice('friend')}
              >
                Call Your Friend
              </button>
            </div>
          </div>
        )}

        {stage === 'taxi-negotiation' && (
          <div className="choices">
            <h3>How do you handle the taxi situation?</h3>
            <button
              className="choice-btn"
              onClick={() => handleTaxiNegotiation('official')}
            >
              🏢 Use official taxi stand (2000₽, safe)
            </button>
            <button
              className="choice-btn"
              onClick={() => handleTaxiNegotiation('negotiate')}
              disabled={resources.language < 20}
            >
              💬 Negotiate with driver in Russian
              {resources.language < 20 && ' (Need 20% Russian)'}
            </button>
            <button
              className="choice-btn"
              onClick={() => handleTaxiNegotiation('cash-card')}
            >
              💳 Ask about card payment
            </button>
          </div>
        )}

        {stage === 'metro-navigation' && (
          <div className="choices">
            <h3>How do you navigate the metro system?</h3>
            <button
              className="choice-btn"
              onClick={() => handleMetroNavigation('figure-out')}
            >
              🧠 Try to figure it out yourself
            </button>
            <button
              className="choice-btn"
              onClick={() => handleMetroNavigation('ask-help')}
            >
              🗣️ Ask someone for help
            </button>
            <button
              className="choice-btn"
              onClick={() => handleMetroNavigation('give-up')}
            >
              😰 Give up and take a taxi instead
            </button>
          </div>
        )}

        {stage === 'complete' && (
          <div className="completion-section">
            <button
              className="btn-primary btn-large"
              onClick={handleComplete}
            >
              Continue to Results →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransportChoice;
