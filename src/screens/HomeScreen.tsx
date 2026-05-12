import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import HeaderBar from '../layout/HeaderBar';
import Greetings from '../components/Home/Greetings';
import UploadFile from '../components/Home/UploadFile';
import { useStudyDocumentPicker } from '../hooks/useStudyDocumentPicker';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const handleDocumentPicked = useCallback(
    (file: DocumentPickerResponse) => {
      navigation.navigate('AILoadingScreen', { file });
    },
    [navigation],
  );

  const onUploadFile = useStudyDocumentPicker({
    onDocumentPicked: handleDocumentPicked,
  });

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} />
      <ScrollView className='flex-1 mt-4' style={styles.content}>
        <View className='flex-1' style={styles.contentContainer}>
          <Greetings name="John Doe" />
          <UploadFile onUploadFile={onUploadFile} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
