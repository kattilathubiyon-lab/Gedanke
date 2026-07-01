import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'fade',
        animationDuration: 350,
      }}
    />
  );
}
