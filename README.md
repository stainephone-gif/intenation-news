# 🏛️ How a Foreigner Settles Down in Moscow

A simulation game that authentically recreates the challenging process of a foreigner navigating life in Moscow, Russia.

![Game Type](https://img.shields.io/badge/Game-Simulation-blue)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-green)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Cordova-orange)

## 🎮 Game Overview

Experience the authentic challenges of settling in Moscow as a foreigner through this narrative-driven simulation game. Your choices in identity creation directly influence difficulty, creating a personalized and replayable experience.

### Key Features

- **Dynamic Character Creation**: Choose your age, nationality, and purpose of entry
- **Realistic Scenarios**: Navigate customs, transportation, and daily challenges
- **Resource Management**: Balance time, money, documents, and stress levels
- **Language Barriers**: Russian proficiency affects your options and outcomes
- **Multiple Pathways**: Different choices lead to varied experiences and endings

## 📱 Screenshots / Gameplay

### Character Creation
Create your unique character with choices that affect gameplay:
- **Age**: 18-99 (affects energy and stress tolerance)
- **Nationality**: Any country except Russia (Belarus gets easier visa process)
- **Purpose**: Study, Business, or Tourism (affects starting resources)

### Scene 1: Arrival & Immigration
- Navigate airport customs and immigration
- Obtain your migration card (required document)
- Make strategic choices that affect stress and time
- Language skills unlock better dialogue options

### Transport Selection
Choose how to reach your accommodation:
- **🚖 Taxi**: Expensive but convenient (language negotiation possible)
- **🚇 Metro**: Cheapest option but complex navigation
- **👥 Friend Pickup**: Free and easy (easy mode)

## 🎯 Game Mechanics

### Resource System

| Resource | Description | Impact |
|----------|-------------|---------|
| 💰 Money | Russian Rubles | Spent on transport, services, documents |
| ⏱️ Time | Action points | Limited time for tasks, delays increase stress |
| 😰 Stress | Mental state (0-100%) | High stress affects decision-making |
| 🗣️ Russian | Language proficiency | Unlocks dialogue options, reduces stress |
| 📄 Documents | Legal papers | Required for various activities |

### Difficulty Scaling

Your character choices affect initial difficulty:

- **Belarus nationality**: ✅ Simplified visa, less stress
- **Student purpose**: 💰 Less money, better Russian skills
- **Business purpose**: 💰 More money, limited language skills
- **Young age (<25)**: ⚡ More time and energy
- **Older age (>50)**: 😰 Higher initial stress

## 🚀 Quick Start

### Play in Browser (Easiest)

```bash
cd moscow-settlement-game
npm install
npm start
```

Open `http://localhost:3000` in your browser.

### Build Android APK

**Prerequisites**: Android SDK, Java JDK, Node.js

```bash
# Automated build script
./build-apk.sh

# Manual build
cd moscow-settlement-game
npm run build
cd ../moscow-settlement-android
cordova build android
```

APK location: `moscow-settlement-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk`

📖 **Detailed instructions**: See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

## 📂 Project Structure

```
intenation-news/
├── moscow-settlement-game/       # React web application
│   ├── src/
│   │   ├── components/
│   │   │   ├── CharacterCreation.js   # Character setup screen
│   │   │   ├── ArrivalScene.js        # Immigration scene
│   │   │   ├── TransportChoice.js     # Transport selection
│   │   │   └── GameComplete.js        # Results screen
│   │   ├── App.js                     # Main game logic
│   │   └── App.css                    # Global styles
│   └── build/                         # Production build
│
├── moscow-settlement-android/     # Cordova wrapper for Android
│   ├── www/                       # Web content (from build)
│   ├── platforms/android/         # Android platform files
│   └── config.xml                 # Cordova configuration
│
├── build-apk.sh                   # Automated build script
├── BUILD_INSTRUCTIONS.md          # Detailed build guide
└── README.md                      # This file
```

## 🎲 Current Implementation

### ✅ Completed Features

1. **Character Creation System**
   - Age selection (18-99)
   - Nationality selector (25+ countries)
   - Purpose of visit (Study/Business/Tourism)
   - Dynamic difficulty preview

2. **Scene 1: Arrival & Immigration**
   - Realistic waiting simulation
   - Customs officer interaction
   - Language-based dialogue options
   - Migration card acquisition

3. **Transport Choice Mechanic**
   - Three transport options with trade-offs
   - Russian language checks
   - Cost vs. convenience decisions
   - Narrative outcomes

4. **Resource Management**
   - Money tracking and spending
   - Time management system
   - Stress level calculation
   - Russian language progression

5. **Results & Scoring**
   - Performance ranking (S/A/B/C/D)
   - Detailed stats breakdown
   - Personalized insights and tips
   - Replay option

## 🔮 Planned Future Scenes

Based on the original game concept:

### Scene 2: Accommodation & Registration
- Hotel/dormitory check-in
- Mandatory registration process
- Student-specific challenges (delayed documents, medical exams)
- Potential discrimination scenarios

### Additional Planned Features
- 🏥 **Hospital**: Medical examination for visa
- 🏛️ **Immigration Office**: Visa extensions, permits (РВП/ВНЖ)
- 📋 **Government Service Center**: Мои документы
- 🚔 **Police Station**: Document checks
- 💼 **Finding a Job**: Employment search
- 🏠 **Renting an Apartment**: Housing search
- 👥 **Socializing**: Making friends, cultural adaptation

## 🛠️ Technical Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend Framework | React | 19.2.3 |
| Mobile Wrapper | Apache Cordova | 14.0.1 |
| Styling | CSS3 | - |
| State Management | React Hooks | - |
| Target Platform | Android | SDK 24+ (Android 7.0+) |
| Build Tool | Gradle | Via Cordova |

## 🎨 Design Philosophy

This game aims to:

1. **Educate through Experience**: Simulate real bureaucratic and cultural challenges
2. **Avoid Political Themes**: Focus on personal experiences, not politics
3. **Promote Cultural Understanding**: Show authentic daily life situations
4. **Encourage Replayability**: Different choices create varied experiences
5. **Balance Challenge and Fun**: Realistic but engaging gameplay

## 👨‍💻 Development

### Adding New Scenes

1. Create component: `src/components/NewScene.js`
2. Add styles: `src/components/NewScene.css`
3. Update game state in `App.js`
4. Add navigation logic

Example:
```javascript
import NewScene from './components/NewScene';

// In App.js
{gameState === 'new-scene' && (
  <NewScene
    character={character}
    resources={resources}
    updateResources={updateResources}
    onComplete={handleSceneComplete}
  />
)}
```

### Modifying Resources

Update the resource system in `App.js`:
```javascript
const [resources, setResources] = useState({
  money: 10000,
  time: 100,
  documents: { passport: true, visa: true },
  language: 0,
  stress: 0,
  // Add new resources here
});
```

## 📊 Game Balance

Current resource values are calibrated for ~15-20 minutes of gameplay per playthrough:

- **Starting Money**: 5,000₽ (student) to 50,000₽ (business)
- **Starting Time**: 80-120 units based on age
- **Initial Stress**: 5-20% based on nationality
- **Language Skills**: 5-30% based on purpose

## 🤝 Contributing

This project is based on the game concept "How a Foreigner Settles Down in Moscow".

Future contributions could include:
- Additional scenes and scenarios
- New character attributes
- More detailed resource systems
- Localization (English/Russian/other languages)
- Sound effects and music
- Enhanced visual design

## 📄 License

Educational and entertainment purposes.

## 🙏 Credits

**Game Concept**: Based on real experiences of foreigners settling in Moscow
**Development**: React + Cordova implementation
**Inspiration**: Authentic challenges faced by international residents in Moscow

## 📞 Support

For build issues, see [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

---

**Note**: This game simulates challenging real-life situations for educational purposes. It does not represent official procedures and should not be used as a guide for actual immigration processes.
