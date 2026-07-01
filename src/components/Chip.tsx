import { fonts, gentleShadow, radii, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  small?: boolean;
}

export function Chip({ label, selected, onPress, small }: ChipProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync().catch(() => {});
        }
        onPress();
      }}
      style={({ pressed }) => [
        styles.chip,
        small && styles.small,
        gentleShadow,
        {
          backgroundColor: selected ? theme.colors.chipSelected : theme.colors.chipBackground,
          borderColor: selected ? theme.colors.chipSelected : theme.colors.border,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          small && styles.smallLabel,
          { color: selected ? theme.colors.chipTextSelected : theme.colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 11,
    paddingHorizontal: spacing.m + 2,
  },
  small: {
    paddingVertical: 7,
    paddingHorizontal: spacing.m - 2,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
  },
  smallLabel: {
    fontSize: 13,
  },
});
