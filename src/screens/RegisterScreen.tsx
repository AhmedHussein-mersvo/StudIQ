import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import CountryPicker from '../components/auth/CountryPicker';
import GradientAuthButton from '../components/auth/GradientAuthButton';
import type { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../stores/authStore';
import { resetGuestUpload } from '../stores/guestStore';
import { getPalette } from '../theme/palette';
import { useThemeStore } from '../theme/themeStore';
import { isLargeScreen, isSmallScreen } from '../utils/config';
import {
  validateConfirmPassword,
  validateCountry,
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/authValidation';
import { boldFont, mediumFont, regularFont, semiBoldFont } from '../utils/font';
import { getScreenContentPaddingHorizontal } from '../utils/screenPadding';

type Props = StackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation, route }: Props) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);
  const registerWithEmail = useAuthStore(s => s.registerWithEmail);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [countryError, setCountryError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const selected = route.params?.country;
      if (selected) {
        setCountry(selected);
        setCountryError(null);
      }
    }, [route.params?.country]),
  );

  const handleRegister = () => {
    const fnErr = validateName(firstName, 'First name');
    const lnErr = validateName(lastName, 'Last name');
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cpErr = validateConfirmPassword(password, confirmPassword);
    const cErr = validateCountry(country);

    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmPasswordError(cpErr);
    setCountryError(cErr);
    setFormError(null);

    if (fnErr || lnErr || eErr || pErr || cpErr || cErr) {
      return;
    }

    setLoading(true);
    const result = registerWithEmail({
      firstName,
      lastName,
      email,
      password,
      country,
    });
    setLoading(false);

    if (!result.ok) {
      setFormError(result.error);
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
          <Text style={[styles.eyebrow, { color: p.eyebrow }]}>Join StudIQ</Text>
          <Text style={[styles.title, { color: p.textPrimary }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: p.textMuted }]}>
            Set up your profile to start studying smarter
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
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <AuthTextField
                label="First name"
                value={firstName}
                onChangeText={t => {
                  setFirstName(t);
                  setFirstNameError(null);
                  setFormError(null);
                }}
                error={firstNameError}
                autoCapitalize="words"
                placeholder="First"
              />
            </View>
            <View style={styles.nameField}>
              <AuthTextField
                label="Last name"
                value={lastName}
                onChangeText={t => {
                  setLastName(t);
                  setLastNameError(null);
                  setFormError(null);
                }}
                error={lastNameError}
                autoCapitalize="words"
                placeholder="Last"
              />
            </View>
          </View>

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
              setConfirmPasswordError(null);
              setFormError(null);
            }}
            error={passwordError}
            secureToggle
            secureTextEntry
            placeholder="At least 8 characters"
          />

          <AuthTextField
            label="Confirm password"
            value={confirmPassword}
            onChangeText={t => {
              setConfirmPassword(t);
              setConfirmPasswordError(null);
              setFormError(null);
            }}
            error={confirmPasswordError}
            secureToggle
            secureTextEntry
            placeholder="Repeat password"
          />

          <CountryPicker
            label="Country"
            value={country}
            error={countryError}
          />

          {formError ? (
            <Text style={[styles.formError, { color: p.error }]}>{formError}</Text>
          ) : null}

          <GradientAuthButton
            title="Create account"
            loading={loading}
            onPress={handleRegister}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: p.textMuted }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.footerLink, { color: p.tabActive }]}>Log in</Text>
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
    fontSize: isLargeScreen ? 30 : 26,
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  formError: {
    fontFamily: regularFont,
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 12,
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
