import React, { useState } from 'react';
import './CharacterCreation.css';

const COUNTRIES = [
  'USA', 'China', 'India', 'Germany', 'France', 'UK', 'Japan', 'South Korea',
  'Brazil', 'Mexico', 'Turkey', 'Egypt', 'South Africa', 'Kazakhstan', 'Uzbekistan',
  'Belarus', 'Ukraine', 'Georgia', 'Armenia', 'Azerbaijan', 'Vietnam', 'Thailand',
  'Indonesia', 'Philippines', 'Other'
];

const PURPOSES = [
  { value: 'study', label: 'Study (Student Visa)', description: 'You are here to study at a Russian university' },
  { value: 'business', label: 'Business (Work Visa)', description: 'You are here for work or business opportunities' },
  { value: 'tourism', label: 'Tourism (Tourist Visa)', description: 'You are visiting Moscow as a tourist' }
];

function CharacterCreation({ onComplete }) {
  const [formData, setFormData] = useState({
    age: 25,
    nationality: '',
    purpose: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nationality) {
      newErrors.nationality = 'Please select your nationality';
    }

    if (formData.nationality === 'Russia') {
      newErrors.nationality = 'You cannot select Russia as your nationality for this game';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Please select your purpose of visit';
    }

    if (formData.age < 18 || formData.age > 99) {
      newErrors.age = 'Age must be between 18 and 99';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onComplete(formData);
    }
  };

  const getDifficultyInfo = () => {
    let difficulty = 'Medium';
    let tips = [];

    if (formData.nationality === 'Belarus') {
      difficulty = 'Easy';
      tips.push('✅ Visa process is simplified for Belarusian citizens');
    }

    if (formData.purpose === 'study') {
      tips.push('💰 Students have limited budget but better language skills');
    } else if (formData.purpose === 'business') {
      tips.push('💰 Business travelers have more money');
    }

    if (formData.age < 25) {
      tips.push('⚡ Young travelers have more energy and time');
    } else if (formData.age > 50) {
      tips.push('😰 Older travelers may face more stress and fatigue');
    }

    return { difficulty, tips };
  };

  const difficultyInfo = getDifficultyInfo();

  return (
    <div className="character-creation">
      <div className="intro-text">
        <h2>Create Your Character</h2>
        <p>
          Welcome to Moscow! Your choices here will determine your journey.
          Different nationalities, ages, and purposes will create unique challenges.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="character-form">
        <div className="form-group">
          <label htmlFor="age">
            Age: <span className="value-display">{formData.age}</span>
          </label>
          <input
            type="range"
            id="age"
            min="18"
            max="99"
            value={formData.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value))}
            className="slider"
          />
          {errors.age && <span className="error">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nationality">Nationality:</label>
          <select
            id="nationality"
            value={formData.nationality}
            onChange={(e) => handleChange('nationality', e.target.value)}
            className={errors.nationality ? 'error-input' : ''}
          >
            <option value="">Select your country...</option>
            {COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {errors.nationality && <span className="error">{errors.nationality}</span>}
        </div>

        <div className="form-group">
          <label>Purpose of Visit:</label>
          <div className="radio-group">
            {PURPOSES.map(purpose => (
              <div key={purpose.value} className="radio-option">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="purpose"
                    value={purpose.value}
                    checked={formData.purpose === purpose.value}
                    onChange={(e) => handleChange('purpose', e.target.value)}
                  />
                  <div className="radio-content">
                    <strong>{purpose.label}</strong>
                    <p>{purpose.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
          {errors.purpose && <span className="error">{errors.purpose}</span>}
        </div>

        {formData.nationality && formData.purpose && (
          <div className="difficulty-preview">
            <h3>📊 Character Preview</h3>
            <p><strong>Difficulty:</strong> {difficultyInfo.difficulty}</p>
            {difficultyInfo.tips.length > 0 && (
              <ul className="tips-list">
                {difficultyInfo.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button type="submit" className="btn-primary">
          Begin Your Journey →
        </button>
      </form>
    </div>
  );
}

export default CharacterCreation;
