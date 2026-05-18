import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientAuthButton from './GradientAuthButton';
import { getPalette } from '../../theme/palette';
import { useThemeStore } from '../../theme/themeStore';
import { isLargeScreen, isSmallScreen, width } from '../../utils/config';
import { mediumFont, regularFont, semiBoldFont } from '../../utils/font';
import { getScreenContentPaddingHorizontal } from '../../utils/screenPadding';

type AuthGateModalProps = {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
};

export default function AuthGateModal({
  visible,
  onClose,
  onLogin,
  onRegister,
}: AuthGateModalProps) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: p.cardBg,
              borderColor: p.cardBorder,
              marginBottom: insets.bottom + 16,
            },
          ]}
          onPress={e => e.stopPropagation()}
        >
          <Text style={[styles.title, { color: p.textPrimary }]}>
            Sign in to continue
          </Text>
          <Text style={[styles.subtitle, { color: p.textMuted }]}>
            Create an account or log in to upload more files and keep your study
            materials.
          </Text>

          <View style={styles.actions}>
            <GradientAuthButton title="Log in" onPress={onLogin} />
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: p.googleButtonBg,
                  borderColor: p.googleButtonBorder,
                },
              ]}
              onPress={onRegister}
              activeOpacity={0.85}
            >
              <Text style={[styles.secondaryText, { color: p.textPrimary }]}>
                Create account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.dismiss}>
              <Text style={[styles.dismissText, { color: p.textMuted }]}>
                Not now
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const cardMaxWidth = Math.min(420, width - 32);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
    paddingHorizontal: getScreenContentPaddingHorizontal(),
  },
  card: {
    width: '100%',
    maxWidth: cardMaxWidth,
    alignSelf: 'center',
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: isLargeScreen ? 28 : isSmallScreen ? 20 : 24,
    gap: 12,
  },
  title: {
    fontFamily: semiBoldFont,
    fontSize: isLargeScreen ? 22 : 20,
  },
  subtitle: {
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 14,
    lineHeight: (isLargeScreen ? 16 : 14) * 1.45,
    marginBottom: 4,
  },
  actions: {
    gap: 12,
    marginTop: 4,
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
  dismiss: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dismissText: {
    fontFamily: regularFont,
    fontSize: 15,
  },
});
