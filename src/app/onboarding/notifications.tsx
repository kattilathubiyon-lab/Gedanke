import { PrimaryButton } from '@/components/Button';
import { FrequencyPicker } from '@/components/FrequencyPicker';
import { WatercolorBackground } from '@/components/WatercolorBackground';
import { fonts, spacing } from '@/constants/theme';
import { NotificationFrequency } from '@/data/types';
import { useTheme } from '@/hooks/useTheme';
import { defaultTimesFor } from '@/services/thoughtEngine';
import { useApp } from '@/store/AppContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationPreferencesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { state, setFrequency } = useApp();
  const [frequency, setLocalFrequency] = useState<NotificationFrequency>(state.settings.frequency);
  const [times, setTimes] = useState<string[]>(
    state.settings.customTimes.length > 0 ? state.settings.customTimes : ['09:00']
  );

  const handleContinue = () => {
    setFrequency(frequency, frequency === 'custom' ? times : undefined);
    router.push('/onboarding/permission');
  };

  return (
    <WatercolorBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.headline, { color: theme.colors.text }]}>
            Wann möchtest du deine Gedanken erhalten?
          </Text>
          <Text style={[styles.subline, { color: theme.colors.textSecondary }]}>
            Du kannst das später jederzeit ändern.
          </Text>
          <FrequencyPicker
            frequency={frequency}
            times={times}
            onChangeFrequency={setLocalFrequency}
            onChangeTimes={setTimes}
          />
          <Text style={[styles.preview, { color: theme.colors.textFaint }]}>
            Gedanken um {defaultTimesFor(frequency, times).join(', ')} Uhr
          </Text>
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton label="Weiter" onPress={handleContinue} />
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
  scroll: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.l,
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
    marginBottom: spacing.xl,
  },
  preview: {
    fontFamily: fonts.sans,
    fontSize: 13,
    marginTop: spacing.s,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: spacing.l,
  },
});
