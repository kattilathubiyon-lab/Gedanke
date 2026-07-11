import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Privilegierter Supabase-Client mit dem Service-Role-Key.
 *
 * ACHTUNG: Der Service-Role-Key umgeht Row Level Security vollständig. Dieser
 * Client darf AUSSCHLIESSLICH serverseitig verwendet werden (Route Handlers,
 * Server Actions, Cron-Jobs) und niemals an den Browser gelangen. Der Import
 * von "server-only" oben lässt den Build fehlschlagen, falls dieses Modul
 * versehentlich in Client-Code landet.
 *
 * Einsatz z. B. für: Deliveries protokollieren, Subscriber verwalten,
 * Moderations-Workflows – also alles, was bewusst an den öffentlichen
 * RLS-Policies vorbei laufen muss.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
