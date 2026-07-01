import { fonts, gentleShadow, radii, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

function toDate(hhmm: string): Date {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10) || 0);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function toHHMM(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface TimeFieldProps {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  onRemove?: () => void;
}

/**
 * One notification time. Uses the native time picker on iOS/Android
 * and a plain HH:MM input on web.
 */
export function TimeField({ value, onChange, onRemove }: TimeFieldProps) {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [draft, setDraft] = useState(value);

  const commitDraft = () => {
    const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(draft.trim());
    if (match) {
      onChange(`${match[1].padStart(2, '0')}:${match[2]}`);
    } else {
      setDraft(value);
    }
  };

  return (
    <View
      style={[
        styles.row,
        gentleShadow,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <Ionicons name="time-outline" size={18} color={theme.colors.textFaint} />
      {Platform.OS === 'web' ? (
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onBlur={commitDraft}
          placeholder="09:00"
          placeholderTextColor={theme.colors.textFaint}
          style={[styles.timeText, { color: theme.colors.text }]}
        />
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowPicker(true)}
          style={styles.timePressable}
        >
          <Text style={[styles.timeText, { color: theme.colors.text }]}>{value} Uhr</Text>
        </Pressable>
      )}
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zeit entfernen"
          hitSlop={8}
          onPress={onRemove}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Ionicons name="close-circle-outline" size={20} color={theme.colors.textFaint} />
        </Pressable>
      ) : null}
      {showPicker && Platform.OS !== 'web' ? (
        <DateTimePicker
          value={toDate(value)}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowPicker(Platform.OS === 'ios');
            if (event.type !== 'dismissed' && date) {
              onChange(toHHMM(date));
            }
            if (Platform.OS === 'ios') setShowPicker(false);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s + 2,
    borderRadius: radii.m,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.m - 4,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.s + 2,
  },
  timePressable: {
    flex: 1,
  },
  timeText: {
    flex: 1,
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    paddingVertical: 0,
  },
});
