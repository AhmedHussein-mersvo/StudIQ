import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import AuthTextField from '../components/auth/AuthTextField';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import GradientAuthButton from '../components/auth/GradientAuthButton';
import type { RootStackParamList } from '../navigation/types';
import { signInWithGoogle } from '../services/googleAuth';
import { useAuthStore } from '../stores/authStore';
import { resetGuestUpload } from '../stores/guestStore';
import { getPalette } from '../theme/palette';
import { useThemeStore } from '../theme/themeStore';
import { isLargeScreen, isSmallScreen } from '../utils/config';
import {
  validateEmail,
  validatePassword,
} from '../utils/authValidation';
import { boldFont, mediumFont, regularFont, semiBoldFont } from '../utils/font';
import { getScreenContentPaddingHorizontal } from '../utils/screenPadding';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);
  const loginWithEmail = useAuthStore(s => s.loginWithEmail);
  const loginWithGoogle = useAuthStore(s => s.loginWithGoogle);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    setFormError(null);

    if (eErr || pErr) {
      return;
    }

    setLoading(true);
    const result = loginWithEmail(email, password);
    setLoading(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    resetGuestUpload();
    navigation.replace('MainTabs');
  };

  const handleGoogle = async () => {
    setFormError(null);
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    setGoogleLoading(false);

    if (!result.ok) {
      if (!result.cancelled) {
        setFormError(result.error);
      }
      return;
    }

    const authResult = loginWithGoogle(result.profile);
    if (!authResult.ok) {
      setFormError(authResult.error);
      return;
    }

    resetGuestUpload();
    navigation.replace('MainTabs');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.eyebrow, { color: p.eyebrow }]}>Welcome back</Text>
          <Text style={[styles.title, { color: p.textPrimary }]}>Log in</Text>
          <Text style={[styles.subtitle, { color: p.textMuted }]}>
            Continue your AI-powered study journey
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: p.cardBg,
              borderColor: p.cardBorder,
            },
          ]}
        >
          <AuthTextField
            label="Email"
            value={email}
            onChangeText={t => {
              setEmail(t);
              setEmailError(null);
              setFormError(null);
            }}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="you@example.com"
          />

          <AuthTextField
            label="Password"
            value={password}
            onChangeText={t => {
              setPassword(t);
              setPasswordError(null);
              setFormError(null);
            }}
            error={passwordError}
            secureToggle
            secureTextEntry
            placeholder="Your password"
          />

          {formError ? (
            <Text style={[styles.formError, { color: p.error }]}>{formError}</Text>
          ) : null}

          <GradientAuthButton
            title="Log in"
            loading={loading}
            onPress={handleLogin}
          />

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: p.divider }]} />
            <Text style={[styles.dividerText, { color: p.textMuted }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: p.divider }]} />
          </View>

          <GoogleSignInButton loading={googleLoading} onPress={handleGoogle} />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: p.textMuted }]}>
            Don&apos;t have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.footerLink, { color: p.tabActive }]}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: getScreenContentPaddingHorizontal(),
    paddingTop: isLargeScreen ? 36 : isSmallScreen ? 20 : 28,
    paddingBottom: isLargeScreen ? 40 : 28,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: isLargeScreen ? 28 : 22,
  },
  logo: {
    width: isLargeScreen ? 88 : 72,
    height: isLargeScreen ? 88 : 72,
    marginBottom: 12,
  },
  eyebrow: {
    fontFamily: mediumFont,
    fontSize: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: boldFont,
    fontSize: isLargeScreen ? 32 : 28,
    marginTop: 6,
  },
  subtitle: {
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 14,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
    padding: isLargeScreen ? 24 : 18,
    gap: 16,
  },
  formError: {
    fontFamily: regularFont,
    fontSize: 14,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontFamily: mediumFont,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: regularFont,
    fontSize: 15,
  },
  footerLink: {
    fontFamily: semiBoldFont,
    fontSize: 15,
  },
});
