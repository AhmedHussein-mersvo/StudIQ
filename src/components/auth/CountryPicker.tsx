import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { RootStackParamList } from '../../navigation/types';
import { getPalette } from '../../theme/palette';
import { useThemeStore } from '../../theme/themeStore';
import { isLargeScreen } from '../../utils/config';
import { mediumFont, regularFont } from '../../utils/font';

type CountryPickerProps = {
  label: string;
  value: string;
  error?: string | null;
};

export default function CountryPicker({
  label,
  value,
  error,
}: CountryPickerProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  const openPicker = () => {
    navigation.navigate('CountrySelect', { currentCountry: value });
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: p.textSecondary }]}>{label}</Text>
      <Pressable
        onPress={openPicker}
        style={[
          styles.field,
          {
            backgroundColor: p.inputBg,
            borderColor: error ? p.error : p.inputBorder,
          },
        ]}
      >
        <Text
          style={[
            styles.value,
            { color: value ? p.inputText : p.inputPlaceholder },
          ]}
          numberOfLines={1}
        >
          {value || 'Select your country'}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={24} color={p.chevron} />
      </Pressable>
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: isLargeScreen ? 52 : 48,
  },
  value: {
    flex: 1,
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 15,
  },
  error: {
    fontFamily: regularFont,
    fontSize: 13,
  },
});
