import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export function saveDataToStorage(
  key: string,
  value: string | number | boolean,
): true | unknown {
  try {
    storage.set(key, value);
  } catch (e) {
    return e;
  }
  return true;
}
export function getNumberFromStorage(key: string): number | undefined {
  const value = storage.getNumber(key);
  return value;
}
export function getStringFromStorage(key: string): string | undefined {
  const value = storage.getString(key);
  return value;
}
export function getBooleanFromStorage(key: string): boolean | undefined {
  const value = storage.getBoolean(key);
  return value;
}

export function deleteFromStorage(key: string) {
  return storage.remove(key);
}

export function deleteAllFromStorage() {
  try {
    storage.clearAll();
  } catch (e) {}
}
