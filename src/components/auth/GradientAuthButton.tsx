import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getPalette } from '../../theme/palette';
import { useThemeStore } from '../../theme/themeStore';
import { isLargeScreen } from '../../utils/config';
import { semiBoldFont } from '../../utils/font';

type GradientAuthButtonProps = TouchableOpacityProps & {
  title: string;
  loading?: boolean;
};

export default function GradientAuthButton({
  title,
  loading = false,
  disabled,
  ...props
}: GradientAuthButtonProps) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      style={[styles.button, isDisabled && styles.disabled]}
      {...props}
    >
      <LinearGradient
        colors={p.buttonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    minHeight: isLargeScreen ? 54 : 50,
  },
  disabled: {
    opacity: 0.55,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isLargeScreen ? 16 : 14,
  },
  title: {
    fontFamily: semiBoldFont,
    fontSize: isLargeScreen ? 17 : 16,
    color: '#FFFFFF',
  },
});
