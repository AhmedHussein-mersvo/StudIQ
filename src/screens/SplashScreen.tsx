import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { boldFont, COLORS, regularFont } from '../utils/font';

export default function SplashScreen({ navigation }: { navigation: any }) {
  const titleY = useRef(new Animated.Value(-30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.92)).current;
  const glowOpacity = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('HomeScreen');
    }, 2000);
  }, [navigation]);
  useEffect(() => {
    const introAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(titleY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]);
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1.08,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.7,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 0.92,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.35,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    introAnimation.start();
    glowAnimation.start();

    return () => glowAnimation.stop();
  }, [glowOpacity, glowScale, logoOpacity, logoScale, titleOpacity, titleY]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
          },
        ]}
      >
        StudIQ
      </Animated.Text>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoGlow,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />
        <View style={styles.logoGlowCore} />
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
          },
        ]}
      >
        The AI-Powered Study Companion
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#030518',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: COLORS.white,
    fontFamily: boldFont,
  },
  logoContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 18,
  },
  logoGlowCore: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  logo: {
    width: 180,
    height: 180,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: regularFont,
    position: 'absolute',
    bottom: 100,
  },
});
