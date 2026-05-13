import { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import type { RecentStudyRecord } from '../../services/recentStudiesStorage';
import { navigateToMainTab, navigationRef } from '../../navigation/navigationRef';
import { getPalette } from '../../theme/palette';
import { useThemeStore } from '../../theme/themeStore';
import {
  isLargeScreen,
  isSmallScreen,
  isXLargeScreen,
} from '../../utils/config';
import { mediumFont, semiBoldFont } from '../../utils/font';
import RecentStudyFileItem from './RecentStudyFileItem';

const CAROUSEL_MAX = 6;

type RecentFilesSectionProps = {
  records: RecentStudyRecord[];
};

export default function RecentFilesSection({
  records,
}: RecentFilesSectionProps) {
  const { width: winWidth } = useWindowDimensions();
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  const itemWidth = useMemo(() => {
    const raw = winWidth * 0.28;
    return Math.min(Math.max(raw, 104), 148);
  }, [winWidth]);

  const gap = isXLargeScreen ? 16 : isLargeScreen ? 14 : 10;

  const carouselData = useMemo(
    () => records.slice(0, CAROUSEL_MAX),
    [records],
  );

  const openResult = (item: RecentStudyRecord) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('MainTabs', {
        screen: 'Home',
        params: {
          screen: 'ResultScreen',
          params: {
            result: item.result,
            errorMessage: item.errorMessage ?? null,
            fileName: item.fileName,
          },
        },
      });
    }
  };

  if (records.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.headerRow} className="flex-row items-center justify-between">
        <Text style={[styles.title, { color: p.textPrimary }]}>Recent files</Text>
        <TouchableOpacity
          onPress={() => navigateToMainTab('Files')}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
        >
          <Text style={[styles.seeAll, { color: p.seeAll }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={carouselData}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        scrollEventThrottle={16}
        style={styles.carouselList}
        contentContainerStyle={[
          styles.carouselContent,
          styles.carouselContentPadding,
          styles.carouselContentEnd,
          { gap },
        ]}
        renderItem={({ item }) => (
          <RecentStudyFileItem
            record={item}
            variant="carousel"
            itemWidth={itemWidth}
            onPress={() => openResult(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: isLargeScreen ? 28 : 22,
  },
  headerRow: {
    marginBottom: isSmallScreen ? 10 : 12,
  },
  title: {
    fontFamily: semiBoldFont,
    fontSize: isXLargeScreen ? 22 : isLargeScreen ? 20 : 17,
  },
  seeAll: {
    fontFamily: mediumFont,
    fontSize: isLargeScreen ? 16 : 14,
  },
  carouselContent: {
    flexGrow: 0,
  },
  carouselContentPadding: {
    paddingVertical: 4,
  },
  carouselContentEnd: {
    paddingRight: 8,
  },
  carouselList: {
    minHeight: isLargeScreen ? 128 : 112,
  },
});
