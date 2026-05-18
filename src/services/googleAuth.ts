import { GOOGLE_WEB_CLIENT_ID } from '@env';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import type { GoogleProfileInput } from '../stores/authStore';

let configured = false;

export function configureGoogleSignIn(): void {
  if (configured || !GOOGLE_WEB_CLIENT_ID) {
    return;
  }
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
  configured = true;
}

export type GoogleSignInResult =
  | { ok: true; profile: GoogleProfileInput }
  | { ok: false; error: string; cancelled?: boolean };

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  if (!GOOGLE_WEB_CLIENT_ID) {
    return {
      ok: false,
      error:
        'Google Sign-In is not configured. Add GOOGLE_WEB_CLIENT_ID to your .env file.',
    };
  }
  configureGoogleSignIn();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) {
      return { ok: false, error: 'Google sign-in was not completed', cancelled: true };
    }

    const data = response.data;
    const email = data.user.email;
    if (!email) {
      return { ok: false, error: 'Google account did not return an email' };
    }

    const photoUrl = data.user.photo?.trim() || undefined;

    return {
      ok: true,
      profile: {
        email,
        firstName: data.user.givenName ?? '',
        lastName: data.user.familyName ?? '',
        ...(photoUrl ? { photoUrl } : {}),
      },
    };
  } catch (error) {
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return {
          ok: false,
          error: 'Sign-in cancelled',
          cancelled: true,
        };
      }
      if (error.code === statusCodes.IN_PROGRESS) {
        return { ok: false, error: 'Sign-in already in progress' };
      }
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return { ok: false, error: 'Google Play Services is not available' };
      }
    }
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Google sign-in failed',
    };
  }
}

export async function signOutGoogle(): Promise<void> {
  configureGoogleSignIn();
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore when not signed in with Google
  }
}
