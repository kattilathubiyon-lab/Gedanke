import { shareThought } from '@/components/ThoughtCard';
import { WatercolorBackground } from '@/components/WatercolorBackground';
import { fonts, radii, softShadow, spacing } from '@/constants/theme';
import { categoryTitle } from '@/data/affirmations';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/store/AppContext';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function greetingFor(hour: number): string {
  if (hour < 11) return 'Guten Morgen';
  if (hour < 18) return 'Guten Tag';
  return 'Guten Abend';
}

function ActionButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [styles.action, { opacity: pressed ? 0.6 : 1 }]}
    >
      <View
        style={[
          styles.actionCircle,
          {
            backgroundColor: active ? theme.colors.primary : theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={active ? theme.colors.onPrimary : theme.colors.textSecondary}
        />
      </View>
      <Text style={[styles.actionLabel, { color: theme.colors.textFaint }]}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const { state, todaysThought, isFavorite, toggleFavorite } = useApp();
  const [copied, setCopied] = useState(false);

  const [fade] = useState(() => new Animated.Value(0));
  const [rise] = useState(() => new Animated.Value(16));
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  const now = new Date();
  const dateLine = now.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const thought = todaysThought?.thought ?? null;
  const favorite = thought ? isFavorite(thought.id) : false;

  const handleCopy = async () => {
    if (!thought) return;
    try {
      await Clipboard.setStringAsync(`„${thought.text}“ — Guter GeDANKE`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — quietly ignore.
    }
  };

  return (
    <WatercolorBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            {greetingFor(now.getHours())},{'\n'}
            {state.user?.name ?? 'du'}
          </Text>
          <Text style={[styles.date, { color: theme.colors.textFaint }]}>{dateLine}</Text>

          <Animated.View
            style={[
              styles.card,
              softShadow,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                opacity: fade,
                transform: [{ translateY: rise }],
              },
            ]}
          >
            <Text style={[styles.eyebrow, { color: theme.colors.textFaint }]}>
              Heutiger Ge
              <Text style={{ color: theme.colors.accent }}>DANKE</Text>
            </Text>
            {thought ? (
              <>
                <Text style={[styles.thought, { color: theme.colors.text }]}>{thought.text}</Text>
                <Text style={[styles.category, { color: theme.colors.textFaint }]}>
                  {categoryTitle(thought.categoryId)}
                </Text>
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.actions}>
                  <ActionButton
                    icon={favorite ? 'heart' : 'heart-outline'}
                    label={favorite ? 'Gemerkt' : 'Gefällt mir'}
                    active={favorite}
                    onPress={() => toggleFavorite(thought.id)}
                  />
                  <ActionButton
                    icon={copied ? 'checkmark' : 'download-outline'}
                    label={copied ? 'Kopiert' : 'Speichern'}
                    onPress={handleCopy}
                  />
                  <ActionButton
                    icon="share-outline"
                    label="Teilen"
                    onPress={() => shareThought(thought)}
                  />
                </View>
              </>
            ) : (
              <Text style={[styles.thought, { color: theme.colors.textSecondary }]}>
                Dein erster Gedanke ist unterwegs …
              </Text>
            )}
          </Animated.View>

          <Text style={[styles.hint, { color: theme.colors.textFaint }]}>
            Nimm dir einen Moment. Lies den Gedanken langsam.{'\n'}Vielleicht sogar zweimal.
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
    paddingTop: spacing.xl,
    paddingBottom: 120,
  },
  greeting: {
    fontFamily: fonts.serifMedium,
    fontSize: 38,
    lineHeight: 46,
  },
  date: {
    fontFamily: fonts.sans,
    fontSize: 14,
    marginTop: spacing.s,
    marginBottom: spacing.xl,
  },
  card: {
    borderRadius: radii.l + 4,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.l,
  },
  eyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    letterSpacing: 1.6,
    marginBottom: spacing.m,
  },
  thought: {
    fontFamily: fonts.serifMedium,
    fontSize: 30,
    lineHeight: 40,
  },
  category: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    marginTop: spacing.m,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.l,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  action: {
    alignItems: 'center',
    gap: 6,
  },
  actionCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
  },
  hint: {
    fontFamily: fonts.serifItalic,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
