import { Chip } from '@/components/Chip';
import { ThoughtCard } from '@/components/ThoughtCard';
import { WatercolorBackground } from '@/components/WatercolorBackground';
import { fonts, gentleShadow, radii, spacing } from '@/constants/theme';
import { categories, thoughtById } from '@/data/affirmations';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/store/AppContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GedankenScreen() {
  const theme = useTheme();
  const { state } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const entries = state.delivered
    .flatMap((delivered) => {
      const thought = thoughtById(delivered.thoughtId);
      return thought ? [{ delivered, thought }] : [];
    })
    .filter((e) => (category ? e.thought.categoryId === category : true))
    .filter((e) => (q ? e.thought.text.toLowerCase().includes(q) : true))
    .sort(
      (a, b) =>
        new Date(b.delivered.deliveredAt).getTime() - new Date(a.delivered.deliveredAt).getTime()
    );

  return (
    <WatercolorBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Gedanken</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textFaint }]}>
          Alles, was dich bisher erreicht hat.
        </Text>

        <View
          style={[
            styles.search,
            gentleShadow,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={theme.colors.textFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Suchen …"
            placeholderTextColor={theme.colors.textFaint}
            style={[styles.searchInput, { color: theme.colors.text }]}
          />
        </View>

        <View style={styles.filterWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            <Chip label="Alle" small selected={category === null} onPress={() => setCategory(null)} />
            {categories.map((c) => (
              <Chip
                key={c.id}
                label={c.title}
                small
                selected={category === c.id}
                onPress={() => setCategory(category === c.id ? null : c.id)}
              />
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={entries}
          keyExtractor={(e) => e.delivered.id}
          renderItem={({ item }) => (
            <ThoughtCard thought={item.thought} dateIso={item.delivered.deliveredAt} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: theme.colors.textFaint }]}>
              {query || category
                ? 'Kein Gedanke passt zu deiner Suche.'
                : 'Deine Gedanken erscheinen hier, sobald sie dich erreichen.'}
            </Text>
          }
        />
      </SafeAreaView>
    </WatercolorBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.l,
  },
  title: {
    fontFamily: fonts.serifMedium,
    fontSize: 34,
    marginTop: spacing.l,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    marginTop: 2,
    marginBottom: spacing.m,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    borderRadius: radii.m,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.m,
    minHeight: 48,
    marginBottom: spacing.m,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    paddingVertical: 10,
  },
  filterWrap: {
    marginBottom: spacing.m,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.s,
    paddingRight: spacing.l,
  },
  list: {
    paddingBottom: 120,
  },
  empty: {
    fontFamily: fonts.serifItalic,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
