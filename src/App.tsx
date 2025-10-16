/**
 * App.tsx
 * Main application entry point
 * Sets up navigation, providers, and app structure
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import NFCService from './src/services/NFCService';

// Mock navigation setup (replace with actual React Navigation in production)
interface AppState {
  isInitialized: boolean;
  nfcAvailable: boolean;
  currentScreen: 'splash' | 'login' | 'dashboard';
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    isInitialized: false,
    nfcAvailable: false,
    currentScreen: 'splash',
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing Human Passport Mobile App...');

      // Request NFC permissions on Android
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.NFC,
            {
              title: 'Human Passport NFC Permission',
              message: 'Human Passport needs access to NFC to communicate with your Keycard',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('⚠️ NFC permission denied');
          }
        } catch (err) {
          console.error('❌ Error requesting NFC permission:', err);
        }
      }

      // Initialize NFC
      await NFCService.initialize();

      // Check NFC availability
      const nfcAvailable = await NFCService.isNFCAvailable();

      setAppState({
        isInitialized: true,
        nfcAvailable,
        currentScreen: 'login',
      });

      console.log('✅ App initialization complete');
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      setAppState((prev) => ({
        ...prev,
        isInitialized: true,
        currentScreen: 'login',
      }));
    }
  };

  if (!appState.isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Navigation and screens will be implemented here */}
        {/* For now, showing app state for demonstration */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});

export default App;
