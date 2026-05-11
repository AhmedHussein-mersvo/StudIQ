import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export function saveDataToStorage(key,value) {
    try {
        storage.set(key,value);
    }
    catch (e) {
        return e;
    }
    return true;
}
export function getNumberFromStorage(key) {
    return storage.getNumber(key);
}
export function getStringFromStorage(key) {
    return storage.getString(key);
}
export function getBooleanFromStorage(key) {
    return storage.getBoolean(key);
}

export function deleteFromStorage(key) {
    return storage.getBoolean(key);
}

export function deleteAllFromStorage() {
    try {
        storage.clearAll();
    }
    catch (e) {
        console.log("can't delete all storage.");
    }
}