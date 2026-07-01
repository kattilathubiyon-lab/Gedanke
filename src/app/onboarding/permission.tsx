import { GhostButton, PrimaryButton } from '@/components/Button';
import { WatercolorBackground } from '@/components/WatercolorBackground';
import { fonts, palette, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { requestNotificationPermission } from '@/services/notifications';
import { useApp } from '@/store/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationPermissionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { setNotificationsEnabled, completeOnboarding } = useApp();
  const [busy, setBusy] = useState(false);

  const finish = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    completeOnboarding();
    router.replace('/(tabs)/home');
  };

  const handleEnable = async () => {
    setBusy(true);
    try {
      const granted = await requestNotificationPermission();
      finish(granted);
    } finally {
      setBusy(false);
    }
  };

  return (
    <WatercolorBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="notifications-outline" size={40} color={palette.sageDeep} />
          </View>
          <Text style={[styles.headline, { color: theme.colors.text }]}>
            Deine Gedanken kommen direkt zu dir.
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Aktiviere Benachrichtigungen, damit wir dir kleine positive Impulse senden können.
          </Text>
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            label="Benachrichtigungen aktivieren"
            onPress={handleEnable}
            loading={busy}
          />
          <GhostButton label="Vielleicht später" onPress={() => finish(false)} style={styles.later} />
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#5B5546',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  headline: {
    fontFamily: fonts.serifMedium,
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  text: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    paddingBottom: spacing.l,
  },
  later: {
    marginTop: spacing.s,
  },
});
