import { createStackNavigator } from '@react-navigation/stack';
import RecentFilesScreen from '../screens/RecentFilesScreen';
import ResultScreen from '../screens/ResultScreen';
import type { FilesStackParamList } from './types';

const Stack = createStackNavigator<FilesStackParamList>();

export default function FilesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
      initialRouteName="FilesList"
    >
      <Stack.Screen name="FilesList" component={RecentFilesScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
}
