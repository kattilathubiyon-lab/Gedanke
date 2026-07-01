import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface AuthResult {
  name: string;
  email: string | null;
}

export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Sign in with Apple. Apple only shares name/e-mail on the very first
 * authorization, so both may be empty on later sign-ins — onboarding
 * asks for the name anyway.
 */
export async function signInWithApple(): Promise<AuthResult | null> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    const name = [credential.fullName?.givenName, credential.fullName?.familyName]
      .filter(Boolean)
      .join(' ');
    return { name, email: credential.email ?? null };
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === 'ERR_REQUEST_CANCELED') return null;
    throw e;
  }
}

interface GoogleClientIds {
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
}

/** Google OAuth client ids come from app.json → expo.extra.googleAuth. */
export function googleClientIds(): GoogleClientIds | null {
  const extra = Constants.expoConfig?.extra as { googleAuth?: GoogleClientIds } | undefined;
  const ids = extra?.googleAuth;
  if (!ids || (!ids.iosClientId && !ids.androidClientId && !ids.webClientId)) return null;
  return ids;
}

/** Fetch the signed-in Google user's profile with an OAuth access token. */
export async function fetchGoogleProfile(accessToken: string): Promise<AuthResult> {
  const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Google-Profil konnte nicht geladen werden.');
  const profile = (await res.json()) as { name?: string; email?: string };
  return { name: profile.name ?? '', email: profile.email ?? null };
}
