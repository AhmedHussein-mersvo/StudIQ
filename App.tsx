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
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CountrySelectScreen from './src/screens/CountrySelectScreen';
import { configureGoogleSignIn } from './src/services/googleAuth';
import AppBackground from './src/layout/AppBackground';
import { getPalette } from './src/theme/palette';
import { useThemeStore } from './src/theme/themeStore';
import { NativeModules, Platform } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

function ThemedNavigation() {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);
  useEffect(() => {
    configureGoogleSignIn();
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
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="CountrySelect" component={CountrySelectScreen} />
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
