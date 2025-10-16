/**
 * Application Constants
 * Configuration values and constants used throughout the app
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.passport.xyz',
  API_KEY: 'n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R',
  SCORER_ID: '100',
  TIMEOUT: 30000,
  RATE_LIMIT: {
    TIER_1: 125, // requests per 15 minutes
    WINDOW: 15 * 60 * 1000, // 15 minutes in ms
  },
};

// Keycard Configuration
export const KEYCARD_CONFIG = {
  AID: 'A0000008040001', // Keycard Application Identifier
  PIN_MIN_LENGTH: 4,
  PIN_MAX_LENGTH: 6,
  PIN_MAX_ATTEMPTS: 3,
  LOCK_TIME: 30 * 60 * 1000, // 30 minutes in ms
  COMMAND_TIMEOUT: 30000,
  
  // APDU Commands
  APDU_COMMANDS: {
    SELECT: { CLA: 0x00, INS: 0xa4 },
    VERIFY_PIN: { CLA: 0x80, INS: 0x20 },
    GET_PUBLIC_KEY: { CLA: 0x80, INS: 0xf7 },
    SIGN: { CLA: 0x80, INS: 0xc0 },
    GET_STATUS: { CLA: 0x80, INS: 0xf2 },
  },
  
  // Response codes
  RESPONSE_CODES: {
    SUCCESS: 0x9000,
    PIN_BLOCKED: 0x63c0,
    PIN_1_ATTEMPT: 0x63c1,
    PIN_2_ATTEMPTS: 0x63c2,
    PIN_3_ATTEMPTS: 0x63c3,
  },
};

// Ethereum Configuration
export const ETHEREUM_CONFIG = {
  MAINNET: {
    CHAIN_ID: 1,
    RPC_URL: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    NAME: 'Ethereum Mainnet',
  },
  SEPOLIA: {
    CHAIN_ID: 11155111,
    RPC_URL: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    NAME: 'Sepolia Testnet',
  },
  
  // Standard gas limits
  GAS_LIMITS: {
    ETH_TRANSFER: '21000',
    TOKEN_TRANSFER: '65000',
    CONTRACT_INTERACTION: '200000',
  },
  
  // BIP44 Paths
  BIP44_PATHS: {
    ETHEREUM_0: "m/44'/60'/0'/0/0",
    ETHEREUM_1: "m/44'/60'/0'/0/1",
    ETHEREUM_ALT: "m/44'/60'/1'/0/0",
  },
};

// Human Passport Configuration
export const PASSPORT_CONFIG = {
  SCORE_THRESHOLD: 20, // Minimum score for Sybil resistance
  SCORE_HIGH_TRUST: 50,
  
  // Stamp categories
  STAMP_CATEGORIES: [
    'GitHub',
    'Twitter',
    'Discord',
    'Lens',
    'ENS',
    'Google',
    'Facebook',
    'Civic',
    'Gitcoin',
    'BrightID',
  ],
  
  // Score weights
  STAMP_WEIGHTS: {
    GitHub: 1.0,
    Twitter: 1.0,
    Discord: 0.5,
    Lens: 1.0,
    ENS: 2.0,
    Google: 1.5,
    Facebook: 1.0,
    Civic: 3.0,
    Gitcoin: 1.0,
    BrightID: 2.0,
  },
};

// NFC Configuration
export const NFC_CONFIG = {
  TECH_FILTERS: [
    'android.nfc.tech.IsoDep',
    'android.nfc.tech.NfcA',
    'android.nfc.tech.MifareClassic',
    'android.nfc.tech.MifareUltralight',
  ],
  
  TIMEOUT: 5000, // 5 seconds
  DETECTION_RANGE: '4-10cm',
};

// Colors (main export)
export const COLORS = {
  PRIMARY: '#0066CC',
  PRIMARY_DARK: '#0052A3',
  SUCCESS: '#4CAF50',
  ERROR: '#CC0000',
  WARNING: '#FFA500',
  INFO: '#0066CC',
  BACKGROUND: '#FFFFFF',
  SURFACE: '#F5F5F5',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  BORDER: '#E0E0E0',
  DIVIDER: '#E8E8E8',
};

// UI Configuration
export const UI_CONFIG = {
  COLORS,
  
  SPACING: {
    XS: 4,
    S: 8,
    M: 16,
    L: 24,
    XL: 32,
  },
  
  BORDER_RADIUS: {
    S: 4,
    M: 8,
    L: 12,
    XL: 16,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_ADDRESS: 'Invalid Ethereum address format',
  INVALID_SIGNATURE: 'Invalid signature format',
  INVALID_PIN: 'Invalid PIN format',
  KEYCARD_NOT_CONNECTED: 'Keycard not connected',
  NFC_NOT_AVAILABLE: 'NFC not available on this device',
  PIN_ATTEMPTS_EXCEEDED: 'PIN attempts exceeded, Keycard locked',
  API_ERROR: 'API request failed',
  NETWORK_ERROR: 'Network connection error',
  TIMEOUT_ERROR: 'Request timeout',
  INSUFFICIENT_BALANCE: 'Insufficient balance for transaction',
  INVALID_GAS_PRICE: 'Invalid gas price',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  TRANSACTION_SIGNED: 'Transaction signed successfully',
  PASSPORT_VERIFIED: 'Passport verified',
  PIN_VERIFIED: 'PIN verified',
  KEYCARD_DETECTED: 'Keycard detected',
};

// Storage Keys (for AsyncStorage)
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_ADDRESS: 'user_address',
  USER_PASSPORT: 'user_passport',
  PASSPORT_SCORE: 'passport_score',
  LAST_LOGIN: 'last_login',
  USER_PREFERENCES: 'user_preferences',
  CACHED_STAMPS: 'cached_stamps',
};

// Events (for Event Emitter)
export const EVENTS = {
  NFC_TAG_DETECTED: 'NFCTagDetected',
  NFC_ERROR: 'NFCError',
  PIN_VERIFIED: 'PINVerified',
  TRANSACTION_SIGNED: 'TransactionSigned',
  PASSPORT_LOADED: 'PassportLoaded',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  TRANSFER: 'transfer',
  CONTRACT_INTERACTION: 'contract_interaction',
  TOKEN_TRANSFER: 'token_transfer',
  NFT_TRANSFER: 'nft_transfer',
};
