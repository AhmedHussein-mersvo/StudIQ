import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import AuthGateModal from '../components/auth/AuthGateModal';
import HeaderBar from '../layout/HeaderBar';
import Greetings from '../components/Home/Greetings';
import UploadFile from '../components/Home/UploadFile';
import RecentFilesSection from '../components/Home/RecentFilesSection';
import { navigationRef } from '../navigation/navigationRef';
import type { RootStackParamList } from '../navigation/types';
import { useStudyDocumentPicker } from '../hooks/useStudyDocumentPicker';
import {
  getRecentStudies,
  type RecentStudyRecord,
} from '../services/recentStudiesStorage';
import { useAuthStore } from '../stores/authStore';
import { markFreeUploadUsed } from '../stores/guestStore';
import { isLargeScreen } from '../utils/config';
import { shouldShowAuthGate } from '../utils/guestUploadGate';
import { getScreenContentPaddingHorizontal } from '../utils/screenPadding';

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const firstName = useAuthStore(s => s.user?.firstName ?? 'Guest');
  const [recentRecords, setRecentRecords] = useState<RecentStudyRecord[]>([]);
  const [authGateVisible, setAuthGateVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setRecentRecords(getRecentStudies());
    }, []),
  );

  const handleDocumentPicked = useCallback(
    (file: DocumentPickerResponse) => {
      if (!isAuthenticated) {
        markFreeUploadUsed();
      }
      if (navigationRef.isReady()) {
        navigationRef.navigate('MainTabs', {
          screen: 'Home',
          params: { screen: 'AILoadingScreen', params: { file } },
        });
      }
    },
    [isAuthenticated],
  );

  const openDocumentPicker = useStudyDocumentPicker({
    onDocumentPicked: handleDocumentPicked,
  });

  const handleUploadPress = useCallback(() => {
    if (shouldShowAuthGate(isAuthenticated)) {
      setAuthGateVisible(true);
      return;
    }
    openDocumentPicker();
  }, [isAuthenticated, openDocumentPicker]);

  const goToLogin = useCallback(() => {
    setAuthGateVisible(false);
    navigation.navigate('Login');
  }, [navigation]);

  const goToRegister = useCallback(() => {
    setAuthGateVisible(false);
    navigation.navigate('Register');
  }, [navigation]);

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
          <Greetings name={firstName} />
          <UploadFile onUploadFile={handleUploadPress} />
          <RecentFilesSection records={recentRecords} />
        </View>
      </ScrollView>

      <AuthGateModal
        visible={authGateVisible}
        onClose={() => setAuthGateVisible(false)}
        onLogin={goToLogin}
        onRegister={goToRegister}
      />
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
  contentContainer: {},
});
