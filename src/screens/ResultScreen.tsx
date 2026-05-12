import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderBar from '../layout/HeaderBar';
import { isLargeScreen, isXLargeScreen } from '../utils/config';
import { boldFont, mediumFont, regularFont, semiBoldFont } from '../utils/font';
import type { StudyResult } from '../services/aiServices';

type ResultScreenProps = {
  navigation: any;
  route?: {
    params?: {
      errorMessage?: string | null;
      result?: StudyResult | null;
    };
  };
};

export default function ResultScreen({ navigation, route }: ResultScreenProps) {
  const result = route?.params?.result;
  const errorMessage = route?.params?.errorMessage;
  const keyPoints = result?.keyPoints ?? [];
  const questions = result?.questions ?? [];

  return (
    <View className="flex-1">
      <HeaderBar navigation={navigation} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content} className="gap-5">
          <View
            style={styles.heroCard}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5"
          >
            <View className="mb-4 flex-row items-center gap-3">
              <View className="items-center justify-center rounded-2xl bg-violet-500/25 p-3">
                <MaterialIcons name="auto-awesome" size={isLargeScreen ? 30 : 24} color="#A78BFA" />
              </View>
              <Text style={styles.eyebrow} className="text-violet-200">
                AI generated result
              </Text>
            </View>
            <Text style={styles.title} className="text-white">
              {result?.title ?? 'AI result unavailable'}
            </Text>
            <Text style={styles.summary} className="mt-3 text-white/70">
              {result?.summary ??
                errorMessage ??
                'Upload another file and try generating study materials again.'}
            </Text>
          </View>

          {keyPoints.length > 0 ? (
            <View style={styles.sectionCard} className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <View className="mb-4 flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={isLargeScreen ? 26 : 22} color="#22C55E" />
                <Text style={styles.sectionTitle} className="text-white">
                  Key points
                </Text>
              </View>
              <View className="gap-3">
                {keyPoints.map((point, index) => (
                  <View key={point} className="flex-row gap-3 rounded-2xl bg-black/20 p-4">
                    <Text style={styles.pointNumber} className="text-blue-300">
                      {index + 1}
                    </Text>
                    <Text style={styles.bodyText} className="flex-1 text-white/80">
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {questions.length > 0 ? (
            <View style={styles.sectionCard} className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <View className="mb-4 flex-row items-center gap-2">
                <MaterialIcons name="quiz" size={isLargeScreen ? 26 : 22} color="#60A5FA" />
                <Text style={styles.sectionTitle} className="text-white">
                  Practice questions
                </Text>
              </View>
              <View className="gap-4">
                {questions.map((item, questionIndex) => (
                  <View key={item.question} className="rounded-2xl bg-black/20 p-4">
                    <Text style={styles.questionText} className="text-white">
                      {questionIndex + 1}. {item.question}
                    </Text>
                    <View className="mt-3 gap-2">
                      {item.options.map(option => {
                        const isAnswer = option === item.answer;

                        return (
                          <View
                            key={option}
                            className={`flex-row items-center gap-2 rounded-xl border p-3 ${
                              isAnswer
                                ? 'border-emerald-400/60 bg-emerald-500/15'
                                : 'border-white/10 bg-white/5'
                            }`}
                          >
                            <MaterialIcons
                              name={isAnswer ? 'check-circle' : 'radio-button-unchecked'}
                              size={18}
                              color={isAnswer ? '#34D399' : 'rgba(255,255,255,0.55)'}
                            />
                            <Text
                              style={styles.optionText}
                              className={isAnswer ? 'text-emerald-100' : 'text-white/70'}
                            >
                              {option}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: isLargeScreen ? 28 : 18,
    paddingBottom: isLargeScreen ? 40 : 28,
  },
  content: {
    width: '100%',
    maxWidth: isXLargeScreen ? 980 : isLargeScreen ? 820 : undefined,
    alignSelf: 'center',
  },
  heroCard: {
    padding: isLargeScreen ? 28 : 20,
  },
  sectionCard: {
    padding: isLargeScreen ? 24 : 18,
  },
  eyebrow: {
    fontFamily: mediumFont,
    fontSize: isLargeScreen ? 16 : 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: boldFont,
    fontSize: isXLargeScreen ? 36 : isLargeScreen ? 32 : 26,
    lineHeight: (isXLargeScreen ? 36 : isLargeScreen ? 32 : 26) * 1.18,
  },
  summary: {
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 18 : 15,
    lineHeight: (isLargeScreen ? 18 : 15) * 1.45,
  },
  sectionTitle: {
    fontFamily: semiBoldFont,
    fontSize: isLargeScreen ? 24 : 20,
  },
  pointNumber: {
    fontFamily: boldFont,
    fontSize: isLargeScreen ? 18 : 16,
  },
  bodyText: {
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 17 : 15,
    lineHeight: (isLargeScreen ? 17 : 15) * 1.45,
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