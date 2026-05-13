import { isLargeScreen, isXLargeScreen } from './config';

/** Horizontal inset for headers + scroll content (tab bar stays full-bleed). */
export function getScreenContentPaddingHorizontal(): number {
  if (isXLargeScreen) {
    return 28;
  }
  if (isLargeScreen) {
    return 22;
  }
  return 15;
}
