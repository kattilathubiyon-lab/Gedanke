import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase-Client für den Browser (Client Components).
 *
 * Verwendet ausschließlich den öffentlichen Anon-Key. Row Level Security in der
 * Datenbank ist die Sicherheitsgrenze: Über diesen Client sind nur die per RLS
 * erlaubten Operationen möglich (z. B. freigegebene Briefe lesen, Feedback
 * einreichen). Der Service-Role-Key darf hier NIEMALS verwendet werden.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
