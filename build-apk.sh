#!/bin/bash

# Moscow Settlement Game - APK Build Script
# This script automates the process of building an Android APK

set -e  # Exit on error

echo "🎮 Moscow Settlement Game - APK Build Script"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Android SDK is installed
if [ -z "$ANDROID_HOME" ]; then
    echo -e "${RED}❌ Error: ANDROID_HOME is not set${NC}"
    echo "Please install Android SDK and set ANDROID_HOME environment variable."
    echo ""
    echo "Example:"
    echo "  export ANDROID_HOME=/path/to/android/sdk"
    echo "  export PATH=\$PATH:\$ANDROID_HOME/tools:\$ANDROID_HOME/platform-tools"
    exit 1
fi

echo -e "${GREEN}✓ Android SDK found at: $ANDROID_HOME${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if Cordova is installed
if ! command -v cordova &> /dev/null; then
    echo -e "${YELLOW}⚠ Cordova not found. Installing...${NC}"
    npm install -g cordova
fi

echo -e "${GREEN}✓ Cordova found: $(cordova --version)${NC}"
echo ""

# Step 1: Build React app
echo "📦 Step 1: Building React application..."
cd moscow-settlement-game

if [ ! -d "node_modules" ]; then
    echo "📥 Installing React dependencies..."
    npm install
fi

echo "🔨 Building production React app..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ React build successful${NC}"
else
    echo -e "${RED}❌ React build failed${NC}"
    exit 1
fi

cd ..

# Step 2: Copy build to Cordova
echo ""
echo "📋 Step 2: Copying build to Cordova project..."
rm -rf moscow-settlement-android/www/*
cp -r moscow-settlement-game/build/* moscow-settlement-android/www/

echo -e "${GREEN}✓ Files copied${NC}"

# Step 3: Build Android APK
echo ""
echo "🤖 Step 3: Building Android APK..."
cd moscow-settlement-android

# Check if Android platform is added
if [ ! -d "platforms/android" ]; then
    echo "➕ Adding Android platform..."
    cordova platform add android
fi

# Build APK
echo "🔨 Building APK (this may take a few minutes)..."
cordova build android

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ BUILD SUCCESSFUL!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "📱 Your APK is ready:"
    echo "   Debug APK: platforms/android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "To install on your Android device:"
    echo "   1. Enable 'Install from Unknown Sources' in your device settings"
    echo "   2. Transfer the APK to your device"
    echo "   3. Tap the APK file to install"
    echo ""
    echo "Or connect your device and run:"
    echo "   cordova run android"
    echo ""

    # Show APK size
    APK_PATH="platforms/android/app/build/outputs/apk/debug/app-debug.apk"
    if [ -f "$APK_PATH" ]; then
        APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo "📊 APK Size: $APK_SIZE"
    fi
else
    echo -e "${RED}❌ Android build failed${NC}"
    echo "Check the error messages above."
    exit 1
fi

cd ..
