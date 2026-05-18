import { canGuestUpload } from '../stores/guestStore';

export function shouldShowAuthGate(isAuthenticated: boolean): boolean {
  return !canGuestUpload(isAuthenticated);
}
