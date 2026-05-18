import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getPalette } from '../../theme/palette';
import { useThemeStore } from '../../theme/themeStore';
import { isLargeScreen } from '../../utils/config';
import { mediumFont, regularFont } from '../../utils/font';

type AuthTextFieldProps = TextInputProps & {
  label: string;
  error?: string | null;
  secureToggle?: boolean;
};

export default function AuthTextField({
  label,
  error,
  secureToggle = false,
  secureTextEntry,
  ...inputProps
}: AuthTextFieldProps) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  const isSecure = secureToggle ? hidden : secureTextEntry;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: p.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: p.inputBg,
            borderColor: error ? p.error : p.inputBorder,
          },
        ]}
      >
        <TextInput
          {...inputProps}
          secureTextEntry={isSecure}
          placeholderTextColor={p.inputPlaceholder}
          style={[styles.input, { color: p.inputText }, inputProps.style]}
        />
        {secureToggle ? (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => setHidden(v => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons
              name={hidden ? 'visibility-off' : 'visibility'}
              size={22}
              color={p.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text style={[styles.error, { color: p.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    fontFamily: mediumFont,
    fontSize: isLargeScreen ? 15 : 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: isLargeScreen ? 52 : 48,
  },
  input: {
    flex: 1,
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 15,
    paddingVertical: 12,
  },
  error: {
    fontFamily: regularFont,
    fontSize: 13,
  },
});
