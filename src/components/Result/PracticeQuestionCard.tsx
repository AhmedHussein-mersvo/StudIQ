import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { StudyQuestion } from '../../services/aiServices';
import type { AppPalette, ColorScheme } from '../../theme/palette';
import { isLargeScreen } from '../../utils/config';
import { regularFont, semiBoldFont } from '../../utils/font';

type PracticeQuestionCardProps = {
  item: StudyQuestion;
  questionIndex: number;
  palette: AppPalette;
  colorScheme: ColorScheme;
};

export default function PracticeQuestionCard({
  item,
  questionIndex,
  palette: p,
  colorScheme,
}: PracticeQuestionCardProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <View
        style={[styles.questionBlock, { backgroundColor: p.rowBg }]}
        className="rounded-2xl p-4"
      >
        <Text style={[styles.questionText, { color: p.textPrimary }]}>
          {questionIndex + 1}. {item.question}
        </Text>
        <View className="mt-3 gap-2">
          {item.options.map(option => {
            const isAnswer = option === item.answer;

            return (
              <View
                key={option}
                style={[
                  styles.optionRow,
                  isAnswer
                    ? styles.optionCorrect
                    : {
                        borderColor: p.optionDefaultBorder,
                        backgroundColor: p.optionDefaultBg,
                        borderWidth: StyleSheet.hairlineWidth,
                      },
                ]}
                className="flex-row items-center gap-2 rounded-xl p-3"
              >
                <MaterialIcons
                  name={isAnswer ? 'check-circle' : 'radio-button-unchecked'}
                  size={18}
                  color={isAnswer ? '#34D399' : p.optionDefaultIcon}
                />
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: isAnswer
                        ? colorScheme === 'light'
                          ? '#065F46'
                          : '#D1FAE5'
                        : p.optionDefaultText,
                    },
                  ]}
                  className="flex-1"
                >
                  {option}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignSelf: 'stretch',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  questionBlock: {},
  optionRow: {},
  optionCorrect: {
    borderColor: 'rgba(52,211,153,0.55)',
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
  },
  questionText: {
    fontFamily: semiBoldFont,
    fontSize: isLargeScreen ? 18 : 16,
    lineHeight: (isLargeScreen ? 18 : 16) * 1.35,
  },
  optionText: {
    flex: 1,
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 14,
  },
});
