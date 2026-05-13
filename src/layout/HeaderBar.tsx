import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { isLargeScreen, isXLargeScreen, width } from '../utils/config';
import { navigationRef } from '../navigation/navigationRef';
import { getPalette } from '../theme/palette';
import { useThemeStore } from '../theme/themeStore';

const logoSize = isXLargeScreen ? 150 : isLargeScreen ? 120 : width * 0.22;
const profileIconSize = isXLargeScreen ? 56 : isLargeScreen ? 46 : 30;
const profilePadding = isLargeScreen ? 14 : 10;
const themeIconSize = isLargeScreen ? 24 : 22;

export default function HeaderBar() {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const toggleColorScheme = useThemeStore(s => s.toggleColorScheme);
  const p = getPalette(colorScheme);

  const goHome = () => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('MainTabs', {
        screen: 'Home',
        params: { screen: 'HomeMain' },
      });
    }
  };

  const goProfile = () => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('MainTabs', {
        screen: 'Profile',
        params: { screen: 'ProfileMain' },
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goHome}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </TouchableOpacity>

      <View style={styles.rightCluster}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            colorScheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          onPress={toggleColorScheme}
          style={[
            styles.chip,
            {
              backgroundColor: p.headerChipBg,
              borderColor: p.headerChipBorder,
            },
          ]}
        >
          <MaterialIcons
            name={colorScheme === 'dark' ? 'wb-sunny' : 'dark-mode'}
            size={themeIconSize}
            color={p.onHeaderChip}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor: p.headerChipBg,
              borderColor: p.headerChipBorder,
            },
          ]}
          onPress={goProfile}
        >
          <Image
            source={require('../assets/profile.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chip: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    padding: profilePadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: logoSize,
    height: logoSize,
    resizeMode: 'contain',
  },
  profileIcon: {
    width: profileIconSize,
    height: profileIconSize,
  },
});
