import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase-Client für den Server (Server Components, Route Handlers, Server
 * Actions). Nutzt den Anon-Key und die Session-Cookies des angemeldeten
 * Nutzers – dadurch greifen die RLS-Policies mit der jeweiligen Rolle
 * (anon oder authenticated). Für Admin-Aktionen wird die is_admin-Prüfung
 * in den Policies wirksam.
 *
 * Für privilegierte, RLS-umgehende Operationen (z. B. Deliveries schreiben,
 * Subscriber verwalten) siehe stattdessen lib/supabase/admin.ts.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll kann aus Server Components heraus aufgerufen werden, wo
            // Cookies nicht gesetzt werden können. Das ist unkritisch, solange
            // eine Middleware die Session aktualisiert.
          }
        },
      },
    },
  );
}
