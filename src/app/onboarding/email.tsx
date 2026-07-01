import { GhostButton, PrimaryButton } from '@/components/Button';
import { Field } from '@/components/Field';
import { WatercolorBackground } from '@/components/WatercolorBackground';
import { fonts, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/store/AppContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function EmailSignUpScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signIn } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (name.trim().length === 0) {
      Alert.alert('Wie heißt du?', 'Bitte gib deinen Namen ein.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      Alert.alert('E-Mail prüfen', 'Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }
    signIn({ name: name.trim(), email: email.trim().toLowerCase(), provider: 'email' });
    router.push('/onboarding/personalization');
  };

  return (
    <WatercolorBackground>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <View style={styles.content}>
            <Text style={[styles.headline, { color: theme.colors.text }]}>
              Registriere dich mit deiner E-Mail.
            </Text>
            <Text style={[styles.subline, { color: theme.colors.textSecondary }]}>
              Nur dein Name und deine E-Mail — mehr brauchen wir nicht.
            </Text>
            <Field
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Dein Name"
              autoCapitalize="words"
              autoFocus
            />
            <Field
              label="E-Mail"
              value={email}
              onChangeText={setEmail}
              placeholder="du@beispiel.de"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.footer}>
            <PrimaryButton label="Weiter" onPress={handleContinue} />
            <GhostButton label="Zurück" onPress={() => router.back()} style={styles.back} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </WatercolorBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.l,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headline: {
    fontFamily: fonts.serifMedium,
    fontSize: 32,
    lineHeight: 40,
    marginBottom: spacing.s,
  },
  subline: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: spacing.xl,
  },
  footer: {
    paddingBottom: spacing.l,
  },
  back: {
    marginTop: spacing.s,
  },
});
