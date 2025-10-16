#!/bin/zsh

# Human Passport Mobile App - APK Build Script
# This script builds the Android release APK

echo "================================"
echo "Human Passport APK Builder"
echo "================================"
echo ""

# Change to android directory
cd /Users/sambit/Documents/test/test/android

echo "🔧 Building Android Release APK..."
echo ""
echo "Current directory: $(pwd)"
echo ""

# Run gradle build
/opt/homebrew/bin/gradle app:assembleRelease \
  -PversionCode=1 \
  -PversionName="1.0.0" \
  --parallel \
  --daemon

BUILD_EXIT=$?

echo ""
echo "Build Exit Code: $BUILD_EXIT"
echo ""

if [ $BUILD_EXIT -eq 0 ]; then
    echo "✅ BUILD SUCCESSFUL!"
    echo ""
    echo "📦 APK Location:"
    find . -name "*.apk" -type f -mmin -10 2>/dev/null | while read apk; do
        ls -lh "$apk"
        echo "File: $apk"
    done
else
    echo "❌ BUILD FAILED!"
    echo "Exit Code: $BUILD_EXIT"
fi

echo ""
echo "================================"
