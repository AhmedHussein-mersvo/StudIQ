import { createNavigationContainerRef } from '@react-navigation/native';
import type { MainTabParamList, RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateToMainTab(screen: keyof MainTabParamList) {
  if (!navigationRef.isReady()) {
    return;
  }
  if (screen === 'Home') {
    navigationRef.navigate('MainTabs', {
      screen: 'Home',
      params: { screen: 'HomeMain' },
    });
    return;
  }
  if (screen === 'Files') {
    navigationRef.navigate('MainTabs', {
      screen: 'Files',
      params: { screen: 'FilesList' },
    });
    return;
  }
  if (screen === 'Profile') {
    navigationRef.navigate('MainTabs', {
      screen: 'Profile',
      params: { screen: 'ProfileMain' },
    });
    return;
  }
  navigationRef.navigate('MainTabs', { screen: 'Quiz', params: {} });
}
