import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import QuizScreen from '../screens/QuizScreen';
import { getPalette } from '../theme/palette';
import { useThemeStore } from '../theme/themeStore';
import {
  isLargeScreen,
  isSmallScreen,
  isXLargeScreen,
} from '../utils/config';
import { mediumFont } from '../utils/font';
import FilesStackNavigator from './FilesStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconProps = {
  color: string;
  size: number;
};

function HomeTabIcon({ color, size }: TabIconProps) {
  return <MaterialIcons name="home" size={size} color={color} />;
}

function ProfileTabIcon({ color, size }: TabIconProps) {
  return <MaterialIcons name="person" size={size} color={color} />;
}

function FilesTabIcon({ color, size }: TabIconProps) {
  return <MaterialIcons name="folder" size={size} color={color} />;
}

function QuizTabIcon({ color, size }: TabIconProps) {
  return <MaterialIcons name="quiz" size={size} color={color} />;
}

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  const tabBarTopRadius = isXLargeScreen
    ? 26
    : isLargeScreen
      ? 22
      : isSmallScreen
        ? 14
        : 18;

  const GESTURE_FALLBACK = Platform.OS === 'android' ? 16 : 0;
  const bottomInset = Math.max(insets.bottom, GESTURE_FALLBACK);

  const tabBarContentHeight = isXLargeScreen
    ? 62
    : isLargeScreen
      ? 58
      : isSmallScreen
        ? 56
        : 54;
  const tabBarHeight = tabBarContentHeight + bottomInset;

  const tabBarPadTop = isLargeScreen ? 10 : isSmallScreen ? 6 : 8;
  const tabBarPadBottom = bottomInset + 4;

  const shadowRadius = isLargeScreen ? 16 : isSmallScreen ? 8 : 12;
  const shadowOffsetY = isLargeScreen ? -8 : -5;

  const tabBarShadow =
    colorScheme === 'dark'
      ? {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: shadowOffsetY },
          shadowOpacity: isSmallScreen ? 0.35 : 0.45,
          shadowRadius,
        }
      : {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: shadowOffsetY },
          shadowOpacity: isSmallScreen ? 0.08 : 0.12,
          shadowRadius,
        };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarActiveTintColor: p.tabActive,
        tabBarInactiveTintColor: p.tabInactive,
        tabBarShowLabel: true,
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarLabelStyle: {
          fontFamily: mediumFont,
          fontSize: isXLargeScreen ? 13 : isLargeScreen ? 12 : isSmallScreen ? 10 : 11,
          marginBottom: 0,
        },
        tabBarStyle: {
          width: '100%',
          alignSelf: 'stretch',
          backgroundColor: p.tabBarBg,
          borderTopLeftRadius: tabBarTopRadius,
          borderTopRightRadius: tabBarTopRadius,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: p.tabBarBorder,
          marginHorizontal: 0,
          marginBottom: 0,
          height: tabBarHeight,
          paddingBottom: tabBarPadBottom,
          paddingTop: tabBarPadTop,
          elevation: colorScheme === 'dark' ? (isLargeScreen ? 28 : 20) : isLargeScreen ? 14 : 10,
          ...tabBarShadow,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ title: 'Home', tabBarIcon: HomeTabIcon }}
      />
      <Tab.Screen
        name="Files"
        component={FilesStackNavigator}
        options={{ title: 'Files', tabBarIcon: FilesTabIcon }}
      />
      {/* <Tab.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ title: 'Quiz', tabBarIcon: QuizTabIcon }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ title: 'Profile', tabBarIcon: ProfileTabIcon }}
      />
    </Tab.Navigator>
  );
}
