import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  isLargeScreen,
  isSmallScreen,
  isXLargeScreen,
  width,
} from '../../utils/config';
import { boldFont, mediumFont, regularFont } from '../../utils/font';
import { getPalette } from '../../theme/palette';
import { useThemeStore } from '../../theme/themeStore';

type UploadFileProps = {
  onUploadFile: () => void;
};

const cardPadding = isXLargeScreen ? 28 : isLargeScreen ? 24 : 18;
const cardRadius = isLargeScreen ? 28 : 22;
const imageSize = isXLargeScreen
  ? 190
  : isLargeScreen
    ? 160
    : isSmallScreen
      ? 96
      : 118;
const titleSize = isXLargeScreen ? 28 : isLargeScreen ? 24 : 18;
const subtitleSize = isLargeScreen ? 18 : 14;
const buttonHeight = isLargeScreen ? 56 : 48;
const buttonWidth = Math.min(width * (isLargeScreen ? 0.34 : 0.46), 220);

export default function UploadFile({ onUploadFile }: UploadFileProps) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  return (
    <LinearGradient
      colors={p.uploadCardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        { borderColor: p.uploadCardBorder, borderWidth: StyleSheet.hairlineWidth },
      ]}
      className="flex-row items-center justify-between overflow-hidden"
    >
      <View style={styles.copy} className="flex-1">
        <Text style={[styles.title, { color: p.uploadTitle }]}>
          Upload any file to get started
        </Text>
        <Text style={[styles.subtitle, { color: p.uploadSubtitle }]}>
          PDF, DOC, XLS, PPT
        </Text>
        <Text style={[styles.subtitle, { color: p.uploadSubtitle }]}>
          and get AI study Materials
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          className="overflow-hidden"
          onPress={onUploadFile}
        >
          <LinearGradient
            colors={p.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
            className="flex-1 flex-row items-center justify-center gap-2"
          >
            <MaterialIcons
              name="add"
              size={isLargeScreen ? 26 : 22}
              color="#FFFFFF"
            />
            <Text style={styles.buttonText}>Upload File</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Image
        source={require('../../assets/upload.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: cardRadius,
    padding: cardPadding,
    marginTop: isLargeScreen ? 28 : 20,
    minHeight: isLargeScreen ? 220 : 170,
    gap: isLargeScreen ? 24 : 12,
  },
  copy: {
    gap: isLargeScreen ? 10 : 7,
  },
  title: {
    fontFamily: boldFont,
    fontSize: titleSize,
    lineHeight: titleSize * 1.3,
  },
  subtitle: {
    fontFamily: regularFont,
    fontSize: subtitleSize,
    lineHeight: subtitleSize * 1.35,
  },
  button: {
    width: buttonWidth,
    height: buttonHeight,
    borderRadius: buttonHeight / 2,
    marginTop: isLargeScreen ? 14 : 10,
  },
  buttonGradient: {
    borderRadius: buttonHeight / 2,
  },
  buttonText: {
    fontFamily: mediumFont,
    fontSize: isLargeScreen ? 17 : 15,
    color: '#FFFFFF',
  },
  image: {
    width: imageSize,
    height: imageSize,
    resizeMode: 'contain',
  },
});
