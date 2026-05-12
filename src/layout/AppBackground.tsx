import type { ReactNode } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppBackgroundProps = {
  children: ReactNode;
};

export default function AppBackground({ children }: AppBackgroundProps) {
  return (
    <LinearGradient
      colors={['#030419', '#030518']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <StatusBar
        barStyle="light-content"
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
    paddingHorizontal:15

  },
  safeArea: {
    flex: 1,
  },
});
