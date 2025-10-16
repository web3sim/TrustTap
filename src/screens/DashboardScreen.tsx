/**
 * Dashboard Screen Component
 * Displays Passport score, stamps, and transaction options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

interface Stamp {
  name: string;
  verified: boolean;
  icon: string;
}

interface DashboardScreenProps {
  address: string;
  onLogout: () => void;
  onSignTransaction?: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  address,
  onLogout,
  onSignTransaction,
}) => {
  const [state, setState] = useState({
    loading: true,
    score: 25.5,
    status: 'verified',
    stamps: [
      { name: 'GitHub', verified: true, icon: '🐙' },
      { name: 'Twitter', verified: true, icon: '𝕏' },
      { name: 'Discord', verified: false, icon: '🎮' },
      { name: 'Lens Protocol', verified: true, icon: '📷' },
    ] as Stamp[],
  });

  useEffect(() => {
    loadPassportData();
  }, []);

  const loadPassportData = async () => {
    try {
      // Simulate API call to fetch Passport data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load Passport data:', error);
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Loading Passport data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Passport Dashboard</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Address Card */}
        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>Ethereum Address</Text>
          <Text style={styles.addressValue}>{address.slice(0, 6)}...{address.slice(-4)}</Text>
          <Text style={styles.addressFull}>{address}</Text>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreContent}>
            <Text style={styles.scoreLabel}>Humanity Score</Text>
            <View style={styles.scoreDisplay}>
              <Text style={styles.scoreValue}>{state.score}</Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
          </View>

          <View style={styles.scoreStatus}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Verified Human</Text>
          </View>
        </View>

        {/* Score Explanation */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📊 What is this score?</Text>
          <Text style={styles.infoText}>
            Your Passport score represents your humanity level based on verified credentials.
            Higher scores indicate more verified activities and trustworthiness.
          </Text>
        </View>

        {/* Stamps Section */}
        <View style={styles.stampsSection}>
          <Text style={styles.stampsTitle}>Verified Credentials</Text>

          <View style={styles.stampsList}>
            {state.stamps.map((stamp, index) => (
              <View key={index} style={styles.stampItem}>
                <View style={styles.stampIcon}>
                  <Text style={styles.stampIconText}>{stamp.icon}</Text>
                </View>

                <View style={styles.stampInfo}>
                  <Text style={styles.stampName}>{stamp.name}</Text>
                  <Text style={styles.stampStatus}>
                    {stamp.verified ? '✓ Connected' : '○ Not connected'}
                  </Text>
                </View>

                {stamp.verified && (
                  <View style={styles.stampVerified}>
                    <Text style={styles.stampVerifiedText}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Additional Stamps */}
        <TouchableOpacity style={styles.addStampButton}>
          <Text style={styles.addStampText}>+ Add More Credentials</Text>
        </TouchableOpacity>

        {/* Security Info */}
        <View style={styles.securityBox}>
          <Text style={styles.securityTitle}>🔐 Your Security</Text>
          <View style={styles.securityItem}>
            <Text style={styles.securityItemText}>
              • Authenticated via Keycard hardware wallet
            </Text>
          </View>
          <View style={styles.securityItem}>
            <Text style={styles.securityItemText}>
              • PIN-protected with NFC tap verification
            </Text>
          </View>
          <View style={styles.securityItem}>
            <Text style={styles.securityItemText}>
              • Private keys secured in tamper-resistant hardware
            </Text>
          </View>
        </View>

        {/* Transaction Signing */}
        {onSignTransaction && (
          <TouchableOpacity
            style={styles.signButton}
            onPress={onSignTransaction}
          >
            <Text style={styles.signButtonText}>✍️ Sign Transaction</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FFE8E8',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CC0000',
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
  },
  addressCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0066CC',
    marginBottom: 8,
  },
  addressFull: {
    fontSize: 11,
    color: '#666666',
    fontFamily: 'monospace',
  },
  scoreCard: {
    backgroundColor: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreContent: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreMax: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.7,
    marginLeft: 4,
  },
  scoreStatus: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
  },
  stampsSection: {
    marginBottom: 24,
  },
  stampsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  stampsList: {
    gap: 10,
  },
  stampItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  stampIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E8F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stampIconText: {
    fontSize: 20,
  },
  stampInfo: {
    flex: 1,
  },
  stampName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  stampStatus: {
    fontSize: 12,
    color: '#888888',
  },
  stampVerified: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stampVerifiedText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addStampButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0066CC',
    alignItems: 'center',
    marginBottom: 24,
  },
  addStampText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
  },
  securityBox: {
    backgroundColor: '#F0FFF0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  securityItem: {
    marginBottom: 6,
  },
  securityItemText: {
    fontSize: 12,
    color: '#1B5E20',
    lineHeight: 16,
  },
  signButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#0066CC',
    alignItems: 'center',
    marginBottom: 20,
  },
  signButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DashboardScreen;
