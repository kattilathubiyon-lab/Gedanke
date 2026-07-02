import { thoughtById } from '@/data/affirmations';
import { PlannedDelivery } from '@/data/types';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

/** Filename of the gentle chime bundled via the expo-notifications plugin. */
const SOUND_FILE = 'gedanke.wav';

/**
 * Android notification channels are immutable once created, so the
 * sound preference maps to two separate channels.
 */
const CHANNEL_SOUND = 'gedanken-sanft';
const CHANNEL_SILENT = 'gedanken-still';

export function configureNotificationHandling() {
  if (!isNative) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureAndroidChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;
  const base = {
    name: 'Gute Gedanken',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 150, 100, 150],
    lightColor: '#A8B8A1',
  };
  await Notifications.setNotificationChannelAsync(CHANNEL_SOUND, {
    ...base,
    sound: SOUND_FILE,
  });
  await Notifications.setNotificationChannelAsync(CHANNEL_SILENT, {
    ...base,
    name: 'Gute Gedanken (still)',
    sound: null,
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNative) return false;
  await ensureAndroidChannels();
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function hasNotificationPermission(): Promise<boolean> {
  if (!isNative) return false;
  const status = await Notifications.getPermissionsAsync();
  return status.granted;
}

/**
 * Re-sync scheduled local notifications with the delivery plan:
 * cancel everything we scheduled before, then schedule one notification
 * per planned delivery, each carrying its own thought.
 */
export async function syncScheduledNotifications(
  plan: PlannedDelivery[],
  enabled: boolean,
  soundEnabled: boolean
): Promise<PlannedDelivery[]> {
  if (!isNative) return plan;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!enabled) {
      return plan.map((p) => ({ ...p, notificationId: null }));
    }
    await ensureAndroidChannels();
    const now = Date.now();
    const synced: PlannedDelivery[] = [];
    for (const p of plan) {
      const at = new Date(p.at);
      if (at.getTime() <= now) {
        synced.push(p);
        continue;
      }
      const thought = thoughtById(p.thoughtId);
      if (!thought) {
        synced.push(p);
        continue;
      }
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Ein GeDANKE für dich',
          body: thought.text,
          // iOS reads the sound from the content; Android from the channel.
          sound: soundEnabled ? SOUND_FILE : false,
          data: { thoughtId: thought.id, plannedId: p.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: at,
          channelId:
            Platform.OS === 'android'
              ? soundEnabled
                ? CHANNEL_SOUND
                : CHANNEL_SILENT
              : undefined,
        },
      });
      synced.push({ ...p, notificationId });
    }
    return synced;
  } catch {
    // Never let notification plumbing break the app experience.
    return plan;
  }
}

export async function cancelAllNotifications(): Promise<void> {
  if (!isNative) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}
