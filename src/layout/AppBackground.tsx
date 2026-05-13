import type { ReactNode } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPalette } from '../theme/palette';
import { useThemeStore } from '../theme/themeStore';

type AppBackgroundProps = {
  children: ReactNode;
};

export default function AppBackground({ children }: AppBackgroundProps) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  return (
    <LinearGradient
      colors={p.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
