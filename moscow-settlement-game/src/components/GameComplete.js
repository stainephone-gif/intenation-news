import React from 'react';
import './GameComplete.css';

function GameComplete({ character, resources }) {
  const getSuccessRating = () => {
    let score = 0;
    let maxScore = 100;

    // Money management (30 points)
    const moneyPercent = (resources.money / 10000) * 100;
    if (moneyPercent > 80) score += 30;
    else if (moneyPercent > 50) score += 20;
    else if (moneyPercent > 20) score += 10;
    else score += 5;

    // Time management (20 points)
    const timePercent = (resources.time / 100) * 100;
    if (timePercent > 60) score += 20;
    else if (timePercent > 40) score += 15;
    else if (timePercent > 20) score += 10;
    else score += 5;

    // Stress management (20 points) - lower is better
    if (resources.stress < 20) score += 20;
    else if (resources.stress < 40) score += 15;
    else if (resources.stress < 60) score += 10;
    else score += 5;

    // Language improvement (15 points)
    if (resources.language > 40) score += 15;
    else if (resources.language > 25) score += 10;
    else if (resources.language > 10) score += 5;

    // Documents acquired (15 points)
    if (resources.documents.migrationCard) score += 15;

    return { score, maxScore, percentage: (score / maxScore) * 100 };
  };

  const getRank = (percentage) => {
    if (percentage >= 90) return { rank: 'S', title: 'Moscow Expert', emoji: '🌟' };
    if (percentage >= 75) return { rank: 'A', title: 'Seasoned Traveler', emoji: '⭐' };
    if (percentage >= 60) return { rank: 'B', title: 'Competent Navigator', emoji: '✨' };
    if (percentage >= 45) return { rank: 'C', title: 'Struggling But Surviving', emoji: '💪' };
    return { rank: 'D', title: 'Barely Made It', emoji: '😅' };
  };

  const getInsights = () => {
    const insights = [];

    if (resources.money < 2000) {
      insights.push('💰 You spent a lot of money! Consider more budget-friendly options next time.');
    } else if (resources.money > 8000) {
      insights.push('💰 Great money management! You saved well.');
    }

    if (resources.stress > 50) {
      insights.push('😰 High stress levels! Try to find ways to reduce anxiety, like learning basic phrases.');
    } else if (resources.stress < 20) {
      insights.push('😌 You handled stress well! Your calm approach paid off.');
    }

    if (resources.language > 30) {
      insights.push('🗣️ Your Russian skills improved significantly! Language is key to settling in.');
    } else if (resources.language < 15) {
      insights.push('🗣️ Consider learning more Russian - it will make life much easier here.');
    }

    if (resources.time < 30) {
      insights.push('⏱️ You ran out of time! Better planning could help.');
    } else if (resources.time > 80) {
      insights.push('⏱️ Excellent time management! You were efficient.');
    }

    return insights;
  };

  const successRating = getSuccessRating();
  const rankInfo = getRank(successRating.percentage);
  const insights = getInsights();

  return (
    <div className="game-complete">
      <div className="complete-header">
        <h1>🎉 Day 1 Complete!</h1>
        <p>You've successfully arrived in Moscow and reached your accommodation.</p>
      </div>

      <div className="results-container">
        <div className="rank-display">
          <div className="rank-badge">
            <div className="rank-emoji">{rankInfo.emoji}</div>
            <div className="rank-letter">{rankInfo.rank}</div>
          </div>
          <h2>{rankInfo.title}</h2>
          <div className="score-display">
            <div className="score-number">{successRating.score}/{successRating.maxScore}</div>
            <div className="score-percentage">{successRating.percentage.toFixed(1)}%</div>
          </div>
        </div>

        <div className="stats-breakdown">
          <h3>📊 Performance Breakdown</h3>

          <div className="stat-item">
            <span className="stat-label">💰 Money Remaining:</span>
            <span className="stat-value">{resources.money}₽</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">⏱️ Time Remaining:</span>
            <span className="stat-value">{resources.time} units</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">😰 Stress Level:</span>
            <span className="stat-value">{resources.stress}%</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">🗣️ Russian Proficiency:</span>
            <span className="stat-value">{resources.language}%</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">📄 Documents:</span>
            <span className="stat-value">
              {resources.documents.migrationCard ? '✅ Migration Card' : '❌ No Migration Card'}
            </span>
          </div>
        </div>

        {insights.length > 0 && (
          <div className="insights-section">
            <h3>💡 Insights & Tips</h3>
            <ul className="insights-list">
              {insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="character-summary">
          <h3>👤 Your Character</h3>
          <p><strong>Nationality:</strong> {character.nationality}</p>
          <p><strong>Age:</strong> {character.age}</p>
          <p><strong>Purpose:</strong> {character.purpose}</p>
        </div>

        <div className="next-steps">
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

        <div className="action-buttons">
          <button
            className="btn-primary btn-large"
            onClick={() => window.location.reload()}
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameComplete;
