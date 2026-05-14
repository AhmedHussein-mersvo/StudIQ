import './global.css';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useMemo } from 'react';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { navigationRef } from './src/navigation/navigationRef';
import type { RootStackParamList } from './src/navigation/types';
import SplashScreen from './src/screens/SplashScreen';
import AppBackground from './src/layout/AppBackground';
import { getPalette } from './src/theme/palette';
import { useThemeStore } from './src/theme/themeStore';
import { NativeModules, Platform } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

function ThemedNavigation() {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);
  useEffect(() => {
    if (Platform.OS === 'android') {
      NativeModules.ImmersiveMode.enterImmersiveMode();
    }
  }, []);
  const navigationTheme = useMemo(() => {
    const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: 'transparent',
        card: 'transparent',
        primary: p.tabActive,
        text: p.textPrimary,
        border: p.cardBorder,
      },
    };
  }, [colorScheme, p.cardBorder, p.tabActive, p.textPrimary]);

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <AppBackground>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
          }}
          initialRouteName="SplashScreen"
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        </Stack.Navigator>
      </AppBackground>
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemedNavigation />
    </SafeAreaProvider>
  );
}
