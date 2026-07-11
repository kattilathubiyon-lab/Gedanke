import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Nimmt eine anonyme Meldung zu einem Brief entgegen. Läuft über den Anon-Client
 * (RLS-Policy „reports: öffentlich melden", nur INSERT).
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const letter_id = typeof body?.letter_id === "string" ? body.letter_id : null;
  if (!letter_id) {
    return NextResponse.json({ ok: false, error: "missing_letter" }, { status: 400 });
  }

  const reason =
    typeof body?.reason === "string" && body.reason.trim().length > 0
      ? body.reason.trim().slice(0, 500)
      : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .insert({ letter_id, reason });

  if (error) {
    return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
