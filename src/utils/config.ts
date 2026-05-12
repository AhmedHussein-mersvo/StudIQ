import { Dimensions } from "react-native";

export const width = Dimensions.get('screen').width;
export const height = Dimensions.get('screen').height;
export const isSmallScreen = width < 375;
export const isMediumScreen = width >= 375 && width < 768;
export const isLargeScreen = width >= 768;
export const isXLargeScreen = width >= 1024;
export const isXXLargeScreen = width >= 1280;
export const isXXXLargeScreen = width >= 1536;
export const isXXXXLargeScreen = width >= 1920;
export const isXXXXXLargeScreen = width >= 2560;
export const isXXXXXXLargeScreen = width >= 3840;
export const isXXXXXXXLargeScreen = width >= 5120;
export const isXXXXXXXXLargeScreen = width >= 6400;
export const isXXXXXXXXXLargeScreen = width >= 7680;


export const API_KEY = '';
