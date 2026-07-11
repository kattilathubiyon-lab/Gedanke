export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Prüft, ob echte Supabase-Zugangsdaten hinterlegt sind (nicht die Platzhalter
 * aus .env.example). So kann die App ohne Konfiguration bauen und laufen und
 * statt eines Absturzes einen freundlichen Einrichtungshinweis zeigen.
 */
export function isSupabaseConfigured(): boolean {
  return (
    SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_URL.includes("your-project") &&
    SUPABASE_ANON_KEY.length > 20 &&
    !SUPABASE_ANON_KEY.includes("your-anon")
  );
}
