import { fonts, radii, softShadow, spacing } from '@/constants/theme';
import { categoryTitle } from '@/data/affirmations';
import { Thought } from '@/data/types';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/store/AppContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native';

export function formatGermanDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
}

export async function shareThought(thought: Thought) {
  try {
    await Share.share({
      message: `„${thought.text}“\n\n— Guter GeDANKE`,
    });
  } catch {
    // Sharing dismissed or unavailable — nothing to do.
  }
}

interface ThoughtCardProps {
  thought: Thought;
  dateIso?: string;
}

/** Archive / favorites card: date, category, thought, gentle actions. */
export function ThoughtCard({ thought, dateIso }: ThoughtCardProps) {
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useApp();
  const favorite = isFavorite(thought.id);

  return (
    <View
      style={[
        styles.card,
        softShadow,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          {dateIso ? (
            <Text style={[styles.date, { color: theme.colors.textFaint }]}>
              {formatGermanDate(dateIso)}
            </Text>
          ) : null}
          <Text style={[styles.category, { color: theme.colors.accent }]}>
            {categoryTitle(thought.categoryId)}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={favorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
            hitSlop={8}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
              toggleFavorite(thought.id);
            }}
            style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={20}
              color={favorite ? theme.colors.danger : theme.colors.textFaint}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Teilen"
            hitSlop={8}
            onPress={() => shareThought(thought)}
            style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="share-outline" size={19} color={theme.colors.textFaint} />
          </Pressable>
        </View>
      </View>
      <Text style={[styles.text, { color: theme.colors.text }]}>{thought.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.l,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.l - 4,
    paddingHorizontal: spacing.l - 2,
    marginBottom: spacing.m,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.s + 2,
  },
  metaLeft: {
    flexShrink: 1,
  },
  date: {
    fontFamily: fonts.sans,
    fontSize: 13,
    marginBottom: 2,
  },
  category: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.m - 2,
  },
  iconButton: {
    padding: 2,
  },
  text: {
    fontFamily: fonts.serifMedium,
    fontSize: 22,
    lineHeight: 30,
  },
});
