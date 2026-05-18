import { create } from 'zustand';
import {
  deleteFromStorage,
  getStringFromStorage,
  saveDataToStorage,
} from '../utils/storage';

const USERS_KEY = 'studiq_users_v1';
const SESSION_KEY = 'studiq_session_v1';

export type AuthProvider = 'email' | 'google';

export type AuthUser = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  provider: AuthProvider;
  photoUrl?: string;
};

type StoredEmailUser = AuthUser & {
  password: string;
  provider: 'email';
};

type UsersRegistry = Record<string, StoredEmailUser | AuthUser>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readUsers(): UsersRegistry {
  const raw = getStringFromStorage(USERS_KEY);
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as UsersRegistry;
  } catch {
    return {};
  }
}

function writeUsers(users: UsersRegistry): void {
  saveDataToStorage(USERS_KEY, JSON.stringify(users));
}

function readSessionUser(): AuthUser | null {
  const raw = getStringFromStorage(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function writeSessionUser(user: AuthUser | null): void {
  if (!user) {
    deleteFromStorage(SESSION_KEY);
    return;
  }
  saveDataToStorage(SESSION_KEY, JSON.stringify(user));
}

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
};

export type GoogleProfileInput = {
  email: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  registerWithEmail: (input: RegisterInput) => { ok: true } | { ok: false; error: string };
  loginWithEmail: (
    email: string,
    password: string,
  ) => { ok: true } | { ok: false; error: string };
  loginWithGoogle: (
    profile: GoogleProfileInput,
  ) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const initialUser = readSessionUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: initialUser !== null,

  registerWithEmail: input => {
    const email = normalizeEmail(input.email);
    const users = readUsers();

    if (users[email]) {
      return { ok: false, error: 'An account with this email already exists' };
    }

    const user: StoredEmailUser = {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email,
      country: input.country.trim(),
      password: input.password,
      provider: 'email',
    };

    users[email] = user;
    writeUsers(users);

    const session: AuthUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: user.country,
      provider: 'email',
    };
    writeSessionUser(session);
    set({ user: session, isAuthenticated: true });

    return { ok: true };
  },

  loginWithEmail: (email, password) => {
    const normalized = normalizeEmail(email);
    const users = readUsers();
    const record = users[normalized];

    if (!record || record.provider !== 'email') {
      return { ok: false, error: 'No account found with this email' };
    }

    const stored = record as StoredEmailUser;
    if (stored.password !== password) {
      return { ok: false, error: 'Incorrect password' };
    }

    const session: AuthUser = {
      firstName: stored.firstName,
      lastName: stored.lastName,
      email: stored.email,
      country: stored.country,
      provider: 'email',
    };
    writeSessionUser(session);
    set({ user: session, isAuthenticated: true });

    return { ok: true };
  },

  loginWithGoogle: profile => {
    const email = normalizeEmail(profile.email);
    if (!email) {
      return { ok: false, error: 'Google account did not return an email' };
    }

    const users = readUsers();
    const photoUrl = profile.photoUrl?.trim() || undefined;
    const session: AuthUser = {
      firstName: profile.firstName.trim() || 'Google',
      lastName: profile.lastName.trim() || 'User',
      email,
      country: users[email]?.country ?? '',
      provider: 'google',
      ...(photoUrl ? { photoUrl } : {}),
    };

    users[email] = session;
    writeUsers(users);
    writeSessionUser(session);
    set({ user: session, isAuthenticated: true });

    return { ok: true };
  },

  logout: () => {
    writeSessionUser(null);
    set({ user: null, isAuthenticated: false });
  },
}));

export function syncAuthStoreFromStorage(): void {
  const user = readSessionUser();
  useAuthStore.setState({
    user,
    isAuthenticated: user !== null,
  });
}

export function clearAuthSession(): void {
  writeSessionUser(null);
  useAuthStore.setState({ user: null, isAuthenticated: false });
}
