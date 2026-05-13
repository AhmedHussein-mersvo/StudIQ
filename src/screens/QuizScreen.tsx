import { useRoute, type RouteProp } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PracticeQuestionCard from '../components/Result/PracticeQuestionCard';
import HeaderBar from '../layout/HeaderBar';
import type { MainTabParamList } from '../navigation/types';
import { getPalette } from '../theme/palette';
import { useThemeStore } from '../theme/themeStore';
import { isLargeScreen, isXLargeScreen } from '../utils/config';
import { getScreenContentPaddingHorizontal } from '../utils/screenPadding';
import { mediumFont, semiBoldFont } from '../utils/font';

type QuizRoute = RouteProp<MainTabParamList, 'Quiz'>;

export default function QuizScreen() {
  const route = useRoute<QuizRoute>();
  const questions = route.params?.questions ?? [];
  const quizTitle = route.params?.quizTitle;
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  return (
    <View style={styles.flex}>
      <HeaderBar />
      <FlatList
        data={questions}
        keyExtractor={(item, index) => `quiz-${index}-${item.question.slice(0, 32)}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: p.textPrimary }]}>
              {quizTitle ? `${quizTitle} — Quiz` : 'Practice quiz'}
            </Text>
            <Text style={[styles.subtitle, { color: p.textMuted }]}>
              {questions.length === 0
                ? 'No questions for this study yet.'
                : `${questions.length} question${questions.length === 1 ? '' : 's'}`}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <PracticeQuestionCard
            item={item}
            questionIndex={index}
            palette={p}
            colorScheme={colorScheme}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: getScreenContentPaddingHorizontal(),
    paddingTop: isLargeScreen ? 16 : 12,
    paddingBottom: isLargeScreen ? 40 : 28,
    maxWidth: isXLargeScreen ? 980 : isLargeScreen ? 820 : undefined,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: isLargeScreen ? 20 : 16,
  },
  title: {
    fontFamily: semiBoldFont,
    fontSize: isXLargeScreen ? 26 : isLargeScreen ? 24 : 20,
  },
  subtitle: {
    fontFamily: mediumFont,
    fontSize: isLargeScreen ? 16 : 14,
    marginTop: 6,
  },
  separator: {
    height: isLargeScreen ? 16 : 12,
  },
});
