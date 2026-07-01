import { fonts, gentleShadow, radii, softShadow, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

function gentleTap() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
}

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, disabled, loading, style }: ButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={() => {
        gentleTap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        softShadow,
        {
          backgroundColor: theme.colors.primary,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.onPrimary} />
      ) : (
        <Text style={[styles.label, { color: theme.colors.onPrimary }]}>{label}</Text>
      )}
    </Pressable>
  );
}

export function GhostButton({ label, onPress, disabled, style }: ButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        gentleTap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: 'transparent',
          opacity: disabled ? 0.5 : pressed ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.ghostLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

interface AuthButtonProps extends ButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
}

export function AuthButton({ label, icon, onPress, disabled, loading, style }: AuthButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={() => {
        gentleTap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        styles.auth,
        gentleShadow,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.text} />
      ) : (
        <>
          <Ionicons name={icon} size={19} color={theme.colors.text} style={styles.authIcon} />
          <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
  },
  auth: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
  },
  authIcon: {
    marginRight: spacing.s + 2,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  ghostLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
  },
});
