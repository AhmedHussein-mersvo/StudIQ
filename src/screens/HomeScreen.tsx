import {
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import HeaderBar from '../layout/HeaderBar';
import Greetings from '../components/Home/Greetings';
import UploadFile from '../components/Home/UploadFile';

const supportedFileTypes = [
  types.pdf,
  types.doc,
  types.docx,
  types.xls,
  types.xlsx,
  types.ppt,
  types.pptx,
];

const requestFilePermission = async () => {
  if (Platform.OS !== 'android' || Number(Platform.Version) > 32) {
    return true;
  }

  const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  const hasPermission = await PermissionsAndroid.check(permission);

  if (hasPermission) {
    return true;
  }

  const result = await PermissionsAndroid.request(permission, {
    title: 'File access permission',
    message: 'StudIQ needs access to your files so you can upload documents.',
    buttonPositive: 'Allow',
    buttonNegative: 'Cancel',
  });

  return result === PermissionsAndroid.RESULTS.GRANTED;
};

const getUploadErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'Unable to open the selected file. Please try again.';
};

export default function HomeScreen({ navigation }: { navigation: any }) {
  const onUploadFile = async () => {
    try {
      const hasPermission = await requestFilePermission();

      if (!hasPermission) {
        Alert.alert(
          'Permission required',
          'Please allow file access to upload a document.',
        );
        return;
      }

      const [file] = await pick({
        type: supportedFileTypes,
        allowMultiSelection: false,
      });

      navigation.navigate('AILoadingScreen', { file });
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      Alert.alert(
        'Upload failed',
        getUploadErrorMessage(error),
      );
    }
  };

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
