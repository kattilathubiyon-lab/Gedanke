import { ThoughtCard } from '@/components/ThoughtCard';
import { WatercolorBackground } from '@/components/WatercolorBackground';
import { fonts, spacing } from '@/constants/theme';
import { thoughtById } from '@/data/affirmations';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/store/AppContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritenScreen() {
  const theme = useTheme();
  const { state } = useApp();

  const favorites = state.favorites
    .flatMap((favorite) => {
      const thought = thoughtById(favorite.thoughtId);
      return thought ? [{ favorite, thought }] : [];
    })
    .sort(
      (a, b) => new Date(b.favorite.createdAt).getTime() - new Date(a.favorite.createdAt).getTime()
    );

  return (
    <WatercolorBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Favoriten</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textFaint }]}>
          Gedanken, die dir besonders gutgetan haben.
        </Text>
        <FlatList
          data={favorites}
          keyExtractor={(e) => e.favorite.id}
          renderItem={({ item }) => (
            <ThoughtCard thought={item.thought} dateIso={item.favorite.createdAt} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="heart-outline" size={40} color={theme.colors.textFaint} />
              <Text style={[styles.emptyText, { color: theme.colors.textFaint }]}>
                Tippe auf das Herz bei einem Gedanken,{'\n'}um ihn hier zu behalten.
              </Text>
            </View>
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
    marginBottom: spacing.l,
  },
  list: {
    paddingBottom: 120,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.m,
    marginTop: spacing.xxl,
  },
  emptyText: {
    fontFamily: fonts.serifItalic,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
  },
});
