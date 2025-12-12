# Moscow Settlement Game - Build Instructions

## Game Overview

"How a Foreigner Settles Down in Moscow" is a simulation game that lets you experience the authentic challenges of settling in Moscow as a foreigner. The game features:

- **Character Creation**: Choose your age, nationality, and purpose of visit
- **Scene 1: Arrival & Immigration**: Navigate customs, get your migration card
- **Transport Choice**: Choose between taxi, metro, or friend pickup
- **Resource Management**: Manage money, time, stress, and language skills
- **Multiple Outcomes**: Your choices affect difficulty and results

## Project Structure

```
/home/user/intenation-news/
├── moscow-settlement-game/     # React web application
│   ├── src/
│   │   ├── components/        # Game components
│   │   │   ├── CharacterCreation.js
│   │   │   ├── ArrivalScene.js
│   │   │   ├── TransportChoice.js
│   │   │   └── GameComplete.js
│   │   ├── App.js             # Main app
│   │   └── index.js
│   ├── build/                 # Production build
│   └── package.json
│
└── moscow-settlement-android/  # Cordova Android wrapper
    ├── www/                   # Contains React build
    ├── platforms/android/     # Android platform files
    └── config.xml
```

## Option 1: Run as Web App (Easiest)

### Prerequisites
- Node.js (v14 or higher)

### Steps

1. Navigate to the game directory:
```bash
cd /home/user/intenation-news/moscow-settlement-game
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser to `http://localhost:3000`

5. To build for production:
```bash
npm run build
```

The production build will be in the `build/` folder and can be deployed to any web server.

## Option 2: Build Android APK

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Java JDK** (version 17 recommended)
3. **Android SDK** (Android Studio or command-line tools)
4. **Gradle** (usually comes with Android SDK)

### Environment Setup

1. Install Android Studio or Android SDK command-line tools
2. Set environment variables:

```bash
export ANDROID_HOME=/path/to/android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

On Windows:
```cmd
set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

### Build Steps

1. Navigate to the Cordova project:
```bash
cd /home/user/intenation-news/moscow-settlement-android
```

2. Build the APK:
```bash
cordova build android
```

3. For a release build:
```bash
cordova build android --release
```

4. Find your APK:
   - Debug APK: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`
   - Release APK: `platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Signing the Release APK

To sign your APK for distribution:

1. Generate a keystore (first time only):
```bash
keytool -genkey -v -keystore moscow-settlement.keystore -alias moscow-settlement -keyalg RSA -keysize 2048 -validity 10000
```

2. Sign the APK:
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore moscow-settlement.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk moscow-settlement
```

3. Align the APK:
```bash
zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk MoscowSettlement.apk
```

## Option 3: Use Online Build Service

If you don't want to install Android SDK locally, you can use services like:

- **PhoneGap Build** (Adobe)
- **Ionic Appflow**
- **GitHub Actions** with Android build workflow

## Testing the Game

### Web Testing
```bash
cd /home/user/intenation-news/moscow-settlement-game
npm start
```

### Android Testing
```bash
cd /home/user/intenation-news/moscow-settlement-android
cordova emulate android  # Requires Android emulator
# OR
cordova run android      # Requires connected Android device with USB debugging
```

## Modifying the Game

### Adding New Scenes

1. Create a new component in `moscow-settlement-game/src/components/`
2. Import and add it to `App.js`
3. Add new game state
4. Create corresponding CSS file

Example:
```javascript
// src/components/AccommodationScene.js
import React from 'react';
import './AccommodationScene.css';

function AccommodationScene({ character, resources, updateResources, onComplete }) {
  // Your scene logic here
}

export default AccommodationScene;
```

### Updating Resources

Resources are managed in `App.js` state and passed down to components:

```javascript
const [resources, setResources] = useState({
  money: 10000,
  time: 100,
  documents: { ... },
  language: 0,
  stress: 0
});
```

Update using `updateResources()` function in components.

## Game Mechanics Implemented

### 1. Character Creation
- Age slider (18-99)
- Nationality selector (any country except Russia)
- Purpose of visit (Study, Business, Tourism)
- Belarus nationality has simplified visa process
- Different purposes affect starting resources

### 2. Arrival Scene
- Simulated waiting time at customs
- Choice-based interaction with customs officer
- Language skill checks
- Document verification
- Migration card acquisition

### 3. Transport Choice
- **Taxi**: Costs 1500-3000₽, language negotiation
- **Metro**: Cheapest (700₽) but complex navigation
- **Friend Pickup**: Free and stress-free (easy mode)

### 4. Resource System
- **Money**: Spent on transport, services
- **Time**: Consumed by activities and waiting
- **Stress**: Increases with challenges, decreases with good choices
- **Language**: Improves with practice, unlocks options
- **Documents**: Migration card, registration, etc.

### 5. Results Screen
- Rank system (S, A, B, C, D)
- Performance breakdown
- Insights and tips
- Character summary

## Future Planned Scenes

As outlined in the original proposal:

1. **Accommodation & Registration**
   - Hotel/dormitory registration
   - Student-specific challenges
   - Dealing with administrators

2. **Hospital** - Medical examinations

3. **Immigration Office** - Visa extensions, permits

4. **Government Service Center** - Мои документы

5. **Police Station** - Document checks

6. **Finding a Job** - Job search and interviews

7. **Renting an Apartment** - Housing search

8. **Socializing** - Making friends and cultural adaptation

## Troubleshooting

### React Build Errors
```bash
cd moscow-settlement-game
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Cordova Build Errors
- Ensure ANDROID_HOME is set correctly
- Check Java version: `java -version` (should be 11-17)
- Update Cordova: `npm install -g cordova@latest`
- Clean build: `cordova clean android && cordova build android`

### APK Installation Fails
- Enable "Install from Unknown Sources" on Android device
- Check APK signing (release builds must be signed)
- Verify minimum Android version compatibility

## Technical Stack

- **Frontend**: React 19.2.3
- **Styling**: Custom CSS with gradients and animations
- **Mobile Wrapper**: Apache Cordova 14.0.1
- **Target Platform**: Android (minimum SDK 24, target SDK 35)

## Credits

Game Design & Implementation: Based on the concept "How a Foreigner Settles Down in Moscow"

This game simulates real challenges foreigners face when settling in Moscow, including:
- Immigration procedures
- Language barriers
- Cultural differences
- Resource management
- Bureaucratic processes

## License

This project is for educational and entertainment purposes.

---

For questions or issues, please refer to the repository documentation.
