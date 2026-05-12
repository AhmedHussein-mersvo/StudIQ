import { useCallback } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
  type DocumentPickerResponse,
} from '@react-native-documents/picker';

const SUPPORTED_STUDY_DOCUMENT_TYPES = [
  types.pdf,
  types.doc,
  types.docx,
  types.xls,
  types.xlsx,
  types.ppt,
  types.pptx,
];

type UseStudyDocumentPickerOptions = {
  onDocumentPicked: (file: DocumentPickerResponse) => void;
};

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

export function useStudyDocumentPicker({
  onDocumentPicked,
}: UseStudyDocumentPickerOptions) {
  return useCallback(async () => {
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
        type: SUPPORTED_STUDY_DOCUMENT_TYPES,
        allowMultiSelection: false,
      });

      onDocumentPicked(file);
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      Alert.alert('Upload failed', getUploadErrorMessage(error));
    }
  }, [onDocumentPicked]);
}
