import type { NavigatorScreenParams } from '@react-navigation/native';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import type { StudyResult, StudyQuestion } from '../services/aiServices';

export type ResultScreenParams = {
  errorMessage?: string | null;
  result?: StudyResult | null;
  fileName?: string;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  AILoadingScreen: { file?: DocumentPickerResponse };
  ResultScreen: ResultScreenParams;
};

export type FilesStackParamList = {
  FilesList: undefined;
  ResultScreen: ResultScreenParams;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Files: NavigatorScreenParams<FilesStackParamList> | undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
  Quiz: { questions?: StudyQuestion[]; quizTitle?: string };
};

export type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: { country?: string } | undefined;
  CountrySelect: { currentCountry?: string } | undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
};
