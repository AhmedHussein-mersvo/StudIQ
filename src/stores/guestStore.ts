import { deleteFromStorage, getBooleanFromStorage, saveDataToStorage } from '../utils/storage';

const GUEST_FREE_UPLOAD_KEY = 'studiq_guest_free_upload_used';

export function hasUsedFreeUpload(): boolean {
  return getBooleanFromStorage(GUEST_FREE_UPLOAD_KEY) === true;
}

export function markFreeUploadUsed(): void {
  saveDataToStorage(GUEST_FREE_UPLOAD_KEY, true);
}

export function resetGuestUpload(): void {
  deleteFromStorage(GUEST_FREE_UPLOAD_KEY);
}

export function canGuestUpload(isAuthenticated: boolean): boolean {
  if (isAuthenticated) {
    return true;
  }
  return !hasUsedFreeUpload();
}
