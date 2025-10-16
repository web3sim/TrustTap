/**
 * Login Screen Component
 * Handles user authentication via Keycard tap and PIN verification
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

interface LoginScreenProps {
  onLoginSuccess: (address: string) => void;
  onError?: (error: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onError }) => {
  const [state, setState] = useState({
    isScanning: false,
    showPinEntry: false,
    pin: '',
    attempts: 0,
    message: 'Tap Keycard to begin',
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleKeycardDetected = async () => {
    try {
      updateState({
        isScanning: true,
        message: '🔵 Keycard detected! Enter PIN...',
        showPinEntry: true,
      });
    } catch (error) {
      handleError('Failed to detect Keycard: ' + String(error));
    }
  };

  const handlePinSubmit = async (pin: string) => {
    try {
      if (!/^\d{4,6}$/.test(pin)) {
        handleError('PIN must be 4-6 digits');
        return;
      }

      updateState({
        isScanning: true,
        message: '🔐 Verifying PIN...',
      });

      // Simulate PIN verification
      // In production: Use KeycardService.verifyPin(pin)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful authentication
      const mockAddress = '0x1234567890123456789012345678901234567890';

      updateState({
        isScanning: false,
        message: '✅ Authentication successful!',
        pin: '',
      });

      onLoginSuccess(mockAddress);
    } catch (error) {
      const attempts = state.attempts + 1;
      if (attempts >= 3) {
        handleError('PIN attempts exceeded. Please try again later.');
        updateState({ pin: '', attempts: 0 });
      } else {
        handleError(`Invalid PIN. ${3 - attempts} attempts remaining.`);
        updateState({
          pin: '',
          attempts,
          message: `Invalid PIN. ${3 - attempts} attempts left`,
        });
      }
    }
  };

  const handleError = (error: string) => {
    updateState({
      isScanning: false,
      message: error,
    });
    if (onError) {
      onError(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Human Passport</Text>
          <Text style={styles.subtitle}>Hardware-Backed Identity</Text>
        </View>

        {/* Message Display */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{state.message}</Text>
        </View>

        {/* Keycard Detection Zone */}
        {!state.showPinEntry && (
          <View style={styles.nfcZone}>
            <View style={[styles.nfcIndicator, state.isScanning && styles.nfcActive]}>
              <Text style={styles.nfcText}>📱</Text>
            </View>
            <Text style={styles.nfcLabel}>
              {state.isScanning ? 'Scanning...' : 'Tap Keycard'}
            </Text>
          </View>
        )}

        {/* PIN Entry */}
        {state.showPinEntry && (
          <View style={styles.pinEntry}>
            <Text style={styles.pinLabel}>Enter PIN (4-6 digits):</Text>
            <View style={styles.pinInput}>
              <Text style={styles.pinDisplay}>
                {'●'.repeat(state.pin.length)}
                {state.pin.length > 0 && '○'.repeat(6 - state.pin.length)}
              </Text>
            </View>

            {/* PIN Keypad */}
            <View style={styles.keypad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keypadButton}
                  onPress={() => {
                    if (state.pin.length < 6) {
                      updateState({ pin: state.pin + num });
                    }
                  }}
                >
                  <Text style={styles.keypadText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Control Buttons */}
            <View style={styles.controlButtons}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => updateState({ pin: state.pin.slice(0, -1) })}
              >
                <Text style={styles.buttonText}>⌫ Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonPrimary, state.pin.length < 4 && styles.buttonDisabled]}
                disabled={state.pin.length < 4}
                onPress={() => handlePinSubmit(state.pin)}
              >
                {state.isScanning ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Verify PIN</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <Text style={styles.securityLabel}>🔒 Security</Text>
          <Text style={styles.securityText}>
            • PIN verified on Keycard hardware{'\n'}
            • Private keys never leave device{'\n'}
            • Encrypted NFC communication
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  messageBox: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  messageText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  nfcZone: {
    alignItems: 'center',
    marginVertical: 40,
  },
  nfcIndicator: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0066CC',
    marginBottom: 16,
  },
  nfcActive: {
    backgroundColor: '#D0E8FF',
  },
  nfcText: {
    fontSize: 48,
  },
  nfcLabel: {
    fontSize: 18,
    color: '#0066CC',
    fontWeight: '600',
  },
  pinEntry: {
    marginVertical: 20,
  },
  pinLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
    fontWeight: '600',
  },
  pinInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinDisplay: {
    fontSize: 28,
    letterSpacing: 8,
    color: '#0066CC',
    fontWeight: '600',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  keypadButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  securityInfo: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
  },
  securityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
    marginBottom: 6,
  },
  securityText: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
  },
});

export default LoginScreen;
