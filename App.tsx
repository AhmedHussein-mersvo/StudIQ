import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import AILoadingScreen from './src/screens/AILoadingScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import SplashScreen from './src/screens/SplashScreen';
import AppBackground from './src/layout/AppBackground';
const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppBackground>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: 'transparent' },
            }}
            initialRouteName="HomeScreen"
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="AILoadingScreen" component={AILoadingScreen} />
            <Stack.Screen name="QuizScreen" component={QuizScreen} />
            <Stack.Screen name="ResultScreen" component={ResultScreen} />
          </Stack.Navigator>
        </AppBackground>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
