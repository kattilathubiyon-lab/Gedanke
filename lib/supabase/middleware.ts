import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

const SESSION_COOKIE = "bdb_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Middleware-Logik: aktualisiert die Supabase-Auth-Session (nötig für den
 * Admin-Bereich mit @supabase/ssr) und stellt sicher, dass jeder Besucher eine
 * anonyme Session-Kennung im Cookie hat. Diese Kennung ist rein zufällig und
 * hat KEINEN Personenbezug – sie dient nur der Auslieferungs-Protokollierung.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (isSupabaseConfigured()) {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    // Session ggf. erneuern (aktualisiert die Auth-Cookies).
    try {
      await supabase.auth.getUser();
    } catch {
      // Netzwerk-/Konfigurationsfehler dürfen normale Requests nicht blockieren.
    }
  }

  // Anonyme Session-Kennung setzen, falls noch keine vorhanden ist.
  if (!request.cookies.get(SESSION_COOKIE)) {
    response.cookies.set(SESSION_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR,
      path: "/",
    });
  }

  return response;
}
