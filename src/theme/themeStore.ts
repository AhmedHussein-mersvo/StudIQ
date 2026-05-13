import { create } from 'zustand';
import { getStringFromStorage, saveDataToStorage } from '../utils/storage';
import type { ColorScheme } from './palette';

const STORAGE_KEY = 'app_color_scheme_v1';

function readStoredScheme(): ColorScheme {
  const v = getStringFromStorage(STORAGE_KEY);
  if (v === 'light' || v === 'dark') {
    return v;
  }
  return 'dark';
}

type ThemeState = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  colorScheme: readStoredScheme(),
  setColorScheme: scheme => {
    saveDataToStorage(STORAGE_KEY, scheme);
    set({ colorScheme: scheme });
  },
  toggleColorScheme: () => {
    const next: ColorScheme =
      get().colorScheme === 'dark' ? 'light' : 'dark';
    get().setColorScheme(next);
  },
}));
