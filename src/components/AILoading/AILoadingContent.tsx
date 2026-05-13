import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getPalette } from '../../theme/palette';
import { useThemeStore } from '../../theme/themeStore';
import { isLargeScreen, isXLargeScreen } from '../../utils/config';
import { boldFont, regularFont } from '../../utils/font';

type AILoadingContentProps = {
  currentStepIndex: number;
  fileName?: string | null;
  steps: readonly string[];
};

type LoadingStepProps = {
  activeColor: string;
  isActive: boolean;
  isDone: boolean;
  label: string;
  pendingColor: string;
};

function LoadingStep({
  activeColor,
  isActive,
  isDone,
  label,
  pendingColor,
}: LoadingStepProps) {
  const color = isDone || isActive ? activeColor : pendingColor;

  return (
    <View className="flex-row items-center gap-3">
      <Text style={[styles.stepMarker, { color }]}>
        {isDone ? '✓' : isActive ? '•' : '○'}
      </Text>
      <Text style={[styles.stepText, { color }]}>{label}</Text>
    </View>
  );
}

export default function AILoadingContent({
  currentStepIndex,
  fileName,
  steps,
}: AILoadingContentProps) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  return (
    <View className="flex-1 justify-center items-center gap-5 px-4">
      <ActivityIndicator size="large" color={p.tabActive} />
      <Text style={[styles.title, { color: p.textPrimary }]}>
        Generating Study Materials...
      </Text>
      {fileName ? (
        <Text
          style={[styles.fileName, { color: p.textMuted }]}
          numberOfLines={1}
        >
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
            activeColor={p.tabActive}
            pendingColor={p.textSubtle}
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
  },
  fileName: {
    maxWidth: '90%',
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 14,
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
});
