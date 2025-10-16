import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionSignScreen from './src/screens/TransactionSignScreen';

// Services
import HumanPassportService from './src/services/HumanPassportService';
import NFCService from './src/services/NFCService';

// Constants
import { COLORS, STORAGE_KEYS } from './src/constants';

const Stack = createNativeStackNavigator();

type RootStackParamList = {
  Login: undefined;
  Dashboard: { userAddress?: string };
  TransactionSign: { recipientAddress?: string; amount?: string };
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      // Initialize services
      NFCService.initialize();
      HumanPassportService.initialize('100', 'n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R');

      // Check for existing session
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const address = await AsyncStorage.getItem(STORAGE_KEYS.USER_ADDRESS);

      if (token && address) {
        setUserToken(token);
        setUserAddress(address);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Bootstrap error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (address: string, pin: string) => {
    try {
      // Verify PIN with Keycard (mock for now)
      const verified = pin.length === 6; // Basic validation

      if (verified) {
        // Generate token and store session
        const token = `token_${Date.now()}`;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ADDRESS, address);

        setUserToken(token);
        setUserAddress(address);
        setIsAuthenticated(true);

        // Fetch user's Passport data
        try {
          const passport = await HumanPassportService.getUserPassport(address);
          await AsyncStorage.setItem(
            STORAGE_KEYS.USER_PASSPORT,
            JSON.stringify(passport)
          );
        } catch (passportError) {
          console.warn('Could not fetch Passport data:', passportError);
        }
      } else {
        Alert.alert('Login Failed', 'Invalid PIN or Keycard not detected');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_ADDRESS);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PASSPORT);

      setUserToken(null);
      setUserAddress(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.PRIMARY}
        />
        <ActivityIndicator
          size="large"
          color={COLORS.PRIMARY}
          style={styles.loader}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.PRIMARY}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.PRIMARY,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            options={{
              title: 'Human Passport',
              headerShown: false,
            }}
          >
            {(props: any) => (
              <LoginScreen
                {...props}
                onLogin={handleLogin}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="Dashboard"
              options={{
                title: 'Dashboard',
                headerLeft: () => null,
                animationEnabled: false,
              }}
            >
              {(props: any) => (
                <DashboardScreen
                  {...props}
                  userAddress={userAddress || ''}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="TransactionSign"
              options={{
                title: 'Sign Transaction',
                headerBackTitle: 'Back',
              }}
            >
              {(props: any) => (
                <TransactionSignScreen
                  {...props}
                  userAddress={userAddress || ''}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 20,
  },
});
