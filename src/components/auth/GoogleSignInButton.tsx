import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { getPalette } from '../../theme/palette';
import { useThemeStore } from '../../theme/themeStore';
import { isLargeScreen } from '../../utils/config';
import { mediumFont } from '../../utils/font';

type GoogleSignInButtonProps = TouchableOpacityProps & {
  loading?: boolean;
};

export default function GoogleSignInButton({
  loading = false,
  disabled,
  ...props
}: GoogleSignInButtonProps) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          backgroundColor: p.googleButtonBg,
          borderColor: p.googleButtonBorder,
        },
        isDisabled && styles.disabled,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={p.textPrimary} />
      ) : (
        <>
          <Image
            source={require('../../assets/google.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={[styles.label, { color: p.textPrimary }]}>
            Continue with Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    minHeight: isLargeScreen ? 54 : 50,
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.55,
  },
  icon: {
    width: 22,
    height: 22,
  },
  label: {
    fontFamily: mediumFont,
    fontSize: isLargeScreen ? 16 : 15,
  },
});
