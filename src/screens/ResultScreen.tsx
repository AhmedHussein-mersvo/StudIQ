import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PracticeQuestionCard from '../components/Result/PracticeQuestionCard';
import HeaderBar from '../layout/HeaderBar';
import { navigationRef } from '../navigation/navigationRef';
import type { StudyResult } from '../services/aiServices';
import { getPalette } from '../theme/palette';
import { useThemeStore } from '../theme/themeStore';
import { isLargeScreen, isXLargeScreen } from '../utils/config';
import { getScreenContentPaddingHorizontal } from '../utils/screenPadding';
import { boldFont, mediumFont, regularFont, semiBoldFont } from '../utils/font';

type ResultScreenProps = {
  route?: {
    params?: {
      errorMessage?: string | null;
      result?: StudyResult | null;
      fileName?: string;
    };
  };
};

export default function ResultScreen({ route }: ResultScreenProps) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  const result = route?.params?.result;
  const errorMessage = route?.params?.errorMessage;
  const sourceFileName = route?.params?.fileName;
  const keyPoints = result?.keyPoints ?? [];
  const questions = result?.questions ?? [];

  const carouselMinH = isLargeScreen ? 320 : 280;
  const [pageWidth, setPageWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    setActiveIndex(0);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [result?.title, questions.length]);

  const onCarouselLayout = (e: { nativeEvent: { layout: { width: number } } }) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - pageWidth) > 0.5) {
      setPageWidth(w);
    }
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth <= 0) {
      return;
    }
    const idx = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    setActiveIndex(Math.max(0, Math.min(questions.length - 1, idx)));
  };

  const cardShell = {
    borderColor: p.cardBorder,
    backgroundColor: p.cardBg,
    borderWidth: StyleSheet.hairlineWidth,
  };

  return (
    <View style={styles.flex}>
      <HeaderBar />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content} className="gap-5">
          <View style={[styles.heroCard, cardShell]} className="overflow-hidden rounded-3xl p-5">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="items-center justify-center rounded-2xl bg-violet-500/25 p-3">
                <MaterialIcons name="auto-awesome" size={isLargeScreen ? 30 : 24} color="#A78BFA" />
              </View>
              <Text style={[styles.eyebrow, { color: p.eyebrow }]}>
                AI generated result
              </Text>
            </View>
            <Text style={[styles.title, { color: p.textPrimary }]}>
              {result?.title ?? 'AI result unavailable'}
            </Text>
            {sourceFileName ? (
              <Text
                style={[styles.sourceFile, { color: p.textMuted }]}
                className="mt-2"
                numberOfLines={2}
              >
                {sourceFileName}
              </Text>
            ) : null}
            <Text style={[styles.summary, { color: p.textSecondary }]} className="mt-3">
              {result?.summary ??
                errorMessage ??
                'Upload another file and try generating study materials again.'}
            </Text>
          </View>

          {keyPoints.length > 0 ? (
            <View style={[styles.sectionCard, cardShell]} className="rounded-3xl p-5">
              <View className="mb-4 flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={isLargeScreen ? 26 : 22} color="#22C55E" />
                <Text style={[styles.sectionTitle, { color: p.textPrimary }]}>
                  Key points
                </Text>
              </View>
              <View className="gap-3">
                {keyPoints.map((point, index) => (
                  <View
                    key={point}
                    style={[
                      styles.pointRow,
                      { backgroundColor: p.rowBg },
                    ]}
                    className="flex-row gap-3 rounded-2xl p-4"
                  >
                    <Text style={[styles.pointNumber, { color: p.pointNumber }]}>
                      {index + 1}
                    </Text>
                    <Text style={[styles.bodyText, { color: p.textSecondary }]} className="flex-1">
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {questions.length > 0 ? (
            <View style={[styles.sectionCard, cardShell]} className="rounded-3xl p-5">
              <View className="mb-4 flex-row items-center gap-2">
                <MaterialIcons name="quiz" size={isLargeScreen ? 26 : 22} color="#60A5FA" />
                <Text style={[styles.sectionTitle, { color: p.textPrimary }]}>
                  Practice questions
                </Text>
              </View>
              <View
                style={[styles.carouselWrap, { minHeight: carouselMinH }]}
                onLayout={onCarouselLayout}
              >
                {pageWidth > 0 ? (
                  <FlatList
                    ref={listRef}
                    data={questions}
                    horizontal
                    pagingEnabled
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => `practice-${index}`}
                    snapToInterval={pageWidth}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    disableIntervalMomentum
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    getItemLayout={(_, index) => ({
                      length: pageWidth,
                      offset: pageWidth * index,
                      index,
                    })}
                    style={{ minHeight: carouselMinH }}
                    renderItem={({ item, index }) => (
                      <View style={{ width: pageWidth, minHeight: carouselMinH }}>
                        <PracticeQuestionCard
                          item={item}
                          questionIndex={index}
                          palette={p}
                          colorScheme={colorScheme}
                        />
                      </View>
                    )}
                  />
                ) : null}
              </View>
              <Text style={[styles.pagerCaption, { color: p.textMuted }]}>
                Question {activeIndex + 1} / {questions.length}
              </Text>
              <View style={styles.dotsRow}>
                {questions.map((_, i) => (
                  <View
                    key={`dot-${i}`}
                    style={[
                      styles.dot,
                      i === activeIndex
                        ? [styles.dotActive, { backgroundColor: p.tabActive }]
                        : { backgroundColor: p.textMuted, opacity: 0.35 },
                    ]}
                  />
                ))}
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (navigationRef.isReady()) {
                    navigationRef.navigate('MainTabs', {
                      screen: 'Quiz',
                      params: {
                        questions,
                        quizTitle: result?.title,
                      },
                    });
                  }
                }}
                style={styles.quizCta}
              >
                <Text style={[styles.quizCtaText, { color: p.tabActive }]}>
                  Open full quiz
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: isLargeScreen ? 28 : 18,
    paddingBottom: isLargeScreen ? 40 : 28,
    paddingHorizontal: getScreenContentPaddingHorizontal(),
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
  pointRow: {},
  carouselWrap: {
    width: '100%',
  },
  pagerCaption: {
    fontFamily: mediumFont,
    fontSize: isLargeScreen ? 15 : 13,
    textAlign: 'center',
    marginTop: isLargeScreen ? 14 : 10,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: isLargeScreen ? 12 : 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    borderRadius: 4,
    opacity: 1,
  },
  quizCta: {
    alignSelf: 'center',
    marginTop: isLargeScreen ? 18 : 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  quizCtaText: {
    fontFamily: semiBoldFont,
    fontSize: isLargeScreen ? 16 : 14,
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
  sourceFile: {
    fontFamily: mediumFont,
    fontSize: isLargeScreen ? 15 : 13,
    lineHeight: (isLargeScreen ? 15 : 13) * 1.4,
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
});
