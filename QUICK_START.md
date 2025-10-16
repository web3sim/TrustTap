# 🚀 Quick Start Commands

## Prerequisites Check

```bash
# Verify Node.js installed
node --version  # Should be 16+

# Verify npm installed
npm --version   # Should be 8+

# Verify Java installed
java -version   # Should be JDK 11+

# Verify Android SDK
echo $ANDROID_HOME  # Should show path to Android SDK
```

## Initial Setup (One Time)

```bash
# 1. Navigate to project directory
cd /Users/sambit/Documents/test/test

# 2. Install all dependencies
npm install

# 3. Create .env file (optional - already in .env.example)
cp .env.example .env

# 4. Verify environment
echo "API Key: $(grep HUMAN_PASSPORT_API_KEY .env)"
echo "Scorer ID: $(grep HUMAN_PASSPORT_SCORER_ID .env)"
```

## Development Workflow

```bash
# Terminal 1: Start Metro bundler
npm start
# This starts the JavaScript bundler and watches for changes

# Terminal 2: Run on Android device
npx react-native run-android
# Make sure Android device is connected via USB
# and has Developer Mode + USB Debugging enabled
```

## Build Commands

```bash
# Build debug APK
cd android
./gradlew assembleDebug
cd ..
# Output: android/app/build/outputs/apk/debug/app-debug.apk

# Build release APK (production)
cd android
./gradlew assembleRelease
cd ..
# Output: android/app/build/outputs/apk/release/app-release.apk

# Install on connected device (debug)
cd android
./gradlew installDebug
cd ..

# Install on connected device (release)
cd android
./gradlew installRelease
cd ..
```

## Testing Commands

```bash
# Check TypeScript for errors
npx tsc --noEmit

# Run linter
npm run lint

# Run unit tests
npm test

# Watch tests
npm test -- --watch
```

## Debugging Commands

```bash
# View Android logs
adb logcat

# List connected devices
adb devices

# Clear cache and rebuild
npm start -- --reset-cache

# Debug on device via DevTools
# Shake device or run:
adb shell input keyevent 82

# View metro server logs
# Check the terminal where "npm start" is running
```

## Clean Commands

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Clean node_modules
rm -rf node_modules && npm install

# Clean all caches
npm start -- --reset-cache

# Remove build artifacts
cd android && rm -rf build app/build && cd ..
```

## Environment Variables

```bash
# View .env configuration
cat .env

# Set API key (if not in .env)
export HUMAN_PASSPORT_API_KEY="n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R"

# Set Android home (if not set)
export ANDROID_HOME=~/Library/Android/sdk  # macOS
export ANDROID_HOME=/opt/android-sdk-linux  # Linux
export ANDROID_HOME=%LOCALAPPDATA%\Android\sdk  # Windows

# View environment
env | grep ANDROID
env | grep HUMAN_PASSPORT
```

## Device Setup

```bash
# Enable USB Debugging on Android device:
# 1. Go to Settings
# 2. About Phone
# 3. Tap Build Number 7 times
# 4. Go back to Settings > Developer Options
# 5. Enable "USB Debugging"

# Connect device and verify
adb devices
# Should show your device as "device" not "offline"

# If offline, authorize:
adb kill-server
adb start-server
adb devices
# Accept authorization prompt on device

# Check device NFC
adb shell getprop ro.nfc.supported
# Should return "true"
```

## Troubleshooting Commands

```bash
# If "react-native command not found"
npm install -g react-native

# If NFC not working
# 1. Check permissions
adb shell pm list permissions | grep nfc

# 2. Enable NFC
adb shell svc nfc enable

# 3. Restart app
adb shell am force-stop com.humanpassport

# If build fails
cd android && ./gradlew clean && ./gradlew assembleDebug && cd ..

# If "Metro bundler connection issue"
lsof -i :8081  # Find process on port 8081
kill -9 <PID>   # Kill the process
npm start       # Restart bundler

# If dependencies missing
rm package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit --skipLibCheck
```

## Production Build Steps

```bash
# 1. Bump version in package.json
# 2. Create signed key (one time)
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias release

# 3. Update gradle.properties with key info
# 4. Build release APK
npm run build:android

# 5. Sign and align (if needed)
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore release.keystore app-release.apk release

zipalign -v 4 app-release.apk app-release-aligned.apk

# 6. Upload to Play Store
# Use Android Studio or Play Console web interface
```

## Useful File Locations

```bash
# Project root
/Users/sambit/Documents/test/test

# Android project
/Users/sambit/Documents/test/test/android

# Source code
/Users/sambit/Documents/test/test/src

# Configuration
/Users/sambit/Documents/test/test/src/constants/index.ts

# Services
/Users/sambit/Documents/test/test/src/services/

# Screens
/Users/sambit/Documents/test/test/src/screens/

# Android manifest
/Users/sambit/Documents/test/test/android/app/src/main/AndroidManifest.xml

# Gradle build file
/Users/sambit/Documents/test/test/android/app/build.gradle

# Build output
/Users/sambit/Documents/test/test/android/app/build/outputs/apk/
```

## Important Files

```bash
# View all TypeScript files
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules

# View all Java files
find . -name "*.java" | grep -v build

# View configuration
cat .env.example
cat src/constants/index.ts
cat android/app/build.gradle
cat tsconfig.json
cat babel.config.js

# View documentation
cat README.md
cat PROJECT_SUMMARY.md
cat COMPLETION_CHECKLIST.md
```

## Git Commands (if using version control)

```bash
# Initialize git repo
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Human Passport Mobile app"

# Create main branch
git branch -M main

# Add remote (if you have a repo)
git remote add origin https://github.com/yourusername/human-passport-mobile.git

# Push to remote
git push -u origin main
```

## API Testing (using curl)

```bash
# Get Passport score for address
curl -X GET \
  "https://api.passport.xyz/v2/stamps/100/score/0x1234567890123456789012345678901234567890" \
  -H "X-API-KEY: n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R"

# Get stamps for address
curl -X GET \
  "https://api.passport.xyz/v2/stamps/0x1234567890123456789012345678901234567890" \
  -H "X-API-KEY: n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R"

# Get stamps metadata
curl -X GET \
  "https://api.passport.xyz/v2/stamps/metadata" \
  -H "X-API-KEY: n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R"
```

## Monitoring & Logs

```bash
# Watch Metro logs in real-time
npm start 2>&1 | tee metro.log

# Watch Android logs
adb logcat | grep "com.humanpassport"

# Watch specific service logs
adb logcat | grep "NFCModule"
adb logcat | grep "MainActivity"

# Save logs to file
adb logcat > android.log

# Real-time metrics
adb shell dumpsys meminfo com.humanpassport
```

## Performance Commands

```bash
# Check app startup time
adb shell am start -W com.humanpassport

# Profile CPU usage
adb shell top

# Monitor memory
adb shell dumpsys meminfo com.humanpassport

# Check battery impact
adb shell dumpsys batterystate
```

---

## Common Workflows

### First Time Setup
```bash
cd /Users/sambit/Documents/test/test
npm install
cp .env.example .env
npx react-native run-android
```

### Daily Development
```bash
# Terminal 1
npm start

# Terminal 2
npx react-native run-android
```

### Build and Test
```bash
npm run build:android
adb install android/app/build/outputs/apk/release/app-release.apk
adb shell am start com.humanpassport
```

### Debugging
```bash
npm start -- --reset-cache
adb logcat | grep "com.humanpassport"
```

### Production Release
```bash
npm run build:android
# Upload android/app/build/outputs/apk/release/app-release.apk to Play Store
```

---

## Critical Credentials (Already Configured)

```
API Endpoint:  https://api.passport.xyz/v2
API Key:       n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R
Scorer ID:     100
```

These are already in `.env.example` and configured in code.

---

**Ready to build! Start with:**
```bash
npm install && npm start
```

**Then in another terminal:**
```bash
npx react-native run-android
```
