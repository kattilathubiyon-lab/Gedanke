import { Chip } from '@/components/Chip';
import { Field } from '@/components/Field';
import { FrequencyPicker } from '@/components/FrequencyPicker';
import { WatercolorBackground } from '@/components/WatercolorBackground';
import { fonts, gentleShadow, radii, spacing } from '@/constants/theme';
import { categories } from '@/data/affirmations';
import { DarkModePreference } from '@/data/types';
import { useTheme } from '@/hooks/useTheme';
import { requestNotificationPermission } from '@/services/notifications';
import { useApp } from '@/store/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DARK_MODES: { key: DarkModePreference; label: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Hell' },
  { key: 'dark', label: 'Dunkel' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textFaint }]}>{title}</Text>
      {children}
    </View>
  );
}

export default function EinstellungenScreen() {
  const theme = useTheme();
  const router = useRouter();
  const {
    state,
    updateName,
    setInterests,
    setFrequency,
    setDarkMode,
    setNotificationsEnabled,
    signOut,
    deleteAccount,
  } = useApp();

  const [name, setName] = useState(state.user?.name ?? '');

  const commitName = () => {
    if (name.trim().length > 0 && name.trim() !== state.user?.name) {
      updateName(name);
    } else {
      setName(state.user?.name ?? '');
    }
  };

  const toggleInterest = (id: string) => {
    const current = state.settings.interests;
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    if (next.length === 0) {
      Alert.alert('Deine Themen', 'Mindestens ein Thema sollte ausgewählt bleiben.');
      return;
    }
    setInterests(next);
  };

  const handleNotificationsToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted && Platform.OS !== 'web') {
        Alert.alert(
          'Benachrichtigungen deaktiviert',
          'Bitte erlaube Benachrichtigungen in den Systemeinstellungen, damit deine Gedanken dich erreichen können.'
        );
      }
      setNotificationsEnabled(granted);
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Abmelden', 'Möchtest du dich wirklich abmelden?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Abmelden',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/onboarding/welcome');
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      'Konto löschen',
      'Alle deine Daten — Gedanken, Favoriten und Einstellungen — werden dauerhaft gelöscht.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Endgültig löschen',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  return (
    <WatercolorBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>Einstellungen</Text>

          <Section title="Profil">
            <Field
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Dein Name"
              autoCapitalize="words"
            />
            {name.trim() !== (state.user?.name ?? '') && name.trim().length > 0 ? (
              <Pressable
                accessibilityRole="button"
                onPress={commitName}
                style={({ pressed }) => [styles.saveName, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                <Text style={[styles.saveNameLabel, { color: theme.colors.primary }]}>
                  Namen speichern
                </Text>
              </Pressable>
            ) : null}
            {state.user?.email ? (
              <View
                style={[
                  styles.infoRow,
                  gentleShadow,
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                ]}
              >
                <Ionicons name="mail-outline" size={17} color={theme.colors.textFaint} />
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  {state.user.email}
                </Text>
              </View>
            ) : null}
          </Section>

          <Section title="Deine Themen">
            <View style={styles.chips}>
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  label={c.title}
                  small
                  selected={state.settings.interests.includes(c.id)}
                  onPress={() => toggleInterest(c.id)}
                />
              ))}
            </View>
          </Section>

          <Section title="Benachrichtigungen">
            <View
              style={[
                styles.switchRow,
                gentleShadow,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
              ]}
            >
              <View style={styles.switchText}>
                <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                  Gedanken erhalten
                </Text>
                <Text style={[styles.switchHint, { color: theme.colors.textFaint }]}>
                  Kleine positive Impulse über den Tag
                </Text>
              </View>
              <Switch
                value={state.settings.notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <FrequencyPicker
              frequency={state.settings.frequency}
              times={state.settings.customTimes}
              onChangeFrequency={(f) => setFrequency(f)}
              onChangeTimes={(times) => setFrequency('custom', times)}
            />
          </Section>

          <Section title="Darstellung">
            <View
              style={[
                styles.segments,
                gentleShadow,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
              ]}
            >
              {DARK_MODES.map((mode) => {
                const selected = state.settings.darkMode === mode.key;
                return (
                  <Pressable
                    key={mode.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setDarkMode(mode.key)}
                    style={[
                      styles.segment,
                      selected && { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentLabel,
                        {
                          color: selected ? theme.colors.onPrimary : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {mode.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Section>

          <Section title="Konto">
            <Pressable
              accessibilityRole="button"
              onPress={handleSignOut}
              style={({ pressed }) => [
                styles.accountRow,
                gentleShadow,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="log-out-outline" size={19} color={theme.colors.textSecondary} />
              <Text style={[styles.accountLabel, { color: theme.colors.text }]}>Abmelden</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.accountRow,
                gentleShadow,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
              <Text style={[styles.accountLabel, { color: theme.colors.danger }]}>
                Konto löschen
              </Text>
            </Pressable>
          </Section>

          <Text style={[styles.footerNote, { color: theme.colors.textFaint }]}>
            Guter GeDANKE · Jeden Tag eine kleine Affirmation.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </WatercolorBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.l,
    paddingBottom: 120,
  },
  title: {
    fontFamily: fonts.serifMedium,
    fontSize: 34,
    marginTop: spacing.l,
    marginBottom: spacing.l,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: spacing.m,
    marginLeft: spacing.xs,
  },
  saveName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -spacing.s,
    marginBottom: spacing.m,
    marginLeft: spacing.xs,
  },
  saveNameLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s + 2,
    borderRadius: radii.m,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.m - 2,
    paddingHorizontal: spacing.m,
  },
  infoText: {
    fontFamily: fonts.sans,
    fontSize: 15,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.m,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.m - 2,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.m,
  },
  switchText: {
    flex: 1,
  },
  switchLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
  },
  switchHint: {
    fontFamily: fonts.sans,
    fontSize: 13,
    marginTop: 1,
  },
  segments: {
    flexDirection: 'row',
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 4,
  },
  segment: {
    flex: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.s + 2,
    alignItems: 'center',
  },
  segmentLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s + 2,
    borderRadius: radii.m,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.s + 2,
  },
  accountLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
  },
  footerNote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.m,
  },
});
