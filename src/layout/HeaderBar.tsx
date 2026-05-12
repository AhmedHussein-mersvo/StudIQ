import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { isLargeScreen, isXLargeScreen, width } from '../utils/config';
import { COLORS } from '../utils/font';

const logoSize = isXLargeScreen ? 150 : isLargeScreen ? 120 : width * 0.22;
const profileIconSize = isXLargeScreen ? 56 : isLargeScreen ? 46 : 30;
const profilePadding = isLargeScreen ? 14 : 10;

export default function HeaderBar({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TouchableOpacity
        style={styles.profileMenu}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Image
          source={require('../assets/profile.png')}
          style={styles.profileIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: logoSize,
    height: logoSize,
    resizeMode: 'contain',
  },
  profileMenu: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    borderRadius: (profileIconSize + profilePadding * 2) / 2,
    padding: profilePadding,
  },
  profileIcon: {
    width: profileIconSize,
    height: profileIconSize,
  },
});
