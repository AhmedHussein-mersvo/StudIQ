import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { isLargeScreen, isXLargeScreen } from '../../utils/config';
import { boldFont, COLORS, regularFont } from '../../utils/font';

type AILoadingContentProps = {
  currentStepIndex: number;
  fileName?: string | null;
  steps: readonly string[];
};

type LoadingStepProps = {
  isActive: boolean;
  isDone: boolean;
  label: string;
};

function LoadingStep({ isActive, isDone, label }: LoadingStepProps) {
  const stateStyle = isDone || isActive ? styles.activeStep : styles.pendingStep;

  return (
    <View className="flex-row items-center gap-3">
      <Text style={[styles.stepMarker, stateStyle]}>
        {isDone ? '✓' : isActive ? '•' : '○'}
      </Text>
      <Text style={[styles.stepText, stateStyle]}>{label}</Text>
    </View>
  );
}

export default function AILoadingContent({
  currentStepIndex,
  fileName,
  steps,
}: AILoadingContentProps) {
  return (
    <View className="flex-1 justify-center items-center gap-5 px-4">
      <ActivityIndicator size="large" color={COLORS.accent} />
      <Text style={styles.title}>Generating Study Materials...</Text>
      {fileName ? (
        <Text style={styles.fileName} numberOfLines={1}>
          Processing {fileName}
        </Text>
      ) : null}
      <View className="gap-3">
        {steps.map((step, index) => (
          <LoadingStep
            key={step}
            label={step}
            isDone={index < currentStepIndex}
            isActive={index === currentStepIndex}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
