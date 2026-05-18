import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GradientAuthButton from '../components/auth/GradientAuthButton';
import HeaderBar from '../layout/HeaderBar';
import { navigateToMainTab } from '../navigation/navigationRef';
import type { RootStackParamList } from '../navigation/types';
import { signOutGoogle } from '../services/googleAuth';
import { useAuthStore } from '../stores/authStore';
import { getPalette } from '../theme/palette';
import { useThemeStore } from '../theme/themeStore';
import { isLargeScreen, isXLargeScreen } from '../utils/config';
import { getScreenContentPaddingHorizontal } from '../utils/screenPadding';
import { getUserAvatarSource } from '../utils/userAvatar';
import {
  boldFont,
  mediumFont,
  regularFont,
  semiBoldFont,
} from '../utils/font';

const APP_VERSION = '0.0.1';

export default function ProfileScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);
  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Guest';
  const subtitle = user?.email ?? 'Sign in to save your progress';
  const avatarSource = getUserAvatarSource(user);

  const handleSignOut = async () => {
    await signOutGoogle();
    logout();
  };

  return (
    <View style={styles.container} className="flex-1">
      <HeaderBar />
      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content} className="gap-5">
          <View
            style={[
              styles.heroCard,
              {
                borderColor: p.cardBorder,
                backgroundColor: p.cardBg,
                borderWidth: StyleSheet.hairlineWidth,
              },
            ]}
            className="overflow-hidden rounded-3xl p-5"
          >
            {isAuthenticated ? (
              <View className="items-center">
                <View
                  style={[
                    styles.avatarRing,
                    {
                      borderColor: p.cardBorder,
                      backgroundColor: p.rowBg,
                    },
                  ]}
                  className="items-center justify-center rounded-full border p-2"
                >
                  <Image
                    source={avatarSource}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                </View>
                <Text style={[styles.displayName, { color: p.textPrimary }]} className="mt-4">
                  {displayName}
                </Text>
                <Text style={[styles.subtitle, { color: p.textMuted }]} className="mt-1">
                  {subtitle}
                </Text>
              </View>
            ) : (
              <View style={styles.guestHero}>
                <Text style={[styles.displayName, { color: p.textPrimary }]}>
                  Continue with StudIQ
                </Text>
                <Text style={[styles.guestSubtitle, { color: p.textMuted }]}>
                  Log in or create an account to upload more files and keep your
                  study materials.
                </Text>
                <View style={styles.guestActions}>
                  <GradientAuthButton
                    title="Log in"
                    onPress={() => navigation.navigate('Login')}
                  />
                  <TouchableOpacity
                    style={[
                      styles.secondaryButton,
                      {
                        backgroundColor: p.googleButtonBg,
                        borderColor: p.googleButtonBorder,
                      },
                    ]}
                    onPress={() => navigation.navigate('Register')}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.secondaryText, { color: p.textPrimary }]}>
                      Create account
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View
            style={[
              styles.section,
              {
                borderColor: p.cardBorder,
                backgroundColor: p.cardBg,
                borderWidth: StyleSheet.hairlineWidth,
              },
            ]}
            className="rounded-3xl p-2"
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.row}
              className="flex-row items-center justify-between rounded-2xl px-4 py-4"
              onPress={() => navigateToMainTab('Files')}
            >
              <View className="flex-row items-center gap-3">
                <View className="rounded-xl bg-violet-500/20 p-2">
                  <MaterialIcons
                    name="folder"
                    size={isLargeScreen ? 24 : 22}
                    color={p.tabActive}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, { color: p.textPrimary }]}>
                    Study materials
                  </Text>
                  <Text style={[styles.rowHint, { color: p.textMuted }]}>
                    Open your recent files
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={22}
                color={p.chevron}
              />
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: p.cardBorder }]}
              className="mx-4 h-px"
            />

            <View style={styles.row} className="flex-row items-center px-4 py-4">
              <View className="flex-row items-center gap-3">
                <View className="rounded-xl bg-blue-500/20 p-2">
                  <MaterialIcons
                    name="info-outline"
                    size={isLargeScreen ? 24 : 22}
                    color="#60A5FA"
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, { color: p.textPrimary }]}>
                    App version
                  </Text>
                  <Text style={[styles.rowHint, { color: p.textMuted }]}>
                    StudIQ {APP_VERSION}
                  </Text>
                </View>
              </View>
            </View>

            {isAuthenticated ? (
              <>
                <View
                  style={[styles.divider, { backgroundColor: p.cardBorder }]}
                  className="mx-4 h-px"
                />

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.row}
                  className="flex-row items-center justify-between rounded-2xl px-4 py-4"
                  onPress={handleSignOut}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="rounded-xl bg-red-500/20 p-2">
                      <MaterialIcons
                        name="logout"
                        size={isLargeScreen ? 24 : 22}
                        color="#F87171"
                      />
                    </View>
                    <View>
                      <Text style={[styles.rowTitle, { color: p.textPrimary }]}>
                        Sign out
                      </Text>
                      <Text style={[styles.rowHint, { color: p.textMuted }]}>
                        Log out of your account
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={22}
                    color={p.chevron}
                  />
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: isLargeScreen ? 20 : 14,
    paddingBottom: isLargeScreen ? 36 : 28,
  },
  content: {
    width: '100%',
    maxWidth: isXLargeScreen ? 720 : undefined,
    alignSelf: 'center',
    paddingHorizontal: getScreenContentPaddingHorizontal(),
  },
  heroCard: {
    paddingVertical: isLargeScreen ? 28 : 22,
  },
  guestHero: {
    gap: 12,
  },
  guestActions: {
    gap: 12,
    marginTop: 4,
  },
  guestSubtitle: {
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 14,
    lineHeight: (isLargeScreen ? 16 : 14) * 1.45,
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: isLargeScreen ? 54 : 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isLargeScreen ? 16 : 14,
  },
  secondaryText: {
    fontFamily: mediumFont,
    fontSize: isLargeScreen ? 17 : 16,
  },
  avatarRing: {
    alignSelf: 'center',
  },
  avatar: {
    width: isLargeScreen ? 96 : 80,
    height: isLargeScreen ? 96 : 80,
    borderRadius: isLargeScreen ? 48 : 40,
  },
  displayName: {
    fontFamily: boldFont,
    fontSize: isXLargeScreen ? 26 : isLargeScreen ? 24 : 20,
  },
  subtitle: {
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 14,
  },
  section: {
    overflow: 'hidden',
  },
  row: {},
  rowTitle: {
    fontFamily: semiBoldFont,
    fontSize: isLargeScreen ? 17 : 15,
  },
  rowHint: {
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 14 : 13,
    marginTop: 2,
  },
  divider: {},
});
