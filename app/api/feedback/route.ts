import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const REACTIONS = new Set(["helped", "no_help", "none"]);
const MOODS = new Set([
  "much_better",
  "better",
  "no_change",
  "worse",
  "much_worse",
]);

/**
 * Nimmt anonymes Feedback zu einem Brief entgegen. Läuft über den Anon-Client,
 * sodass die RLS-Policy „feedback: öffentlich einreichen" greift (nur INSERT).
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

  const reaction = REACTIONS.has(body?.reaction) ? body.reaction : null;
  const mood_change = MOODS.has(body?.mood_change) ? body.mood_change : null;
  const flagged_unsafe = body?.flagged_unsafe === true;
  const note =
    typeof body?.note === "string" && body.note.trim().length > 0
      ? body.note.trim().slice(0, 1000)
      : null;

  const supabase = await createClient();
  const { error } = await supabase.from("feedback").insert({
    letter_id,
    reaction,
    mood_change,
    flagged_unsafe,
    note,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
