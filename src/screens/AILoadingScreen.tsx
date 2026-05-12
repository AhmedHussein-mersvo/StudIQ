import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import HeaderBar from '../layout/HeaderBar';
import { useEffect, useState } from 'react';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import { boldFont, COLORS, regularFont } from '../utils/font';
import { isLargeScreen, isXLargeScreen } from '../utils/config';

const STEPS = [
  'Extracting text',
  'Understanding lecture',
  'Generating quiz',
  'Creating flashcards',
];

type AILoadingScreenProps = {
  navigation: any;
  route?: {
    params?: {
      file?: DocumentPickerResponse;
    };
  };
};

export default function AILoadingScreen({
  navigation,
  route,
}: AILoadingScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const fileName = route?.params?.file?.name;

  useEffect(() => {
    if (currentStepIndex === STEPS.length - 1) {
      const doneTimer = setTimeout(() => {
        navigation.replace('ResultScreen');
      }, 700);

      return () => clearTimeout(doneTimer);
    }

    const stepTimer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 900);

    return () => clearTimeout(stepTimer);
  }, [currentStepIndex, navigation]);

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} />
      <View className="flex-1 justify-center items-center gap-5 px-4">
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.title}>Generating Study Materials...</Text>
        {fileName ? (
          <Text style={styles.fileName} numberOfLines={1}>
            Processing {fileName}
          </Text>
        ) : null}
        <View className="gap-3">
          {STEPS.map((step, index) => {
            const isDone = index < currentStepIndex;
            const isActive = index === currentStepIndex;

            return (
              <View key={step} className="flex-row items-center gap-3">
                <Text
                  style={[
                    styles.stepMarker,
                    isDone || isActive ? styles.activeStep : styles.pendingStep,
                  ]}
                >
                  {isDone ? '✓' : isActive ? '•' : '○'}
                </Text>
                <Text
                  style={[
                    styles.stepText,
                    isDone || isActive ? styles.activeStep : styles.pendingStep,
                  ]}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: isXLargeScreen ? 24 : isLargeScreen ? 20 : 18,
    fontFamily: boldFont,
    marginTop: isLargeScreen ? 20 : 10,
    color: COLORS.white,
  },
  fileName: {
    maxWidth: '90%',
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 14,
    color: 'rgba(255, 255, 255, 0.72)',
  },
  stepMarker: {
    width: isLargeScreen ? 24 : 20,
    fontSize: isXLargeScreen ? 22 : isLargeScreen ? 20 : 18,
    fontFamily: boldFont,
  },
  stepText: {
    fontSize: isXLargeScreen ? 20 : isLargeScreen ? 18 : 16,
    fontFamily: regularFont,
  },
  activeStep: {
    color: COLORS.accent,
  },
  pendingStep: {
    color: 'rgba(255, 255, 255, 0.64)',
  },
});
