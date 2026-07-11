import "server-only";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { PublicLetter } from "@/lib/types";

const SESSION_COOKIE = "bdb_session";

/** Liest die anonyme Session-Kennung aus dem Cookie (von der Middleware gesetzt). */
export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/**
 * Liefert einen zufälligen FREIGEGEBENEN Brief aus und protokolliert die
 * Auslieferung. Nutzt den Service-Role-Client, weil deliveries serverseitig
 * geschrieben werden und times_delivered erhöht wird (umgeht RLS bewusst).
 *
 * Es werden ausschließlich Briefe mit status = 'approved' berücksichtigt – ein
 * unmoderierter Brief kann hier niemals ausgeliefert werden.
 *
 * @param excludeIds bereits in dieser Session gesehene Brief-IDs (für Abwechslung)
 */
export async function deliverRandomLetter(
  excludeIds: string[] = [],
): Promise<PublicLetter | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createAdminClient();

  const { data: ids, error } = await supabase
    .from("letters")
    .select("id")
    .eq("status", "approved");

  if (error || !ids || ids.length === 0) return null;

  // Bereits gesehene ausschließen; wenn dann nichts übrig bleibt, alle zulassen.
  const pool = ids.filter((row) => !excludeIds.includes(row.id));
  const candidates = pool.length > 0 ? pool : ids;
  const chosenId =
    candidates[Math.floor(Math.random() * candidates.length)].id;

  const { data: letter, error: letterError } = await supabase
    .from("letters")
    .select("id, content, author_alias, tags, created_at, times_delivered")
    .eq("id", chosenId)
    .eq("status", "approved")
    .single();

  if (letterError || !letter) return null;

  // Auslieferung protokollieren (anonyme Session) und Zähler erhöhen.
  const sessionId = await getSessionId();
  await supabase
    .from("deliveries")
    .insert({ letter_id: letter.id, session_id: sessionId });
  await supabase
    .from("letters")
    .update({ times_delivered: (letter.times_delivered ?? 0) + 1 })
    .eq("id", letter.id);

  return {
    id: letter.id,
    content: letter.content,
    author_alias: letter.author_alias,
    tags: letter.tags ?? [],
    created_at: letter.created_at,
  };
}
