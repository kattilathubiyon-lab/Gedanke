import { useApp } from '@/store/AppContext';
import { Redirect } from 'expo-router';
import React from 'react';

/** Entry point: route to onboarding or the main app. */
export default function Index() {
  const { state, hydrated } = useApp();

  if (!hydrated) return null;

  if (!state.user) return <Redirect href="/onboarding/welcome" />;
  if (!state.onboardingComplete) return <Redirect href="/onboarding/personalization" />;
  return <Redirect href="/(tabs)/home" />;
}
