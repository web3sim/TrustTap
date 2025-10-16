#!/bin/bash

# Human Passport Mobile - Quick Start Setup
# This script sets up the development environment and runs the app

set -e

echo "🚀 Human Passport Mobile - Quick Start Setup"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "${YELLOW}1️⃣  Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "${RED}✗ Node.js not found. Please install from https://nodejs.org/${NC}"
    exit 1
fi
echo "${GREEN}✓ Node.js $(node --version)${NC}"

# Check npm
echo "${YELLOW}2️⃣  Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo "${RED}✗ npm not found. Please install Node.js with npm${NC}"
    exit 1
fi
echo "${GREEN}✓ npm $(npm --version)${NC}"

# Check Java
echo "${YELLOW}3️⃣  Checking Java...${NC}"
if ! command -v java &> /dev/null; then
    echo "${RED}✗ Java not found. Please install JDK 11+${NC}"
    exit 1
fi
echo "${GREEN}✓ Java $(java -version 2>&1 | head -1)${NC}"

# Check Android SDK
echo "${YELLOW}4️⃣  Checking Android SDK...${NC}"
if [ -z "$ANDROID_HOME" ]; then
    echo "${RED}✗ ANDROID_HOME not set. Set it to your Android SDK path${NC}"
    exit 1
fi
echo "${GREEN}✓ ANDROID_HOME=$ANDROID_HOME${NC}"

# Install dependencies
echo "${YELLOW}5️⃣  Installing npm dependencies...${NC}"
npm install
echo "${GREEN}✓ Dependencies installed${NC}"

# Setup environment
echo "${YELLOW}6️⃣  Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo "${GREEN}✓ Created .env from .env.example${NC}"
else
    echo "${GREEN}✓ .env already exists${NC}"
fi

# Verify credentials
echo "${YELLOW}7️⃣  Verifying API credentials...${NC}"
API_KEY=$(grep "HUMAN_PASSPORT_API_KEY" .env | cut -d'=' -f2)
SCORER_ID=$(grep "HUMAN_PASSPORT_SCORER_ID" .env | cut -d'=' -f2)
echo "${GREEN}✓ API Key configured: ${API_KEY:0:10}...${NC}"
echo "${GREEN}✓ Scorer ID configured: $SCORER_ID${NC}"

# Check for connected device
echo "${YELLOW}8️⃣  Checking for connected Android device...${NC}"
if ! adb devices | grep -q "device$"; then
    echo "${YELLOW}⚠ No Android device detected. Ensure:${NC}"
    echo "  1. Connect Android device via USB"
    echo "  2. Enable Developer Mode (tap Build Number 7 times in Settings)"
    echo "  3. Enable USB Debugging in Developer Options"
    echo "${YELLOW}You can still build the app without a device.${NC}"
else
    DEVICE=$(adb devices | grep "device$" | head -1 | awk '{print $1}')
    echo "${GREEN}✓ Device detected: $DEVICE${NC}"
fi

echo ""
echo "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📱 Next steps:"
echo ""
echo "${YELLOW}Option 1: Run on connected device${NC}"
echo "  npm run android"
echo ""
echo "${YELLOW}Option 2: Start development server only${NC}"
echo "  npm start"
echo ""
echo "${YELLOW}Option 3: Build release APK${NC}"
echo "  npm run build:android"
echo ""
echo "${YELLOW}📖 Documentation:${NC}"
echo "  - README.md - Full documentation"
echo "  - PROJECT_SUMMARY.md - Project overview"
echo "  - src/constants/index.ts - Configuration"
echo ""
echo "${GREEN}Happy coding! 🎉${NC}"
