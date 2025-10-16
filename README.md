# Human Passport Mobile 📱

> Portable Hardware-Backed Identity with Keycard + NFC

A **React Native** Android application that integrates **Human Passport** identity verification with **Keycard** hardware wallet support via NFC. Users can tap their Keycard to securely log in, verify their identity (Sybil resistance), and sign Ethereum transactions using PIN + NFC.

**Version**: 1.0.0 | **API Key**: n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R | **Scorer ID**: 100

## 🎯 Features

✅ **Hardware-Backed Security**
- Secure element for key storage (Keycard Common Criteria EAL5+)
- Private keys never leave the device
- 4-6 digit PIN-protected access
- NFC tap-to-authenticate

✅ **NFC Integration** 
- Native Android NFC support (API 21+)
- IsoDep protocol for Keycard communication
- Foreground dispatch for reliable tag detection
- 4-10cm tap range

✅ **Human Passport Integration**
- Real-time Sybil resistance scoring (Stamps API v2)
- Passport score verification (threshold: 20)
- Multi-stamp verification (GitHub, Twitter, Discord, Lens, etc.)
- Score expiry tracking

✅ **Ethereum Support**
- BIP32/BIP44 key derivation paths
- Transaction signing with Keycard
- Message signing (EIP-191 standard)
- Contract interaction support

✅ **Android Optimized**
- Native NFC module for low-level APDU commands
- React Native bridge integration
- Foreground dispatch for NFC
- Keycard APDU command support

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ ([nodejs.org](https://nodejs.org/))
- **npm** 8+ or **yarn** 4+
- **Java Development Kit (JDK)** 11+
- **Android SDK** (API level 21+ required, API 31+ recommended)
- **Android Studio** Flamingo+ ([developer.android.com](https://developer.android.com/studio))

### Hardware Requirements

- **Android Device**: Android 5.0+ with NFC capability (physical device required - emulator has limited NFC support)
- **Keycard**: Status Keycard with NFC (get from [keycard.tech](https://keycard.tech/))
- **PC/Mac**: For development and building

### Account/Credentials

- **Human Passport API Key**: `n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R` ✅ (Already configured)
- **Scorer ID**: `100` ✅ (Already configured)
- **Ethereum RPC URL**: Infura/Alchemy (optional for advanced features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/human-passport-mobile.git
cd human-passport-mobile
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
HUMAN_PASSPORT_API_URL=https://api.passport.xyz
HUMAN_PASSPORT_API_KEY=your_api_key_here
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
ETHEREUM_CHAIN_ID=1
```

4. **Install iOS dependencies** (macOS only)
```bash
cd ios
pod install
cd ..
```

### Running the App

**iOS**
```bash
npm run ios
# or with specific simulator
react-native run-ios --simulator="iPhone 14"
```

**Android**
```bash
npm run android
# Requires Android device or emulator to be running
```

**Start the Metro bundler**
```bash
npm start
```

## 📱 Project Structure

```
human-passport-mobile/
├── src/
│   ├── screens/              # UI Screens
│   │   ├── LoginScreen.tsx   # PIN entry & authentication
│   │   ├── DashboardScreen.tsx   # Passport score display
│   │   └── SignScreen.tsx    # Transaction signing
│   │
│   ├── components/           # Reusable UI Components
│   │   ├── NFCReader.tsx     # NFC tap handler
│   │   ├── PinInput.tsx      # PIN entry component
│   │   └── PassportDisplay.tsx   # Score visualization
│   │
│   ├── services/             # Business Logic
│   │   ├── KeycardService.ts    # Keycard operations
│   │   ├── NFCService.ts        # NFC communication
│   │   ├── HumanPassportService.ts  # Passport API
│   │   └── EthereumService.ts   # Transaction handling
│   │
│   ├── utils/                # Utilities
│   │   ├── helpers.ts        # Common functions
│   │   └── constants.ts      # App constants
│   │
│   ├── types/                # TypeScript definitions
│   │   └── index.ts
│   │
│   └── App.tsx               # App entry point
│
├── android/                  # Android native code
├── ios/                      # iOS native code
├── package.json
├── tsconfig.json
├── SECURITY.md              # Security documentation
└── README.md
```

## 🔐 Security

This application implements enterprise-grade security:

- **PIN Protection**: 4-6 digit PIN verified on Keycard hardware
- **Hardware Security**: Private keys in tamper-resistant secure element
- **NFC Encryption**: Encrypted communication between app and Keycard
- **No Key Storage**: Private keys never leave the hardware wallet
- **Session Management**: Automatic session timeout after inactivity

**See [SECURITY.md](./SECURITY.md) for detailed security documentation.**

## 🔄 Authentication Flow

```
1. User launches app
   ↓
2. App checks NFC availability
   ↓
3. User taps Keycard
   ↓
4. NFC detects Keycard via APDU SELECT
   ↓
5. App displays PIN entry screen
   ↓
6. User enters PIN (4-6 digits)
   ↓
7. App sends PIN to Keycard via APDU VERIFY
   ↓
8. Keycard validates PIN (hardware-level)
   ↓
9. PIN correct → Derive public key → Get Ethereum address
   ↓
10. Query Human Passport API with address
    ↓
11. Display Passport score and verification status
    ↓
12. ✅ Authentication successful
```

## ✍️ Transaction Signing Flow

```
1. User initiates transaction
   ↓
2. App creates transaction object
   ↓
3. Hash transaction (Keccak-256)
   ↓
4. User taps Keycard
   ↓
5. NFC detects Keycard
   ↓
6. App sends signing request via APDU SIGN
   ↓
7. Keycard signs with private key
   ↓
8. Keycard returns signature (v, r, s)
   ↓
9. App constructs signed transaction
   ↓
10. ✅ Transaction ready for broadcast
```

## 📚 API Integration

### Human Passport Endpoints

The app integrates with Human Passport API for identity verification:

```typescript
// Get Passport score
GET /v2/score/{address}
Response: { address, score, status, expiration_timestamp }

// Get Passport stamps
GET /v2/stamps/{address}
Response: { stamps: [...] }

// Verify signature
POST /v2/verify-signature
Body: { address, message, signature }
Response: { valid: boolean }
```

**Authentication**: Bearer token in Authorization header

### Ethereum Interaction

Transaction signing and verification using ethers.js:

```typescript
// Sign transaction with Keycard
const signature = await keycardService.signTransaction(tx);

// Sign arbitrary message
const signature = await keycardService.signMessage(message);

// Verify recovery
const recoveredAddress = ethers.recoverAddress(message, signature);
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Testing
For actual hardware testing, you'll need:
- Physical NFC device (Android phone or iPhone 6s+)
- Keycard initialized with PIN
- Human Passport account with some Stamps verified

### Testing Scenarios

1. **PIN Verification**
   - Correct PIN → Authentication success
   - Incorrect PIN (1-3 attempts) → Retry allowed
   - 4th attempt → Keycard locked

2. **Transaction Signing**
   - Simple ETH transfer → Signature generated
   - Complex contract call → Signature generated
   - Verification → Signature recovery successful

3. **Passport Integration**
   - API connectivity → Response received
   - Score retrieval → Score displayed
   - Stamp verification → Stamps shown

## 🔧 Troubleshooting

### NFC Not Working

**Problem**: App doesn't detect Keycard
- Ensure NFC is enabled in device settings
- Check app has NFC permissions (Settings → Apps → Human Passport)
- Move Keycard closer to device
- Restart app and try again

**Problem**: "NFC Manager not initialized"
- Ensure NFC is available on device
- Check iOS version >= 13
- Check Android version >= 5.0 with NFC capability

### PIN Not Being Accepted

**Problem**: Always shows "Invalid PIN"
- Verify PIN is 4-6 digits
- Check device is in NFC detection mode
- Try fresh Keycard tap
- Verify NFC connection stability

**Problem**: "Keycard locked" error
- Keycard is locked after 3 failed PIN attempts
- Wait 30 minutes for automatic unlock
- Or unlock using PUK code if available

### Passport API Errors

**Problem**: "Cannot fetch Passport score"
- Verify API key is set in `.env`
- Check internet connectivity
- Ensure Ethereum address is valid
- Verify API endpoint URL

**Problem**: "Unauthorized" error
- Check API key is correct
- Verify API key hasn't expired
- Request new API key from developer portal

## 📖 Documentation

- **[Security Documentation](./SECURITY.md)** - Detailed security model, APDU commands, key derivation
- **[Human Passport Docs](https://docs.passport.xyz/)** - Official Passport documentation
- **[Keycard Docs](https://docs.keycard.tech/)** - Keycard API reference
- **[React Native Docs](https://reactnative.dev/)** - React Native documentation

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Status Research & Development** - Keycard SDK and documentation
- **Human Passport** - Sybil protection and identity verification
- **Ethereum Foundation** - Ethereum protocol and standards
- **React Native Community** - Cross-platform mobile framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/human-passport-mobile/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/human-passport-mobile/discussions)
- **Security**: security@yourcompany.com

## 🔗 Links

- [Human Passport](https://passport.human.tech/)
- [Keycard](https://keycard.tech/)
- [Status](https://status.im/)
- [Ethereum](https://ethereum.org/)

---

**Built with ❤️ for decentralized identity**

Version 1.0.0 | October 2025

## 🛠 Build & Deployment

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm start

# 3. Run on Android
npx react-native run-android

# 4. Build release
cd android && ./gradlew assembleRelease && cd ..
```

### Android Build Details

**Min SDK**: Android 5.0 (API 21)
**Target SDK**: Android 12+ (API 31+)

```bash
# Development Build (Debug)
cd android
./gradlew installDebug
cd ..

# Release Build (Production)
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
cd ..

# Clean build
cd android && ./gradlew clean && cd ..
```

### Configuration Checklist

✅ **API Credentials** (Already configured)
- API Key: `n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R`
- Scorer ID: `100`
- Base URL: `https://api.passport.xyz/v2`

✅ **Android Setup** (Already configured)
- NFC Permissions: Manifest configured
- NFC Tech Filter: XML configured  
- Min SDK: API 21+
- Target SDK: API 31+

✅ **Native Modules** (Already configured)
- NFCModule.java: Low-level APDU communication
- MainActivity.java: NFC foreground dispatch
- HumanPassportPackage.java: React Native bridge

### Development Commands

```bash
# Watch for changes and rebuild
npm start

# Run on device/emulator
npx react-native run-android

# Debug logs
npx react-native log-android

# Clear cache and rebuild
npx react-native start --reset-cache

# Metro bundler only
npm run start

# Build without running
cd android && ./gradlew assembleDebug && cd ..
```

### Performance Optimization

- **Lazy loading**: Services initialized on-demand
- **Code splitting**: Screen components loaded async
- **Image optimization**: Cached and memoized
- **Memory**: Proper cleanup in useEffect
- **NFC timeout**: 5-second detection window

### Production Deployment

1. **Code Signing**
   ```bash
   keytool -genkey -v -keystore release.keystore \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias release
   ```

2. **Update gradle.properties**
   ```gradle
   MYAPP_RELEASE_STORE_FILE=release.keystore
   MYAPP_RELEASE_KEY_ALIAS=release
   MYAPP_RELEASE_STORE_PASSWORD=*****
   MYAPP_RELEASE_KEY_PASSWORD=*****
   ```

3. **Build Release APK**
   ```bash
   cd android && ./gradlew assembleRelease && cd ..
   ```

4. **Upload to Play Store**
   - Use Android Studio → Build → Generate Signed APK
   - Or upload via Play Console web interface

### Continuous Integration

Example GitHub Actions workflow:

```yaml
name: Build Android APK
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: cd android && ./gradlew assembleRelease && cd ..
```

---

**API Status**: ✅ Active and Configured
- Endpoint: https://api.passport.xyz/v2
- Authentication: X-API-KEY header
- Rate Limit: 125 requests/15 minutes

**Ready for**: Development | Testing | Production Deployment

````
