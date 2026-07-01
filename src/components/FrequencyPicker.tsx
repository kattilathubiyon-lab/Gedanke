import { TimeField } from '@/components/TimeField';
import { fonts, gentleShadow, radii, spacing } from '@/constants/theme';
import { NotificationFrequency } from '@/data/types';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const OPTIONS: { key: NotificationFrequency; label: string; hint: string }[] = [
  { key: '1x', label: '1x täglich', hint: 'Ein Gedanke am Morgen' },
  { key: '2x', label: '2x täglich', hint: 'Morgens und abends' },
  { key: '3x', label: '3x täglich', hint: 'Morgens, mittags und abends' },
  { key: 'custom', label: 'Individuell', hint: 'Wähle deine eigenen Zeiten' },
];

interface FrequencyPickerProps {
  frequency: NotificationFrequency;
  times: string[];
  onChangeFrequency: (f: NotificationFrequency) => void;
  onChangeTimes: (times: string[]) => void;
}

export function FrequencyPicker({
  frequency,
  times,
  onChangeFrequency,
  onChangeTimes,
}: FrequencyPickerProps) {
  const theme = useTheme();
  return (
    <View>
      {OPTIONS.map((option) => {
        const selected = frequency === option.key;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChangeFrequency(option.key)}
            style={({ pressed }) => [
              styles.option,
              gentleShadow,
              {
                backgroundColor: theme.colors.card,
                borderColor: selected ? theme.colors.primary : theme.colors.border,
                borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={styles.optionText}>
              <Text style={[styles.optionLabel, { color: theme.colors.text }]}>{option.label}</Text>
              <Text style={[styles.optionHint, { color: theme.colors.textFaint }]}>
                {option.hint}
              </Text>
            </View>
            <Ionicons
              name={selected ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={selected ? theme.colors.primary : theme.colors.textFaint}
            />
          </Pressable>
        );
      })}

      {frequency === 'custom' ? (
        <View style={styles.customTimes}>
          <Text style={[styles.customLabel, { color: theme.colors.textSecondary }]}>
            Deine Zeiten
          </Text>
          {times.map((t, i) => (
            <TimeField
              key={`${i}-${t}`}
              value={t}
              onChange={(v) => onChangeTimes(times.map((x, j) => (j === i ? v : x)))}
              onRemove={
                times.length > 1 ? () => onChangeTimes(times.filter((_, j) => j !== i)) : undefined
              }
            />
          ))}
          {times.length < 6 ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => onChangeTimes([...times, '12:00'])}
              style={({ pressed }) => [styles.addTime, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Ionicons name="add-circle-outline" size={19} color={theme.colors.primary} />
              <Text style={[styles.addTimeLabel, { color: theme.colors.primary }]}>
                Zeit hinzufügen
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.m,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m + 2,
    marginBottom: spacing.s + 4,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
  },
  optionHint: {
    fontFamily: fonts.sans,
    fontSize: 13,
    marginTop: 1,
  },
  customTimes: {
    marginTop: spacing.s,
  },
  customLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    marginBottom: spacing.s,
    marginLeft: spacing.xs,
  },
  addTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s - 2,
    paddingVertical: spacing.s,
  },
  addTimeLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
  },
});
