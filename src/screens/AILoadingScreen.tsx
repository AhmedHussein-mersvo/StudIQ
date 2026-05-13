import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import AILoadingContent from '../components/AILoading/AILoadingContent';
import HeaderBar from '../layout/HeaderBar';
import { generateSummary, type StudyResult } from '../services/aiServices';
import { appendRecentStudy } from '../services/recentStudiesStorage';
import { getFileTypePresentation } from '../utils/fileTypePresentation';
import { getScreenContentPaddingHorizontal } from '../utils/screenPadding';

const AI_GENERATION_STEPS = [
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
  const [studyResult, setStudyResult] = useState<StudyResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const file = route?.params?.file;
  const fileName = route?.params?.file?.name;

  useEffect(() => {
    let isMounted = true;

    if (!file) {
      setErrorMessage('No uploaded document was found.');
      return () => {
        isMounted = false;
      };
    }

    generateSummary(file)
      .then(result => {
        if (isMounted) {
          setStudyResult(result);
        }
      })
      .catch(error => {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to generate study materials.',
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [file]);

  useEffect(() => {
    const isFinalStep = currentStepIndex === AI_GENERATION_STEPS.length - 1;
    const hasFinishedGenerating = studyResult || errorMessage;

    if (isFinalStep && hasFinishedGenerating) {
      const doneTimer = setTimeout(() => {
        if (file && studyResult) {
          const { iconName, color } = getFileTypePresentation(
            file.name,
            file.type,
          );
          appendRecentStudy({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            fileName: file.name ?? 'Document',
            iconName,
            iconColor: color,
            createdAt: Date.now(),
            result: studyResult,
            errorMessage: null,
          });
        }

        navigation.replace('ResultScreen', {
          errorMessage,
          result: studyResult,
          fileName: file?.name ?? undefined,
        });
      }, 700);

      return () => clearTimeout(doneTimer);
    }

    if (isFinalStep) {
      return undefined;
    }

    const stepTimer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 900);

    return () => clearTimeout(stepTimer);
  }, [currentStepIndex, errorMessage, file, navigation, studyResult]);

  return (
    <View style={styles.container}>
      <HeaderBar />
      <AILoadingContent
        steps={AI_GENERATION_STEPS}
        currentStepIndex={currentStepIndex}
        fileName={fileName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getScreenContentPaddingHorizontal(),
  },
});
