import { AuthButton } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { WatercolorBackground } from '@/components/WatercolorBackground';
import { fonts, palette, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import {
  fetchGoogleProfile,
  googleClientIds,
  isAppleSignInAvailable,
  signInWithApple,
} from '@/services/auth';
import { useApp } from '@/store/AppContext';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signIn } = useApp();
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [busy, setBusy] = useState<'apple' | null>(null);

  const googleIds = googleClientIds();
  // A placeholder keeps the hook happy when Google auth is not configured;
  // the button guards against actually prompting in that case.
  const placeholderClientId = 'not-configured.apps.googleusercontent.com';
  const [request, response, promptGoogle] = Google.useAuthRequest({
    iosClientId: googleIds?.iosClientId || undefined,
    androidClientId: googleIds?.androidClientId || undefined,
    webClientId: googleIds?.webClientId || placeholderClientId,
    clientId: googleIds?.webClientId || placeholderClientId,
  });

  useEffect(() => {
    isAppleSignInAvailable().then(setAppleAvailable);
  }, []);

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      fetchGoogleProfile(response.authentication.accessToken)
        .then((profile) => {
          signIn({ name: profile.name, email: profile.email, provider: 'google' });
          router.push('/onboarding/personalization');
        })
        .catch(() => {
          Alert.alert('Anmeldung fehlgeschlagen', 'Bitte versuche es noch einmal.');
        });
    }
  }, [response, router, signIn]);

  const handleApple = async () => {
    if (!appleAvailable) {
      Alert.alert(
        'Nicht verfügbar',
        Platform.OS === 'ios'
          ? 'Mit Apple anmelden ist auf diesem Gerät nicht verfügbar.'
          : 'Mit Apple anmelden ist nur auf dem iPhone verfügbar. Nutze gern die Anmeldung per E-Mail.'
      );
      return;
    }
    try {
      setBusy('apple');
      const result = await signInWithApple();
      if (result) {
        signIn({ name: result.name, email: result.email, provider: 'apple' });
        router.push('/onboarding/personalization');
      }
    } catch {
      Alert.alert('Anmeldung fehlgeschlagen', 'Bitte versuche es noch einmal.');
    } finally {
      setBusy(null);
    }
  };

  const handleGoogle = () => {
    if (!googleIds || !request) {
      Alert.alert(
        'Noch nicht eingerichtet',
        'Die Google-Anmeldung ist in dieser Version noch nicht konfiguriert. Nutze gern die Anmeldung per E-Mail.'
      );
      return;
    }
    promptGoogle();
  };

  return (
    <WatercolorBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.hero}>
          <Logo size={120} />
          <Text style={[styles.headline, { color: theme.colors.text }]}>
            Willkommen bei{'\n'}Guter Ge<Text style={styles.danke}>DANKE</Text>
          </Text>
          <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
            Jeden Tag eine kleine Affirmation für mehr Selbstliebe, Motivation und innere Ruhe.
          </Text>
        </View>
        <View style={styles.buttons}>
          <AuthButton
            icon="logo-apple"
            label="Mit Apple fortfahren"
            onPress={handleApple}
            loading={busy === 'apple'}
            style={styles.button}
          />
          <AuthButton
            icon="logo-google"
            label="Mit Google fortfahren"
            onPress={handleGoogle}
            style={styles.button}
          />
          <AuthButton
            icon="mail-outline"
            label="Mit E-Mail fortfahren"
            onPress={() => router.push('/onboarding/email')}
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    </WatercolorBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.l,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.l,
  },
  headline: {
    fontFamily: fonts.serifMedium,
    fontSize: 36,
    lineHeight: 44,
    textAlign: 'center',
  },
  danke: {
    fontFamily: fonts.serif,
    color: palette.gold,
    letterSpacing: 1.2,
  },
  tagline: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    maxWidth: 300,
  },
  buttons: {
    paddingBottom: spacing.l,
  },
  button: {
    marginBottom: spacing.m - 4,
  },
});
