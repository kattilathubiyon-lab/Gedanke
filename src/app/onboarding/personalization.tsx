import { PrimaryButton } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Field } from '@/components/Field';
import { WatercolorBackground } from '@/components/WatercolorBackground';
import { fonts, spacing } from '@/constants/theme';
import { categories } from '@/data/affirmations';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/store/AppContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PersonalizationScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { state, updateName, setInterests } = useApp();
  const [name, setName] = useState(state.user?.name ?? '');
  const [selected, setSelected] = useState<string[]>(state.settings.interests);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleContinue = () => {
    if (name.trim().length === 0) {
      Alert.alert('Wie dürfen wir dich nennen?', 'Bitte gib deinen Namen ein.');
      return;
    }
    if (selected.length === 0) {
      Alert.alert('Deine Themen', 'Wähle mindestens ein Thema, das dir wichtig ist.');
      return;
    }
    updateName(name);
    setInterests(selected);
    router.push('/onboarding/notifications');
  };

  return (
    <WatercolorBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.headline, { color: theme.colors.text }]}>
            Schön, dass du da bist.
          </Text>

          <Text style={[styles.question, { color: theme.colors.textSecondary }]}>
            Wie dürfen wir dich nennen?
          </Text>
          <Field value={name} onChangeText={setName} placeholder="Dein Name" autoCapitalize="words" />

          <Text style={[styles.question, styles.topicsQuestion, { color: theme.colors.textSecondary }]}>
            Welche Themen sind dir wichtig?
          </Text>
          <View style={styles.chips}>
            {categories.map((c) => (
              <Chip
                key={c.id}
                label={c.title}
                selected={selected.includes(c.id)}
                onPress={() => toggle(c.id)}
              />
            ))}
          </View>
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
    fontSize: 34,
    lineHeight: 42,
    marginBottom: spacing.xl,
  },
  question: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    marginBottom: spacing.m,
  },
  topicsQuestion: {
    marginTop: spacing.l,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s + 2,
  },
  footer: {
    paddingBottom: spacing.l,
  },
});
