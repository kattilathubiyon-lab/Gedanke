import { fonts, gentleShadow, radii, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

interface FieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words';
  autoFocus?: boolean;
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = 'sentences',
  autoFocus,
}: FieldProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textFaint}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoFocus={autoFocus}
        style={[
          styles.input,
          gentleShadow,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.m,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    marginBottom: spacing.s,
    marginLeft: spacing.xs,
  },
  input: {
    minHeight: 54,
    borderRadius: radii.m,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.m + 2,
    fontFamily: fonts.sans,
    fontSize: 16,
  },
});
