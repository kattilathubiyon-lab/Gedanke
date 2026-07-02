import { thoughtById } from '@/data/affirmations';
import {
  AppState,
  AuthProvider as AuthProviderKind,
  DarkModePreference,
  Favorite,
  initialAppState,
  NotificationFrequency,
  Settings,
  Thought,
  User,
  UserThought,
} from '@/data/types';
import { cancelAllNotifications, syncScheduledNotifications } from '@/services/notifications';
import {
  buildPlan,
  isSameDay,
  newUserThought,
  pickThought,
  settlePlan,
  toUserThought,
} from '@/services/thoughtEngine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState as RNAppState } from 'react-native';

const STORAGE_KEY = 'guter-gedanke/state/v1';

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

interface AppContextValue {
  state: AppState;
  hydrated: boolean;
  /** The latest thought delivered today — the "Heutiger GeDANKE". */
  todaysThought: (UserThought & { thought: Thought }) | null;
  signIn: (params: { name: string; email: string | null; provider: AuthProviderKind }) => void;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateName: (name: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setInterests: (interests: string[]) => void;
  setFrequency: (frequency: NotificationFrequency, customTimes?: string[]) => void;
  setDarkMode: (mode: DarkModePreference) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  completeOnboarding: () => void;
  toggleFavorite: (thoughtId: string) => void;
  isFavorite: (thoughtId: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

/**
 * Settle due deliveries into the archive, extend the plan over the
 * horizon and make sure today has a thought the moment the app opens.
 */
function advance(state: AppState, now: Date): AppState {
  if (!state.onboardingComplete) return state;

  const { due, future } = settlePlan(state.plan, now);
  let delivered = state.delivered;
  if (due.length > 0) {
    delivered = [...delivered, ...due.map(toUserThought)];
  }

  let next: AppState = { ...state, delivered, plan: future };

  const hasToday = delivered.some((d) => isSameDay(new Date(d.deliveredAt), now));
  if (!hasToday) {
    const thought = pickThought(next, now);
    next = { ...next, delivered: [...next.delivered, newUserThought(thought.id, now)] };
  }

  next = { ...next, plan: buildPlan(next, now) };
  return next;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialAppState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from storage once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw) as AppState;
          const merged: AppState = {
            ...initialAppState,
            ...parsed,
            // Deep-merge so newly added settings keep their defaults.
            settings: { ...initialAppState.settings, ...parsed.settings },
          };
          setState(advance(merged, new Date()));
        }
      } catch {
        // Corrupted storage — start fresh rather than crash.
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on every change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  // Keep scheduled notifications in sync with the plan.
  const lastSyncKey = useRef<string>('');
  useEffect(() => {
    if (!hydrated || !state.onboardingComplete) return;
    const key = JSON.stringify([
      state.settings.notificationsEnabled,
      state.settings.soundEnabled,
      state.plan.map((p) => [p.at, p.thoughtId]),
    ]);
    if (key === lastSyncKey.current) return;
    lastSyncKey.current = key;
    syncScheduledNotifications(
      state.plan,
      state.settings.notificationsEnabled,
      state.settings.soundEnabled
    ).then((synced) => {
      setState((s) => (s.plan.length === synced.length ? { ...s, plan: synced } : s));
    });
  }, [
    hydrated,
    state.onboardingComplete,
    state.settings.notificationsEnabled,
    state.settings.soundEnabled,
    state.plan,
  ]);

  // When the app returns to the foreground, settle due deliveries.
  useEffect(() => {
    const sub = RNAppState.addEventListener('change', (status) => {
      if (status === 'active') {
        setState((s) => advance(s, new Date()));
      }
    });
    return () => sub.remove();
  }, []);

  const signIn = useCallback(
    (params: { name: string; email: string | null; provider: AuthProviderKind }) => {
      const user: User = {
        id: uid(),
        name: params.name.trim(),
        email: params.email,
        provider: params.provider,
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({ ...s, user }));
    },
    []
  );

  const signOut = useCallback(async () => {
    await cancelAllNotifications();
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    setState(initialAppState);
  }, []);

  const deleteAccount = useCallback(async () => {
    await cancelAllNotifications();
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    setState(initialAppState);
  }, []);

  const updateName = useCallback((name: string) => {
    setState((s) => (s.user ? { ...s, user: { ...s.user, name: name.trim() } } : s));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => {
      const next: AppState = { ...s, settings: { ...s.settings, ...patch } };
      // Frequency/time/interest changes reshape upcoming deliveries.
      if (
        s.onboardingComplete &&
        (patch.frequency !== undefined || patch.customTimes !== undefined || patch.interests !== undefined)
      ) {
        return { ...next, plan: buildPlan({ ...next, plan: [] }, new Date()) };
      }
      return next;
    });
  }, []);

  const setInterests = useCallback(
    (interests: string[]) => updateSettings({ interests }),
    [updateSettings]
  );

  const setFrequency = useCallback(
    (frequency: NotificationFrequency, customTimes?: string[]) => {
      updateSettings(
        customTimes !== undefined ? { frequency, customTimes } : { frequency }
      );
    },
    [updateSettings]
  );

  const setDarkMode = useCallback(
    (darkMode: DarkModePreference) => updateSettings({ darkMode }),
    [updateSettings]
  );

  const setNotificationsEnabled = useCallback(
    (notificationsEnabled: boolean) => updateSettings({ notificationsEnabled }),
    [updateSettings]
  );

  const completeOnboarding = useCallback(() => {
    setState((s) => advance({ ...s, onboardingComplete: true }, new Date()));
  }, []);

  const toggleFavorite = useCallback((thoughtId: string) => {
    setState((s) => {
      const existing = s.favorites.find((f) => f.thoughtId === thoughtId);
      if (existing) {
        return { ...s, favorites: s.favorites.filter((f) => f.thoughtId !== thoughtId) };
      }
      const fav: Favorite = { id: uid(), thoughtId, createdAt: new Date().toISOString() };
      return { ...s, favorites: [...s.favorites, fav] };
    });
  }, []);

  const isFavorite = useCallback(
    (thoughtId: string) => state.favorites.some((f) => f.thoughtId === thoughtId),
    [state.favorites]
  );

  const findTodaysThought = (): (UserThought & { thought: Thought }) | null => {
    const now = new Date();
    const today = state.delivered
      .filter((d) => isSameDay(new Date(d.deliveredAt), now))
      .sort((a, b) => new Date(b.deliveredAt).getTime() - new Date(a.deliveredAt).getTime());
    for (const d of today) {
      const thought = thoughtById(d.thoughtId);
      if (thought) return { ...d, thought };
    }
    return null;
  };
  const todaysThought = findTodaysThought();

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      hydrated,
      todaysThought,
      signIn,
      signOut,
      deleteAccount,
      updateName,
      updateSettings,
      setInterests,
      setFrequency,
      setDarkMode,
      setNotificationsEnabled,
      completeOnboarding,
      toggleFavorite,
      isFavorite,
    }),
    [
      state,
      hydrated,
      todaysThought,
      signIn,
      signOut,
      deleteAccount,
      updateName,
      updateSettings,
      setInterests,
      setFrequency,
      setDarkMode,
      setNotificationsEnabled,
      completeOnboarding,
      toggleFavorite,
      isFavorite,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
