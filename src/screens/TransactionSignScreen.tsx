/**
 * Transaction Sign Screen
 * Handles transaction creation, review, and signing via Keycard
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

interface TransactionSignScreenProps {
  address: string;
  onSignSuccess?: (txHash: string) => void;
  onCancel: () => void;
}

const TransactionSignScreen: React.FC<TransactionSignScreenProps> = ({
  address,
  onSignSuccess,
  onCancel,
}) => {
  const [state, setState] = useState({
    recipientAddress: '',
    amount: '',
    gasPrice: '20',
    isSigning: false,
    txHash: '',
    showConfirm: false,
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleReviewTransaction = () => {
    if (!state.recipientAddress.trim()) {
      Alert.alert('Error', 'Please enter recipient address');
      return;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(state.recipientAddress)) {
      Alert.alert('Error', 'Invalid Ethereum address format');
      return;
    }
    if (!state.amount.trim()) {
      Alert.alert('Error', 'Please enter amount');
      return;
    }

    updateState({ showConfirm: true });
  };

  const handleSignTransaction = async () => {
    try {
      updateState({ isSigning: true });

      // Simulate transaction signing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock transaction hash
      const mockTxHash = '0x' + 'a'.repeat(64);

      updateState({
        isSigning: false,
        txHash: mockTxHash,
      });

      Alert.alert('Success', 'Transaction signed successfully!');

      if (onSignSuccess) {
        onSignSuccess(mockTxHash);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign transaction: ' + String(error));
      updateState({ isSigning: false });
    }
  };

  if (state.showConfirm) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Confirm Transaction</Text>

          <View style={styles.reviewCard}>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>From</Text>
              <Text style={styles.reviewValue}>
                {address.slice(0, 6)}...{address.slice(-4)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>To</Text>
              <Text style={styles.reviewValue}>
                {state.recipientAddress.slice(0, 6)}...{state.recipientAddress.slice(-4)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Amount</Text>
              <Text style={styles.reviewAmount}>{state.amount} ETH</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Gas Price</Text>
              <Text style={styles.reviewValue}>{state.gasPrice} Gwei</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Estimated Gas</Text>
              <Text style={styles.reviewValue}>21,000</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Total Cost</Text>
              <Text style={styles.reviewTotal}>
                {(parseFloat(state.amount) + 0.00042).toFixed(6)} ETH
              </Text>
            </View>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Please Review Carefully</Text>
            <Text style={styles.warningText}>
              • Verify the recipient address is correct{'\n'}
              • This action cannot be undone{'\n'}
              • You will need to tap your Keycard to sign
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.signButton]}
            onPress={handleSignTransaction}
            disabled={state.isSigning}
          >
            {state.isSigning ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>✍️ Sign with Keycard</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => updateState({ showConfirm: false })}
            disabled={state.isSigning}
          >
            <Text style={styles.buttonCancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>New Transaction</Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>From Address</Text>
          <View style={styles.addressDisplay}>
            <Text style={styles.addressText}>{address}</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Recipient Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="0x..."
            placeholderTextColor="#CCCCCC"
            value={state.recipientAddress}
            onChangeText={(text) => updateState({ recipientAddress: text })}
            editable={!state.isSigning}
          />
          <Text style={styles.hint}>Must be valid Ethereum address</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Amount (ETH) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.0"
            placeholderTextColor="#CCCCCC"
            value={state.amount}
            onChangeText={(text) => updateState({ amount: text })}
            keyboardType="decimal-pad"
            editable={!state.isSigning}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Gas Price (Gwei)</Text>
          <TextInput
            style={styles.input}
            placeholder="20"
            placeholderTextColor="#CCCCCC"
            value={state.gasPrice}
            onChangeText={(text) => updateState({ gasPrice: text })}
            keyboardType="decimal-pad"
            editable={!state.isSigning}
          />
        </View>

        <View style={styles.estimateBox}>
          <Text style={styles.estimateLabel}>Estimated Total Cost</Text>
          <Text style={styles.estimateValue}>
            {(parseFloat(state.amount || '0') + 0.00042).toFixed(6)} ETH
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.reviewButton]}
          onPress={handleReviewTransaction}
          disabled={state.isSigning}
        >
          <Text style={styles.buttonText}>Review Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={state.isSigning}
        >
          <Text style={styles.buttonCancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#FAFAFA',
  },
  hint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 6,
  },
  addressDisplay: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addressText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
  },
  estimateBox: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  estimateLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  estimateValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  reviewCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#666666',
  },
  reviewValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  reviewAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066CC',
  },
  reviewTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  warningBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF8C00',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#8B7355',
    lineHeight: 18,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewButton: {
    backgroundColor: '#0066CC',
  },
  signButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
});

export default TransactionSignScreen;
