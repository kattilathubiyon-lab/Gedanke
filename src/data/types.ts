/** Data model — mirrors the product spec (Users, Categories, Thoughts, UserThoughts, Favorites). */

export type AuthProvider = 'apple' | 'google' | 'email';

export interface User {
  id: string;
  name: string;
  email: string | null;
  provider: AuthProvider;
  createdAt: string; // ISO
}

export interface Category {
  id: string;
  title: string;
}

export interface Thought {
  id: string;
  categoryId: string;
  text: string;
}

/** A thought that has been delivered to the user (the archive). */
export interface UserThought {
  id: string;
  thoughtId: string;
  deliveredAt: string; // ISO
}

export interface Favorite {
  id: string;
  thoughtId: string;
  createdAt: string; // ISO
}

/** A future delivery that has been planned & scheduled as a notification. */
export interface PlannedDelivery {
  id: string;
  thoughtId: string;
  at: string; // ISO
  notificationId: string | null;
}

export type NotificationFrequency = '1x' | '2x' | '3x' | 'custom';

export type DarkModePreference = 'system' | 'light' | 'dark';

export interface Settings {
  /** Selected category ids ("interests"). */
  interests: string[];
  frequency: NotificationFrequency;
  /** Custom times as "HH:MM" — only used when frequency === 'custom'. */
  customTimes: string[];
  notificationsEnabled: boolean;
  /** Play the gentle Guter GeDANKE chime with each notification. */
  soundEnabled: boolean;
  darkMode: DarkModePreference;
}

export interface AppState {
  user: User | null;
  onboardingComplete: boolean;
  settings: Settings;
  delivered: UserThought[];
  favorites: Favorite[];
  plan: PlannedDelivery[];
}

export const defaultSettings: Settings = {
  interests: [],
  frequency: '1x',
  customTimes: ['09:00'],
  notificationsEnabled: false,
  soundEnabled: true,
  darkMode: 'system',
};

export const initialAppState: AppState = {
  user: null,
  onboardingComplete: false,
  settings: defaultSettings,
  delivered: [],
  favorites: [],
  plan: [],
};
