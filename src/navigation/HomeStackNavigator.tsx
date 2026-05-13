import { createStackNavigator } from '@react-navigation/stack';
import AILoadingScreen from '../screens/AILoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import ResultScreen from '../screens/ResultScreen';
import type { HomeStackParamList } from './types';

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
      initialRouteName="HomeMain"
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="AILoadingScreen" component={AILoadingScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
}
