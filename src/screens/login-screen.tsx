import React, {useState, useEffect} from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {colors} from '../constants/colors';
import {styles} from '../styles/app-styles';
import {
  googleSignIn,
  appleSignIn,
  emailSignIn,
  initializeGoogleSignIn,
  isAppleAuthenticationAvailable,
} from '../services/auth-service';

type LoginScreenProps = {
  onBack: () => void;
  onLoginComplete: () => void;
};

const GOOGLE_WEB_CLIENT_ID =
  '55928517187-jdfdge4n6e6ljngn110tfg9p9m3vuv4v.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = '';
type LoginProvider = 'email' | 'google' | 'apple';

export function LoginScreen({onBack, onLoginComplete}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<LoginProvider | null>(
    null,
  );
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const isLoading = loadingProvider !== null;

  // Initialize on first Google login attempt
  const handleGoogleLogin = async () => {
    setAuthError('');
    setLoadingProvider('google');
    try {
      if (Platform.OS === 'ios' && !GOOGLE_IOS_CLIENT_ID) {
        Alert.alert(
          'Google Sign-In setup needed',
          'Create an iOS OAuth client ID in Google Cloud, then add it as GOOGLE_IOS_CLIENT_ID in login-screen.tsx.',
        );
        return;
      }

      // Initialize Google Sign-In on first use
      await initializeGoogleSignIn({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
      });

      const result = await googleSignIn();

      if (result.success) {
        // TODO: Send tokens to your backend and create a session
        // Example:
        // const response = await fetch('your-api.com/auth/google', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     idToken: result.tokens?.idToken,
        //     user: result.user,
        //   }),
        // });
        // if (response.ok) {
        //   onLoginComplete();
        // }

        Alert.alert('Success', `Welcome ${result.user.name || 'back'}`);
        onLoginComplete();
      } else {
        setAuthError(result.error || 'Google Sign-In failed.');
      }
    } catch (error: any) {
      setAuthError(error.message || 'An error occurred during Google Sign-In');
    } finally {
      setLoadingProvider(null);
    }
  };

  // Check Apple Authentication availability on mount
  useEffect(() => {
    isAppleAuthenticationAvailable().then(setIsAppleAvailable);
  }, []);

  const canSubmit = email.trim().includes('@') && password.trim().length >= 6;
  const shouldShowValidationHint =
    (hasTriedSubmit || email.length > 0 || password.length > 0) && !canSubmit;

  const handleEmailLogin = async () => {
    setHasTriedSubmit(true);
    setAuthError('');

    if (!canSubmit) {
      return;
    }

    setLoadingProvider('email');
    try {
      const result = await emailSignIn({email, password});

      if (result.success) {
        onLoginComplete();
        return;
      }

      setAuthError(result.error);
    } catch {
      setAuthError('An error occurred during login');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleAppleLogin = async () => {
    setAuthError('');
    setLoadingProvider('apple');
    try {
      const result = await appleSignIn();

      if (result.success) {
        // TODO: Send token to your backend and create a session
        // Example:
        // const response = await fetch('your-api.com/auth/apple', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     identityToken: result.tokens?.identityToken,
        //     user: result.user,
        //   }),
        // });
        // if (response.ok) {
        //   onLoginComplete();
        // }

        Alert.alert('Success', `Welcome ${result.user.fullName || 'back'}`);
        onLoginComplete();
      } else if (!(result as any).cancelled) {
        setAuthError(result.error || 'Apple Sign-In failed.');
      }
    } catch (error: any) {
      setAuthError(error.message || 'An error occurred during Apple Sign-In');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <View style={styles.loginStage}>
      <View style={styles.loginHeaderRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          disabled={isLoading}
          style={styles.authBackButton}>
          <Text selectable style={styles.authBackButtonText}>
            Back
          </Text>
        </Pressable>
        <View style={styles.loginBadge}>
          <Text selectable style={styles.loginBadgeText}>
            Secure
          </Text>
        </View>
      </View>

      <View style={styles.loginCard}>
        <Text selectable style={styles.loginTitle}>
          Welcome back
        </Text>
        <Text selectable style={styles.loginSubtitle}>
          Sign in to keep your calm profile, reminders, and support preferences
          together.
        </Text>

        <View style={styles.formGroup}>
          <Text selectable style={styles.inputLabel}>
            Email address
          </Text>
          <TextInput
            accessibilityLabel="Email address"
            autoCapitalize="none"
            autoCorrect={false}
            inputMode="email"
            keyboardType="email-address"
            onChangeText={value => {
              setEmail(value);
              setAuthError('');
            }}
            placeholder="name@example.com"
            placeholderTextColor={colors.placeholder}
            style={styles.textInput}
            value={email}
            editable={!isLoading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text selectable style={styles.inputLabel}>
            Password
          </Text>
          <TextInput
            accessibilityLabel="Password"
            autoCapitalize="none"
            onChangeText={value => {
              setPassword(value);
              setAuthError('');
            }}
            placeholder="At least 6 characters"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            style={styles.textInput}
            value={password}
            editable={!isLoading}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleEmailLogin}
          disabled={!canSubmit || isLoading}
          style={[
            styles.submitButton,
            styles.authSubmitButton,
            (!canSubmit || isLoading) && styles.submitButtonDisabled,
          ]}>
          {loadingProvider === 'email' ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text selectable style={styles.submitButtonText}>
              Log in
            </Text>
          )}
        </Pressable>

        {shouldShowValidationHint && (
          <Text selectable style={styles.formHint}>
            Enter a valid email and a password with 6 or more characters.
          </Text>
        )}

        {authError && (
          <Text selectable style={styles.formHint}>
            {authError}
          </Text>
        )}

        <View style={styles.authDividerRow}>
          <View style={styles.authDividerLine} />
          <Text selectable style={styles.authDividerText}>
            or continue with
          </Text>
          <View style={styles.authDividerLine} />
        </View>

        <View style={styles.socialButtonStack}>
          <Pressable
            accessibilityRole="button"
            onPress={handleGoogleLogin}
            disabled={isLoading}
            style={[styles.socialButton, isLoading && styles.submitButtonDisabled]}>
            {loadingProvider === 'google' ? (
              <ActivityIndicator color={colors.ink} />
            ) : (
              <>
                <View style={styles.socialButtonMark}>
                  <Text selectable style={styles.socialButtonMarkText}>
                    G
                  </Text>
                </View>
                <Text selectable style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </>
            )}
          </Pressable>

          {isAppleAvailable && (
            <Pressable
              accessibilityRole="button"
              onPress={handleAppleLogin}
              disabled={isLoading}
              style={[styles.socialButton, isLoading && styles.submitButtonDisabled]}>
              {loadingProvider === 'apple' ? (
                <ActivityIndicator color={colors.ink} />
              ) : (
                <>
                  <View style={styles.socialButtonMark}>
                    <Text selectable style={styles.socialButtonMarkText}>
                      A
                    </Text>
                  </View>
                  <Text selectable style={styles.socialButtonText}>
                    Continue with Apple
                  </Text>
                </>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
