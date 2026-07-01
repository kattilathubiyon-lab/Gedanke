import { fonts, palette } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

/**
 * The brand wordmark. DANKE is always visually highlighted —
 * set in soft gold with a firmer weight.
 */
export function Wordmark({ size = 32, style }: { size?: number; style?: TextStyle }) {
  const theme = useTheme();
  return (
    <Text
      style={[styles.base, { fontSize: size, color: theme.colors.text }, style]}
      accessibilityRole="header"
    >
      Guter Ge
      <Text style={[styles.danke, { fontSize: size }]}>DANKE</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: fonts.serifMedium,
    letterSpacing: 0.4,
  },
  danke: {
    fontFamily: fonts.serif,
    color: palette.gold,
    letterSpacing: 1.2,
  },
});
