import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';

export const LoginScreen: React.FC = () => {
  const { signIn, playAsGuest, loading, error } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(error);

  const handleSignIn = async () => {
    try {
      setErrorMessage(null);
      await signIn();
    } catch (err) {
      logger.error('Sign in failed:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign in. Please try again.';
      setErrorMessage(message);
      Alert.alert('Sign In Failed', message);
    }
  };

  const handlePlayAsGuest = async () => {
    try {
      setErrorMessage(null);
      await playAsGuest();
    } catch (err) {
      logger.error('Guest mode failed:', err);
      const message = err instanceof Error ? err.message : 'Failed to enable guest mode';
      setErrorMessage(message);
      Alert.alert('Error', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Title Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🐾</Text>
          <Text style={styles.title}>Lilly's Box</Text>
          <Text style={styles.subtitle}>Care for your virtual pet</Text>
        </View>

        {/* Error Message */}
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.googleButtonEmoji}>🔐</Text>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.dividerText}>or</Text>

          <TouchableOpacity
            style={[styles.guestButton, loading && styles.buttonDisabled]}
            onPress={handlePlayAsGuest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#9b59b6" />
            ) : (
              <>
                <Text style={styles.guestButtonEmoji}>👤</Text>
                <Text style={styles.guestButtonText}>Play as Guest</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Login to save your progress and sync across devices
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
    width: '100%',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#4285f4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  googleButtonEmoji: {
    fontSize: 20,
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerText: {
    color: '#999999',
    fontSize: 14,
    marginVertical: 8,
  },
  guestButton: {
    width: '100%',
    backgroundColor: '#f5f0ff',
    borderColor: '#9b59b6',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  guestButtonEmoji: {
    fontSize: 20,
  },
  guestButtonText: {
    color: '#9b59b6',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
