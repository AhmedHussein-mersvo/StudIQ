import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import HeaderBar from '../layout/HeaderBar';
import Greetings from '../components/Home/Greetings';
import UploadFile from '../components/Home/UploadFile';
import RecentFilesSection from '../components/Home/RecentFilesSection';
import { navigationRef } from '../navigation/navigationRef';
import { useStudyDocumentPicker } from '../hooks/useStudyDocumentPicker';
import {
  getRecentStudies,
  type RecentStudyRecord,
} from '../services/recentStudiesStorage';
import { isLargeScreen } from '../utils/config';
import { getScreenContentPaddingHorizontal } from '../utils/screenPadding';

export default function HomeScreen() {
  const [recentRecords, setRecentRecords] = useState<RecentStudyRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      setRecentRecords(getRecentStudies());
    }, []),
  );

  const handleDocumentPicked = useCallback((file: DocumentPickerResponse) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('MainTabs', {
        screen: 'Home',
        params: { screen: 'AILoadingScreen', params: { file } },
      });
    }
  }, []);

  const onUploadFile = useStudyDocumentPicker({
    onDocumentPicked: handleDocumentPicked,
  });

  return (
    <View style={styles.container}>
      <HeaderBar />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollInner}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Greetings name="John Doe" />
          <UploadFile onUploadFile={onUploadFile} />
          <RecentFilesSection records={recentRecords} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getScreenContentPaddingHorizontal(),
  },
  content: {
    flex: 1,
  },
  scrollInner: {
    paddingTop: isLargeScreen ? 18 : 14,
    flexGrow: 1,
  },
  contentContainer: {
    // flex: 1,
  },
});
