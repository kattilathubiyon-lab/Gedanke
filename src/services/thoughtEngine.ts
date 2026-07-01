import { thoughts } from '@/data/affirmations';
import {
  AppState,
  NotificationFrequency,
  PlannedDelivery,
  Thought,
  UserThought,
} from '@/data/types';

/** How many days of deliveries we plan (and schedule) ahead. */
export const PLAN_HORIZON_DAYS = 7;
/** A thought should not repeat within this window. */
export const NO_REPEAT_DAYS = 30;

export function defaultTimesFor(frequency: NotificationFrequency, customTimes: string[]): string[] {
  switch (frequency) {
    case '1x':
      return ['09:00'];
    case '2x':
      return ['09:00', '19:00'];
    case '3x':
      return ['08:00', '13:00', '20:00'];
    case 'custom':
      return customTimes.length > 0 ? [...customTimes].sort() : ['09:00'];
  }
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function atTime(day: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
  const d = new Date(day);
  d.setHours(h, m, 0, 0);
  return d;
}

/** Thought ids used within the no-repeat window (delivered or already planned). */
function recentlyUsedIds(delivered: UserThought[], plan: PlannedDelivery[], now: Date): Set<string> {
  const cutoff = now.getTime() - NO_REPEAT_DAYS * 24 * 60 * 60 * 1000;
  const used = new Set<string>();
  for (const d of delivered) {
    if (new Date(d.deliveredAt).getTime() >= cutoff) used.add(d.thoughtId);
  }
  for (const p of plan) used.add(p.thoughtId);
  return used;
}

function poolFor(interests: string[]): Thought[] {
  const pool = interests.length > 0 ? thoughts.filter((t) => interests.includes(t.categoryId)) : thoughts;
  return pool.length > 0 ? pool : thoughts;
}

/**
 * Pick one thought matching the user's interests, rotating randomly and
 * avoiding anything used within the last 30 days. If the whole pool has
 * been used (small pool, frequent deliveries), fall back to the least
 * recently delivered thought so the app never goes silent.
 */
export function pickThought(state: AppState, now: Date, extraUsed?: Set<string>): Thought {
  const pool = poolFor(state.settings.interests);
  const used = recentlyUsedIds(state.delivered, state.plan, now);
  extraUsed?.forEach((id) => used.add(id));

  const fresh = pool.filter((t) => !used.has(t.id));
  if (fresh.length > 0) {
    return fresh[Math.floor(Math.random() * fresh.length)];
  }

  const lastDeliveredAt = new Map<string, number>();
  for (const d of state.delivered) {
    const t = new Date(d.deliveredAt).getTime();
    lastDeliveredAt.set(d.thoughtId, Math.max(lastDeliveredAt.get(d.thoughtId) ?? 0, t));
  }
  const sorted = [...pool].sort(
    (a, b) => (lastDeliveredAt.get(a.id) ?? 0) - (lastDeliveredAt.get(b.id) ?? 0)
  );
  return sorted[0];
}

/**
 * Build the delivery plan for the next PLAN_HORIZON_DAYS: one entry per
 * scheduled time per day, each with its own thought. Keeps existing
 * future entries (so already-scheduled notifications stay stable) and
 * fills in whatever is missing.
 */
export function buildPlan(state: AppState, now: Date): PlannedDelivery[] {
  const times = defaultTimesFor(state.settings.frequency, state.settings.customTimes);
  const keep = state.plan.filter((p) => new Date(p.at).getTime() > now.getTime());

  const wantedSlots: Date[] = [];
  for (let day = 0; day <= PLAN_HORIZON_DAYS; day++) {
    const d = new Date(now);
    d.setDate(d.getDate() + day);
    for (const time of times) {
      const slot = atTime(d, time);
      if (slot.getTime() > now.getTime()) wantedSlots.push(slot);
    }
  }

  const keptAtTimes = new Set(keep.map((p) => new Date(p.at).getTime()));
  const result = [...keep];
  const usedThisPass = new Set<string>();

  for (const slot of wantedSlots) {
    if (keptAtTimes.has(slot.getTime())) continue;
    const thought = pickThought({ ...state, plan: result }, now, usedThisPass);
    usedThisPass.add(thought.id);
    result.push({ id: uid(), thoughtId: thought.id, at: slot.toISOString(), notificationId: null });
  }

  result.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  return result;
}

/**
 * Split the plan into entries whose time has passed (they become part of
 * the archive) and entries still in the future.
 */
export function settlePlan(
  plan: PlannedDelivery[],
  now: Date
): { due: PlannedDelivery[]; future: PlannedDelivery[] } {
  const due: PlannedDelivery[] = [];
  const future: PlannedDelivery[] = [];
  for (const p of plan) {
    (new Date(p.at).getTime() <= now.getTime() ? due : future).push(p);
  }
  return { due, future };
}

export function toUserThought(p: PlannedDelivery): UserThought {
  return { id: uid(), thoughtId: p.thoughtId, deliveredAt: p.at };
}

export function newUserThought(thoughtId: string, deliveredAt: Date): UserThought {
  return { id: uid(), thoughtId, deliveredAt: deliveredAt.toISOString() };
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
