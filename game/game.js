// Game State
const gameState = {
    screen: 'character-creation',
    character: null,
    resources: {
        money: 10000,
        time: 100,
        documents: {
            passport: true,
            visa: true,
            migrationCard: false,
            registration: false
        },
        language: 0,
        stress: 0
    },
    arrivalStage: 'customs-line',
    transportStage: 'choice',
    messages: [],
    customsOfficerMood: 'neutral'
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCharacterCreation();
});

// Character Creation
function initCharacterCreation() {
    const ageSlider = document.getElementById('age');
    const ageDisplay = document.getElementById('ageDisplay');
    const form = document.getElementById('characterForm');
    const nationality = document.getElementById('nationality');
    const purposeRadios = document.querySelectorAll('input[name="purpose"]');

    // Age slider
    ageSlider.addEventListener('input', (e) => {
        ageDisplay.textContent = e.target.value;
        updateDifficultyPreview();
    });

    // Nationality change
    nationality.addEventListener('change', () => {
        updateDifficultyPreview();
    });

    // Purpose change
    purposeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateDifficultyPreview();
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateCharacterForm()) {
            createCharacter();
        }
    });
}

function updateDifficultyPreview() {
    const age = parseInt(document.getElementById('age').value);
    const nationality = document.getElementById('nationality').value;
    const purpose = document.querySelector('input[name="purpose"]:checked')?.value;

    if (!nationality || !purpose) {
        document.getElementById('difficultyPreview').style.display = 'none';
        return;
    }

    document.getElementById('difficultyPreview').style.display = 'block';

    let difficulty = 'Medium';
    const tips = [];

    if (nationality === 'Belarus') {
        difficulty = 'Easy';
        tips.push('✅ Visa process is simplified for Belarusian citizens');
    }

    if (purpose === 'study') {
        tips.push('💰 Students have limited budget but better language skills');
    } else if (purpose === 'business') {
        tips.push('💰 Business travelers have more money');
    }

    if (age < 25) {
        tips.push('⚡ Young travelers have more energy and time');
    } else if (age > 50) {
        tips.push('😰 Older travelers may face more stress and fatigue');
    }

    document.getElementById('difficultyLevel').textContent = difficulty;
    const tipsList = document.getElementById('tipsList');
    tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
}

function validateCharacterForm() {
    const age = parseInt(document.getElementById('age').value);
    const nationality = document.getElementById('nationality').value;
    const purpose = document.querySelector('input[name="purpose"]:checked')?.value;

    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    if (age < 18 || age > 99) {
        document.getElementById('ageError').textContent = 'Age must be between 18 and 99';
        isValid = false;
    }

    if (!nationality) {
        document.getElementById('nationalityError').textContent = 'Please select your nationality';
        isValid = false;
    }

    if (!purpose) {
        document.getElementById('purposeError').textContent = 'Please select your purpose of visit';
        isValid = false;
    }

    return isValid;
}

function createCharacter() {
    const age = parseInt(document.getElementById('age').value);
    const nationality = document.getElementById('nationality').value;
    const purpose = document.querySelector('input[name="purpose"]:checked').value;

    gameState.character = { age, nationality, purpose };

    // Adjust initial resources based on character
    if (nationality === 'Belarus') {
        gameState.resources.stress = 5;
        gameState.resources.time = 120;
    } else {
        gameState.resources.stress = 15;
    }

    if (purpose === 'study') {
        gameState.resources.money = 5000;
        gameState.resources.language = 30;
    } else if (purpose === 'business') {
        gameState.resources.money = 50000;
        gameState.resources.language = 10;
    } else {
        gameState.resources.money = 15000;
        gameState.resources.language = 5;
    }

    if (age < 25) {
        gameState.resources.time = 120;
    } else if (age > 50) {
        gameState.resources.time = 80;
        gameState.resources.stress = 20;
    }

    // Show resource bar
    document.getElementById('resourceBar').style.display = 'flex';
    updateResourceDisplay();

    // Start arrival scene
    showScreen('arrivalScene');
    startArrivalScene();
}

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';
    gameState.screen = screenId;
}

// Resource Management
function updateResources(updates) {
    if (updates.money !== undefined) gameState.resources.money += updates.money;
    if (updates.time !== undefined) gameState.resources.time += updates.time;
    if (updates.stress !== undefined) gameState.resources.stress += updates.stress;
    if (updates.language !== undefined) gameState.resources.language += updates.language;
    if (updates.documents) {
        Object.assign(gameState.resources.documents, updates.documents);
    }
    updateResourceDisplay();
}

function updateResourceDisplay() {
    document.getElementById('money').textContent = Math.max(0, gameState.resources.money);
    document.getElementById('time').textContent = Math.max(0, gameState.resources.time);
    document.getElementById('stress').textContent = Math.max(0, Math.min(100, gameState.resources.stress));
    document.getElementById('language').textContent = Math.max(0, Math.min(100, gameState.resources.language));
}

// Arrival Scene
function startArrivalScene() {
    gameState.messages = [];
    gameState.arrivalStage = 'customs-line';

    const messagesDiv = document.getElementById('arrivalMessages');
    const choicesDiv = document.getElementById('arrivalChoices');

    addMessage('⏳ Waiting in queue... Please make a choice while waiting.');

    messagesDiv.innerHTML = gameState.messages.map(msg => `<div class="message">${msg}</div>`).join('');

    choicesDiv.innerHTML = `
        <h3>What do you do while waiting?</h3>
        <button class="choice-btn" onclick="handleCustomsChoice('wait')">📱 Wait patiently and check your phone</button>
        <button class="choice-btn" onclick="handleCustomsChoice('ask-help')" ${gameState.resources.language < 10 ? 'disabled' : ''}>
            🗣️ Ask someone for help in Russian${gameState.resources.language < 10 ? ' (Need 10% Russian)' : ''}
        </button>
    `;
}

function addMessage(msg) {
    gameState.messages.push(msg);
    updateMessages('arrivalMessages');
}

function updateMessages(divId) {
    const messagesDiv = document.getElementById(divId);
    messagesDiv.innerHTML = gameState.messages.map(msg => `<div class="message">${msg}</div>`).join('');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function handleCustomsChoice(choice) {
    const choicesDiv = document.getElementById('arrivalChoices');

    if (choice === 'wait') {
        addMessage('You patiently wait in the long queue, observing other travelers...');
        updateResources({ time: -5, stress: 3 });
    } else if (choice === 'ask-help') {
        if (gameState.resources.language >= 20) {
            addMessage('You successfully ask someone in Russian where to go. They help you!');
            updateResources({ time: -2, stress: -2, language: 2 });
        } else {
            addMessage('You try to ask in broken Russian, but create confusion. You end up waiting longer...');
            updateResources({ time: -8, stress: 5 });
        }
    }

    setTimeout(() => {
        addMessage('You reach the customs officer. They look at you and gesture for your documents.');
        showCustomsInteractionChoices();
    }, 1000);
}

function showCustomsInteractionChoices() {
    const choicesDiv = document.getElementById('arrivalChoices');
    choicesDiv.innerHTML = `
        <h3>How do you approach the customs officer?</h3>
        <button class="choice-btn" onclick="handleCustomsInteraction('smile')">😊 Smile and be polite</button>
        <button class="choice-btn" onclick="handleCustomsInteraction('rush')">⚡ Look impatient (you want to get through quickly)</button>
        <button class="choice-btn" onclick="handleCustomsInteraction('russian')" ${gameState.resources.language < 15 ? 'disabled' : ''}>
            🇷🇺 Greet them in Russian${gameState.resources.language < 15 ? ' (Need 15% Russian)' : ''}
        </button>
    `;
}

function handleCustomsInteraction(choice) {
    if (choice === 'smile') {
        addMessage('You smile and hand over your documents politely.');
        gameState.customsOfficerMood = 'neutral';

        if (gameState.character.nationality === 'Belarus') {
            addMessage('The officer smiles slightly seeing your Belarusian passport. "Welcome," they say.');
            updateResources({ stress: -3 });
            gameState.customsOfficerMood = 'friendly';
        } else {
            addMessage('The officer takes your passport and examines it carefully...');
        }
    } else if (choice === 'rush') {
        addMessage('You seem impatient. The officer gives you a stern look.');
        addMessage('"Papers," they say coldly in Russian.');
        gameState.customsOfficerMood = 'annoyed';
        updateResources({ stress: 8 });
    } else if (choice === 'russian') {
        if (gameState.resources.language >= 30) {
            addMessage('You greet them in Russian: "Добрый день!" The officer nods approvingly.');
            gameState.customsOfficerMood = 'friendly';
            updateResources({ stress: -5, language: 3 });
        } else {
            addMessage('You attempt Russian but mispronounce badly. The officer looks confused.');
            gameState.customsOfficerMood = 'confused';
            updateResources({ stress: 3 });
        }
    }

    setTimeout(() => {
        processDocuments();
    }, 1500);
}

function processDocuments() {
    const choicesDiv = document.getElementById('arrivalChoices');

    if (gameState.customsOfficerMood === 'friendly' || gameState.character.nationality === 'Belarus') {
        addMessage('The officer quickly checks your documents and stamps your passport.');
        addMessage('You receive your migration card. Keep it safe - you need it for registration!');
        updateResources({ time: -3 });
        gameState.resources.documents.migrationCard = true;
    } else if (gameState.customsOfficerMood === 'annoyed') {
        addMessage('The officer takes their time, asking many questions in Russian...');

        if (gameState.resources.language < 15) {
            addMessage('You struggle to understand. You have to call a translator. This takes time.');
            updateResources({ time: -15, stress: 10, money: -500 });
        } else {
            addMessage('You manage to answer in basic Russian. Finally, they let you through.');
            updateResources({ time: -10, stress: 5, language: 5 });
        }

        addMessage('You receive your migration card.');
        gameState.resources.documents.migrationCard = true;
    } else {
        addMessage('The officer processes your documents normally.');
        addMessage('You receive your migration card. Remember to register within 7 days!');
        updateResources({ time: -5, stress: 2 });
        gameState.resources.documents.migrationCard = true;
    }

    choicesDiv.innerHTML = `
        <button class="btn-primary btn-large" onclick="completeArrivalScene()">
            Continue to Transport Selection →
        </button>
    `;
}

function completeArrivalScene() {
    addMessage('✅ You have successfully cleared customs and received your migration card!');
    setTimeout(() => {
        showScreen('transportScene');
        startTransportScene();
    }, 1000);
}

// Transport Scene
function startTransportScene() {
    gameState.messages = [];
    gameState.transportStage = 'choice';

    const choicesDiv = document.getElementById('transportChoices');
    choicesDiv.innerHTML = `
        <h3>Choose your transport:</h3>
        <div class="transport-options">
            <div class="transport-card">
                <div class="transport-header">🚖 Taxi</div>
                <div class="transport-details">
                    <p><strong>Cost:</strong> 1500-3000₽ (depends on negotiation)</p>
                    <p><strong>Time:</strong> ~8-12 units</p>
                    <p><strong>Difficulty:</strong> May require Russian communication</p>
                </div>
                <button class="choice-btn" onclick="handleTransportChoice('taxi')">Choose Taxi</button>
            </div>

            <div class="transport-card">
                <div class="transport-header">🚇 Metro (Aeroexpress + Metro)</div>
                <div class="transport-details">
                    <p><strong>Cost:</strong> ~700₽ (cheapest option)</p>
                    <p><strong>Time:</strong> ~20-40 units (can get lost)</p>
                    <p><strong>Difficulty:</strong> Requires navigation skills & Russian</p>
                </div>
                <button class="choice-btn" onclick="handleTransportChoice('metro')">Choose Metro</button>
            </div>

            <div class="transport-card easy-mode">
                <div class="transport-header">👥 Friend Pickup</div>
                <div class="transport-details">
                    <p><strong>Cost:</strong> 0₽ (free!)</p>
                    <p><strong>Time:</strong> ~10 units</p>
                    <p><strong>Difficulty:</strong> Easy mode - stress free!</p>
                </div>
                <button class="choice-btn" onclick="handleTransportChoice('friend')">Call Your Friend</button>
            </div>
        </div>
    `;
}

function addTransportMessage(msg) {
    gameState.messages.push(msg);
    updateMessages('transportMessages');
}

function handleTransportChoice(choice) {
    const messagesDiv = document.getElementById('transportMessages');
    const choicesDiv = document.getElementById('transportChoices');

    messagesDiv.style.display = 'block';

    if (choice === 'taxi') {
        addTransportMessage('🚖 You exit the airport and look for a taxi...');
        addTransportMessage('Several drivers approach you, offering rides.');

        setTimeout(() => {
            choicesDiv.innerHTML = `
                <h3>How do you handle the taxi situation?</h3>
                <button class="choice-btn" onclick="handleTaxiChoice('official')">
                    🏢 Use official taxi stand (2000₽, safe)
                </button>
                <button class="choice-btn" onclick="handleTaxiChoice('negotiate')" ${gameState.resources.language < 20 ? 'disabled' : ''}>
                    💬 Negotiate with driver in Russian${gameState.resources.language < 20 ? ' (Need 20% Russian)' : ''}
                </button>
                <button class="choice-btn" onclick="handleTaxiChoice('card')">
                    💳 Ask about card payment
                </button>
            `;
        }, 1000);
    } else if (choice === 'metro') {
        addTransportMessage('🚇 You decide to take the metro. It\'s much cheaper!');
        addTransportMessage('You follow signs (in Cyrillic) to the Aeroexpress train.');

        setTimeout(() => {
            choicesDiv.innerHTML = `
                <h3>How do you navigate the metro system?</h3>
                <button class="choice-btn" onclick="handleMetroChoice('figure')">
                    🧠 Try to figure it out yourself
                </button>
                <button class="choice-btn" onclick="handleMetroChoice('ask')">
                    🗣️ Ask someone for help
                </button>
                <button class="choice-btn" onclick="handleMetroChoice('giveup')">
                    😰 Give up and take a taxi instead
                </button>
            `;
        }, 1000);
    } else if (choice === 'friend') {
        addTransportMessage('📱 You call your friend who\'s already in Moscow.');
        addTransportMessage('They arrive in 20 minutes and greet you warmly!');
        addTransportMessage('They help you navigate everything and take you to your accommodation.');

        updateResources({ money: 0, time: -10, stress: -15 });

        setTimeout(() => {
            addTransportMessage('✅ Having a friend here makes everything so much easier! (Easy mode activated)');
            completeTransportScene();
        }, 2000);
    }
}

function handleTaxiChoice(choice) {
    const choicesDiv = document.getElementById('transportChoices');

    if (choice === 'official') {
        addTransportMessage('You find the official taxi stand. The fare is 2000₽ to the city center.');
        addTransportMessage('The driver speaks some English and accepts card payment.');
        updateResources({ money: -2000, time: -8, stress: -5 });
        addTransportMessage('✅ You arrive safely at your destination with minimal stress!');
    } else if (choice === 'negotiate') {
        if (gameState.resources.language >= 40) {
            addTransportMessage('You negotiate in Russian and agree on 1200₽.');
            addTransportMessage('The driver is impressed by your Russian skills!');
            updateResources({ money: -1200, time: -10, stress: -2, language: 5 });
            addTransportMessage('✅ You saved money and practiced your Russian!');
        } else {
            addTransportMessage('You try to negotiate but struggle with Russian...');
            addTransportMessage('The driver takes advantage and charges you 3000₽!');
            updateResources({ money: -3000, time: -12, stress: 10 });
            addTransportMessage('😓 You feel cheated but at least you arrived...');
        }
    } else if (choice === 'card') {
        addTransportMessage('You ask about payment methods...');

        if (gameState.resources.language >= 25) {
            addTransportMessage('You successfully ask "Можно картой?" (Can I pay by card?)');
            addTransportMessage('The driver says yes. You pay 2000₽ by card.');
            updateResources({ money: -2000, time: -9, stress: 2, language: 3 });
            addTransportMessage('✅ Payment successful!');
        } else {
            addTransportMessage('You struggle to communicate about payment...');
            addTransportMessage('You end up paying 2500₽ in cash (the only option you understood).');
            updateResources({ money: -2500, time: -10, stress: 8 });
            addTransportMessage('😰 The language barrier made this stressful...');
        }
    }

    setTimeout(() => completeTransportScene(), 2000);
}

function handleMetroChoice(choice) {
    const choicesDiv = document.getElementById('transportChoices');

    if (choice === 'figure') {
        if (gameState.resources.language >= 35) {
            addTransportMessage('You read the signs in Russian and successfully purchase an Aeroexpress ticket.');
            addTransportMessage('Then you navigate to the metro and buy a Troika card.');
            addTransportMessage('The journey is smooth. Total cost: 700₽');
            updateResources({ money: -700, time: -25, stress: 5, language: 8 });
            addTransportMessage('✅ You successfully navigated the metro system!');
        } else {
            addTransportMessage('You struggle with the ticket machines (all in Russian)...');
            addTransportMessage('After 20 minutes of confusion, you finally get help from a kind stranger.');
            addTransportMessage('You eventually make it, but it was exhausting.');
            updateResources({ money: -700, time: -40, stress: 15, language: 5 });
            addTransportMessage('😓 You made it, but you\'re exhausted from the confusion...');
        }
    } else if (choice === 'ask') {
        addTransportMessage('You approach a young person who looks friendly...');

        if (gameState.resources.language >= 15) {
            addTransportMessage('You ask in simple Russian: "Помогите, пожалуйста" (Help, please)');
            addTransportMessage('They help you buy tickets and show you the way!');
            updateResources({ money: -700, time: -20, stress: -3, language: 7 });
            addTransportMessage('✅ Kindness of strangers! You made it safely and learned more Russian!');
        } else {
            addTransportMessage('You struggle to communicate, using hand gestures...');
            addTransportMessage('They eventually understand and help, but it takes time.');
            updateResources({ money: -700, time: -30, stress: 8, language: 3 });
            addTransportMessage('😅 Communication was hard, but you got help.');
        }
    } else if (choice === 'giveup') {
        addTransportMessage('The metro is too confusing. You decide to get a taxi instead...');
        addTransportMessage('You end up paying 2500₽ for a taxi from the airport.');
        updateResources({ money: -2500, time: -15, stress: 12 });
        addTransportMessage('😞 You gave up on the metro and spent more money...');
    }

    setTimeout(() => completeTransportScene(), 2000);
}

function completeTransportScene() {
    const choicesDiv = document.getElementById('transportChoices');
    choicesDiv.innerHTML = `
        <button class="btn-primary btn-large" onclick="showResults()">
            Continue to Results →
        </button>
    `;
}

// Results
function showResults() {
    showScreen('resultsScene');

    const { score, maxScore, percentage } = calculateScore();
    const rank = getRank(percentage);
    const insights = getInsights();

    const resultsDiv = document.getElementById('resultsContent');
    resultsDiv.innerHTML = `
        <div class="rank-display">
            <div class="rank-badge">
                <div class="rank-emoji">${rank.emoji}</div>
                <div class="rank-letter">${rank.rank}</div>
            </div>
            <h2>${rank.title}</h2>
            <div class="score-display">
                <div class="score-number">${score}/${maxScore}</div>
                <div class="score-percentage">${percentage.toFixed(1)}%</div>
            </div>
        </div>

        <div class="stats-breakdown">
            <h3>📊 Performance Breakdown</h3>
            <div class="stat-item">
                <span class="stat-label">💰 Money Remaining:</span>
                <span class="stat-value">${gameState.resources.money}₽</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">⏱️ Time Remaining:</span>
                <span class="stat-value">${gameState.resources.time} units</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">😰 Stress Level:</span>
                <span class="stat-value">${gameState.resources.stress}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">🗣️ Russian Proficiency:</span>
                <span class="stat-value">${gameState.resources.language}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">📄 Documents:</span>
                <span class="stat-value">${gameState.resources.documents.migrationCard ? '✅ Migration Card' : '❌ No Migration Card'}</span>
            </div>
        </div>

        ${insights.length > 0 ? `
            <div class="insights-section">
                <h3>💡 Insights & Tips</h3>
                <ul class="insights-list">
                    ${insights.map(insight => `<li>${insight}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        <div class="character-summary">
            <h3>👤 Your Character</h3>
            <p><strong>Nationality:</strong> ${gameState.character.nationality}</p>
            <p><strong>Age:</strong> ${gameState.character.age}</p>
            <p><strong>Purpose:</strong> ${gameState.character.purpose}</p>
        </div>

        <div class="next-steps">
            <h3>🔜 Coming Soon</h3>
            <p>This demo covers the first day of settling in Moscow. Future updates will include:</p>
            <ul>
                <li>🏥 Hospital & Medical Examination</li>
                <li>🏛️ Immigration Office (получение РВП/ВНЖ)</li>
                <li>📋 Government Service Center (Мои документы)</li>
                <li>🏠 Finding and Renting an Apartment</li>
                <li>💼 Job Hunting</li>
                <li>👥 Making Friends & Socializing</li>
                <li>🚔 Dealing with Police (document checks)</li>
            </ul>
        </div>

        <div class="action-buttons">
            <button class="btn-primary btn-large" onclick="location.reload()">
                🔄 Play Again
            </button>
        </div>
    `;
}

function calculateScore() {
    let score = 0;
    const maxScore = 100;

    // Money management (30 points)
    const moneyPercent = (gameState.resources.money / 10000) * 100;
    if (moneyPercent > 80) score += 30;
    else if (moneyPercent > 50) score += 20;
    else if (moneyPercent > 20) score += 10;
    else score += 5;

    // Time management (20 points)
    const timePercent = (gameState.resources.time / 100) * 100;
    if (timePercent > 60) score += 20;
    else if (timePercent > 40) score += 15;
    else if (timePercent > 20) score += 10;
    else score += 5;

    // Stress management (20 points) - lower is better
    if (gameState.resources.stress < 20) score += 20;
    else if (gameState.resources.stress < 40) score += 15;
    else if (gameState.resources.stress < 60) score += 10;
    else score += 5;

    // Language improvement (15 points)
    if (gameState.resources.language > 40) score += 15;
    else if (gameState.resources.language > 25) score += 10;
    else if (gameState.resources.language > 10) score += 5;

    // Documents acquired (15 points)
    if (gameState.resources.documents.migrationCard) score += 15;

    return { score, maxScore, percentage: (score / maxScore) * 100 };
}

function getRank(percentage) {
    if (percentage >= 90) return { rank: 'S', title: 'Moscow Expert', emoji: '🌟' };
    if (percentage >= 75) return { rank: 'A', title: 'Seasoned Traveler', emoji: '⭐' };
    if (percentage >= 60) return { rank: 'B', title: 'Competent Navigator', emoji: '✨' };
    if (percentage >= 45) return { rank: 'C', title: 'Struggling But Surviving', emoji: '💪' };
    return { rank: 'D', title: 'Barely Made It', emoji: '😅' };
}

function getInsights() {
    const insights = [];

    if (gameState.resources.money < 2000) {
        insights.push('💰 You spent a lot of money! Consider more budget-friendly options next time.');
    } else if (gameState.resources.money > 8000) {
        insights.push('💰 Great money management! You saved well.');
    }

    if (gameState.resources.stress > 50) {
        insights.push('😰 High stress levels! Try to find ways to reduce anxiety, like learning basic phrases.');
    } else if (gameState.resources.stress < 20) {
        insights.push('😌 You handled stress well! Your calm approach paid off.');
    }

    if (gameState.resources.language > 30) {
        insights.push('🗣️ Your Russian skills improved significantly! Language is key to settling in.');
    } else if (gameState.resources.language < 15) {
        insights.push('🗣️ Consider learning more Russian - it will make life much easier here.');
    }

    if (gameState.resources.time < 30) {
        insights.push('⏱️ You ran out of time! Better planning could help.');
    } else if (gameState.resources.time > 80) {
        insights.push('⏱️ Excellent time management! You were efficient.');
    }

    return insights;
}
