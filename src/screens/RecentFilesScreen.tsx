import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import RecentStudyFileItem from '../components/Home/RecentStudyFileItem';
import HeaderBar from '../layout/HeaderBar';
import { navigationRef } from '../navigation/navigationRef';
import {
  getRecentStudies,
  type RecentStudyRecord,
} from '../services/recentStudiesStorage';
import { getPalette } from '../theme/palette';
import { useThemeStore } from '../theme/themeStore';
import { isLargeScreen, isXLargeScreen } from '../utils/config';
import { getScreenContentPaddingHorizontal } from '../utils/screenPadding';
import { regularFont, semiBoldFont } from '../utils/font';

export default function RecentFilesScreen() {
  const [records, setRecords] = useState<RecentStudyRecord[]>([]);
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  useFocusEffect(
    useCallback(() => {
      setRecords(getRecentStudies());
    }, []),
  );

  const openResult = (item: RecentStudyRecord) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('MainTabs', {
        screen: 'Files',
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

  return (
    <View style={styles.container} className="flex-1">
      <HeaderBar />
      <View style={styles.inner} className="flex-1">
        <Text style={[styles.screenTitle, { color: p.textPrimary }]}>
          Recent files
        </Text>
        <Text style={[styles.subtitle, { color: p.textMuted }]}>
          Open a saved study to review summary and questions.
        </Text>
        <FlatList
          data={records}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: p.textSubtle }]}>
              No files yet. Upload a document from home to generate study materials.
            </Text>
          }
          renderItem={({ item }) => (
            <RecentStudyFileItem
              record={item}
              variant="list"
              onPress={() => openResult(item)}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    paddingTop: isLargeScreen ? 12 : 8,
    maxWidth: isXLargeScreen ? 720 : undefined,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: getScreenContentPaddingHorizontal(),
  },
  screenTitle: {
    fontFamily: semiBoldFont,
    fontSize: isXLargeScreen ? 26 : isLargeScreen ? 24 : 20,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 14,
    marginBottom: isLargeScreen ? 20 : 16,
    lineHeight: (isLargeScreen ? 16 : 14) * 1.4,
  },
  listContent: {
    paddingBottom: isLargeScreen ? 40 : 28,
    flexGrow: 1,
  },
  empty: {
    fontFamily: regularFont,
    fontSize: isLargeScreen ? 16 : 14,
    marginTop: 24,
    textAlign: 'center',
    lineHeight: (isLargeScreen ? 16 : 14) * 1.45,
  },
});
