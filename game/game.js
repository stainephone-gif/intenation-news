// ===== GAME STATE =====
const gameState = {
    character: null,
    resources: {
        daysLeft: 90,
        money: 50000,
        language: 30,
        stress: 10,
        documents: []
    },
    currentDocument: 0,
    gameStartTime: null,
    waitingState: null,
    completedLocations: [],
    events: []
};

// ===== DOCUMENTS DATA =====
const DOCUMENTS = [
    {
        id: 'migration-card',
        name: 'Migration Card',
        location: 'airport',
        icon: '✈️',
        baseCost: 0,
        baseTime: 3, // hours (will be converted to days: 3/24)
        timeRange: [2, 4],
        waitingDays: 0,
        languageRequired: 15,
        description: 'Get your migration card at the airport immigration desk'
    },
    {
        id: 'registration',
        name: 'Registration',
        location: 'accommodation',
        icon: '🏠',
        baseCost: 500,
        costOptions: [
            { name: 'Hotel (Free)', cost: 0, time: 1 },
            { name: 'Dormitory', cost: 500, time: 1 },
            { name: 'Apartment', cost: 5000, time: 1 }
        ],
        baseTime: 1,
        waitingDays: 1,
        languageRequired: 15,
        description: 'Register your address at your accommodation'
    },
    {
        id: 'university-reg',
        name: 'University Registration',
        location: 'university',
        icon: '🎓',
        baseCost: 0,
        baseTime: 3,
        timeRange: [2, 4],
        waitingDays: 0,
        languageRequired: 20,
        description: 'Complete your registration at the university',
        requiredPurpose: 'study'
    },
    {
        id: 'sim-bank',
        name: 'SIM Card & Bank Card',
        location: 'telecom',
        icon: '📱',
        baseCost: 6000,
        costRange: [3000, 9000],
        baseTime: 2,
        waitingDays: 1,
        languageRequired: 25,
        description: 'Get a local SIM card and open a bank account'
    },
    {
        id: 'medical',
        name: 'Medical Certificate',
        location: 'hospital',
        icon: '🏥',
        baseCost: 6000,
        baseTime: 3,
        timeRange: [2, 4],
        waitingDays: 3,
        languageRequired: 20,
        description: 'Obtain required medical examination certificate'
    },
    {
        id: 'fingerprint',
        name: 'Fingerprint Card',
        location: 'migration',
        icon: '🏛️',
        baseCost: 1600, // for students
        costByPurpose: {
            study: 1600,
            work: 16000,
            tourism: 16000
        },
        baseTime: 4.5,
        timeRange: [3, 6],
        waitingDays: 5,
        languageRequired: 25,
        description: 'Get fingerprinted at the migration center (final document!)'
    }
];

// ===== RANDOM EVENTS =====
const RANDOM_EVENTS = [
    {
        id: 'missing-stamp',
        probability: 0.15,
        title: '⚠️ Missing Stamp!',
        description: 'Your medical certificate is missing an official stamp! You need to go back to the hospital.',
        effects: { money: -1000, daysLeft: -2, stress: 10 },
        triggerDocument: 'medical'
    },
    {
        id: 'translation-error',
        probability: 0.12,
        title: '📄 Translation Error',
        description: 'Your document translation has errors. You need to pay for a new certified translation.',
        effects: { money: -1500, daysLeft: -1, stress: 8 },
        triggerDocument: null
    },
    {
        id: 'helpful-stranger',
        probability: 0.1,
        title: '😊 Helpful Stranger',
        description: 'A kind local helped you navigate the system and gave you useful tips!',
        effects: { stress: -10, language: 5 },
        triggerDocument: null
    },
    {
        id: 'long-queue',
        probability: 0.18,
        title: '⏰ Unexpected Long Queue',
        description: 'The queue is much longer than expected. You have to wait an extra day.',
        effects: { daysLeft: -1, stress: 5 },
        triggerDocument: null
    },
    {
        id: 'language-help',
        probability: 0.08,
        title: '🗣️ Language Practice',
        description: 'You successfully communicated in Russian and gained confidence!',
        effects: { language: 8, stress: -5 },
        triggerDocument: null
    }
];

// ===== NATIONALITY VISITOR STATS =====
const VISITOR_STATS = {
    'USA': 12500,
    'China': 45000,
    'India': 18000,
    'Germany': 8500,
    'France': 7200,
    'UK': 6800,
    'Japan': 5500,
    'South Korea': 9200,
    'Brazil': 3400,
    'Mexico': 2100,
    'Turkey': 15000,
    'Egypt': 4200,
    'Kazakhstan': 38000,
    'Vietnam': 7800,
    'Other': 5000
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initCharacterCreation();
});

// ===== CHARACTER CREATION =====
function initCharacterCreation() {
    const form = document.getElementById('characterForm');
    const ageSlider = document.getElementById('age');
    const ageDisplay = document.getElementById('ageDisplay');
    const nationality = document.getElementById('nationality');
    const destination = document.getElementById('destination');
    const purposeRadios = document.querySelectorAll('input[name="purpose"]');

    // Age slider update
    ageSlider.addEventListener('input', (e) => {
        ageDisplay.textContent = e.target.value;
        updateCharacterPreview();
    });

    // Nationality selection
    nationality.addEventListener('change', () => {
        updateDestinationStats();
        updateCharacterPreview();
    });

    // Destination selection
    destination.addEventListener('change', () => {
        if (destination.value && destination.value !== 'Moscow') {
            alert('Sorry, only Moscow is available in this version!');
            destination.value = 'Moscow';
        }
        updateDestinationStats();
    });

    // Purpose selection
    purposeRadios.forEach(radio => {
        radio.addEventListener('change', updateCharacterPreview);
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        createCharacter();
    });
}

function updateDestinationStats() {
    const nationality = document.getElementById('nationality').value;
    const destination = document.getElementById('destination').value;
    const statsDiv = document.getElementById('destinationStats');

    if (nationality && destination) {
        statsDiv.style.display = 'block';
        document.getElementById('nationalityName').textContent = nationality;
        document.getElementById('visitorCount').textContent =
            (VISITOR_STATS[nationality] || 5000).toLocaleString();
    } else {
        statsDiv.style.display = 'none';
    }
}

function updateCharacterPreview() {
    const age = parseInt(document.getElementById('age').value);
    const nationality = document.getElementById('nationality').value;
    const purpose = document.querySelector('input[name="purpose"]:checked')?.value;
    const preview = document.getElementById('characterPreview');
    const content = document.getElementById('previewContent');

    if (!nationality || !purpose) {
        preview.style.display = 'none';
        return;
    }

    preview.style.display = 'block';

    const stats = calculateStartingResources(age, nationality, purpose);

    content.innerHTML = `
        <p><strong>Starting Resources:</strong></p>
        <ul style="list-style: none; padding-left: 0; margin-top: 0.5rem;">
            <li>💰 Money: ${stats.money.toLocaleString()}₽</li>
            <li>⏰ Days: ${stats.daysLeft}</li>
            <li>🗣️ Language: ${stats.language}%</li>
            <li>😰 Stress: ${stats.stress}%</li>
        </ul>
    `;
}

function calculateStartingResources(age, nationality, purpose) {
    let money = 50000;
    let daysLeft = 90;
    let language = 30;
    let stress = 10;

    // Adjust by purpose
    if (purpose === 'study') {
        money = 50000;
        language = 30;
    } else if (purpose === 'work') {
        money = 100000;
        language = 15;
        stress = 15;
    } else if (purpose === 'tourism') {
        money = 70000;
        language = 10;
        daysLeft = 60;
    }

    // Adjust by age
    if (age < 25) {
        language += 10;
        stress -= 5;
    } else if (age > 50) {
        stress += 10;
        money += 20000;
    }

    // Adjust by nationality (CIS countries)
    if (['Kazakhstan', 'Belarus', 'Armenia'].includes(nationality)) {
        language += 20;
        stress -= 10;
    }

    return { money, daysLeft, language: Math.min(language, 100), stress: Math.max(stress, 0) };
}

function createCharacter() {
    const age = parseInt(document.getElementById('age').value);
    const nationality = document.getElementById('nationality').value;
    const destination = document.getElementById('destination').value;
    const purpose = document.querySelector('input[name="purpose"]:checked').value;

    if (destination !== 'Moscow') {
        alert('Please select Moscow as destination (other cities coming soon!)');
        return;
    }

    // Create character
    gameState.character = { age, nationality, destination, purpose };

    // Set starting resources
    const stats = calculateStartingResources(age, nationality, purpose);
    gameState.resources = {
        ...stats,
        documents: []
    };

    // Set game start time
    gameState.gameStartTime = Date.now();

    // Show resource bar and start game
    document.getElementById('resourceBar').style.display = 'flex';
    updateResourceDisplay();

    showScreen('gameMap');
    updateMapState();
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ===== RESOURCE MANAGEMENT =====
function updateResourceDisplay() {
    document.getElementById('daysLeft').textContent = gameState.resources.daysLeft;
    document.getElementById('money').textContent = Math.max(0, gameState.resources.money).toLocaleString();
    document.getElementById('docsProgress').textContent =
        `${gameState.resources.documents.length}/6`;
    document.getElementById('language').textContent =
        Math.max(0, Math.min(100, Math.round(gameState.resources.language)));
    document.getElementById('stress').textContent =
        Math.max(0, Math.min(100, Math.round(gameState.resources.stress)));
}

function updateResources(changes) {
    if (changes.daysLeft !== undefined) {
        gameState.resources.daysLeft += changes.daysLeft;
    }
    if (changes.money !== undefined) {
        gameState.resources.money += changes.money;
    }
    if (changes.language !== undefined) {
        gameState.resources.language = Math.max(0, Math.min(100,
            gameState.resources.language + changes.language));
    }
    if (changes.stress !== undefined) {
        gameState.resources.stress = Math.max(0, Math.min(100,
            gameState.resources.stress + changes.stress));
    }

    updateResourceDisplay();
    checkGameOver();
}

function checkGameOver() {
    const { daysLeft, money, stress } = gameState.resources;

    // Check failure conditions
    if (daysLeft <= 0) {
        endGame(false, 'Time ran out! You failed to complete all documents within 90 days.');
        return true;
    }

    if (money < 0) {
        endGame(false, 'You ran out of money! You cannot continue without funds.');
        return true;
    }

    if (stress >= 100) {
        endGame(false, 'Stress overload! The bureaucratic maze was too overwhelming.');
        return true;
    }

    // Check victory condition
    if (gameState.resources.documents.length === 6) {
        endGame(true, 'Congratulations! You successfully obtained all required documents!');
        return true;
    }

    return false;
}

// ===== MAP MANAGEMENT =====
function updateMapState() {
    const nextDoc = DOCUMENTS[gameState.currentDocument];

    // Update all location cards
    DOCUMENTS.forEach((doc, index) => {
        const card = document.getElementById(`loc-${doc.location}`);

        if (gameState.resources.documents.includes(doc.id)) {
            // Completed
            card.classList.remove('locked', 'active');
            card.classList.add('completed');
            card.querySelector('.location-status').textContent = 'Completed ✓';
        } else if (index === gameState.currentDocument) {
            // Current/Active
            card.classList.remove('locked', 'completed');
            card.classList.add('active');
            card.querySelector('.location-status').textContent = 'Available';
            card.style.cursor = 'pointer';
            card.onclick = () => openLocation(doc.location);
        } else {
            // Locked
            card.classList.add('locked');
            card.classList.remove('active', 'completed');
            card.querySelector('.location-status').textContent = 'Locked';
            card.style.cursor = 'not-allowed';
            card.onclick = null;
        }
    });

    // Update current task
    if (nextDoc) {
        document.getElementById('taskDescription').textContent =
            `Go to ${formatLocationName(nextDoc.location)} to get: ${nextDoc.name}`;
    }
}

function formatLocationName(location) {
    const names = {
        'airport': 'the Airport',
        'accommodation': 'your Accommodation',
        'university': 'the University',
        'telecom': 'the Phone Shop & Bank',
        'hospital': 'the Hospital',
        'migration': 'the Migration Center'
    };
    return names[location] || location;
}

// ===== LOCATION MANAGEMENT =====
function openLocation(locationId) {
    const doc = DOCUMENTS[gameState.currentDocument];

    if (doc.location !== locationId) {
        alert('This location is not available yet!');
        return;
    }

    // Skip if purpose doesn't match (e.g., university for non-students)
    if (doc.requiredPurpose && gameState.character.purpose !== doc.requiredPurpose) {
        // Skip this document
        gameState.resources.documents.push(doc.id);
        gameState.currentDocument++;
        updateMapState();
        return;
    }

    showScreen('locationScreen');
    renderLocationContent(doc);

    // Setup back button
    document.getElementById('btnBack').onclick = () => {
        showScreen('gameMap');
    };
}

function renderLocationContent(doc) {
    document.getElementById('locationTitle').textContent =
        `${doc.icon} ${formatLocationName(doc.location)}`;

    const content = document.getElementById('locationContent');

    // Check if requirements are met
    const canProceed = gameState.resources.language >= doc.languageRequired;
    const hasMoney = gameState.resources.money >= doc.baseCost;

    content.innerHTML = `
        <div class="location-description">
            <p>${doc.description}</p>
        </div>

        <div class="document-requirements">
            <h3>📋 Requirements</h3>
            <ul class="requirement-list">
                <li class="${gameState.resources.language >= doc.languageRequired ? 'requirement-met' : 'requirement-unmet'}">
                    ${gameState.resources.language >= doc.languageRequired ? '✅' : '❌'}
                    Russian Language: ${doc.languageRequired}% (You have: ${Math.round(gameState.resources.language)}%)
                </li>
                <li class="${hasMoney ? 'requirement-met' : 'requirement-unmet'}">
                    ${hasMoney ? '✅' : '❌'}
                    Money: ${doc.baseCost.toLocaleString()}₽ (You have: ${gameState.resources.money.toLocaleString()}₽)
                </li>
                <li>⏰ Time Required: ${doc.baseTime} hours ${doc.waitingDays > 0 ? `+ ${doc.waitingDays} days waiting` : ''}</li>
            </ul>
        </div>

        ${renderActionOptions(doc, canProceed, hasMoney)}
    `;
}

function renderActionOptions(doc, canProceed, hasMoney) {
    if (!canProceed) {
        return `
            <div class="action-options">
                <div class="action-card disabled">
                    <h4>❌ Insufficient Language Skills</h4>
                    <p>You need to improve your Russian before you can proceed here.
                    Consider studying or finding help.</p>
                </div>
                <button class="btn-secondary" onclick="showScreen('gameMap')">
                    Go Back and Prepare
                </button>
            </div>
        `;
    }

    if (!hasMoney) {
        return `
            <div class="action-options">
                <div class="action-card disabled">
                    <h4>❌ Insufficient Funds</h4>
                    <p>You don't have enough money for this document.
                    You need ${doc.baseCost.toLocaleString()}₽ but only have ${gameState.resources.money.toLocaleString()}₽.</p>
                </div>
                <button class="btn-secondary" onclick="showScreen('gameMap')">
                    Go Back
                </button>
            </div>
        `;
    }

    // Standard option
    let options = `
        <div class="action-options">
            <div class="action-card" onclick="processDocument('standard')">
                <h4>📝 Standard Processing</h4>
                <p>${doc.description}</p>
                <div class="action-cost">
                    <span class="cost-item">💰 ${doc.baseCost.toLocaleString()}₽</span>
                    <span class="cost-item">⏰ ${doc.baseTime} hours</span>
                    <span class="cost-item">🗣️ ${doc.languageRequired}% Russian</span>
                </div>
            </div>
    `;

    // Express option (more expensive, faster)
    if (doc.baseCost > 0) {
        const expressCost = doc.baseCost + 3000;
        const expressTime = Math.max(1, doc.baseTime - 1);
        options += `
            <div class="action-card" onclick="processDocument('express')">
                <h4>⚡ Express Processing</h4>
                <p>Pay extra to speed up the process and reduce language requirements.</p>
                <div class="action-cost">
                    <span class="cost-item">💰 ${expressCost.toLocaleString()}₽</span>
                    <span class="cost-item">⏰ ${expressTime} hours</span>
                    <span class="cost-item">🗣️ ${Math.max(0, doc.languageRequired - 10)}% Russian</span>
                </div>
            </div>
        `;
    }

    options += `</div>`;
    return options;
}

// ===== DOCUMENT PROCESSING =====
function processDocument(mode) {
    const doc = DOCUMENTS[gameState.currentDocument];

    let cost = doc.baseCost;
    let time = doc.baseTime;
    let languageReq = doc.languageRequired;

    if (mode === 'express') {
        cost = doc.baseCost + 3000;
        time = Math.max(1, doc.baseTime - 1);
        languageReq = Math.max(0, doc.languageRequired - 10);
    }

    // Add some randomness
    const randomTimeFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    time = Math.round(time * randomTimeFactor);

    // Apply costs
    updateResources({
        money: -cost,
        daysLeft: -Math.ceil(time / 24), // Convert hours to days
        stress: Math.round(5 + Math.random() * 5)
    });

    // Check for random events
    triggerRandomEvent(doc);

    // If there's a waiting period, show waiting screen
    if (doc.waitingDays > 0) {
        startWaiting(doc, doc.waitingDays);
    } else {
        completeDocument(doc);
    }
}

// ===== WAITING SYSTEM =====
function startWaiting(doc, days) {
    gameState.waitingState = {
        document: doc,
        daysRemaining: days,
        totalDays: days,
        activity: null
    };

    showScreen('waitingScreen');

    document.getElementById('waitingTitle').textContent =
        `Processing ${doc.name}...`;
    document.getElementById('waitingDescription').textContent =
        `Your documents are being processed. This will take ${days} days. You can use this time productively.`;
    document.getElementById('waitingDaysLeft').textContent = days;

    updateWaitingProgress();

    // Setup activity buttons
    document.getElementById('btnStudyLanguage').onclick = () => setWaitingActivity('language');
    document.getElementById('btnPartTimeWork').onclick = () => setWaitingActivity('work');
    document.getElementById('btnRest').onclick = () => setWaitingActivity('rest');
    document.getElementById('btnSkipWait').onclick = skipWaiting;
}

function setWaitingActivity(activity) {
    gameState.waitingState.activity = activity;

    // Highlight selected button
    document.querySelectorAll('.waiting-actions .btn-secondary').forEach(btn => {
        btn.style.background = 'white';
        btn.style.color = '#667eea';
    });

    if (activity === 'language') {
        document.getElementById('btnStudyLanguage').style.background = '#667eea';
        document.getElementById('btnStudyLanguage').style.color = 'white';
    } else if (activity === 'work') {
        document.getElementById('btnPartTimeWork').style.background = '#667eea';
        document.getElementById('btnPartTimeWork').style.color = 'white';
    } else if (activity === 'rest') {
        document.getElementById('btnRest').style.background = '#667eea';
        document.getElementById('btnRest').style.color = 'white';
    }
}

function updateWaitingProgress() {
    const { daysRemaining, totalDays } = gameState.waitingState;
    const progress = ((totalDays - daysRemaining) / totalDays) * 100;

    document.getElementById('waitingProgress').style.width = `${progress}%`;
    document.getElementById('waitingDaysLeft').textContent = daysRemaining;
}

function skipWaiting() {
    const { document: doc, daysRemaining, activity } = gameState.waitingState;

    // Apply effects based on waiting activity
    const changes = { daysLeft: -daysRemaining };

    if (activity === 'language') {
        changes.language = daysRemaining * 1; // +1% per day
        changes.stress = -2;
    } else if (activity === 'work') {
        changes.money = daysRemaining * 500; // +500₽ per day
        changes.stress = 3;
    } else if (activity === 'rest') {
        changes.stress = -daysRemaining * 5; // -5% per day
    } else {
        // No activity selected - mild stress increase
        changes.stress = 3;
    }

    updateResources(changes);

    gameState.waitingState = null;
    completeDocument(doc);
}

// ===== DOCUMENT COMPLETION =====
function completeDocument(doc) {
    // Add document to completed list
    gameState.resources.documents.push(doc.id);
    gameState.completedLocations.push(doc.location);
    gameState.currentDocument++;

    // Show completion message
    showEvent(
        '✅',
        'Document Obtained!',
        `You have successfully obtained your ${doc.name}! ${6 - gameState.currentDocument} documents remaining.`,
        () => {
            showScreen('gameMap');
            updateMapState();
            checkGameOver();
        }
    );
}

// ===== RANDOM EVENTS =====
function triggerRandomEvent(currentDoc) {
    // Filter applicable events
    const applicableEvents = RANDOM_EVENTS.filter(event => {
        if (event.triggerDocument && event.triggerDocument !== currentDoc.id) {
            return false;
        }
        return Math.random() < event.probability;
    });

    if (applicableEvents.length === 0) return;

    // Pick random event
    const event = applicableEvents[Math.floor(Math.random() * applicableEvents.length)];

    setTimeout(() => {
        showEvent(
            event.title.split(' ')[0],
            event.title.substring(event.title.indexOf(' ') + 1),
            event.description,
            () => {
                updateResources(event.effects);
            }
        );
    }, 500);
}

// ===== EVENT MODAL =====
function showEvent(icon, title, description, callback) {
    const modal = document.getElementById('eventModal');
    document.getElementById('eventIcon').textContent = icon;
    document.getElementById('eventTitle').textContent = title;
    document.getElementById('eventDescription').textContent = description;

    modal.classList.add('active');

    document.getElementById('btnEventClose').onclick = () => {
        modal.classList.remove('active');
        if (callback) callback();
    };
}

// ===== GAME END =====
function endGame(victory, message) {
    showScreen('resultsScreen');

    const icon = document.getElementById('resultIcon');
    const title = document.getElementById('resultTitle');
    const subtitle = document.getElementById('resultSubtitle');
    const content = document.getElementById('resultsContent');

    if (victory) {
        icon.textContent = '🎉';
        title.textContent = 'Congratulations!';
        subtitle.textContent = message;
    } else {
        icon.textContent = '😞';
        title.textContent = 'Game Over';
        subtitle.textContent = message;
    }

    // Calculate score
    const score = calculateScore(victory);

    content.innerHTML = `
        <div class="result-section">
            <h3>📊 Final Statistics</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Days Remaining</div>
                    <div class="stat-value">${gameState.resources.daysLeft}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Money Remaining</div>
                    <div class="stat-value">${gameState.resources.money.toLocaleString()}₽</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Documents Collected</div>
                    <div class="stat-value">${gameState.resources.documents.length}/6</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Russian Proficiency</div>
                    <div class="stat-value">${Math.round(gameState.resources.language)}%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Stress Level</div>
                    <div class="stat-value">${Math.round(gameState.resources.stress)}%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Overall Score</div>
                    <div class="stat-value">${score.total}/100</div>
                </div>
            </div>
        </div>

        <div class="result-section">
            <h3>💡 Performance Analysis</h3>
            ${generatePerformanceAnalysis(score)}
        </div>

        <div class="result-section">
            <h3>👤 Your Character</h3>
            <p><strong>Nationality:</strong> ${gameState.character.nationality}</p>
            <p><strong>Age:</strong> ${gameState.character.age}</p>
            <p><strong>Purpose:</strong> ${gameState.character.purpose}</p>
            <p><strong>Destination:</strong> ${gameState.character.destination}</p>
        </div>

        ${victory ? generateResourceLinks() : ''}
    `;
}

function calculateScore(victory) {
    const { daysLeft, money, documents, language, stress } = gameState.resources;

    let score = {
        time: 0,
        money: 0,
        documents: 0,
        language: 0,
        stress: 0,
        total: 0
    };

    // Documents (40 points max)
    score.documents = (documents.length / 6) * 40;

    // Time management (20 points max)
    score.time = Math.min(20, (daysLeft / 90) * 20);

    // Money management (15 points max)
    score.money = Math.min(15, (money / 50000) * 15);

    // Language improvement (15 points max)
    score.language = Math.min(15, (language / 100) * 15);

    // Stress management (10 points max) - lower is better
    score.stress = Math.max(0, 10 - (stress / 10));

    score.total = Math.round(
        score.documents + score.time + score.money + score.language + score.stress
    );

    return score;
}

function generatePerformanceAnalysis(score) {
    const insights = [];

    if (score.documents >= 35) {
        insights.push('✅ Excellent job collecting documents!');
    } else if (score.documents < 20) {
        insights.push('❌ You struggled to collect the required documents.');
    }

    if (score.time >= 15) {
        insights.push('⏰ Great time management!');
    } else if (score.time < 5) {
        insights.push('⏰ You ran low on time. Better planning could help.');
    }

    if (score.money >= 10) {
        insights.push('💰 Excellent financial management!');
    } else {
        insights.push('💰 Consider budgeting more carefully.');
    }

    if (score.language >= 10) {
        insights.push('🗣️ Your Russian skills improved significantly!');
    } else {
        insights.push('🗣️ Learning more Russian would make the process easier.');
    }

    if (score.stress >= 7) {
        insights.push('😌 You managed stress well!');
    } else {
        insights.push('😰 The process was very stressful. Try to stay calm.');
    }

    return `<ul style="list-style: none; padding: 0;">${insights.map(i =>
        `<li style="padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0;">${i}</li>`
    ).join('')}</ul>`;
}

function generateResourceLinks() {
    return `
        <div class="result-section" style="background: #e6fffa; border-left: 4px solid #38b2ac;">
            <h3>🔗 Helpful Resources</h3>
            <p style="margin-bottom: 1rem;">Learn more about settling in Russia:</p>
            <ul style="padding-left: 1.5rem;">
                <li style="margin: 0.5rem 0;">
                    <a href="https://www.gov.ru/en/" target="_blank" style="color: #3182ce;">
                        Russian Government Services Portal
                    </a>
                </li>
                <li style="margin: 0.5rem 0;">
                    <a href="https://www.mfa.gov.ru/en/" target="_blank" style="color: #3182ce;">
                        Ministry of Foreign Affairs
                    </a>
                </li>
                <li style="margin: 0.5rem 0;">
                    <a href="https://www.study-in-russia.ru/en/" target="_blank" style="color: #3182ce;">
                        Study in Russia
                    </a>
                </li>
            </ul>
        </div>
    `;
}
