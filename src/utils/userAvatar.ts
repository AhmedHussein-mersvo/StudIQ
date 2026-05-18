import type { ImageSourcePropType } from 'react-native';
import type { AuthUser } from '../stores/authStore';

const defaultAvatar = require('../assets/profile.png');

export function getUserAvatarSource(
  user: AuthUser | null | undefined,
): ImageSourcePropType {
  if (user?.provider === 'google' && user.photoUrl) {
    return { uri: user.photoUrl };
  }
  return defaultAvatar;
}
