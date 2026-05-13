import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getPalette } from '../../theme/palette';
import { useThemeStore } from '../../theme/themeStore';
import { boldFont, regularFont } from '../../utils/font';

type GreetingsProps = {
  name: string;
};

export default function Greetings({ name }: GreetingsProps) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  return (
    <View style={styles.wrap}>
      <View className="flex-row items-center gap-2">
        <Text style={[styles.title, { color: p.textPrimary }]}>
          Hello, {name}
        </Text>
        <MaterialIcons name="waving-hand" size={24} color="#fbcb42" />
      </View>
      <Text style={[styles.subtitle, { color: p.textMuted }]}>
        What would you like to learn today?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  subtitle: {
    fontFamily: regularFont,
    marginTop: 4,
  },
  title: {
    fontFamily: boldFont,
    fontSize: 24,
    lineHeight: 30,
  },
});
